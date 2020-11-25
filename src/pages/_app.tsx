import { ThemeProvider } from 'emotion-theming';
import theme from '../theme';
import { CSSReset } from '@chakra-ui/core';

function MyApp({ Component, pageProps }: any) {
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
