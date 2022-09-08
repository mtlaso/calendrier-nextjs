import "../styles/globals.sass";
import "../styles/Nprogress.css";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <RecoilNexus />
      <Component {...pageProps} />
    </RecoilRoot>
  );
}

export default MyApp;
