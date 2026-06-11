import { defineNuxtConfig } from "nuxt/config";

// set this as env variable to build for different targets
type PageType = 'ambassador' | 'cert' | 'ai'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: 'favicon/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: 'favicon/favicon-32x32.png' },
        { rel: 'icon', type: 'image/x-icon', href: 'favicon/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: 'favicon/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: 'favicon/android-chrome-192x192.png' },
        { rel: 'icon', type: 'image/png', sizes: '512x512', href: 'favicon/android-chrome-512x512.png' }
      ],
      htmlAttrs: {
        'data-theme': process.env.RF_PAGE,
      },
    }
  },
  alias: {
    "@": "./",
  },
  components: {
    dirs: [
      { path: '~/components', ignore: ['index.ts'] },
    ]
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/eslint', '@nuxt/content'],
  ssr: true,
  devtools: { enabled: true },
  css: [
    './assets/css/tailwind.css',
    './assets/css/main.scss',
  ],
  content: {
    renderer: {
      anchorLinks: false
    }
  },
  runtimeConfig: {
    public: {
      rfPage: process.env.RF_PAGE as PageType
    },
    contentfulSpaceId: process.env.CONTENTFUL_SPACE_ID,
    contentfulAccessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    contentfulPreviewToken: process.env.CONTENTFUL_PREVIEW_TOKEN
  },
  // buildDir: 'docs',
  compatibilityDate: '2024-04-03',
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        process.env.BASE_URL || '/',
      ],
    },
  },
})