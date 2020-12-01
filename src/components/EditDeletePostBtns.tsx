import { IconButton, Link } from '@chakra-ui/core';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useDeletePostMutation, useMeQuery } from '../generated/graphql';

interface EditDeletePostBtnsProps {
  postId: number;
  authorId: number;
}

const EditDeletePostBtns: React.FC<EditDeletePostBtnsProps> = ({ postId, authorId }) => {
  const router = useRouter();
  const [deletePost] = useDeletePostMutation();
  const { data: meData } = useMeQuery();

  if (meData?.me?.id !== authorId) {
    return null;
  }

  return (
    <>
      <NextLink href='/post/edit/[id]' as={`/post/edit/${postId}`}>
        <IconButton as={Link} aria-label='Edit Post' size='md' icon='edit' mr={5} />
      </NextLink>
      <IconButton
        variantColor='red'
        aria-label='Delete Post'
        size='md'
        icon='delete'
        onClick={() => {
          deletePost({
            variables: { id: postId },
            update: cache => {
              cache.evict({ id: 'Post:' + postId });
            }
          });
          router.back();
        }}
      />
    </>
  );
};

EditDeletePostBtns.propTypes = {
  postId: PropTypes.number.isRequired,
  authorId: PropTypes.number.isRequired
};

export default EditDeletePostBtns;
