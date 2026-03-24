import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog_en: defineCollection({
      type: 'page',
      source: 'blog/en/**',
      schema: z.object({
        date: z.string(),
        description: z.string().optional()
      })
    }),
    blog_tr: defineCollection({
      type: 'page',
      source: 'blog/tr/**',
      schema: z.object({
        date: z.string(),
        description: z.string().optional()
      })
    })
  }
})
