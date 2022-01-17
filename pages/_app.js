import { UseWalletProvider } from "use-wallet";

// styles
import "../styles/main.scss";

export default function MyApp({ Component, pageProps }) {
  return (
    <UseWalletProvider autoConnect>
      <Component {...pageProps} />
    </UseWalletProvider>
  );
}
