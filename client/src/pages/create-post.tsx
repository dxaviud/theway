import { Box, Button, FormControl } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import {
  PostsDocument,
  useCreatePostMutation,
  useMeQuery,
} from "../generated/graphql";

interface CreatePostProps {}

const CreatePost: React.FC<CreatePostProps> = ({}) => {
  const { data, loading } = useMeQuery();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !data?.me) {
      router.replace("/login?next=" + router.pathname);
    }
  }, [data, loading, router]);
  const [createPost] = useCreatePostMutation({
    refetchQueries: [{ query: PostsDocument }],
  });
  return (
    <Wrapper size="small">
      <Formik
        initialValues={{ title: "", content: "" }}
        onSubmit={async ({ title, content }, { setFieldError }) => {
          const result = await createPost({
            variables: {
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
              Create Post
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default CreatePost;
