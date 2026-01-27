import antfu from "@antfu/eslint-config";

export default antfu({
  nextjs: true,
  typescript: true,

  lessOpinionated: true,

  stylistic: {
    indent: 2,
    quotes: "single",
  },

  formatters: {
    css: true,
  },

  ignores: ["next-env.d.ts"],
});
