import { Platform } from "react-native";
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";

import { BASE_URL } from "src/constants/env";
import { useAuthState } from "src/contexts/AuthContext";
import { URLJoin } from "src/utils";
import requestAxios, { useAxios } from "src/hooks/useAxios";
import { RoomJson, RoomJsonIoTs } from "src/types/Types.context";
import { Request } from "src/types/Types";
import { useChatDispatch } from "src/contexts/ChatContext";

type UseRequestPostRoomImage = () => {
  requestPostRoomImage: (_roomId: string, _roomImage: ImageInfo) => void;
};
export const useRequestPostRoomImage: UseRequestPostRoomImage = () => {
  const authState = useAuthState();
  const chatDispatch = useChatDispatch();

  const requestPostRoomImage = (_roomId: string, _roomImage: ImageInfo) => {
    const url = URLJoin(BASE_URL, "rooms/", _roomId, "images/");

    const formData = new FormData();
    formData.append("image", {
      name: "room_image.jpg",
      uri:
        Platform.OS === "android"
          ? _roomImage.uri
          : _roomImage.uri.replace("file://", ""),
      type: "image/jpg",
    });

    requestAxios(url, "post", RoomJsonIoTs, {
      token: authState.token ? authState.token : "",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      thenCallback: (resData) => {
        const roomJson = resData as RoomJson;
        chatDispatch({
          type: "UPDATE_TALKING_ROOM",
          roomJson: roomJson,
        });
      },
    });
  };

  return {
    requestPostRoomImage,
  };
};

type UseRequestPostRoom = (
  roomName: string | null,
  isExcludeDifferentGender: boolean | null,
  roomImage: ImageInfo | null,
  additionalThenCallback?: (roomJson: RoomJson) => void
) => {
  requestPostRoom: Request;
  isLoadingPostRoom: boolean;
};
export const useRequestPostRoom: UseRequestPostRoom = (
  roomName,
  isExcludeDifferentGender,
  roomImage,
  additionalThenCallback = () => void 0
) => {
  const authState = useAuthState();
  const chatDispatch = useChatDispatch();

  const { requestPostRoomImage } = useRequestPostRoomImage();

  const { isLoading: isLoadingPostRoom, request: requestPostRoom } = useAxios(
    URLJoin(BASE_URL, "rooms/"),
    "post",
    RoomJsonIoTs,
    {
      data: {
        ...(roomName !== null ? { name: roomName } : {}),
        ...(isExcludeDifferentGender !== null
          ? { is_exclude_different_gender: isExcludeDifferentGender }
          : {}),
      },
      thenCallback: (resData) => {
        const roomJson = resData as RoomJson;

        if (roomImage) {
          // この時点ではroomImageのpostが完了していないのでnullに(これをしないとデフォルト画像が表示されてしまうため)
          const imageNullRoomJson = { ...roomJson };
          imageNullRoomJson.image = null;
          chatDispatch({
            type: "INIT_TALKING_ROOM",
            roomJson: imageNullRoomJson,
          });
          requestPostRoomImage(roomJson.id, roomImage);
        } else {
          chatDispatch({ type: "INIT_TALKING_ROOM", roomJson: roomJson });
        }

        chatDispatch({
          type: "APPEND_COMMON_MESSAGE",
          roomId: roomJson.id,
          commonMessageSettings: {
            type: "CREATED_ROOM",
          },
        });

        additionalThenCallback(roomJson);
      },
      token: authState.token ? authState.token : "",
    }
  );

  return {
    requestPostRoom,
    isLoadingPostRoom,
  };
};

type UseRequestPatchRoom = (
  roomId: string,
  roomName?: string | null,
  isExcludeDifferentGender?: boolean | null,
  roomImage?: ImageInfo | null,
  additionalThenCallback?: (roomJson: RoomJson) => void
) => {
  requestPatchRoom: Request;
  isLoadingPatchRoom: boolean;
};
export const useRequestPatchRoom: UseRequestPatchRoom = (
  roomId,
  roomName = null,
  isExcludeDifferentGender = null,
  roomImage = null,
  additionalThenCallback = () => void 0
) => {
  const authState = useAuthState();
  const chatDispatch = useChatDispatch();

  const { requestPostRoomImage } = useRequestPostRoomImage();

  const { isLoading: isLoadingPatchRoom, request: requestPatchRoom } = useAxios(
    URLJoin(BASE_URL, "rooms/", roomId),
    "patch",
    RoomJsonIoTs,
    {
      data: {
        ...(roomName !== null ? { name: roomName } : {}),
        ...(isExcludeDifferentGender !== null
          ? { is_exclude_different_gender: isExcludeDifferentGender }
          : {}),
      },
      thenCallback: (resData) => {
        const roomJson = resData as RoomJson;

        if (roomImage) {
          // この時点ではroomImageのpostが完了していないのでnullに(これをしないとデフォルト画像が表示されてしまうため)
          const imageNullRoomJson = { ...roomJson };
          imageNullRoomJson.image = null;
          chatDispatch({
            type: "UPDATE_TALKING_ROOM",
            roomJson: imageNullRoomJson,
          });
          requestPostRoomImage(roomJson.id, roomImage);
        } else {
          chatDispatch({ type: "UPDATE_TALKING_ROOM", roomJson: roomJson });
        }

        additionalThenCallback(roomJson);
      },
      token: authState.token ? authState.token : "",
    }
  );

  return {
    requestPatchRoom,
    isLoadingPatchRoom,
  };
};

type UseRequestDeleteRoom = (
  roomId: string,
  additionalThenCallback?: () => void
) => {
  requestDeleteRoom: Request;
  isLoadingDeleteRoom: boolean;
};
export const useRequestDeleteRoom: UseRequestDeleteRoom = (
  roomId,
  additionalThenCallback = () => void 0
) => {
  const authState = useAuthState();
  const chatDispatch = useChatDispatch();

  const {
    isLoading: isLoadingDeleteRoom,
    request: requestDeleteRoom,
  } = useAxios(URLJoin(BASE_URL, "rooms/", roomId), "delete", RoomJsonIoTs, {
    thenCallback: () => {
      chatDispatch({
        type: "I_END_TALK",
        roomId: roomId,
      });

      chatDispatch({
        type: "CLOSE_TALK",
        roomId: roomId,
      });

      additionalThenCallback && additionalThenCallback();
    },
    token: authState.token ? authState.token : "",
  });

  return {
    requestDeleteRoom,
    isLoadingDeleteRoom,
  };
};
