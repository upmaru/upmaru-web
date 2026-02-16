import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string().default("Upmaru Team"),
    authorImage: z.string().optional(),
    coverImage: z.string().optional(),
    icon: z
      .string()
      .regex(/^[A-Za-z0-9]+Icon$/)
      .optional(),
    ogImage: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
