import Navbar from '../components/layouts/Navbar';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useGetAllPostsQuery } from '../generated/graphql';
import { Link } from '@chakra-ui/core';
import NextLink from 'next/link';

const Index = () => {
  const [{ data }] = useGetAllPostsQuery();
  return (
    <>
      <Navbar />
      <div>Index page</div>
      <NextLink href='/create-post'>
        <Link>Create Post</Link>
      </NextLink>

      {data && data.getAllPosts.map(p => <div key={p.id}>{p.title}</div>)}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
