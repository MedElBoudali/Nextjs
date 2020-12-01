import { ApolloClient, InMemoryCache } from '@apollo/client';
import { NextPageContext } from 'next';
import { withApollo as createWithApollo } from 'next-apollo';
import { PaginatedPosts } from '../generated/graphql';

const client = (ctx: NextPageContext) =>
  new ApolloClient({
    uri: process.env.NEXT_PUBLIC_API_URL as string,
    credentials: 'include',
    headers: {
      cookie: (typeof window === 'undefined' ? ctx.req?.headers.cookie : undefined) || ''
    },
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            getAllPosts: {
              keyArgs: ['limit'],
              merge(
                existing: PaginatedPosts | undefined,
                incoming: PaginatedPosts
              ): PaginatedPosts {
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

export const withApollo = createWithApollo(client);
