import Navbar from '../components/layouts/Navbar';
import { useGetAllPostsQuery } from '../generated/graphql';
import { Box, Button, Flex, Heading, Link, Text } from '@chakra-ui/core';
import NextLink from 'next/link';
import { Stack } from '@chakra-ui/core';
import { useState } from 'react';
import VoteButtons from '../components/VoteButtons';
import EditDeletePostBtns from '../components/EditDeletePostBtns';

const Index = () => {
  const [variables, setVariables] = useState({ limit: 15, cursor: null as null | string });
  const { data, error, loading } = useGetAllPostsQuery({
    variables
  });

  // handling if we don't have any data
  if (!data && !loading) {
    return (
      <div>
        <p>Something Went Wrong. Try Again</p>
        <p>Error: ${error?.message}</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Stack spacing='24px' m={5}>
        {data?.getAllPosts.posts && !loading ? (
          data.getAllPosts.posts.map(p =>
            !p ? null : (
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

                  <Box ml='auto'>
                    <EditDeletePostBtns postId={p.id} authorId={p.authorId} />
                  </Box>
                </Flex>
              </Flex>
            )
          )
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
            isLoading={loading}
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

export default Index;
