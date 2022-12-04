import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.css';
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
      <Component {...pageProps} />
  </AppContext.Provider>
  )
}

export default MyApp;
