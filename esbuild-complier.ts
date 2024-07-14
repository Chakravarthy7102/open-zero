import * as esbuild from "esbuild";
import compileTailwindCss from "./tailwindCompiler";

export default async function esBuildCompileCode(
  code: string,
  fileHash: string
) {
  // const publicFilePath = `component-${fileHash}.js`;
  const publicFilePath =
    "component-open-zero-260bea1b-0a9e-421b-94b0-d2ed6dbc6452";

  const css = await compileTailwindCss(code);

  await esbuild.build({
    stdin: {
      contents: css,
      loader: "css",
      resolveDir: ".",
    },
    outfile: `./public/css/${publicFilePath}.css`,
    bundle: true,
    minify: true,
    write: true,
    platform: "browser",
  });

  await esbuild.build({
    stdin: {
      contents: code,
      loader: "tsx",
      resolveDir: ".",
    },
    format: "iife",
    outfile: `./public/js/${publicFilePath}.cjs`,
    bundle: true,
    minify: true,
    write: true,
    alias: {
      "@/components/ui": "./src/components/ui",
      "@/lib/utils": "./src/lib/utils",
    },
    define: {
      "process.env.__NEXT_IMAGE_OPTS": "undefined",
    },
    platform: "browser",
    logLevel: "debug",
  });

  return publicFilePath;
}
