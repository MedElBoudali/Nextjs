import { Provider, createClient } from 'urql';
import { ThemeProvider } from 'emotion-theming';
import theme from '../theme';
import { CSSReset } from '@chakra-ui/core';

const client = createClient({
  url: 'http://localhost:4000/graphql',
  fetchOptions: { credentials: 'include' }
});

function MyApp({ Component, pageProps }: any) {
  return (
    <Provider value={client}>
      <ThemeProvider theme={theme}>
        <CSSReset />
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
