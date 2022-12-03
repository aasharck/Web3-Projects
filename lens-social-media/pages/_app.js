import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.css';
import {
  wagmiClient,
  chains,
  WagmiConfig,
  RainbowKitProvider,
} from './utils/walletSetup';
import AppContext from '../AppContext';
import { useState } from 'react';

function MyApp({ Component, pageProps }) {
  const [token, setToken] = useState()

  return(
    <AppContext.Provider
      value={{
        state: {
          token: token,
        },
        setToken: setToken,
      }}
    >
  <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider chains={chains}>
      <Component {...pageProps} />
    </RainbowKitProvider>
  </WagmiConfig>
  </AppContext.Provider>
  )
}

export default MyApp;
