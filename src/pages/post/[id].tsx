import { useRouter } from 'next/router';
import { useGetPostQuery } from '../../generated/graphql';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import Navbar from '../../components/layouts/Navbar';
import EditDeletePostBtns from '../../components/EditDeletePostBtns';
import { Box, Flex, Heading } from '@chakra-ui/core';

const CurrentPost: React.FC<{}> = () => {
  const router = useRouter();
  const intId = typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;
  const [{ fetching, data }] = useGetPostQuery({
    variables: {
      id: intId
    }
  });
  if (!data && !fetching) {
    return (
      <div>
        <p>Something Went Wrong. Try Again</p>
      </div>
    );
  }
  return (
    <div>
      {data?.getPost && !fetching ? (
        <div>
          <head>
            <title>{!data?.getPost ? 'Loading ...' : data.getPost.title}</title>
          </head>
          <Navbar />
          <Box mx={200}>
            <Heading my={10}>{data.getPost.title}</Heading>
            <Heading fontSize='xl'>{data.getPost.text}</Heading>
            <p style={{margin:"10px 0"}}>{data.getPost.points} Vote.</p>
            <p style={{margin:"10px 0"}}>Created by: {data.getPost.author.username}</p>
          </Box>

          <Flex>
            <Box m='auto'>
              <EditDeletePostBtns postId={intId} authorId={data.getPost.author.id} />
            </Box>
          </Flex>
        </div>
      ) : (
        <div>Loiding ...</div>
      )}
    </div>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(CurrentPost);
