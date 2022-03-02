import '~/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import RouteGuard from '~/components/RouteGuard';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Inventory Manager</title>
      </Head>
      <RouteGuard>
        <Component {...pageProps} />
      </RouteGuard>
    </>
  );
}

export default MyApp;
