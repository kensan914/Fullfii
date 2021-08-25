import React, { useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import NativeAdView, {
  MediaView,
  NativeAd,
  CallToActionView,
  IconView,
  HeadlineView,
  TaglineView,
  AdvertiserView,
  AdBadge,
  StoreView,
  StarRatingView
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
            <Block style={styles.adBadge}>
              <AdBadge />
            </Block>
            <Block row style={styles.topContainer}>
              <Block>
                <IconView
                style={styles.IconView}
              />
              </Block>
              <Block row style={styles.storeInfoContainer}>
                <StoreView/>
                <StarRatingView/>
              </Block>

              <Block style={styles.HeadlineView}>
                <HeadlineView
                  style={{
                    fontWeight: "bold",
                    fontSize: 14,
                  }}
                />
              </Block>
            </Block>
            <Block  center style={styles.mediaContainer}>
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative"
  },
  contents: {

  },
  adBadge: {
    backgroundColor: COLORS.GREEN,
    marginBottom: 16
  },
  topContainer: {
    marginBottom: 8
  },
  IconView: {
    height: 60,
    width: 60,
    borderRadius: 8
  },
  HeadlineView: {
    marginLeft: 8,
    marginBottom: 16
  },
  titleContainer: {},
  taglineView: {
    color: COLORS.BLACK,
    fontWeight: "bold",
    fontSize: 16,
  },
  storeInfoContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  contentContainer: {},
  mediaContainer: {

  },
  mediaView: {
    width: 300,
    height: 140,
    overflow: "hidden",
    borderRadius: 8,
  },
  appInfoContainer: {  },
});
