import { BASE_URL } from "src/constants/env";
import { useAuthState } from "src/contexts/AuthContext";
import { URLJoin } from "src/utils";
import requestAxios, { useAxios } from "src/hooks/useAxios";
import { RoomJson, RoomJsonIoTs } from "src/types/Types.context";
import { Request } from "src/types/Types";
import { Dispatch, MutableRefObject } from "react";
import { Platform } from "react-native";
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import { useChatDispatch } from "src/contexts/ChatContext";

type UseRequestRoom = (
  roomName: string,
  isExcludeDifferentGender: boolean | null,
  roomImage: ImageInfo | null,
  resetState: () => void,
  setIsOpenRoomEditorModal: Dispatch<boolean>,
  roomId?: string,
  willOpenRoomCreatedModalRef?: MutableRefObject<boolean>
) => {
  requestPostRoom: Request;
  isLoadingPostRoom: boolean;
  // requestPatchRoom: Request;
  // isLoadingPatchRoom: boolean;
  // requestDeleteRoom: Request;
  // isLoadingDeleteRoom: boolean;
};

export const useRequestRoom: UseRequestRoom = (
  roomName,
  isExcludeDifferentGender,
  roomImage,
  resetState,
  setIsOpenRoomEditorModal,
  roomId = "",
  willOpenRoomCreatedModalRef
) => {
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
          type: "UPDATE_TALKING_ROOM_PROPERTIES",
          roomJson: roomJson,
        });
      },
    });
  };

  const { isLoading: isLoadingPostRoom, request: requestPostRoom } = useAxios(
    URLJoin(BASE_URL, "rooms/"),
    "post",
    RoomJsonIoTs,
    {
      data: {
        ...(roomName ? { name: roomName } : {}),
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
            type: "APPEND_TALKING_ROOM",
            room: imageNullRoomJson,
          });
          requestPostRoomImage(roomJson.id, roomImage);
        } else {
          chatDispatch({ type: "APPEND_TALKING_ROOM", room: roomJson });
        }

        if (willOpenRoomCreatedModalRef) {
          willOpenRoomCreatedModalRef.current = true;
        }
        resetState();
        setIsOpenRoomEditorModal(false);
      },
      token: authState.token ? authState.token : "",
    }
  );

  // const requestPatchRoom;
  // const requestDeleteRoom;

  return {
    requestPostRoom,
    isLoadingPostRoom,
    // requestPatchRoom,
    // requestDeleteRoom,
  };
};
