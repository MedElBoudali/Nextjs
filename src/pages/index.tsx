import Navbar from '../components/layouts/Navbar';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useDeletePostMutation, useGetAllPostsQuery } from '../generated/graphql';
import { Box, Button, Flex, Heading, IconButton, Link, Text } from '@chakra-ui/core';
import NextLink from 'next/link';
import { Stack } from '@chakra-ui/core';
import { useState } from 'react';
import VoteButtons from '../components/VoteButtons';

const Index = () => {
  const [variables, setVariables] = useState({ limit: 15, cursor: null as null | string });
  const [{ data, fetching }] = useGetAllPostsQuery({
    variables
  });

  const [, deletePost] = useDeletePostMutation();
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
      <Stack spacing='24px' m={5}>
        {data?.getAllPosts.posts && !fetching ? (
          data.getAllPosts.posts.map(p => (
            <Flex p={5} shadow='md' borderWidth='1px' key={p.id} align='center'>
              <VoteButtons post={p} />
              <Flex align='center' flex={1}>
                <Box flex={1} paddingRight={10}>
                  <NextLink href={`/post/${encodeURIComponent(p.id)}`}>
                    <Link>
                      <Heading fontSize='xl' style={{ cursor: 'pointer', width: 'fit-content' }}>
                        {p.title}
                      </Heading>
                    </Link>
                  </NextLink>
                  <Text mt={4} style={{ textAlign: 'justify' }}>
                    {p.textSnippet}
                  </Text>
                  <Text mt={4}>Author: {p.author.username}</Text>
                </Box>
                <IconButton
                  ml='auto'
                  variantColor='red'
                  aria-label='Delete Post'
                  size='md'
                  icon='delete'
                  onClick={() => deletePost({id: p.id})}
                />
              </Flex>
            </Flex>
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
