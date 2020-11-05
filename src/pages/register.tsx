import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { Box, Button } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/router';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import PropTypes from 'prop-types';

interface registerProps {}

const Register: React.FC<registerProps> = () => {
  const router = useRouter();
  const [_, register] = useRegisterMutation();

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          // send values (usernam, password) to our register mutation
          const response = await register(values);
          if (response.data?.register.errors) {
            // check if we have errors
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
            // worked
            // router.push('/');
          }
        }}>
        {({ isSubmitting }) => (
          <Form>
            <Box>
              <InputField name='username' placeholder='username' label='Username' />
            </Box>
            <Box mt='30px'>
              <InputField name='password' placeholder='password' label='Password' type='password' />
            </Box>

            <Button mt='30px' type='submit' isLoading={isSubmitting} variantColor='teal'>
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

Register.propTypes = {};

export default Register;
