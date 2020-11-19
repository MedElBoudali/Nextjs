import Navbar from '../components/layouts/Navbar';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useGetAllPostsQuery } from '../generated/graphql';
import { Link } from '@chakra-ui/core';
import NextLink from 'next/link';

const Index = () => {
  const [{ data }] = useGetAllPostsQuery({
    variables: {
      limit: 10
    }
  });
  return (
    <>
      <Navbar />
      <NextLink href='/create-post'>
        <Link>Create Post</Link>
      </NextLink>

      {data &&
        data.getAllPosts.map(p => (
          <div style={{ margin: '5px 50px' }} key={p.id}>
            <p>Title: {p.title}</p>
            <p>Text: {p.text}</p>
            <p>Points: {p.points}</p>
            <p>Author: {p.authorId}</p>
          </div>
        ))}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
