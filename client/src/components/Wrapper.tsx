import { Box } from "@chakra-ui/react";

interface WrapperProps {
  size?: "small" | "regular";
}

type Props = React.PropsWithChildren<WrapperProps>;

export const Wrapper: React.FC<Props> = ({ children, size = "regular" }) => (
  <Box mt={8} mx="auto" maxW={size === "regular" ? "800px" : "400px"} w="100%">
    {children}
  </Box>
);
