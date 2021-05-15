import React from "react";
import { Block, Text } from "galio-framework";
import {
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
  Image,
} from "react-native";
import IconExtra from "src/components/atoms/Icon";

import { COLORS } from "src/constants/theme";
import Avatar from "src/components/atoms/Avatar";
import ShowRoomModal from "src/components/molecules/ShowRoomModal";

const { width } = Dimensions.get("screen");

const RoomCard = (props) => {
  const { item, hiddenRooms, setHiddenRooms } = props;

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Block style={styles.container}>
        <TouchableHighlight
          activeOpacity={0.7}
          underlayColor="#DDDDDD"
          onPress={() => {
            setIsOpen(true);
          }}
          style={styles.touchableHightlight}
        >
          <Block style={styles.card}>
            <Block style={styles.title}>
              <Text
                size={16}
                color={COLORS.BLACK}
                bold
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item.title}
              </Text>
            </Block>
            <Block flex row>
              <Block />
              <Image
                source={item.image}
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: 20,
                }}
              />
              <Block flex column>
                <Block row>
                  <Avatar size={32} image={item.avatar} style={styles.avater} />
                  <Block column style={styles.userInfo}>
                    <Block style={styles.userName}>
                      <Text
                        size={14}
                        color={COLORS.LIGHT_GRAY}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.userName}
                      </Text>
                    </Block>
                    <Block row>
                      <Block style={styles.userGender}>
                        <Text
                          size={14}
                          color={COLORS.LIGHT_GRAY}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {item.userGender}
                        </Text>
                      </Block>
                      <Block style={styles.userJob}>
                        <Text
                          size={14}
                          color={COLORS.LIGHT_GRAY}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {item.userJob}
                        </Text>
                      </Block>
                    </Block>
                  </Block>
                </Block>
                <Block row>
                  <Block flex row style={styles.member}>
                    <Block>
                      <IconExtra
                        name={item.memberIconName}
                        family="Ionicons"
                        size={32}
                        color={item.memberColor}
                      />
                    </Block>
                    <Block style={styles.memberText}>
                      <Text size={14} color={COLORS.LIGHT_GRAY}>
                        {item.joinNum}/{item.maxNum}
                      </Text>
                    </Block>
                  </Block>
                </Block>
              </Block>
            </Block>
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => {
                setHiddenRooms([...hiddenRooms, item.key]);
              }}
            >
              <IconExtra
                name="eye-off"
                family="Feather"
                size={32}
                color={COLORS.BROWN}
              />
            </TouchableOpacity>
          </Block>
        </TouchableHighlight>
      </Block>
      <ShowRoomModal
        item={item}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        hiddenRooms={hiddenRooms}
        setHiddenRooms={setHiddenRooms}
      />
    </>
  );
};

export default RoomCard;

const styles = StyleSheet.create({
  container: {
    marginRight: 20,
    marginLeft: 20,
    marginTop: 10,
    height: "auto",
  },
  card: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    position: "relative",
    width: width - 40,
    borderRadius: 20,
    backgroundColor: COLORS.WHITE,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.26,
    shadowRadius: 0,
    elevation: 1,
  },
  touchableHightlight: {
    borderRadius: 20,
  },
  title: {
    marginBottom: 16,
  },
  avater: {
    marginLeft: 16,
  },
  userInfo: {
    marginLeft: 8,
  },
  userName: {
    marginBottom: 4,
  },
  userGender: {
    marginRight: 4,
  },
  position: {
    marginLeft: 16,
    marginTop: 16,
    alignItems: "center",
  },
  positionText: {
    marginLeft: 8,
  },
  member: {
    marginLeft: 16,
    marginTop: 16,
    alignItems: "center",
  },
  memberText: {
    marginLeft: 8,
  },
  eyeIcon: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
});
