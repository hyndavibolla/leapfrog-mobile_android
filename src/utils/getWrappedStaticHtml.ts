const htmlHeader = `<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { font-family: Gotham, "Helvetica Neue", Helvetica, Arial, "sans-serif";
        font-size: 12px;
        font-style:normal;
        text-align: justify; 
        line-height: 1.6em;
    }
    body { margin: 20px; }
    h1 { display: none }
    h2 {
      font-size: 25px;
      color: #517E99;
      font-weight: bold;
    }

    em {
      font-style: normal;
      font-weight: bold;
      font-size: 14px;
      color: #262C2F;
    }
    strong {
      font-style: normal;
      font-weight: bold;
      font-size: 14px;
      color: #262C2F;
    }
    a {
      font-size: 12px;
      font-style: normal;
      font-weight: 300;
      color: #262C2F;
    }

    tr td p {
      text-align: left;
    }

    td {
      padding: 10px
    }
    
  </style>
</head>
<body>`;

const htmlFooter = '</body></html>';

export const getWrappedHtml = (staticHtmlBody: string): string => {
  return `${htmlHeader}${staticHtmlBody}${htmlFooter}`;
};
