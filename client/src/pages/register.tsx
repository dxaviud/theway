import { Box, Button, FormControl } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { MeDocument, useRegisterMutation } from "../generated/graphql";

interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
  const [register] = useRegisterMutation({
    refetchQueries: [{ query: MeDocument }],
  });
  const router = useRouter();
  return (
    <Wrapper size="small">
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={async ({ email, password }, { setFieldError }) => {
          const result = await register({
            variables: {
              email,
              password,
            },
          });
          const errors = result.data?.register.errors;
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
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
