import Navbar from '../components/layouts/Navbar';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useGetAllPostsQuery } from '../generated/graphql';
import { Box, Button, Flex, Heading, Link, Text } from '@chakra-ui/core';
import NextLink from 'next/link';
import { Stack } from '@chakra-ui/core';
import { useState } from 'react';

const Index = () => {
  const [variables, setVariables] = useState({ limit: 10, cursor: null as null | string });
  const [{ data, fetching }] = useGetAllPostsQuery({
    variables
  });

  // handling if we don't have any data
  if (!data && !fetching) {
    return (
      <div>
        <p>Something Went Wrong. Try Again</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Flex align='center' m={10}>
        <Heading>Reddit Clone</Heading>
        <NextLink href='/create-post'>
          <Link ml='auto'>Create Post</Link>
        </NextLink>
      </Flex>

      <Stack spacing='24px' m={5}>
        {data?.getAllPosts.posts && !fetching ? (
          data.getAllPosts.posts.map(p => (
            <Box p={5} shadow='md' borderWidth='1px' key={p.id}>
              <Heading fontSize='xl'>{p.title}</Heading>
              <Text mt={4} style={{ textAlign: 'justify' }}>
                {p.textSnippet}
              </Text>
              <Text mt={4}>Likes: {p.points}</Text>
              <Text mt={4}>Author ID: {p.authorId}</Text>
            </Box>
          ))
        ) : (
          <Flex>
            <Heading fontSize='l' m='auto'>
              Loading ...
            </Heading>
          </Flex>
        )}
      </Stack>
      {data && data.getAllPosts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.getAllPosts.posts[data.getAllPosts.posts.length - 1].createdAt
              });
            }}
            isLoading={fetching}
            m='auto'
            my={10}
            w='40%'
            variantColor='teal'>
            Load More
          </Button>
        </Flex>
      ) : null}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
