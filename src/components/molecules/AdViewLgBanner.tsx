import React, { useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import NativeAdView, {
  MediaView,
  NativeAd,
} from "react-native-admob-native-ads";
import { Block, Text } from "galio-framework";

import { COLORS } from "src/constants/colors";
import { width } from "src/constants";

type Props = {
  adUnitId: string;
};
export const AdViewLgBanner: React.FC<Props> = (props) => {
  const { adUnitId } = props;

  const [status, setStatus] = useState<"LOADING" | "LOADED" | "ERROR">(
    "LOADING"
  );
  const [viewWidth] = useState(width - 40);
  const [viewHeight] = useState(160);

  const _onAdFailedToLoad = (event: NativeAd) => {
    setStatus("ERROR");
  };
  const _onUnifiedNativeAdLoaded = (event: NativeAd): {} => {
    setStatus("LOADED");
  };
  const _onAdLoaded = () => void 0;
  const _onAdClicked = () => void 0;
  const _onAdImpression = () => void 0;
  const _onAdLeftApplication = () => void 0;

  return (
    <Block
      flex
      style={styles.container}
    >
      <NativeAdView
        onAdLoaded={_onAdLoaded}
        onAdFailedToLoad={_onAdFailedToLoad}
        onAdLeftApplication={_onAdLeftApplication}
        onAdClicked={_onAdClicked}
        onAdImpression={_onAdImpression}
        onUnifiedNativeAdLoaded={_onUnifiedNativeAdLoaded}
        // refreshInterval={60000 * 2}
        adUnitID={adUnitId}
        requestNonPersonalizedAdsOnly
        style={styles.nativeAdView}
      >
        {status === "LOADED" ? (
          <Block
            flex
            style={[
              styles.contents,
              {
                width: viewWidth,
                minHeight: viewHeight,
              },
            ]}
          >
            <Block  style={styles.mediaContainer}>
              <MediaView style={styles.mediaView} />
            </Block>
          </Block>
        ) : (
          <Block
            flex
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: viewWidth,
            }}
          >
            {status === "LOADING" && (
              <ActivityIndicator size={28} color="#a9a9a9" />
            )}
            {status === "ERROR" && (
              <Text style={{ color: "#a9a9a9" }}>:-(</Text>
            )}
          </Block>
        )}
      </NativeAdView>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    backgroundColor: COLORS.BEIGE,
    width: width
  },
  nativeAdView: {
    height: 200,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative"
  },
  contents: {

  },
  adBadge: {
    position: "absolute",
    left: 0
  },
  titleContainer: {},
  taglineView: {
    color: COLORS.BLACK,
    fontWeight: "bold",
    fontSize: 16,
  },
  contentContainer: {},
  mediaContainer: {},
  mediaView: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: 8,
  },
  appInfoContainer: {  },
});
