import { Box, Heading, Text } from "@chakra-ui/react";
import NextLink from "next/link";

interface PostContentProps {
  post: {
    id: number;
    title: string;
    creatorEmail: string;
    content: string;
  };
}

export const PostContent: React.FC<PostContentProps> = ({ post }) => {
  return (
    <Box flex={1}>
      <NextLink href="/post/[id]" as={`/post/${post.id}`}>
        <Heading fontSize="xl">{post.title}</Heading>
      </NextLink>
      <Text>By {post.creatorEmail}</Text>
      <Text mt={4}>{post.content}</Text>
    </Box>
  );
};
