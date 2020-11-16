import { Box, Button, Flex, Link } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import { useState } from 'react';
import InputField from '../../components/InputField';
import Wrapper from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorMap';
import NextLink from 'next/link';
import PropTypes from 'prop-types';

interface ChangePasswordProps {}

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const router = useRouter();
  const [tokenError, setTokenError] = useState('');
  const [, changePassword] = useChangePasswordMutation();
  return (
    <div>
      <Wrapper variant='small'>
        <Formik
          initialValues={{ newPassword: '' }}
          onSubmit={async (values, { setErrors }) => {
            const response = await changePassword({ newPassword: values.newPassword, token });
            if (response.data?.changePassword.errors) {
              const errorMap = toErrorMap(response.data.changePassword.errors);
              // check if we have token error
              if ('token' in errorMap) {
                setTokenError(errorMap.token);
              }
              setErrors(errorMap);
            } else if (response.data?.changePassword.user) {
              // worked
              router.push('/');
            }
          }}>
          {({ isSubmitting }) => (
            <Form>
              <Box>
                <InputField
                  name='newPassword'
                  placeholder='new password'
                  label='New Password'
                  type='password'
                />
              </Box>
              {tokenError && (
                <Box bg='tomato' w='100%' p={2} mt={2} color='white'>
                  {tokenError}
                  <NextLink href='/forgot-password'>
                    <Link ml={2}>Click here for new token</Link>
                  </NextLink>
                </Box>
              )}
              <Button mt={2} type='submit' isLoading={isSubmitting} variantColor='teal'>
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

export default withUrqlClient(createUrqlClient)(ChangePassword);
