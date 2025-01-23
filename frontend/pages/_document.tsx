import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="fr">
        <Head>
          <meta name='application-name' content='Décorez-Rénovez' />
          <meta name='apple-mobile-web-app-capable' content='yes' />
          <meta name='apple-mobile-web-app-status-bar-style' content='default' />
          <meta name='apple-mobile-web-app-title' content='Décorez-Rénovez' />
          <meta name='description' content='Plateforme de mise en relation entre artisans et clients pour projets de rénovation' />
          <meta name='format-detection' content='telephone=no' />
          <meta name='mobile-web-app-capable' content='yes' />
          <meta name='theme-color' content='#4F46E5' />

          <link rel='apple-touch-icon' href='/icons/icon-152x152.png' />
          <link rel='icon' type='image/png' sizes='32x32' href='/icons/favicon-32x32.png' />
          <link rel='icon' type='image/png' sizes='16x16' href='/icons/favicon-16x16.png' />
          <link rel='manifest' href='/manifest.json' />
          <link rel='shortcut icon' href='/favicon.ico' />
          
          <meta name='twitter:card' content='summary' />
          <meta name='twitter:url' content='https://decorez-renovez.fr' />
          <meta name='twitter:title' content='Décorez-Rénovez' />
          <meta name='twitter:description' content='Plateforme de mise en relation entre artisans et clients pour projets de rénovation' />
          <meta name='twitter:image' content='https://decorez-renovez.fr/icons/icon-192x192.png' />
          <meta name='twitter:creator' content='@decorezrenovez' />
          
          <meta property='og:type' content='website' />
          <meta property='og:title' content='Décorez-Rénovez' />
          <meta property='og:description' content='Plateforme de mise en relation entre artisans et clients pour projets de rénovation' />
          <meta property='og:site_name' content='Décorez-Rénovez' />
          <meta property='og:url' content='https://decorez-renovez.fr' />
          <meta property='og:image' content='https://decorez-renovez.fr/icons/icon-192x192.png' />

          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
