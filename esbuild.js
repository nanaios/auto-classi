import * as esbuild from "esbuild"

esbuild.build({
    entryPoints: ["src/bin.ts"],
    outfile: "dist/bin.js",
    bundle: true,
    platform: "node",
    format: "esm",
    packages: "external",
    minify: true,
    charset: "utf8",
    treeShaking: true,
    sourcemap: true
})