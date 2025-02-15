import * as esbuild from "esbuild"
import * as tsup from "tsup"

esbuild.build({
    entryPoints: ["src/index.ts"],
    outfile: "dist/index.js",
    bundle: true,
    platform: "node",
    format: "esm",
    packages: "external",
    minify: true
})