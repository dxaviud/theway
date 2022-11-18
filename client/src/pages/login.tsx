import { Box, Button, FormControl } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { MeDocument, useLoginMutation } from "../generated/graphql";

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const [login] = useLoginMutation({
    refetchQueries: [{ query: MeDocument }],
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
            router.push("/");
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
