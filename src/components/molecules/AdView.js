import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Dimensions,
  ActivityIndicator,
  DeviceEventEmitter,
  Text,
} from "react-native";
import NativeAdView, {
  CallToActionView,
  IconView,
  StarRatingView,
  MediaView,
  StoreView,
  TaglineView,
} from "react-native-admob-native-ads";
import { Block } from "galio-framework";

import { Events, Logger } from "src/constants";
import { COLORS } from "src/constants/theme";

const { width } = Dimensions.get("screen");

export const AdView = (props) => {
  const { index, media, type, adUnitId } = props;
  let loadOnMount = true;
  const [aspectRatio, setAspectRatio] = useState(1);
  const [adLoaded, setAdLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const nativeAdRef = useRef();

  const _onAdFailedToLoad = (event) => {
    setError(true);
    setLoading(false);
    Logger("AD", "FAILED", event?.error?.message);
  };

  const _onAdLoaded = () => {
    Logger("AD", "LOADED", "Ad has loaded successfully");
  };

  const _onAdClicked = () => {
    Logger("AD", "CLICK", "User has clicked the Ad");
  };

  const _onAdImpression = () => {
    Logger("AD", "IMPRESSION", "Ad impression recorded");
  };

  const _onUnifiedNativeAdLoaded = (event) => {
    Logger("AD", "RECIEVED", "Unified ad  Recieved", event);
    setLoading(false);
    setAdLoaded(true);
    setError(false);
    setAspectRatio(event.aspectRatio);
  };

  const onViewableItemsChanged = (event) => {
    /**
     * [STEP IV] We check if any AdViews are currently viewable.
     */
    let viewableAds = event.viewableItems.filter(
      (i) => i.key.indexOf("ad") !== -1
    );

    viewableAds.forEach((adView) => {
      if (adView.index === index && !adLoaded) {
        /**
         * [STEP V] If the ad is viewable and not loaded
         * already, we will load the ad.
         */
        setLoading(true);
        setAdLoaded(false);
        setError(false);
        Logger("AD", "IN VIEW", "Loading " + index);
        nativeAdRef.current?.loadAd();
      } else {
        /**
         * We will not reload ads or load
         * ads that are not viewable currently
         * to save bandwidth and requests sent
         * to server.
         */
        if (adLoaded) {
          Logger("AD", "IN VIEW", "Loaded " + index);
        } else {
          Logger("AD", "NOT IN VIEW", index);
        }
      }
    });
  };

  useEffect(() => {
    /**
     * for previous steps go to List.js file.
     *
     * [STEP III] We will subscribe to onViewableItemsChanged event in all AdViews in the List.
     */
    if (!loadOnMount) {
      DeviceEventEmitter.addListener(
        Events.onViewableItemsChanged,
        onViewableItemsChanged
      );
    }

    return () => {
      if (!loadOnMount) {
        DeviceEventEmitter.removeListener(
          Events.onViewableItemsChanged,
          onViewableItemsChanged
        );
      }
    };
  }, [adLoaded]);

  useEffect(() => {
    if (loadOnMount) {
      setLoading(true);
      setAdLoaded(false);
      setError(false);
      nativeAdRef.current?.loadAd();
    }
    return () => {
      setAdLoaded(false);
    };
  }, [type]);

  return (
    <NativeAdView
      onAdLoaded={_onAdLoaded}
      onAdFailedToLoad={_onAdFailedToLoad}
      onAdLeftApplication={() => {
        console.log("ad has left the application");
      }}
      onAdClicked={_onAdClicked}
      onAdImpression={_onAdImpression}
      onUnifiedNativeAdLoaded={_onUnifiedNativeAdLoaded}
      refreshInterval={60000 * 2}
      style={{
        marginRight: 20,
        marginLeft: 20,
        marginTop: 10,
        height: "auto",
      }}
      adUnitID={adUnitId} // REPLACE WITH NATIVE_AD_VIDEO_ID for video ads.
    >
      <Block
        style={{
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
        }}
      >
        <Block
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: "auto",
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {loading && <ActivityIndicator size={28} color="#a9a9a9" />}
          {error && <Text style={{ color: "#a9a9a9" }}>:-(</Text>}
        </Block>

        <Block
          flex
          space="between"
          row
          style={{
            paddingVertical: 16,
            paddingHorizontal: 16,
            borderRadius: 20,
            backgroundColor: COLORS.WHITE,
            opacity: loading || error || !adLoaded ? 0 : 1,
          }}
        >
          <View flex={0.65} style={{}}>
            {/* <HeadlineView
              hello="abc"
              style={{
                fontWeight: "bold",
                fontSize: 16,
                marginRight: "auto",
              }}
            /> */}
            <TaglineView
              numberOfLines={5}
              style={{
                color: COLORS.BLACK,
                fontWeight: "bold",
                fontSize: 14,
                marginRight: "auto",
              }}
            />
            {/* <AdvertiserView
              style={{
                fontSize: 16,
                color: "gray",
              }}
            /> */}

            <Block
              row
              style={{
                paddingTop: 4,
                paddingBottom: 8,
              }}
            >
              <StoreView
                style={{
                  fontSize: 12,
                }}
              />
              <StarRatingView
                starSize={12}
                fullStarColor="orange"
                emptyStarColor="gray"
                containerStyle={{
                  width: 65,
                  marginLeft: 10,
                }}
              />
            </Block>
            <CallToActionView
              starSize={12}
              style={{ marginRight: "auto" }}
              buttonAndroidStyle={{
                backgroundColor: "#00ff00",
                borderRadius: 5,
              }}
              allCaps
              textStyle={{
                fontSize: 12,
                flexWrap: "wrap",
                color: "#0058B3",
              }}
            />
          </View>
          <Block flex={0.35} center style={{ marginLeft: 8 }}>
            {media ? (
              <IconView
                style={{
                  width: 100,
                  height: 70,
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              />
            ) : (
              <MediaView
                style={{
                  width: "100%",
                  height: 70,
                  overflow: "hidden",
                  borderRadius: 8,
                }}
              />
            )}
          </Block>
        </Block>

        {media ? (
          <MediaView
            style={{
              width: "100%",
              height: Dimensions.get("window").width / 1.5,
              backgroundColor: "white",
              // shadowColor: "#000",
              // shadowOffset: {
              //   width: 0,
              //   height: 6,
              // },
              // shadowOpacity: 0.25,
              // shadowRadius: 3.84,

              // elevation: 5,
            }}
          />
        ) : null}
      </Block>
    </NativeAdView>
  );
};
