import * as esbuild from "esbuild";

export default async function esBuildCompileCode(code: string) {
  const result = await esbuild.transform(code, {
    loader: "tsx",
    format: "esm",
    platform: "node",
  });

  const build = await esbuild.build({
    stdin: {
      contents: result.code,
      loader: "tsx",
      resolveDir: ".",
    },
    format: "cjs",
    outfile: "./Source.js",
    bundle: true,
    sourcemap: true,
    minify: true,
    write: true,
    preserveSymlinks: true,
    logLevel: "debug",
  });

  return build;
}
