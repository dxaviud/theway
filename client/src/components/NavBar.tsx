import { Box, Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useMeQuery } from "../generated/graphql";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = () => {
  const { data, loading } = useMeQuery();
  let body;
  if (loading) {
    body = null;
  } else if (data?.me) {
    body = <Box>{data.me.email}</Box>;
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
