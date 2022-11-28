import { useEffect, useState } from "react";
import { Box, FlatList, Text, useToast, VStack } from "native-base";
import { api } from "../services/api";
import { ScrollView } from "react-native";
import { GuessProps, RankingCard } from "./RankingCard";

import { Game } from "../components/Game";
import { Loading } from "./Loading";
import { EmptyRakingList } from "./EmptyRakingList";

interface Props {
  poolId: string;
}

export function GuessesRanking({ poolId }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [guesses, setGuesses] = useState<GuessProps[]>([]);
  const toast = useToast();
  const today = new Date();

  async function fetchGuesses() {
    try {
      setIsLoading(true);
      const response = await api.get<{ guesses: GuessProps[] }>(
        `/guesses/${poolId}`
      );
      setGuesses(response.data.guesses);
      console.log(response.data.guesses);
    } catch (err) {
      console.log(err);
      toast.show({
        title: "Não foi possível carregar os dados dos jogos.",
        bgColor: "red.500",
        placement: "top",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGuesses();
  }, [poolId]);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <FlatList
      data={guesses}
      ListEmptyComponent={<EmptyRakingList />}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <RankingCard data={item} />}
    />
  );
}
