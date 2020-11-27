import { dedupExchange, fetchExchange } from 'urql';
import { cacheExchange, Cache } from '@urql/exchange-graphcache';
import { betterupdateQuery } from './betterupdateQuery';
import {
  DeletePostMutationVariables,
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
  VoteMutationVariables
} from '../generated/graphql';
import { cursorPagination } from './cursorPagination';
import gql from 'graphql-tag';
import { isServer } from './isServer';

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  // add cookie to make ssr request to graphql api
  let cookie = '';
  if (isServer()) {
    cookie = ctx?.req?.headers?.cookie;
  }

  const invalidateAllPosts = (cache: Cache) => {
    const allFields = cache.inspectFields('Query');
    const fieldInfos = allFields.filter(info => info.fieldName === 'getAllPosts');
    fieldInfos.forEach(fi => cache.invalidate('Query', 'getAllPosts', fi.arguments || {}));
  };

  return {
    url: 'http://localhost:4000/graphql',
    fetchOptions: { credentials: 'include' as const, headers: cookie ? { cookie } : undefined },
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
            deletePost: (_result, args, cache, info) => {
              cache.invalidate({
                __typename: 'Post',
                id: (args as DeletePostMutationVariables).id
              });
            },
            vote: (_result, args, cache, _2) => {
              const { postId, value } = args as VoteMutationVariables;
              const data = cache.readFragment(
                gql`
                  fragment _ on Post {
                    id
                    points
                    voteStatus
                  }
                `,
                { id: postId } as any
              );
              if (data) {
                if (data.voteStatus === args.value) {
                  return;
                }
                const newPoints = (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
                cache.writeFragment(
                  gql`
                    fragment __ on Post {
                      points
                      voteStatus
                    }
                  `,
                  { id: postId, points: newPoints, voteStatus: value } as any
                );
              }
            },
            createPost: (_result, _, cache, _2) => {
              // cache.invalidate('Query', 'getAllPosts', {
              //   limit: 15
              // });
              // the other way
              invalidateAllPosts(cache);
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
              invalidateAllPosts(cache);
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
  };
};
