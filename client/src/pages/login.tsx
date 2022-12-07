import { Box, Button, Flex, FormControl } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import {
  MeDocument,
  PostsDocument,
  useLoginMutation,
} from "../generated/graphql";

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const [login] = useLoginMutation({
    refetchQueries: [{ query: MeDocument }, { query: PostsDocument }],
  });
  const router = useRouter();
  return (
    <Wrapper size="small">
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={async ({ email, password }, { setFieldError }) => {
          const result = await login({
            variables: {
              email,
              password,
            },
          });
          const errors = result.data?.login.errors;
          if (errors) {
            for (const { field, message } of errors) {
              setFieldError(field, message);
            }
          } else {
            if (typeof router.query.next === "string") {
              router.push(router.query.next);
            } else {
              router.push("/");
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <FormControl>
              <InputField name="email" label="Email" />
              <Box mt={4}>
                <InputField name="password" label="Password" type="password" />
              </Box>
            </FormControl>
            <Flex>
              <Box ml="auto">
                <NextLink href="/forgot-password">Forgot password?</NextLink>
              </Box>
            </Flex>
            <Button
              type="submit"
              isLoading={isSubmitting}
              mt={4}
              colorScheme="twitter"
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Login;
