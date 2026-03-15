import { Box, Text } from "@chakra-ui/react";
import { T } from "./tokens";

interface FormFieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  mb?: number;
}

export function FormField({ label, required, hint, children, mb = 4 }: FormFieldProps) {
  return (
    <Box mb={mb}>
      <Text fontSize="12.5px" fontWeight={600} color="#334155" mb={1.5}>
        {label}
        {required && (
          <Text as="span" color={T.red} ml={0.5}>*</Text>
        )}
      </Text>
      {children}
      {hint && (
        <Text fontSize="11.5px" color={T.sub} mt={1}>{hint}</Text>
      )}
    </Box>
  );
}
