export default {
  ssr: false,
  components: true,
  head: {
    titleTemplate: "%s - ACCGAME247 ",
    title: "ACCGAME247 - Shop bán tài khoản game uy tín hàng đầu Việt Nam",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || "",
      },
    ],
    link: [
      // Favicon chuẩn đa trình duyệt
      {
        rel: "icon",
        type: "image/png",
        sizes: "96x96",
        href: "/favicon-96x96.png",
      },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "shortcut icon", href: "/favicon.ico" },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      { rel: "manifest", href: "/site.webmanifest" },

      {
        rel: "stylesheet",
        href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css",
        integrity:
          "sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==",
        crossorigin: "anonymous",
        referrerpolicy: "no-referrer",
      },
    ],
    script: [
      {
        src: "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4",
        defer: true,
      },
    ],
  },
  loading: { color: "#fff" },
  modules: ["@nuxtjs/axios"],
  plugins: [
    "~/plugins/axios.js",
    "~/plugins/toast.js",
    { src: "~/plugins/ws.client.js", mode: "client" },
  ],
  buildModules: ["@nuxtjs/vuetify"],
  vuetify: { customVariables: ["~/assets/styles/variables.scss"] },
  css: ["~/assets/styles/main.scss", "~/assets/styles/toast.scss"],
  router: { middleware: ["auth"] },
  build: { extend(config, ctx) {} },
  server: { host: "0.0.0.0", port: process.env.PORT },
};
