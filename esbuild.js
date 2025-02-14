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
});

tsup.build({
    dts: {
        entry: ['src/index.ts'],
        only: true
    },
    bundle: true,
    format: ["esm"],
    outDir: "./types",
    entry: ["./src/index.ts"]
})