// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: [
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxt/ui",
  ],
  css: ["~/assets/css/main.css"],

  ui: {
    colorMode: false,
    theme: {
      colors: ['primary', 'secondary', 'info', 'success', 'warning', 'error', 'neutral']
    }
  },

  runtimeConfig: {
    abacatePayApiBase:
      process.env.ABACATE_PAY_API_BASE || "https://api.abacatepay.com",
    abacatePayToken: process.env.ABACATE_PAY_TOKEN || "",
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:8080",
    },
  },

  app: {
    head: {
      title: "Inovare",
      titleTemplate: "%s",
    },
  },
});
