import { availablePresets, registerPreset, transform } from "@babel/standalone";
import {
  type TailwindConfig,
  createTailwindcss,
} from "@mhsdesign/jit-browser-tailwindcss";
import tailwindConfig from "../../tailwind.config";

registerPreset("tsx", {
  presets: [
    [availablePresets["typescript"], { allExtensions: true, isTSX: true }],
  ],
});

export const getCompiledCodeBlobURL = async (code: string) => {
  const compiledComponent = babelCompile(code, `Code.tsx`);

  const app = `
      import React, { useEffect } from 'react';
      import { createRoot } from 'react-dom';
      import Code from './Code.tsx';

      const App = () => {
        return (
          <>
            <Code />
          </>
        )
      }

      createRoot(document.querySelector("#root")).render(<App />)
    `;

  const output = babelCompile(app, "index.tsx");

  const tailwindCss = createTailwindcss({ tailwindConfig });

  const css = await tailwindCss.generateStylesFromContent(
    `
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    :root {
        --foreground-rgb: 0, 0, 0;
        --background-start-rgb: 214, 219, 220;
        --background-end-rgb: 255, 255, 255;
        }

        @media (prefers-color-scheme: dark) {
        :root {
            --foreground-rgb: 255, 255, 255;
            --background-start-rgb: 0, 0, 0;
            --background-end-rgb: 0, 0, 0;
        }
    }

    body {
        color: rgb(var(--foreground-rgb));
        background: linear-gradient(
            to bottom,
            transparent,
            rgb(var(--background-end-rgb))
            )
            rgb(var(--background-start-rgb));
        }

        @layer utilities {
        .text-balance {
            text-wrap: balance;
        }
    }

    `,
    [compiledComponent.code!, output.code!]
  );

  const html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <style>${css}</style>
    </head>
    <body>
      <div id="root"></div>
      <script crossorigin defer src="https://unpkg.com/react@18.2.0/umd/react.production.min.js"></script>
      <script crossorigin defer src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
      <script defer>window.addEventListener("DOMContentLoaded", () => {${[
        compiledComponent.code,
        output.code,
      ].join("\n")}});</script>
    </body>
  </html>
    `;

  const blob = new Blob([html], { type: "text/html" });
  const blobURL = URL.createObjectURL(blob);

  return blobURL;
};

const babelCompile = (code: string, filename: string) =>
  transform(code, {
    filename: filename,
    plugins: [
      [
        "transform-modules-umd",
        {
          globals: { react: "React", "react-dom": "ReactDOM" },
        },
      ],
    ],
    presets: ["tsx", "react"],
  });
