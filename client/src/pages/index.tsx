import { Link, List, ListItem, Text } from "@chakra-ui/react";

import NextLink from "next/link";
import { Container } from "../components/Container";
import { CTA } from "../components/CTA";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import { Main } from "../components/Main";

const Index = () => {
  return (
    <>
      {/* <NavBar /> */}
      <Container height="100vh">
        <Hero title="The Way" />
        <Main>
          <List my={0} color="text">
            <ListItem>
              <NextLink href="/posts">Posts</NextLink>
            </ListItem>
            <ListItem>
              <NextLink href="/create-post">Create Post</NextLink>
            </ListItem>
          </List>
        </Main>

        <DarkModeSwitch />
        <Footer>
          <Text color="text">
            <Link isExternal href="https://nextjs.org" flexGrow={1} mr={2}>
              Next.js
            </Link>
            ❤️{" "}
            <Link isExternal href="https://chakra-ui.com" flexGrow={1} mr={2}>
              Chakra UI
            </Link>
          </Text>
        </Footer>
        <CTA />
      </Container>
    </>
  );
};

export default Index;
