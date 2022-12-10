import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import NextLink from "next/link";
import {
  PostsDocument,
  useDeletePostMutation,
  useMeQuery,
} from "../generated/graphql";

interface PostButtonsProps {
  creatorId: number;
  id: number;
}

export const PostButtons: React.FC<PostButtonsProps> = ({ creatorId, id }) => {
  const { data, loading } = useMeQuery({
    fetchPolicy: "no-cache",
  });
  const [deletePost] = useDeletePostMutation({
    refetchQueries: [{ query: PostsDocument }],
  });
  if (loading) {
    return null;
  }
  return (
    (data && data.me?.id === creatorId && (
      <Flex align="center">
        <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
          <IconButton
            mr={4}
            aria-label="edit post"
            icon={<EditIcon />}
          ></IconButton>
        </NextLink>
        <IconButton
          aria-label="delete post"
          onClick={() => {
            deletePost({ variables: { id } });
          }}
          icon={<DeleteIcon />}
        ></IconButton>
      </Flex>
    )) ||
    null
  );
};
