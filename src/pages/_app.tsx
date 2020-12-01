import { ThemeProvider } from 'emotion-theming';
import theme from '../theme';
import { CSSReset } from '@chakra-ui/core';
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { PaginatedPosts } from '../generated/graphql';

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL as string,
  credentials: 'include',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getAllPosts: {
            keyArgs: ['limit'],
            merge(existing: PaginatedPosts | undefined, incoming: PaginatedPosts): PaginatedPosts {
              return {
                // __typename: 'PaginatedPosts',
                // hasMore: existing?.hasMore as boolean,
                ...incoming,
                posts: [...(existing?.posts || []), ...incoming.posts]
              };
            }
          }
        }
      }
    }
  })
});

function MyApp({ Component, pageProps }: any) {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CSSReset />
        <Component {...pageProps} />
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default MyApp;
