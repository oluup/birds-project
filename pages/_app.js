import { UseWalletProvider } from "use-wallet";

// Components
import { Layout } from "../components/Layouts";

// styles
import "../styles/main.scss";

export default function MyApp({ Component, pageProps }) {
  return (
    <UseWalletProvider autoConnect>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UseWalletProvider>
  );
}
