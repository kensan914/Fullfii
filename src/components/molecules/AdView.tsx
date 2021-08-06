import React, { useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import NativeAdView, {
  CallToActionView,
  StarRatingView,
  MediaView,
  StoreView,
  TaglineView,
  NativeAd,
} from "react-native-admob-native-ads";
import { Block, Text } from "galio-framework";

import { COLORS } from "src/constants/colors";
import { width } from "src/constants";

type Props = {
  adUnitId: string;
};
export const AdView: React.FC<Props> = (props) => {
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
      style={[styles.container, { width: viewWidth, minHeight: viewHeight }]}
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
            <Block flex={0.4} style={styles.titleContainer}>
              <TaglineView numberOfLines={3} style={styles.taglineView} />
            </Block>

            <Block flex={0.6} row style={styles.contentContainer}>
              <Block flex={0.5} style={styles.mediaContainer}>
                <MediaView style={styles.mediaView} />
              </Block>
              <Block flex={0.5} style={styles.appInfoContainer}>
                <StoreView
                  style={{
                    fontSize: 12,
                  }}
                />
                <StarRatingView size={12} style={{ marginTop: 4 }} />
                <CallToActionView
                  style={{ marginTop: 8 }}
                  allCaps
                  textStyle={{
                    fontSize: 12,
                    flexWrap: "wrap",
                    color: "#0058B3",
                  }}
                />
              </Block>
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
    marginRight: 20,
    marginLeft: 20,
    marginTop: 10,
    position: "relative",
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
  nativeAdView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contents: { borderRadius: 20, padding: 16 },
  titleContainer: {},
  taglineView: {
    color: COLORS.BLACK,
    fontWeight: "bold",
    fontSize: 14,
  },
  contentContainer: {},
  mediaContainer: {},
  mediaView: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: 8,
  },
  appInfoContainer: { paddingLeft: 16 },
});
