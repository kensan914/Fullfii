import React, {useState} from "react";
import { StyleSheet, Image } from "react-native";
import { Block, Text, Button } from "galio-framework";
import { COLORS } from "src/constants/theme";
import { width } from "src/constants";
import IconExtra from "src/components/atoms/Icon";
import { ToTalkUserListItem } from "src/components/templates/ProfileTemplate/organisms/ToTalkUserListItem";
import { ListOtherUserEmpty }  from "src/components/templates/ProfileTemplate/organisms/ListOtherUserEmpty";
import { ScrollView } from "react-native-gesture-handler";
import { TALK_LIST_DEMO_IMG } from "src/constants/imagePath";
import  Avatar from "src/components/atoms/Avatar"


type userInfo = {
  name: string,
  gender: string,
  job: string,
  image: string,
  sumOfTalkedRoom: number,
  sumOfListenedRoom: number
};
type wantToTalkUsers = {
  name: string,
  image: string
}[]

type Props = {
  onTransitionProfileEditor: () => void;
  userInfo: userInfo;
  wantToTalkUsers: wantToTalkUsers;
};
export const ProfileTemplate: React.FC<Props> = (props) => {
  const [isList, setIsList] = useState(true);

  const {
    onTransitionProfileEditor,
    userInfo,
    wantToTalkUsers
   } = props;
  return (
    <ScrollView style={styles.container}>
      <Block flex >
        <Block row style={styles.profilePostBox}>
          <Avatar
            size={84}
            // image={}
            style={styles.profileImage}
          />
          <Block row flex style={styles.postContents}>
            <Block column center style={styles.postSpoke}>
              {/* 他者のマイページ且つ公開しない状態の場合はアイコン表示 */}
              {/* <IconExtra name="lock" family="Feather" size={20} color={COLORS.GRAY}/> */}
              <Text bold color={COLORS.BLACK} size={16} style={styles.textHeight}>{userInfo.sumOfTalkedRoom}</Text>
              <Text size={14} color={COLORS.BLACK} style={styles.textHeight}>話した</Text>
            </Block>
            <Block column center style={styles.postListened}>
              {/* <IconExtra name="lock" family="Feather" size={20} color={COLORS.GRAY}/> */}
              <Text bold size={16} color={COLORS.BLACK} style={styles.textHeight}>{userInfo.sumOfListenedRoom}</Text>
              <Text size={14} color={COLORS.BLACK} style={styles.textHeight}>聞いた</Text>
            </Block>
          </Block>
        </Block>
        <Block style={styles.profileInfoBox}>
            <Text size={16} color={COLORS.BLACK} style={styles.textHeight}>{userInfo.name}</Text>
            <Text size={14} color={COLORS.BLACK} style={styles.textHeight}>性別：{userInfo.gender}  /  職業：{userInfo.job}</Text>
        </Block>
        <Button shadowless={true} color='transparent' opacity={0.6} style={styles.editProfileButton} onPress={()=>{onTransitionProfileEditor()}}>
          <Text size={14} bold color={COLORS.BROWN}>プロフィールを編集</Text>
        </Button>
        <Block center style={styles.postHeader}>
          <Text bold size={16} color={COLORS.BLACK}>また相談したい人リスト</Text>
        </Block>
        <Block style={styles.postBody}>
          {
            isList ?
            (wantToTalkUsers.map((wantToTalkUsers) => {
              return (
                <ToTalkUserListItem name={wantToTalkUsers.name} image={wantToTalkUsers.image}/>
              )
            }))
              :
              <ListOtherUserEmpty/>
          }
          </Block>
      </Block>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    backgroundColor: COLORS.BEIGE
  },
  profilePostBox: {
    marginTop: 16,
    alignItems: "center"
  },
  profileImage: {
    width: 84,
    height: 84,
    borderRadius: 50,
  },
  postContents: {
    justifyContent: "center",
  },
  postSpoke: {
    width: 72,
    height: 40,
    justifyContent: "center",
  },
  postListened: {
    width: 72,
    height: 40,
    justifyContent: "center",
    marginLeft: 8
  },
  textHeight: {
    lineHeight: 20
  },
  profileInfoBox: {
    marginTop: 16
  },
  editProfileButton: {
    width: width-32,
    marginTop: 16,
    borderWidth: 2,
    borderColor: COLORS.BROWN,
    borderRadius: 4
  },
  postHeader: {
    marginTop: 40
  },
  postBody: {
    marginTop: 16,
  },

});
