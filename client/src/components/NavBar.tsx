import { Box, Button, Flex } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = () => {
  const router = useRouter();
  const [logout, { loading: logoutLoading }] = useLogoutMutation();
  const { data, loading } = useMeQuery();
  let body;
  if (loading) {
    body = null;
  } else if (data?.me) {
    body = (
      <Flex>
        <Flex alignItems="center" mr={2}>
          {data.me.email}
        </Flex>
        <Button
          onClick={() => {
            logout();
            router.reload();
          }}
          isLoading={logoutLoading}
          colorScheme="blackAlpha"
          // variant="link"
        >
          Logout
        </Button>
      </Flex>
    );
  } else {
    body = (
      <>
        <Button as={NextLink} href="/login" colorScheme="blackAlpha">
          Login
        </Button>
        {/* <NextLink href="/login">Login</NextLink> */}
        <Button as={NextLink} href="/register" colorScheme="blackAlpha">
          Register
        </Button>
        {/* <NextLink href="/register">Register</NextLink> */}
      </>
    );
  }
  return (
    <Flex color="black" bgColor="green.200" p={4}>
      <Box mr="auto">{body}</Box>
    </Flex>
  );
};
