import { Box, Button, FormControl } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../../../components/InputField";
import { NavBar } from "../../../components/NavBar";
import { Wrapper } from "../../../components/Wrapper";
import {
  PostsDocument,
  useMeQuery,
  usePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";

const EditPost: React.FC<{}> = ({}) => {
  const { data: meData, loading: meLoading } = useMeQuery({
    fetchPolicy: "network-only",
  });
  const [updatePost] = useUpdatePostMutation({
    refetchQueries: [{ query: PostsDocument }],
  });
  const router = useRouter();
  const postId = parseInt(router.query.id as string);
  const { data: postData, loading: postLoading } = usePostQuery({
    variables: {
      id: postId,
    },
  });

  let body = null;
  if (meLoading || postLoading) {
    body = <Box>Loading...</Box>;
  } else if (!meData || !meData.me) {
    router.replace("/login?next=" + router.pathname);
  } else if (!postData || !postData.post) {
    body = <Box>Post not found.</Box>;
  } else {
    body = (
      <Formik
        initialValues={{
          title: postData.post.title,
          content: postData.post.content,
        }}
        onSubmit={async ({ title, content }, { setFieldError }) => {
          const result = await updatePost({
            variables: {
              id: postId,
              title,
              content,
            },
          });
          console.log(result);
          // const errors = result.data?.createPost.errors;
          // if (errors) {
          //   for (const { field, message } of errors) {
          //     setFieldError(field, message);
          //   }
          // } else {
          // }
          router.push("/posts");
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <FormControl>
              <InputField name="title" label="Title" />
              <Box mt={4}>
                <InputField textarea name="content" label="Content" />
              </Box>
            </FormControl>
            <Button
              type="submit"
              isLoading={isSubmitting}
              mt={4}
              colorScheme="twitter"
            >
              Update Post
            </Button>
          </Form>
        )}
      </Formik>
    );
  }
  return (
    <>
      <NavBar />
      <Wrapper size="small">{body}</Wrapper>
    </>
  );
};

export default EditPost;
