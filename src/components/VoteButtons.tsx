import { Flex, IconButton } from '@chakra-ui/core';
import PropTypes from 'prop-types';
import { GetAllPostsQuery } from '../generated/graphql';

interface VoteButtonsProps {
  post: GetAllPostsQuery['getAllPosts']['posts'][0];
  vote: (value: number, postId: number) => void;
}

const VoteButtons: React.FC<VoteButtonsProps> = ({ post, vote }) => {
  return (
    <Flex direction='column' justifyContent='center' alignItems='center' mr={4}>
      <IconButton
        aria-label='vote up'
        size='md'
        icon='chevron-up'
        onClick={() => vote(1, post.id)}
      />
      {post.points}
      <IconButton
        aria-label='vote down'
        size='md'
        icon='chevron-down'
        onClick={() => vote(-1, post.id)}
      />
    </Flex>
  );
};

VoteButtons.propTypes = {
  post: PropTypes.object,
  vote: PropTypes.func.isRequired
};

export default VoteButtons;
