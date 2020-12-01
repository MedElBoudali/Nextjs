import { ApolloCache, gql } from '@apollo/client';
import { Flex, IconButton } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  PostSnippetFragment,
  useMeQuery,
  useVoteMutation,
  VoteMutation
} from '../generated/graphql';

interface VoteButtonsProps {
  post: PostSnippetFragment;
}

const updateAfterVote = (value: number, postId: number, cache: ApolloCache<VoteMutation>) => {
  const data = cache.readFragment<{
    id: number;
    points: number;
    voteStatus: number | null;
  }>({
    id: 'Post:' + postId,
    fragment: gql`
      fragment _ on Post {
        id
        points
        voteStatus
      }
    `
  });
  if (data) {
    if (data.voteStatus === value) {
      return;
    }
    const newPoints = (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
    cache.writeFragment({
      id: 'Post:' + postId,
      fragment: gql`
        fragment __ on Post {
          points
          voteStatus
        }
      `,
      data: { points: newPoints, voteStatus: value }
    });
  }
};

const VoteButtons: React.FC<VoteButtonsProps> = ({ post }) => {
  const [voteMutation] = useVoteMutation();
  const [isLoading, setIsLoading] = useState<'upvoteLoading' | 'downvoteLoading' | 'notLoading'>(
    'notLoading'
  );

  // check if auth
  const { data, loading } = useMeQuery();
  const router = useRouter();

  const voteFunc = async (voteValue: number) => {
    if (!loading && !data?.me) {
      router.replace('/login?redirection=' + router.pathname);
      return;
    }

    if (post.voteStatus === voteValue) {
      return;
    }

    // update function will update the cache after vote
    setIsLoading('downvoteLoading');
    await voteMutation({
      variables: { value: voteValue, postId: post.id },
      update: cache => updateAfterVote(voteValue, post.id, cache)
    });
    setIsLoading('notLoading');
  };

  return (
    <Flex direction='column' justifyContent='center' alignItems='center' mr={4}>
      <IconButton
        aria-label='vote up'
        size='md'
        icon='chevron-up'
        isLoading={isLoading === 'upvoteLoading'}
        variantColor={post.voteStatus === 1 ? 'green' : undefined}
        onClick={() => voteFunc(1)}
      />
      {post.points}
      <IconButton
        aria-label='vote down'
        size='md'
        icon='chevron-down'
        isLoading={isLoading === 'downvoteLoading'}
        variantColor={post.voteStatus === -1 ? 'red' : undefined}
        onClick={() => voteFunc(-1)}
      />
    </Flex>
  );
};

export default VoteButtons;
