import { Box, Button, Flex, Link } from "@chakra-ui/react";
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
        <Box mr={2}>{data.me.email}</Box>
        <Button
          onClick={() => {
            logout();
            router.reload();
          }}
          isLoading={logoutLoading}
          variant="link"
        >
          Logout
        </Button>
      </Flex>
    );
  } else {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </>
    );
  }
  return (
    <Flex color="black" bgColor="green.200" p={4}>
      <Box mr="auto">{body}</Box>
    </Flex>
  );
};
