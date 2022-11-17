import { Center, Text, Icon } from "native-base";
import { Fontisto } from "@expo/vector-icons";
import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";

import Logo from "../assets/logo.svg";

export function SignIn() {
  const { signIn, user } = useAuth();

  return (
    <Center flex={1} bgColor="gray.900" p={7}>
      <Text color="green.500">Olá</Text>
    </Center>
  );
}
