import Navbar from '../components/layouts/Navbar';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useGetAllPostsQuery } from '../generated/graphql';
import { Box, Heading, Link, Text } from '@chakra-ui/core';
import NextLink from 'next/link';
import { Stack } from '@chakra-ui/core';

const Index = () => {
  const [{ data }] = useGetAllPostsQuery({
    variables: {
      limit: 9
    }
  });
  return (
    <>
      <Navbar />
      <NextLink href='/create-post'>
        <Link>Create Post</Link>
      </NextLink>
      <Stack spacing='24px' m={10}>
        {data &&
          data.getAllPosts.map(p => (
            <Box p={5} shadow='md' borderWidth='1px' key={p.id}>
              <Heading fontSize='xl'>{p.title}</Heading>
              <Text mt={4} style={{ textAlign: 'justify' }}>
                {p.textSnippet}
              </Text>
              <Text mt={4}>Likes: {p.points}</Text>
              <Text mt={4}>Author ID: {p.authorId}</Text>
            </Box>
          ))}
      </Stack>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
