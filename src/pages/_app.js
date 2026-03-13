import '../styles/globals.css';
import '../styles/styles.css';
import { SessionProvider } from 'next-auth/react';

function App({ Component, pageProps, session }) {
  return (
    <SessionProvider session={session}>
      {/* Visually hidden until focused — lets keyboard users skip past navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-500 focus:text-white focus:rounded focus:shadow-lg"
      >
        Skip to main content
      </a>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default App
