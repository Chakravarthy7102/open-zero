import { createTailwindcss } from "@mhsdesign/jit-browser-tailwindcss";
import tailwindConfig from "./tailwind.config";

export default async function compileTailwindCss(code: string) {
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
    [code]
  );

  return css;
}