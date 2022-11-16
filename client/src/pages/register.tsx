import { Box, Button, FormControl } from "@chakra-ui/react";
import { Form, Formik, FormikValues } from "formik";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";

interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
  return (
    <Wrapper size="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values: FormikValues) => {
          console.log(values);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <FormControl>
              <InputField name="username" label="Username" />
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
