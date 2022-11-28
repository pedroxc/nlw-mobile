import { Button, HStack, Text, useTheme, VStack } from "native-base";
import { X, Check } from "phosphor-react-native";
import { getName } from "country-list";
import dayjs from "dayjs";
import ptbr from "dayjs/locale/pt-br";

import { Team } from "./Team";
import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { Loading } from "./Loading";

export interface GuessProps {
  id: string;
  gameId: string;
  createdAt: string;
  participantId: string;
  firstTeamPoints: number;
  secondTeamPoints: number;
}
interface IUser {
  id: string;
  name: string;
  avatarUrl: string;
}
interface Props {
  data: GuessProps;
}
export interface GameProps {
  id: string;
  firstTeamCountryCode: string;
  secondTeamCountryCode: string;
  date: string;
}

export function RankingCard({ data }: Props) {
  const { colors, sizes } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [game, setGame] = useState<GameProps>();
  const [user, setUser] = useState<IUser>();

  const fetchGame = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<{ game: GameProps }>(
        `games/${data.gameId}`
      );
      setGame(response.data.game);
      console.log(response.data);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`participant/${data.participantId}`);
      setUser(response.data);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchGame();
    fetchUser();
  }, []);
  if (isLoading) {
    return <Loading />;
  }
  return (
    <VStack
      w="full"
      bgColor="gray.800"
      rounded="sm"
      alignItems="center"
      borderBottomWidth={3}
      borderBottomColor="yellow.500"
      mb={3}
      p={4}
    >
      {game && user && (
        <>
          <Text color="gray.100" fontFamily="heading" fontSize="sm">
            Palpite de: {user.name}
          </Text>
          <Text color="gray.100" fontFamily="heading" fontSize="sm">
            {getName(game.firstTeamCountryCode)} vs.{" "}
            {getName(game.secondTeamCountryCode)}
          </Text>
          <Text color="gray.200" fontSize="xs"></Text>
          <HStack
            mt={4}
            w="full"
            justifyContent="space-between"
            alignItems="center"
          >
            <Team
              code={game.firstTeamCountryCode}
              position="right"
              value={String(data.firstTeamPoints)}
              isDisabled={true}
            />

            <X color={colors.gray[300]} size={sizes[6]} />

            <Team
              code={game.secondTeamCountryCode}
              position="left"
              value={String(data.secondTeamPoints)}
              isDisabled={true}
            />
          </HStack>
        </>
      )}
    </VStack>
  );
}
