import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import {
  MeDocument,
  useLogoutMutation,
  useMeQuery,
} from "../generated/graphql";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = () => {
  const router = useRouter();
  const [logout, { loading: logoutLoading }] = useLogoutMutation({
    refetchQueries: [{ query: MeDocument }],
  });
  const { data, loading } = useMeQuery();
  let body;
  if (loading) {
    body = null;
  } else if (data?.me) {
    body = (
      <Flex>
        <Flex alignItems="center" mr={4}>
          {data.me.email}
        </Flex>
        <Button
          onClick={async () => {
            await logout();
            router.push("/");
          }}
          isLoading={logoutLoading}
          colorScheme="green"
        >
          Logout
        </Button>
      </Flex>
    );
  } else {
    body = (
      <>
        <Button as={NextLink} href="/login" colorScheme="green" mr={4}>
          Login
        </Button>
        <Button as={NextLink} href="/register" colorScheme="green">
          Register
        </Button>
      </>
    );
  }
  return (
    <Flex color="white" bgColor="black" p={4}>
      <Flex flex={1}>
        <NextLink href="/">
          <Heading
            bgGradient="linear(to-l, heroGradientStart, heroGradientEnd)"
            bgClip="text"
          >
            The Way
          </Heading>
        </NextLink>
        <Box ml="auto">{body}</Box>
      </Flex>
    </Flex>
  );
};
