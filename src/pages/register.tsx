import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import PropTypes from 'prop-types';
import { useMutation } from 'urql';

interface registerProps {}

const Register: React.FC<registerProps> = () => {
  const [_, register] = useMutation(`
  mutation($username: String!, $password: String!) {
  register(userIputs: { username: $username, password: $password }) {
    errors {
      field
      message
    }
    user {
      id
      username
    }
  }
}
`);
  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async values => {
          const response = register(values);
          console.log(typeod)
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
