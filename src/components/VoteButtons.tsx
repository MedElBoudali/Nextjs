import { Flex, IconButton } from '@chakra-ui/core';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';

interface VoteButtonsProps {
  // we can use this
  //   post: GetAllPostsQuery['getAllPosts']['posts'][0];
  //   or create fragment and use it here
  post: PostSnippetFragment;
}

const VoteButtons: React.FC<VoteButtonsProps> = ({ post }) => {
  const [_, voteMutation] = useVoteMutation();
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
        onClick={async () => {
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
        onClick={async () => {
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

VoteButtons.propTypes = {
  post: PropTypes.object
};

export default VoteButtons;
