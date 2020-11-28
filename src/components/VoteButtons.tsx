import { Flex, IconButton } from '@chakra-ui/core';
import { useState } from 'react';
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';

interface VoteButtonsProps {
  // we can use this
  //   post: GetAllPostsQuery['getAllPosts']['posts'][0];
  //   or create fragment and use it here
  post: PostSnippetFragment;
}

const VoteButtons: React.FC<VoteButtonsProps> = ({ post }) => {
  const [, voteMutation] = useVoteMutation();
  const [isLoading, setIsLoading] = useState<'upvoteLoading' | 'downvoteLoading' | 'notLoading'>(
    'notLoading'
  );
  return (
    <Flex direction='column' justifyContent='center' alignItems='center' mr={4}>
      <IconButton
        aria-label='vote up'
        size='md'
        icon='chevron-up'
        isLoading={isLoading === 'upvoteLoading'}
        variantColor={post.voteStatus === 1 ? 'green' : undefined}
        onClick={async () => {
          if (post.voteStatus === 1) {
            return;
          }
          setIsLoading('upvoteLoading');
          await voteMutation({
            value: 1,
            postId: post.id
          });
          setIsLoading('notLoading');
        }}
      />
      {post.points}
      <IconButton
        aria-label='vote down'
        size='md'
        icon='chevron-down'
        isLoading={isLoading === 'downvoteLoading'}
        variantColor={post.voteStatus === -1 ? 'red' : undefined}
        onClick={async () => {
          if (post.voteStatus === -1) {
            return;
          }
          setIsLoading('downvoteLoading');
          await voteMutation({
            value: -1,
            postId: post.id
          });
          setIsLoading('notLoading');
        }}
      />
    </Flex>
  );
};

export default VoteButtons;
