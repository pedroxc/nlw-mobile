import { useState } from "react";
import { Heading, Text, Toast, VStack } from "native-base";
import { Header } from "../components/Header";

import Logo from "../assets/logo.svg";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useToast } from "native-base";
import { api } from "../services/api";

export function New() {
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [isLoading, setIsloading] = useState(false);
  async function handlePoolCreate() {
    if (!title.trim()) {
      return toast.show({
        title: "Informe um nome para o bolão!",
        placement: "top",
        bgColor: "red.500",
      });
    }
    try {
      setIsloading(true);
      await api.post("/pools", { title });
      toast.show({
        title: "Bolão Criado com sucesso!",
        placement: "top",
        bgColor: "green.500",
      });
      setTitle("");
    } catch (err) {
      console.log(err);
      toast.show({
        title: "Erro ao crair Bolão.",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsloading(false);
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Criar Novo Bolão" />
      <VStack mt={8} mx={5} alignItems="center">
        <Logo />
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          my={8}
          textAlign="center"
        >
          Crie seu róprio bolão da copa e compartilhe entre amigos!
        </Heading>

        <Input
          mb={2}
          placeholder="Qual o nome do seu bolão?"
          onChangeText={setTitle}
          value={title}
        />
        <Button onPress={handlePoolCreate} title="criar meu bolão" />
        <Text color="gray.200" fontSize="sm" textAlign="center" px={10} mt={4}>
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas.
        </Text>
      </VStack>
    </VStack>
  );
}
