import { Box, Button, Flex, FormControl, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";

interface Token {
  token: string;
}

const ChangePassword: NextPage<Token> = ({ token }) => {
  const router = useRouter();
  const [changePassword, {}] = useChangePasswordMutation();
  const [tokenErr, setTokenErr] = useState("");
  return (
    <Wrapper size="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async ({ newPassword }, { setFieldError }) => {
          const result = await changePassword({
            variables: {
              token,
              newPassword,
            },
          });
          const errors = result.data?.changePassword.errors;
          if (errors) {
            for (const { field, message } of errors) {
              if (field == "token") {
                setTokenErr(message);
              } else {
                setFieldError(field, message);
              }
            }
          } else {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <FormControl>
              <InputField
                name="newPassword"
                label="New Password"
                type="password"
              />
            </FormControl>
            {tokenErr ? (
              <Flex>
                <Box mr="auto" color="red">
                  {tokenErr}
                </Box>
                <NextLink href="/forgot-password">
                  <Link>get a new password</Link>
                </NextLink>
              </Flex>
            ) : null}
            <Button
              type="submit"
              isLoading={isSubmitting}
              mt={4}
              colorScheme="twitter"
            >
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

ChangePassword.getInitialProps = ({ query }): Token => {
  return {
    token: query.token as string,
  };
};

export default ChangePassword;
