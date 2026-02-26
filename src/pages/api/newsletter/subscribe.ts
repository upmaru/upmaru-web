import type { APIRoute } from "astro";

const LOOPS_MAILING_LIST_ID = "cmm31vjaz88ra0i2o0o0laltw";
const DEFAULT_LOOPS_FORM_ENDPOINT =
  "https://app.loops.so/api/newsletter-form/cm46nia1902myqjoedjvkq0dg";

function jsonResponse(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getLoopsFormEndpoint() {
  const direct = import.meta.env.LOOPS_FORM_ENDPOINT;
  if (direct) return String(direct);

  const formId = import.meta.env.LOOPS_FORM_ID;
  if (formId) return `https://app.loops.so/api/newsletter-form/${formId}`;

  return DEFAULT_LOOPS_FORM_ENDPOINT;
}

async function parseJson<T>(response: Response) {
  return (await response.json().catch(() => null)) as T | null;
}

export const GET: APIRoute = async () =>
  jsonResponse(405, {
    success: false,
    message: "Method not allowed. Use POST.",
  });

export const POST: APIRoute = async ({ request }) => {
  try {
    let rawEmail = "";
    const contentType =
      request.headers.get("content-type")?.toLowerCase() ?? "";

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const bodyText = await request.text();
      const params = new URLSearchParams(bodyText);
      rawEmail = String(params.get("email") ?? "");
    } else {
      const formData = await request.formData();
      rawEmail = String(formData.get("email") ?? "");
    }

    const email = rawEmail.trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
      return jsonResponse(400, {
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const loopsFormEndpoint = getLoopsFormEndpoint();

    const loopsBody = new URLSearchParams({
      email,
      mailingLists: LOOPS_MAILING_LIST_ID,
      source: "LLM Tests Newsletter",
    });

    let loopsResponse: Response;
    try {
      loopsResponse = await fetch(loopsFormEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: loopsBody,
      });
    } catch (error) {
      console.error("[newsletter/subscribe] loops request failed", error);
      return jsonResponse(502, {
        success: false,
        message:
          "Could not reach the newsletter service. Please try again in a bit.",
      });
    }

    if (loopsResponse.status === 429) {
      return jsonResponse(429, {
        success: false,
        message: "Too many attempts. Please try again in a bit.",
      });
    }

    const loopsData = await parseJson<{ success?: boolean; message?: string }>(
      loopsResponse,
    );

    if (!loopsResponse.ok || !loopsData?.success) {
      return jsonResponse(400, {
        success: false,
        message:
          loopsData?.message ||
          `Could not subscribe right now (HTTP ${loopsResponse.status}). Please try again.`,
      });
    }

    return jsonResponse(200, {
      success: true,
      message: "Subscribed. We will notify you when new results are published.",
    });
  } catch (error) {
    console.error("[newsletter/subscribe] unexpected error", error);
    return jsonResponse(500, {
      success: false,
      message: "Could not subscribe right now. Please try again in a bit.",
    });
  }
};
