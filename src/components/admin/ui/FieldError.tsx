import { Text } from "@chakra-ui/react";
import { T } from "./tokens";

/**
 * FieldError — reusable inline validation error message.
 * Usage: <FieldError msg={errors.name} />
 */
export function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <Text fontSize="11.5px" color={T.red} mt={1} fontWeight={500}>
      {msg}
    </Text>
  );
}
