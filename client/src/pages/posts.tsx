import { Box, Flex, Stack } from "@chakra-ui/react";

import { NavBar } from "../components/NavBar";
import { PostButtons } from "../components/PostButtons";
import { PostContent } from "../components/PostContent";
import { Voter } from "../components/Voter";
import { Wrapper } from "../components/Wrapper";
import { usePostsQuery } from "../generated/graphql";

const Posts = () => {
  const { data: postsData, loading: postsLoading } = usePostsQuery({
    fetchPolicy: "no-cache",
  });
  if (postsLoading) {
    return (
      <>
        <NavBar />
        <Wrapper>
          <Box>Loading...</Box>
        </Wrapper>
      </>
    );
  }
  if (!postsData) {
    return (
      <>
        <NavBar />
        <Wrapper>
          <Stack spacing={8}>
            <Box>No posts.</Box>
          </Stack>
        </Wrapper>
      </>
    );
  }
  return (
    <>
      <NavBar />
      <Wrapper>
        <Stack spacing={8}>
          {postsData.posts.map((post) => (
            <Flex key={post.id} mt={2} p={5} shadow="md" borderWidth="1px">
              <Voter post={post} />
              <PostContent
                post={{
                  id: post.id,
                  title: post.title,
                  creatorEmail: post.creator.email,
                  content: post.contentSnippet,
                }}
              />
              <PostButtons creatorId={post.creatorId} id={post.id} />
            </Flex>
          ))}
        </Stack>
      </Wrapper>
    </>
  );
};

export default Posts;
