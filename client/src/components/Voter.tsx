import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  PostsDocument,
  useMeQuery,
  useVoteMutation,
  VoteMutationVariables,
} from "../generated/graphql";

interface VoterProps {
  post: {
    id: number;
    flow: number;
    voteFlow?: number | null | undefined;
  };
}

export const Voter: React.FC<VoterProps> = ({ post }) => {
  const { data: meData, loading: meLoading } = useMeQuery({
    fetchPolicy: "network-only",
  });
  const [vote, { loading: voteLoading }] = useVoteMutation({
    refetchQueries: [{ query: PostsDocument }],
  });
  const [vars, setVars] = useState<VoteMutationVariables>({
    flow: 0,
    postId: 0,
  });
  const router = useRouter();

  return (
    <Flex direction="column" alignItems="center" mr={4}>
      <IconButton
        onClick={async () => {
          if (!meData?.me) {
            router.replace("/login?next=" + router.asPath);
            return;
          }
          const variables = {
            postId: post.id,
            flow: 1,
          };
          setVars(variables);
          await vote({
            variables,
          });
        }}
        isLoading={voteLoading && vars?.flow === 1 && vars?.postId == post.id}
        colorScheme={post.voteFlow === 1 ? "green" : undefined}
        aria-label="upflow post"
        icon={<ChevronUpIcon />}
        disabled={meLoading}
      ></IconButton>
      {post.flow}
      <IconButton
        onClick={async () => {
          if (!meData?.me) {
            router.replace("/login?next=" + router.asPath);
            return;
          }
          const variables = {
            postId: post.id,
            flow: -1,
          };
          setVars(variables);
          await vote({
            variables,
          });
        }}
        isLoading={voteLoading && vars?.flow === -1 && vars?.postId == post.id}
        colorScheme={post.voteFlow === -1 ? "red" : undefined}
        aria-label="downflow post"
        icon={<ChevronDownIcon />}
        disabled={meLoading}
      ></IconButton>
    </Flex>
  );
};
