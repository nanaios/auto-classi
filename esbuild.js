import * as esbuild from "esbuild"

esbuild.build({
    entryPoints: ["src/index.ts"],
    outfile: "dist/index.js",
    bundle: true,
    platform: "node",
    format: "esm",
    packages: "external",
    minify: true
})