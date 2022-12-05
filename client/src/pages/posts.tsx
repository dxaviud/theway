import { Box, Heading, Stack, Text } from "@chakra-ui/react";

import { NavBar } from "../components/NavBar";
import { Wrapper } from "../components/Wrapper";
import { usePostsQuery } from "../generated/graphql";

const Posts = () => {
  const { data } = usePostsQuery();
  return (
    <>
      <NavBar />
      <Wrapper>
        <Stack spacing={8}>
          {!data ? (
            <div>Loading...</div>
          ) : (
            data.posts.map((post) => (
              <Box key={post.id} mt={2} p={5} shadow="md" borderWidth="1px">
                <Heading fontSize="xl">{post.title}</Heading>
                <Text mt={4}>{post.contentSnippet}</Text>
              </Box>
            ))
          )}
        </Stack>
      </Wrapper>
    </>
  );
};

export default Posts;
