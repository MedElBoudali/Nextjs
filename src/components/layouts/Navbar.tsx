import { Fragment } from 'react';
// import { Nav, LogoContainer, Logo, LogoHeader, ButtonsContainer } from './NavbarStyle';
import NextLink from 'next/link';
import { Box, Button, Flex, Heading, Link } from '@chakra-ui/core';
import { useLogoutMutation, useMeQuery } from '../../generated/graphql';
import { useRouter } from 'next/router';
import { isServer } from '../../utils/isServer';

const Navbar: React.FC<{}> = () => {
  const router = useRouter();
  const { data, loading } = useMeQuery({ skip: isServer() });
  const [logout, { loading: logoutFetching }] = useLogoutMutation();

  let body = null;
  if (loading) {
    // loading and not loged in
  } else if (!data?.me) {
    // if we are not loged in
    body = (
      <>
        <NextLink href='/login'>
          <Link color='white' mr={2}>
            Login
          </Link>
        </NextLink>
        <NextLink href='/register'>
          <Link color='white' ml={2}>
            Register
          </Link>
        </NextLink>
      </>
    );
  } else {
    // if we are loged in
    body = (
      <Flex>
        <Box color='white' style={{ textTransform: 'uppercase' }}>
          {data?.me?.username}
        </Box>
        <NextLink href='/create-post'>
          <Link ml='5' color='white' paddingX={2} background='#68D391'>
            Create Post
          </Link>
        </NextLink>
        <Button
          ml={5}
          variant='link'
          color='#68D391'
          onClick={async () => {
            await logout();
            router.reload();
          }}
          isLoading={logoutFetching}>
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Fragment>
      {/* <Nav>
        <LogoContainer>
          <Logo src='https://i.imgur.com/sdO8tAw.png' />
          <LogoHeader>reddit</LogoHeader>
        </LogoContainer>
        <ButtonsContainer>
          <Link href='/login'>login</Link>
          <Link href='/register'>register</Link>
        </ButtonsContainer>
      </Nav> */}
      <Flex bg='#008080' paddingX={10} paddingY={4} align='center'>
        <NextLink href='/'>
          <Link>
            <Heading style={{ color: 'white' }}>Reddit Clone</Heading>
          </Link>
        </NextLink>
        <Box ml={'auto'}>{body}</Box>
      </Flex>
    </Fragment>
  );
};

export default Navbar;
