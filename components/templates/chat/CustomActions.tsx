import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
} from "react-native";

const CustomActions = (props) => {
  // const onActionsPress = () => {
  //   const options = [
  //     "Choose From Library",
  //     "Take Picture",
  //     "Send Location",
  //     "Cancel",
  //   ];
  //   const cancelButtonIndex = options.length - 1;
  //   this.context.actionSheet().showActionSheetWithOptions(
  //     {
  //       options,
  //       cancelButtonIndex,
  //     },
  //     async (buttonIndex) => {
  //       const { onSend } = this.props;
  //       switch (buttonIndex) {
  //         case 0:
  //           pickImageAsync(onSend);
  //           return;
  //         case 1:
  //           takePictureAsync(onSend);
  //           return;
  //         case 2:
  //           getLocationAsync(onSend);
  //         default:
  //       }
  //     }
  //   );
  // };

  // const renderIcon = () => {
  //   if (this.props.renderIcon) {
  //     return this.props.renderIcon();
  //   }
  //   return (
  //     <View style={[styles.wrapper, this.props.wrapperStyle]}>
  //       <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
  //     </View>
  //   );
  // };

  return (
    // <TouchableOpacity
    //   style={[styles.container, this.props.containerStyle]}
    //   onPress={this.onActionsPress}
    // >
    //   {this.renderIcon()}
    // </TouchableOpacity>
    null
  );
};

export default CustomActions;
