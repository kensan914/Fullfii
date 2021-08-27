import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";

import { RoomsTemplate } from "src/components/templates/RoomsTemplate";
import { BASE_URL } from "src/constants/env";
import { useAuthState } from "src/contexts/AuthContext";
import { useAxios } from "src/hooks/useAxios";
import { FilterKey } from "src/navigations/Header/organisms/FilterHeaderMenu/useFilterRoom";
import {
  RoomsSummaries,
  RoomsSummariesResData,
  RoomsSummariesResDataIoTs,
} from "src/types/Types";
import { Room } from "src/types/Types.context";
import { URLJoin } from "src/utils";

export type NavigateRoomsIndividual = (
  headerTitle: string,
  tagKey?: string,
  filterKey?: FilterKey
) => void;
export const RoomsScreen: React.FC = () => {
  const authState = useAuthState();
  const navigation = useNavigation();

  const [roomsSummaries, setRoomsSummaries] = useState<
    RoomsSummaries | undefined
  >();

  useAxios(
    URLJoin(BASE_URL, "rooms/summaries/"),
    "get",
    RoomsSummariesResDataIoTs,
    {
      token: authState.token ? authState.token : "",
      thenCallback: (resData) => {
        const roomsSummariesRes = resData as RoomsSummariesResData;
        const roomsSummaries = roomsSummariesRes.summaries.map(
          (roomSummary) => {
            const _rooms: Room[] = roomSummary.rooms.map((roomJson) => {
              const room: Room = { ...roomJson, ...{ createdAt: new Date() } };
              if (roomJson.createdAt) {
                room.createdAt = new Date(roomJson.createdAt);
              }
              return room;
            });
            return {
              ...roomSummary,
              rooms: _rooms,
            };
          }
        );
        setRoomsSummaries(roomsSummaries);
      },
      shouldRequestDidMount: true,
    }
  );

  const navigateRoomsIndividual: NavigateRoomsIndividual = (
    headerTitle: string,
    tagKey?: string,
    filterKey?: FilterKey
  ) => {
    navigation.navigate("RoomsIndividual", {
      headerTitle: headerTitle,
      tagKey: tagKey,
      filterKey: filterKey,
    });
  };

  return (
    <RoomsTemplate
      roomsSummaries={roomsSummaries}
      navigateRoomsIndividual={navigateRoomsIndividual}
    />
  );
};
