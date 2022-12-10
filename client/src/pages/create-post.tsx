import { Box, Button, FormControl } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { NavBar } from "../components/NavBar";
import { Wrapper } from "../components/Wrapper";
import {
  PostsDocument,
  useCreatePostMutation,
  useMeQuery,
} from "../generated/graphql";

interface CreatePostProps {}

const CreatePost: React.FC<CreatePostProps> = ({}) => {
  const { data, loading } = useMeQuery({
    fetchPolicy: "network-only",
  });
  const [createPost] = useCreatePostMutation({
    refetchQueries: [{ query: PostsDocument }],
  });
  const router = useRouter();

  let body = null;
  if (loading) {
    body = <Box>Loading...</Box>;
  } else if (!data || !data.me) {
    router.replace("/login?next=" + router.pathname);
  } else {
    body = (
      <Formik
        initialValues={{ title: "", content: "" }}
        onSubmit={async ({ title, content }) => {
          await createPost({
            variables: {
              title,
              content,
            },
          });
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
              Create Post
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

export default CreatePost;
