export const getCompiledCodeBlobURL = async (code: string) => {
  const filename = "component-open-zero-260bea1b-0a9e-421b-94b0-d2ed6dbc6452";

  const html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <link rel="stylesheet" href="http://localhost:3000/css/${filename}.css"></link>
    </head>
    <body>
      <div id="root"></div>
      <script crossorigin defer src="http://localhost:3000/js/${filename}.cjs"></script>
    </body>
  </html>
    `;

  const blob = new Blob([html], { type: "text/html" });
  const blobURL = URL.createObjectURL(blob);

  return blobURL;
};
