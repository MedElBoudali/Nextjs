import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { Box, Button, Link } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { MeDocument, MeQuery, useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import Navbar from '../components/layouts/Navbar';
import { withApollo } from '../utils/withApollo';

const Login: React.FC<{}> = () => {
  const router = useRouter();
  const [login] = useLoginMutation();

  return (
    <>
      <Navbar />
      <Wrapper variant='small'>
        <Formik
          initialValues={{ userNameOrEmail: '', password: '' }}
          onSubmit={async (values, { setErrors }) => {
            // send values (usernam, password) to our login mutation
            const response = await login({
              variables: values,
              update: (cache, { data }) => {
                cache.writeQuery<MeQuery>({
                  query: MeDocument,
                  data: {
                    __typename: 'Query',
                    me: data?.login.user
                  }
                });
                cache.evict({ fieldName: 'getAllPosts:{}' });
              }
            });
            if (response.data?.login.errors) {
              // check if we have errors
              setErrors(toErrorMap(response.data.login.errors));
            } else if (response.data?.login.user) {
              // check if we have redirection
              if (typeof router.query.redirection === 'undefined') {
                router.push('/');
              } else {
                router.push(router.query.redirection as string);
              }
            }
          }}>
          {({ isSubmitting }) => (
            <Form>
              <Box>
                <InputField
                  name='userNameOrEmail'
                  placeholder='example / name@example.com'
                  label='Username / Email'
                />
              </Box>
              <Box mt={2}>
                <InputField
                  name='password'
                  placeholder='password'
                  label='Password'
                  type='password'
                />
              </Box>
              <Box mt={2}>
                <NextLink href='/forgot-password'>
                  <Link>Forgot your password?</Link>
                </NextLink>
              </Box>
              <Box mt={2}>
                <NextLink href='/register'>
                  <Link>New user? Click here to register.</Link>
                </NextLink>
              </Box>
              <Button mt={2} type='submit' isLoading={isSubmitting} variantColor='teal'>
                Login
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </>
  );
};

export default withApollo({ ssr: false })(Login);
