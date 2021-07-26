import React, {useState} from "react";
import { Text, Button, Block } from "galio-framework";
import {
  StyleSheet,
  Image,
  TextInput,
  Keyboard,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from "react-native";
import { COLORS } from "src/constants/colors";
import { width, height } from "src/constants";
import { MAN_AND_WOMAN_IMG, MEN_IMG } from "src/constants/imagePath";
import { ALERT_MESSAGES } from "src/constants/alertMessages";
import { LECTURE_WOMAN_IMG } from "src/constants/imagePath";

export const InputIsExcludeDifferentGenderTemplate: React.FC = () => {
  const [isExcludeDifferentGender, setIsExcludeDifferentGender] = useState(false)
  const [canSetIsExcludeDifferentGender, setCanSetIsExcludeDifferentGender] = useState(false)


  return (
    <Block flex style={styles.container}>
      <Block style={styles.disclosureRangeContainer}>
        <Block row space="between" style={styles.circleButtons}>
          <TouchableOpacity
            style={[
              styles.circleButton,
              isExcludeDifferentGender !== null &&
              !isExcludeDifferentGender
                ? { borderColor: COLORS.GREEN }
                : { borderColor: "#f4f8f7" },
            ]}
            onPress={() => {
              setIsExcludeDifferentGender(false);
            }}
          >
            <ImageBackground
              source={MAN_AND_WOMAN_IMG}
              style={styles.disclosureRangeImage}
            >
              <Block style={styles.disclosureRangeText}>
                <Text size={10} bold>
                  異性にも表示
                </Text>
              </Block>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.circleButton,
              isExcludeDifferentGender !== null &&
              isExcludeDifferentGender
                ? { borderColor: COLORS.GREEN }
                : { borderColor: "#f4f8f7" },
            ]}
            onPress={() => {
              if (!canSetIsExcludeDifferentGender) {
                Alert.alert(
                  ...ALERT_MESSAGES[
                    "CANNOT_SET_IS_EXCLUDE_DEFERENT_GENDER"
                  ]
                );
              } else {
                setIsExcludeDifferentGender(true);
              }
            }}
          >
            <ImageBackground
              source={MEN_IMG}
              style={styles.disclosureRangeImage}
            >
              <Block style={styles.disclosureRangeText}>
                <Text size={10} bold>
                  同性のみ表示
                </Text>
              </Block>
            </ImageBackground>
          </TouchableOpacity>
        </Block>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    height: height-120-104-48
  },

  textLineHeight: {
    lineHeight: 20
  },
  avater: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 8,
  },
  leftMessageContainer: {
    alignItems: "center",
  },
  leftMessage: {
    backgroundColor: COLORS.WHITE,
    height: "auto",
    width: 270,
    padding: 16,
    borderBottomRightRadius: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
  },
  disclosureRangeContainer: {
    marginTop: 32,
  },
  circleButtons: {
    paddingHorizontal: 64,
    marginBottom: 32,
    marginTop: 8,
  },
  circleButton: {
    height: 84,
    width: 84,
    backgroundColor: "#f4f8f7",
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 8,
  },
  disclosureRangeImage: {
    height: 80,
    width: 80,
    alignItems: "center",
  },
  disclosureRangeText: {
    paddingTop: 12,
  },
})
