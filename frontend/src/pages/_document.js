import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="BM Healthcare - Book doctor appointments and diagnostic tests online" />
        <meta name="keywords" content="healthcare, doctor appointment, diagnostic tests, medical, health checkup" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
