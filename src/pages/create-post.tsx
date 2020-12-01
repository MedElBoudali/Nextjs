import { Box, Button } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';
import InputField from '../components/InputField';
import Navbar from '../components/layouts/Navbar';
import Wrapper from '../components/Wrapper';
import { FieldError, useCreatePostMutation } from '../generated/graphql';
import { useIsAuth } from '../hooks/useIsAuth';
import { toErrorMap } from '../utils/toErrorMap';
import { withApollo } from '../utils/withApollo';

const CreatePost: React.FC = () => {
  useIsAuth(); // custom hook to verifie if authenticated or not
  const router = useRouter();
  const [createPost] = useCreatePostMutation();
  const [authError, setAuthError] = useState(false);
  return (
    <>
      <Navbar />
      <Wrapper variant='small'>
        <Formik
          initialValues={{ title: '', text: '' }}
          onSubmit={async (values, { setErrors }) => {
            // send values (usernam, password) to our login mutation
            const response = await createPost({
              variables: values,
              update: cache => {
                cache.evict({ fieldName: 'getAllPosts:{}' });
              }
            });
            if (response.data?.createPost.error) {
              // check if we have errors
              // check if we are auth
              if (response.data.createPost.error.field === 'authenticated') {
                setAuthError(true);
              }
              setErrors(toErrorMap([response.data.createPost.error] as FieldError[]));
            } else if (response.data?.createPost.post) {
              // worked
              router.push('/');
            }
          }}>
          {({ isSubmitting }) => (
            <Form>
              <Box>
                <InputField name='title' placeholder='This is the new title' label='Title' />
              </Box>
              <Box>
                <InputField name='text' placeholder='Some text here' label='Body' />
              </Box>
              {authError && (
                <Box style={{ color: 'red' }}>
                  <p>please log in before creating posts.</p>
                </Box>
              )}
              <Button mt={2} type='submit' isLoading={isSubmitting} variantColor='teal'>
                Create Post
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </>
  );
};

export default withApollo({ ssr: false })(CreatePost);
