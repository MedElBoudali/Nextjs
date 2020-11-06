import { Fragment } from 'react';
// import { Nav, LogoContainer, Logo, LogoHeader, ButtonsContainer } from './NavbarStyle';
import NextLink from 'next/link';
import { Box, Button, Flex, Link } from '@chakra-ui/core';
import { useMeQuery } from '../../generated/graphql';

const Navbar: React.FC<{}> = () => {
  const [{ data, fetching }] = useMeQuery();

  let body = null;
  if (fetching) {
    // loading and not login
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
        <Box color='white'>{data?.me?.username}</Box>
        <Button ml={5} variant='link' color='#68D391'>
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
      <Flex bg='#008080' paddingX={10} paddingY={4}>
        <Box ml={'auto'}>{body}</Box>
      </Flex>
    </Fragment>
  );
};

export default Navbar;
