import { useState } from "react";
import { Heading, VStack } from "native-base";
import { Header } from "../components/Header";
import { useToast } from "native-base";

import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export function Find() {
  const toast = useToast();
  const { navigate } = useNavigation();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleJoinPool() {
    try {
      setIsLoading(true);
      if (!code.trim()) {
        toast.show({
          title: "Informe um código válido!",
          placement: "top",
          bgColor: "red.500",
        });
      }

      await api.post("/pools/join", { code });
      toast.show({
        title: "Você entrou no bolão com sucesso!",
        placement: "top",
        bgColor: "green.500",
      });
      navigate("pools");
    } catch (error) {
      setIsLoading(false);
      console.log(error);

      if (error.response?.data?.message === "You already join this pool") {
        return toast.show({
          title: "Você já está nesse bolão",
          placement: "top",
          bgColor: "red.500",
        });
      }

      return toast.show({
        title: "Erro ao entrar no Bolão",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por Código" showBackButton />
      <VStack mt={8} mx={5} alignItems="center">
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          textAlign="center"
          mb={8}
        >
          Encontre um bolão através de seu código único
        </Heading>

        <Input
          mb={2}
          placeholder="Qual o código do bolão?"
          onChangeText={setCode}
          autoCapitalize="characters"
          value={code}
        />
        <Button
          title="BUSCAR BOLÃO"
          isLoading={isLoading}
          onPress={handleJoinPool}
        />
      </VStack>
    </VStack>
  );
}
