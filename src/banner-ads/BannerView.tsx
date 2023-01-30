import * as React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { PlaceHolderView } from './Placeholder';
import { Banner } from '../CTKAdManagerBanner';
import Interstitial from '../CTKAdManagerInterstitial'
import {
  AD_UNIT_LIST,
  getTransformationStyle,
  getWidthHeight,
} from './utils';
import DefaultBanner from './DefaultBanner'

interface IProps {
  containerSize: string;
  onAdLoaded?: (e: any) => void;
  onAdFailed?: (e: any) => void;
  onAdClicked?: () => void;
  gamContainerStyle?: any;
  adunitID?: string
  adSize?: string
  adUnitList?: AD_UNIT_LIST;
  defaultBannerdata?: {
    imagesrc?: string
    link?: string
  }
  showGamBanner: boolean
}

export function GamBannerView(props: IProps) {

  const [containerWidth, containerHeight] = getWidthHeight(props.containerSize);
  const [adLoaded, setIsAdLoaded] = React.useState(false)
  // Below line find nearest size ad from list of adIds
  // const adIDindex = getAdUnitID(
  //   props.adUnitList,
  //   containerWidth,
  //   containerHeight,
  // );
  //   const {id: adUnitID, size: adSize} = props.adUnitList[adIDindex.index]; 

  const adUnitID = props.adunitID || '';
  const adSize = props.adSize || ''

  const [adWidth, adHeight] = getWidthHeight(adSize);
  const [isGAMError, setIsGamError] = React.useState(false)

  const onAdfailed = (e: any) => {
    console.log('GAM: onAdfailed sdk: ', e, adUnitID);
    setIsGamError(true)
    setIsAdLoaded(true)
    props.onAdFailed && props.onAdFailed(e);
  };

  const onAdOpened = () => {
    console.log('GAM: onAdOpened sdk: ', adUnitID);
    props.onAdClicked && props.onAdClicked();
  };

  const onAdLoad = (e: any) => {
    console.log('GAM: onAdLoad sdk: ', e, adUnitID);
    setIsAdLoaded(true)
    props.onAdLoaded && props.onAdLoaded(e);
  };

  const transformStyle = React.useMemo(
    () =>
      getTransformationStyle(
        containerWidth,
        containerHeight,
        adWidth,
        adHeight,
      ),
    [containerWidth, containerHeight],
  );

  console.log("GAM: Ad: ", adUnitID, isGAMError, adSize, adWidth, adHeight)

  return adUnitID ?
    (
      <View
        style={[
          {
            ...props.gamContainerStyle,
            width: containerWidth,
            height: containerHeight
          },
          styles.container,
        ]}>

        {!adLoaded && props.showGamBanner ? <PlaceHolderView /> : null}
        <Text
          style={styles.placeholderAd}
          children="Ad"
        />
        {isGAMError || !props.showGamBanner ?
          <DefaultBanner style={transformStyle} {...props.defaultBannerdata} /> :
          <View style={transformStyle}>
            <Banner
              style={styles.bannerContainer}
              onAdFailedToLoad={onAdfailed}
              onAdOpened={onAdOpened}
              adSize={`${adWidth}x${adHeight}` as any}
              onAdLoaded={onAdLoad}
              validAdSizes={['fluid', `${adWidth}x${adHeight}`]}
              adUnitID={adUnitID}
              testDevices={[Interstitial.simulatorId]}
            />
          </View>}
      </View>
    ) : null;
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  bannerContainer: {
    resizeMode: 'cover',
    overflow: 'hidden',
    zIndex: 5,
    top: 0,
    left: 0,
    width: 200,
    height: 100,
  },
  placeholderAd: {
    backgroundColor: '#FBAB33',
    position: 'absolute',
    top: 0,
    right: 0,
    margin: 12,
    paddingHorizontal: 4,
    borderRadius: 2,
    zIndex: 10,
    color: '#121212',
    fontFamily: 'Noto Sans Display',
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.2
  },
});