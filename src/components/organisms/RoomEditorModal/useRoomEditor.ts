import { useState } from "react";
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";

import { PropsDependsOnMode } from "src/components/organisms/RoomEditorModal";

export type IsSpeakerState = boolean;
export type RoomNameState = string | null;
export type RoomImageState = ImageInfo | null;
export type TagsState = string[] | null;
export type isExcludeDifferentGenderState = boolean | null;
export type isPrivateState = boolean | null;

export const useInitStateInRoomEditor = (
  propsDependsOnMode: PropsDependsOnMode,
  canSetIsExcludeDifferentGender: boolean
): {
  initIsSpeaker: IsSpeakerState;
  initRoomName: RoomNameState;
  initRoomImage: RoomImageState;
  initDraftRoomImage: RoomImageState;
  initTags: TagsState;
  initDraftTags: TagsState;
  initIsExcludeDifferentGender: isExcludeDifferentGenderState;
  initIsPrivate: isPrivateState;
} => {
  const [initIsSpeaker] = useState<IsSpeakerState>(
    propsDependsOnMode.mode === "FIX"
      ? propsDependsOnMode.talkingRoom.isSpeaker
      : true
  );
  const [initRoomName] = useState<RoomNameState>(
    propsDependsOnMode.mode === "FIX"
      ? propsDependsOnMode.talkingRoom.name
      : null
  );
  const [initRoomImage] = useState<RoomImageState>(null);
  const [initDraftRoomImage] = useState<RoomImageState>(null);
  const [initTags] = useState<TagsState>(
    propsDependsOnMode.mode === "FIX"
      ? propsDependsOnMode.talkingRoom.tags.map((_tag) => {
          return _tag.key;
        })
      : null
  );
  const [initDraftTags] = useState<TagsState>(null);

  // initIsExcludeDifferentGender初期値のコード量が長いので関数に抽出
  const geneInitIsExcludeDifferentGender = () => {
    let _initIsExcludeDifferentGender = null;
    if (propsDependsOnMode.mode === "FIX") {
      if (propsDependsOnMode.talkingRoom.isPrivate) return false;
      if (canSetIsExcludeDifferentGender) {
        _initIsExcludeDifferentGender =
          propsDependsOnMode.talkingRoom.isExcludeDifferentGender;
      } else {
        _initIsExcludeDifferentGender = false; // HACK:(気味) 性別内緒or未設定は強制的に「異性にも表示」
      }
    }
    return _initIsExcludeDifferentGender;
  };
  const [initIsExcludeDifferentGender] =
    useState<isExcludeDifferentGenderState>(geneInitIsExcludeDifferentGender());
  const [initIsPrivate] = useState<isPrivateState>(
    propsDependsOnMode.mode === "FIX"
      ? propsDependsOnMode.talkingRoom.isPrivate
      : null
  );

  return {
    initIsSpeaker,
    initRoomName,
    initRoomImage,
    initDraftRoomImage,
    initTags,
    initDraftTags,
    initIsExcludeDifferentGender,
    initIsPrivate,
  };
};
