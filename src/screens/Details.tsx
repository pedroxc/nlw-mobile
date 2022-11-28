import { useEffect, useState } from "react";
import { HStack, Text, useToast, VStack } from "native-base";
import { Share } from "react-native";
import { Header } from "../components/Header";
import { useRoute } from "@react-navigation/native";
import { Loading } from "../components/Loading";
import { api } from "../services/api";
import { PoolPros } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";
import { Guesses } from "../components/Guesses";
import { GuessesRanking } from "../components/GuessesRanking";

interface RouteParams {
  id: string;
}

export function Details() {
  const toast = useToast();
  const [optionsSelecteted, setOptionsSelected] = useState<
    "guesses" | "ranking"
  >("guesses");
  const [isLoading, setIsLoading] = useState(false);
  const [poolDetails, setPoolDetails] = useState<PoolPros>({} as PoolPros);
  const route = useRoute();
  const { id } = route.params as RouteParams;
  async function fetchPoolDetails() {
    try {
      setIsLoading(true);
      const response = await api.get(`/pools/${id}`);
      setPoolDetails(response.data.pool);
    } catch (err) {
      console.log(err);
      toast.show({
        title: "Não foi possível carregar os detalhes do bolão.",
        bgColor: "red.500",
        placement: "top",
      });
    } finally {
      setIsLoading(false);
    }
  }
  async function handleCodeShare() {
    await Share.share({
      message: poolDetails.code,
    });
  }

  useEffect(() => {
    fetchPoolDetails();
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bgColor="gray.900" maxH="90%">
      <Header
        title={poolDetails.title}
        showBackButton
        showShareButton
        onShare={handleCodeShare}
      />
      {poolDetails._count?.participants > 0 ? (
        <VStack px={5} flex={1}>
          <PoolHeader data={poolDetails} />
          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option
              title="Jogos"
              isSelected={optionsSelecteted === "guesses"}
              onPress={() => setOptionsSelected("guesses")}
            />
            <Option
              title="Palpites do Grupo"
              isSelected={optionsSelecteted === "ranking"}
              onPress={() => setOptionsSelected("ranking")}
            />
          </HStack>

          {optionsSelecteted === `guesses` && (
            <Guesses poolId={poolDetails.id} code={poolDetails.code} />
          )}
          {optionsSelecteted === "ranking" && (
            <GuessesRanking poolId={poolDetails.id} />
          )}
        </VStack>
      ) : (
        <EmptyMyPoolList code={poolDetails.code} />
      )}
    </VStack>
  );
}
