/**
 * @type {import('prettier').Config & import("@ianvs/prettier-plugin-sort-imports").PluginConfig}
 */
const config = {
    arrowParens: "avoid",
    printWidth: 120,
    singleQuote: true,
    jsxSingleQuote: true,
    semi: true,
    trailingComma: "none",
    plugins: ["prettier-plugin-tailwindcss"]
};

export default config;
