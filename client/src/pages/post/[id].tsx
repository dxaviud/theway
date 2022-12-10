import { Box, Flex } from "@chakra-ui/react";
import { NavBar } from "../../components/NavBar";
import { PostContent } from "../../components/PostContent";
import { Voter } from "../../components/Voter";
import { Wrapper } from "../../components/Wrapper";
import { usePostQuery } from "../../generated/graphql";

const Post = ({ id }: any) => {
  const postId = parseInt(id);
  const { data, loading, error } = usePostQuery({
    variables: {
      id: postId,
    },
  });

  let body = null;
  if (loading) {
    body = <Box>Loading...</Box>;
  } else if (error) {
    console.log("error on post/[id]", error);
  } else if (!data || !data.post) {
    body = <Box>Post not found.</Box>;
  } else {
    const post = data.post;
    body = (
      <Flex>
        <Voter post={data.post} />
        <PostContent
          post={{
            id: post.id,
            title: post.title,
            creatorEmail: post.creator.email,
            content: post.content,
          }}
        />
      </Flex>
    );
  }

  return (
    <>
      <NavBar />
      <Wrapper>{body}</Wrapper>
    </>
  );
};

export function getServerSideProps(context: any) {
  const { id } = context.query;
  return {
    props: { id }, // will be passed to the page component as props
  };
}

export default Post;
