import { Linking } from "expo";
import PropTypes from "prop-types";
import React from "react";
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  ViewPropTypes,
  View,
  Text,
} from "react-native";

import MapView from "./MapView";

const CustomView = (props) => {
  // const { currentMessage, containerStyle, mapViewStyle } = this.props;
  // if (currentMessage.location) {
  //   return (
  //     <TouchableOpacity
  //       style={[styles.container, containerStyle]}
  //       onPress={this.openMapAsync}
  //     >
  //       {Platform.OS !== "web" ? (
  //         <MapView
  //           style={[styles.mapView, mapViewStyle]}
  //           region={{
  //             latitude: currentMessage.location.latitude,
  //             longitude: currentMessage.location.longitude,
  //             latitudeDelta: 0.0922,
  //             longitudeDelta: 0.0421,
  //           }}
  //           scrollEnabled={false}
  //           zoomEnabled={false}
  //         />
  //       ) : (
  //         <View style={{ padding: 15 }}>
  //           <Text style={{ color: "tomato", fontWeight: "bold" }}>
  //             Map not supported in web yet, sorry!
  //           </Text>
  //         </View>
  //       )}
  //     </TouchableOpacity>
  //   );
  // }
  return null;
};

export default CustomView;

const styles = StyleSheet.create({
  container: {},
  mapView: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
  },
});
