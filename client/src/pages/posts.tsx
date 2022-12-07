import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, IconButton, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";

import { NavBar } from "../components/NavBar";
import { Wrapper } from "../components/Wrapper";
import {
  PostsDocument,
  usePostsQuery,
  useVoteMutation,
  VoteMutationVariables,
} from "../generated/graphql";

const Posts = () => {
  const { data } = usePostsQuery();
  const [vote, { loading }] = useVoteMutation({
    refetchQueries: [{ query: PostsDocument }],
  });
  const [vars, setVars] = useState<VoteMutationVariables>();
  return (
    <>
      <NavBar />
      <Wrapper>
        <Stack spacing={8}>
          {!data ? (
            <div>Loading...</div>
          ) : (
            data.posts.map((post) => (
              <Flex key={post.id} mt={2} p={5} shadow="md" borderWidth="1px">
                <Flex direction="column" alignItems="center" mr={4}>
                  <IconButton
                    onClick={async () => {
                      const variables = {
                        postId: post.id,
                        flow: 1,
                      };
                      setVars(variables);
                      await vote({
                        variables,
                      });
                    }}
                    isLoading={
                      loading && vars!.flow === 1 && vars!.postId == post.id
                    }
                    colorScheme={post.voteFlow === 1 ? "green" : undefined}
                    aria-label="upflow post"
                    icon={<ChevronUpIcon />}
                  ></IconButton>
                  {post.flow}
                  <IconButton
                    onClick={async () => {
                      const variables = {
                        postId: post.id,
                        flow: -1,
                      };
                      setVars(variables);
                      await vote({
                        variables,
                      });
                    }}
                    isLoading={
                      loading && vars!.flow === -1 && vars!.postId == post.id
                    }
                    colorScheme={post.voteFlow === -1 ? "red" : undefined}
                    aria-label="downflow post"
                    icon={<ChevronDownIcon />}
                  ></IconButton>
                </Flex>
                <Box>
                  <Heading fontSize="xl">{post.title}</Heading>
                  <Text mt={4}>{post.contentSnippet}</Text>
                </Box>
              </Flex>
            ))
          )}
        </Stack>
      </Wrapper>
    </>
  );
};

export default Posts;
