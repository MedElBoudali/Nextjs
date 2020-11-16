import { Box, Button } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import PropTypes from 'prop-types';
import InputField from '../../components/InputField';
import Wrapper from '../../components/Wrapper';

interface ChangePasswordProps {}

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  return (
    <div>
      <Wrapper variant='small'>
        <Formik
          initialValues={{ userNameOrEmail: '', password: '' }}
          onSubmit={async (values, { setErrors }) => {}}>
          {({ isSubmitting }) => (
            <Form>
              <Box>
                <InputField name='newPassword' placeholder='new password' label='New Password' />
              </Box>
              <Button mt='30px' type='submit' isLoading={isSubmitting} variantColor='teal'>
                Change Password
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </div>
  );
};

// to get the query parameters from url ex: change-password/74d34b7c-af96-4fd3-9c77-57663b897308
ChangePassword.getInitialProps = ({ query }) => {
  return { token: query.token as string };
};

ChangePassword.propTypes = {};

export default ChangePassword;
