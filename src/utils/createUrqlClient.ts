import { dedupExchange, fetchExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import { betterupdateQuery } from './betterupdateQuery';
import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation
} from '../generated/graphql';
import { cursorPagination } from './cursorPagination';

export const createUrqlClient = (ssrExchange: any) => ({
  url: 'http://localhost:4000/graphql',
  fetchOptions: { credentials: 'include' as const },
  exchanges: [
    dedupExchange,
    cacheExchange({
      keys: { PaginatedPosts: () => null },
      resolvers: {
        Query: {
          getAllPosts: cursorPagination()
        }
      },
      updates: {
        Mutation: {
          vote: (_result, _, cache, _2) => {
            const allFields = cache.inspectFields('Query');
            const fieldInfos = allFields.filter(info => info.fieldName === 'getAllPosts');
            fieldInfos.forEach(fi => cache.invalidate('Query', 'getAllPosts', fi.arguments || {}));
          },
          createPost: (_result, _, cache, _2) => {
            // cache.invalidate('Query', 'getAllPosts', {
            //   limit: 15
            // });
            // the other way
            const allFields = cache.inspectFields('Query');
            const fieldInfos = allFields.filter(info => info.fieldName === 'getAllPosts');
            fieldInfos.forEach(fi => cache.invalidate('Query', 'getAllPosts', fi.arguments || {}));
          },
          login: (_result, _, cache, _2) => {
            betterupdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return { me: result.login.user };
                }
              }
            );
          },
          register: (_result, _, cache, _2) => {
            betterupdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return { me: result.register.user };
                }
              }
            );
          },
          logout: (_result, _, cache, _2) => {
            betterupdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({ me: null })
            );
          }
        }
      }
    }),
    ssrExchange,
    fetchExchange
  ]
});
