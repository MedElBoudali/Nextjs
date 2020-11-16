import { Box, Button } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import Wrapper from '../components/Wrapper';
import { createUrqlClient } from '../utils/createUrqlClient';
import PropTypes from 'prop-types';
import InputField from '../components/InputField';
import { useForgotPasswordMutation } from '../generated/graphql';
import { useState } from 'react';
import { isServer } from '../utils/isServer';

interface ForgotPAsswordProps {}

const ForgotPAssword: React.FC<ForgotPAsswordProps> = props => {
  const [, forgotPassword] = useForgotPasswordMutation();
  const [isSend, setIsSend] = useState(false);
  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ email: '' }}
        onSubmit={async (values, { _ }) => {
          const response = await forgotPassword({ email: values.email });
          if (response.data?.forgotPassword) {
            setIsSend(true);
          }
        }}>
        {({ isSubmitting }) => (
          <div>
            {isSend ? (
              <Box>
                <h4>✔️ Email Send!</h4>
                <p> please check your email for reseting your password.</p>
              </Box>
            ) : (
              <Form>
                <Box>
                  <InputField name='email' placeholder='name@example.com' label='Email' />
                </Box>
                <Button mt={2} type='submit' isLoading={isSubmitting} variantColor='teal'>
                  Reset Password
                </Button>
              </Form>
            )}
          </div>
        )}
      </Formik>
    </Wrapper>
  );
};

ForgotPAssword.propTypes = {};

export default withUrqlClient(createUrqlClient)(ForgotPAssword);
