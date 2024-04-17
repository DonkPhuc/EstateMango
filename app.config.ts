// app.config.ts
export default defineAppConfig({
  nuxtIcon: {
    size: "16px", // default <Icon> size applied
    class: "icon", // default <Icon> class applied
    aliases: {
      nuxt: "logos:nuxt-icon",
    },
  },
  ui: {
    primary: "sky",
    gray: "neutral",
  },
});
