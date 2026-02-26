import type { APIRoute } from "astro";

const LOOPS_MAILING_LIST_ID = "cmm31vjaz88ra0i2o0o0laltw";
const DEFAULT_LOOPS_FORM_ENDPOINT =
  "https://app.loops.so/api/newsletter-form/cm46nia1902myqjoedjvkq0dg";
const TURNSTILE_VERIFY_ENDPOINT =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

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

type ParsedSubscribePayload = {
  email: string;
  turnstileToken: string;
};

async function parseSubscribePayload(
  request: Request,
): Promise<ParsedSubscribePayload> {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const bodyText = await request.text();
    const params = new URLSearchParams(bodyText);
    return {
      email: String(params.get("email") ?? ""),
      turnstileToken: String(params.get("cf-turnstile-response") ?? ""),
    };
  }

  const formData = await request.formData();
  return {
    email: String(formData.get("email") ?? ""),
    turnstileToken: String(formData.get("cf-turnstile-response") ?? ""),
  };
}

async function parseJson<T>(response: Response) {
  return (await response.json().catch(() => null)) as T | null;
}

type TurnstileVerificationResponse = {
  success?: boolean;
  "error-codes"?: string[];
};

async function verifyTurnstileToken(
  token: string,
  remoteIp: string | null,
  secret: string,
): Promise<{ ok: boolean; message?: string }> {
  if (!secret.trim()) {
    console.error(
      "[newsletter/subscribe] missing CF_TURNSTILE_SECRET environment variable",
    );
    return {
      ok: false,
      message: "Captcha is misconfigured. Please try again later.",
    };
  }

  if (!token.trim()) {
    return {
      ok: false,
      message: "Please complete the captcha.",
    };
  }

  const body = new URLSearchParams({
    secret: String(secret),
    response: token.trim(),
  });

  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  let verifyResponse: Response;
  try {
    verifyResponse = await fetch(TURNSTILE_VERIFY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
  } catch (error) {
    console.error(
      "[newsletter/subscribe] turnstile verify request failed",
      error,
    );
    return {
      ok: false,
      message: "Could not verify captcha. Please try again.",
    };
  }

  const verifyData =
    await parseJson<TurnstileVerificationResponse>(verifyResponse);

  if (!verifyResponse.ok || !verifyData?.success) {
    console.warn("[newsletter/subscribe] turnstile verification failed", {
      status: verifyResponse.status,
      errors: verifyData?.["error-codes"] ?? [],
    });
    return {
      ok: false,
      message: "Captcha verification failed. Please try again.",
    };
  }

  return { ok: true };
}

type RuntimeLocals = {
  runtime?: {
    env?: Record<string, unknown>;
  };
};

function getTurnstileSecret(locals: RuntimeLocals): string {
  const runtimeSecret =
    typeof locals.runtime?.env?.CF_TURNSTILE_SECRET === "string"
      ? locals.runtime.env.CF_TURNSTILE_SECRET
      : "";

  return runtimeSecret || import.meta.env.CF_TURNSTILE_SECRET || "";
}

export const GET: APIRoute = async () =>
  jsonResponse(405, {
    success: false,
    message: "Method not allowed. Use POST.",
  });

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { email: rawEmail, turnstileToken } =
      await parseSubscribePayload(request);

    const email = rawEmail.trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
      return jsonResponse(400, {
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const configuredSecret = getTurnstileSecret(locals as RuntimeLocals);

    const turnstileVerification = await verifyTurnstileToken(
      turnstileToken,
      request.headers.get("cf-connecting-ip"),
      configuredSecret,
    );
    if (!turnstileVerification.ok) {
      return jsonResponse(400, {
        success: false,
        message:
          turnstileVerification.message ||
          "Captcha verification failed. Please try again.",
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
