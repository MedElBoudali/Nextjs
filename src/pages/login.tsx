import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { Box, Button } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/router';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import Navbar from '../components/layouts/Navbar';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Login: React.FC<{}> = () => {
  const router = useRouter();
  const [, login] = useLoginMutation();

  return (
    <>
      <Navbar />
      <Wrapper variant='small'>
        <Formik
          initialValues={{ username: '', password: '' }}
          onSubmit={async (values, { setErrors }) => {
            // send values (usernam, password) to our login mutation
            const response = await login(values);
            if (response.data?.login.errors) {
              // check if we have errors
              setErrors(toErrorMap(response.data.login.errors));
            } else if (response.data?.login.user) {
              // worked
              router.push('/');
            }
          }}>
          {({ isSubmitting }) => (
            <Form>
              <Box>
                <InputField name='username' placeholder='username' label='Username' />
              </Box>
              <Box mt='30px'>
                <InputField
                  name='password'
                  placeholder='password'
                  label='Password'
                  type='password'
                />
              </Box>

              <Button mt='30px' type='submit' isLoading={isSubmitting} variantColor='teal'>
                Login
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
