import { Box, Button, Link } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';
import InputField from '../../components/InputField';
import Wrapper from '../../components/Wrapper';
import { MeDocument, MeQuery, useChangePasswordMutation } from '../../generated/graphql';
import { toErrorMap } from '../../utils/toErrorMap';
import NextLink from 'next/link';
import { withApollo } from '../../utils/withApollo';

const ChangePassword: React.FC<{}> = () => {
  const router = useRouter();
  const [tokenError, setTokenError] = useState('');
  const [changePassword] = useChangePasswordMutation();

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            variables: {
              newPassword: values.newPassword,
              token: typeof router.query.token === 'string' ? router.query.token : ''
            },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: 'Query',
                  me: data?.changePassword.user
                }
              });
            }
          });
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
  );
};

export default withApollo({ ssr: false })(ChangePassword);
