import { Center, Text, Icon } from "native-base";
import { Image } from "react-native";
import { Fontisto } from "@expo/vector-icons";
import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";

import logo from "../assets/logo.svg";

export function SignIn() {
  const { signIn, user } = useAuth();

  return (
    <Center flex={1} bgColor="gray.900" p={7}>
      <Image
        source={logo}
        style={{ tintColor: "white", width: 212, height: 40 }}
      />
      <Button
        mt={12}
        onPress={signIn}
        type="SECONDARY"
        title="ENTRAR COM GOOGLE"
        leftIcon={<Icon as={Fontisto} name="google" color="white" size="md" />}
      />
      <Text color="white" textAlign="center" mt={4}>
        Não utilizamos nenhuma informação além {"\n"}do seu e-mail para criação
        da sua conta
      </Text>
    </Center>
  );
}
