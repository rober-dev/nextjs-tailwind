// Tailwind styles
import '../css/tailwind.css';

// Component definition
export default function BaseApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
