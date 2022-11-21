import { Box, Button, FormControl } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useState } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";

const ForgotPassword: React.FC = () => {
  const [done, setDone] = useState(false);
  const [forgotPassword, {}] = useForgotPasswordMutation();
  return (
    <Wrapper size="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async ({ email }) => {
          const result = await forgotPassword({
            variables: {
              email,
            },
          });
          setDone(true);
        }}
      >
        {({ isSubmitting }) =>
          done ? (
            <Box>Email sent! Check your inbox. You can close this tab.</Box>
          ) : (
            <Form>
              <FormControl>
                <InputField name="email" label="Email" type="email" />
              </FormControl>
              <Button
                type="submit"
                isLoading={isSubmitting}
                mt={4}
                colorScheme="twitter"
              >
                Forgot Password
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default ForgotPassword;
