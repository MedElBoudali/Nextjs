import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { Box, Button, Link } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { MeDocument, MeQuery, useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import Navbar from '../components/layouts/Navbar';
import { withApollo } from '../utils/withApollo';

const Register: React.FC<{}> = () => {
  const router = useRouter();
  const [register] = useRegisterMutation();

  return (
    <>
      <Navbar />
      <Wrapper variant='small'>
        <Formik
          initialValues={{ username: '', email: '', password: '' }}
          onSubmit={async (values, { setErrors }) => {
            // send values (usernam, password) to our register mutation
            const response = await register({
              variables: { userInputs: values },
              update: (cache, { data }) => {
                cache.writeQuery<MeQuery>({
                  query: MeDocument,
                  data: {
                    __typename: 'Query',
                    me: data?.register.user
                  }
                });
              }
            });
            if (response.data?.register.errors) {
              // check if we have errors
              setErrors(toErrorMap(response.data.register.errors));
            } else if (response.data?.register.user) {
              // worked
              router.push('/');
            }
          }}>
          {({ isSubmitting }) => (
            <Form>
              <Box>
                <InputField name='username' placeholder='username' label='Username' />
              </Box>
              <Box mt={2}>
                <InputField name='email' placeholder='name@example.com' label='Email' />
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
                <NextLink href='/login'>
                  <Link>You have an account? Click here to login.</Link>
                </NextLink>
              </Box>
              <Button mt={2} type='submit' isLoading={isSubmitting} variantColor='teal'>
                Register
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </>
  );
};

export default withApollo({ ssr: false })(Register);
