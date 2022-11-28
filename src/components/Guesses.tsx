import { useEffect, useState } from "react";
import { Box, FlatList, Text, useToast, VStack } from "native-base";
import { api } from "../services/api";
import { ScrollView } from "react-native";

import { GameProps, Game } from "../components/Game";
import { Loading } from "./Loading";
import { EmptyMyPoolList } from "./EmptyMyPoolList";

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [games, setGames] = useState<GameProps[]>([]);
  const [passedGames, setPassedGames] = useState<GameProps[]>([]);
  const [firstTeamPoints, setFirstTeamPoints] = useState("");
  const [secondTeamPoints, setSecondTeamPoints] = useState("");
  const toast = useToast();
  const today = new Date();

  async function fetchGames() {
    try {
      setIsLoading(true);
      const response = await api.get(`/pools/${poolId}/games`);
      const array = response.data.games;
      const filtered = array.filter((e) => new Date(e.date) > today);
      const old = array.filter((e) => new Date(e.date) < today);
      setPassedGames(old);
      setGames(filtered);
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

  async function handleGuessConfirm(gameId: string) {
    try {
      setIsLoading(true);
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: "Informe o placar do palpite.",
          bgColor: "red.500",
          placement: "top",
        });
      }
      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      });

      toast.show({
        title: "Palpite enviado com sucesso!",
        bgColor: "green.500",
        placement: "top",
      });
      fetchGames();
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      toast.show({
        title: "Não foi possível enviar o palpite.",
        bgColor: "red.500",
        placement: "top",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGames();
  }, [poolId]);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <VStack flex={1} maxH="full">
      <FlatList
        data={games}
        ListEmptyComponent={<EmptyMyPoolList code={code} />}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Game
            data={item}
            setFirstTeamPoints={setFirstTeamPoints}
            setSecondTeamPoints={setSecondTeamPoints}
            onGuessConfirm={() => handleGuessConfirm(item.id)}
          />
        )}
        ListFooterComponent={
          <FlatList
            flexGrow={1}
            data={passedGames}
            ListHeaderComponent={
              <Text color="gray.200" fontSize="xs">
                Jogos Passados!
              </Text>
            }
            ListEmptyComponent={<EmptyMyPoolList code={code} />}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Game
                data={item}
                setFirstTeamPoints={setFirstTeamPoints}
                setSecondTeamPoints={setSecondTeamPoints}
                onGuessConfirm={() => handleGuessConfirm(item.id)}
              />
            )}
          />
        }
      />
    </VStack>
  );
}
