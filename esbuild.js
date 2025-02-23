import * as esbuild from "esbuild"

const isProduction = process.argv[2] === "production"

esbuild.build({
    entryPoints: ["src/bin.ts"],
    outfile: "dist/bin.js",
    bundle: true,
    platform: "node",
    format: "esm",
    packages: "external",
    minify: false,
    charset: "utf8",
    treeShaking: true,
    sourcemap: true,
    dropLabels: isProduction ? ["DEV"] : [],
})