// @ts-expect-error - Nuxt auto-imports defineAppConfig
export default defineAppConfig({
  ui: {
    colors: {
      primary: "blue",
      secondary: "#10B981",
      accent: "#F59E0B",
      neutral: "#374151",
      info: "#3B82F6",
      success: "#10B981",
      warning: "#FBBF24",
      error: "#EF4444",
    },
  },
});
