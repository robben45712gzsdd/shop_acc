export default {
  ssr: false,
  components: true,
  head: {
    titleTemplate: "%s - " + process.env.npm_package_name,
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || "",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    script: [
      {
        src: "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4",
        defer: true,
      },
    ],
  },
  loading: { color: "#fff" },
  modules: ["@nuxtjs/axios"],
  plugins: ["~/plugins/axios.js"],
  buildModules: ["@nuxtjs/vuetify"],
  vuetify: {
    customVariables: ["~/assets/styles/variables.scss"],
  },
  css: ["~/assets/styles/main.scss"],
  router: {
    middleware: ["auth"],
  },
  build: {
    extend(config, ctx) {},
  },
};
