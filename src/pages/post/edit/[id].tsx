import { Box, Button } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import InputField from '../../../components/InputField';
import Navbar from '../../../components/layouts/Navbar';
import Wrapper from '../../../components/Wrapper';
import { useGetPostQuery, useUpdatePostMutation } from '../../../generated/graphql';
import { createUrqlClient } from '../../../utils/createUrqlClient';

interface EditPostProps {}

const EditPost: React.FC<EditPostProps> = () => {
  const router = useRouter();
  const intId = typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;
  const [{ fetching, data }] = useGetPostQuery({ variables: { id: intId } });
  const [, updatePost] = useUpdatePostMutation();

  if (!data?.getPost) {
    return (
      <div>
        <p>Something Went Wrong. Try Again</p>
      </div>
    );
  }

  return (
    <div>
      <head>
        <title>Edit Post</title>
      </head>
      <Navbar />
      <Wrapper variant='small'>
        <Formik
          initialValues={{ title: data.getPost.title, text: data.getPost.text }}
          onSubmit={async values => {
            await updatePost({ id: intId, ...values });
            router.back();
          }}>
          {({ isSubmitting }) => (
            <Form>
              <Box>
                <InputField name='title' label='Title' />
              </Box>
              <Box>
                <InputField name='text' label='Text' />
              </Box>
              <Button mt={2} type='submit' isLoading={isSubmitting} variantColor='teal'>
                Update Post
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </div>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(EditPost);
