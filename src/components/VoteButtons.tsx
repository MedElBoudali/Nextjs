import { Flex, IconButton } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { PostSnippetFragment, useMeQuery, useVoteMutation } from '../generated/graphql';

interface VoteButtonsProps {
  // we can use this
  //   post: GetAllPostsQuery['getAllPosts']['posts'][0];
  //   or create fragment and use it here
  post: PostSnippetFragment;
}

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
    }

    if (post.voteStatus === voteValue) {
      return;
    }

    setIsLoading('downvoteLoading');
    await voteMutation({ variables: { value: voteValue, postId: post.id } });
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
