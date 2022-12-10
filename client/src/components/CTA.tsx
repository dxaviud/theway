import { Button } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

import { Container } from "./Container";

export const CTA = () => {
  const router = useRouter();
  const [logout, { loading: logoutLoading }] = useLogoutMutation();
  const { data, loading } = useMeQuery();
  let body;
  if (loading) {
    body = null;
  } else if (data?.me) {
    body = (
      <Button
        onClick={() => {
          logout();
          router.reload();
        }}
        isLoading={logoutLoading}
        variant="solid"
        colorScheme="green"
        rounded="button"
        flexGrow={3}
        mx={2}
        width="full"
      >
        Logout {data.me.email}
      </Button>
    );
  } else {
    body = (
      <>
        <Button
          as={NextLink}
          href="/login"
          variant="outline"
          colorScheme="green"
          rounded="button"
          flexGrow={1}
          mx={2}
          width="full"
        >
          Login
        </Button>
        <Button
          as={NextLink}
          href="/register"
          variant="solid"
          colorScheme="green"
          rounded="button"
          flexGrow={3}
          mx={2}
          width="full"
        >
          Register
        </Button>
      </>
    );
  }
  return (
    <Container
      flexDirection="row"
      position="fixed"
      bottom={0}
      width="full"
      maxWidth="3xl"
      py={3}
    >
      {body}
    </Container>
  );
};
