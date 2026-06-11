import { defineContentConfig, defineCollection, z } from '@nuxt/content'

const rfPage = process.env.RF_PAGE || 'cert'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: {
        include: `${rfPage}/**/*.md`,
        prefix: '/',
      },
      schema: z.object({
        domain: z.enum(['cert', 'robocon', 'ambassador', 'ai']).optional(),
        navbar: z.object({
          title: z.string(),
          links: z.array(z.object({
            label: z.string(),
            href: z.string(),
            external: z.boolean().optional()
          })).optional()
        }).optional(),
        showFooter: z.boolean().optional(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
      })
    }),
    providers: defineCollection({
      type: 'data',
      source: `${rfPage}/providers/**/*.yml`,
      schema: z.object({
        name: z.string(),
        country: z.array(z.string()).optional(),
        languages: z.array(z.string()).optional(),
        description: z.string().optional(),
        website: z.string().optional(),
        logo: z.string().optional(),
        inPerson: z.boolean().default(false),
        online: z.boolean().default(false),
        fullDescription: z.string().optional(),
      })
    }),
    ambassadors: defineCollection({
      type: 'data',
      source: `${rfPage}/ambassadors/**/*.yml`,
      schema: z.object({
        name: z.string(),
        picture: z.string().optional(),
        location: z.array(z.string()).optional(),
        language: z.array(z.string()).optional(),
        roles: z.array(z.string()).optional(),
        shortDescription: z.string().optional(),
        longDescription: z.string().optional(),
        slackName: z.string().optional(),
      })
    })
  }
})
