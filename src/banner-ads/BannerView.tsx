import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Banner } from '../CTKAdManagerBanner';
import Interstitial from '../CTKAdManagerInterstitial'
import type { INudge, INudgeResponse } from '../interfaces/AdTypes';
import { fetchQuery } from '../networkmanager/network';
import {
  AD_UNIT_LIST,
  getAdSize,
  getTransformationStyle,
  getWidthHeight,
} from './utils';

interface IProps {
  containerSize: string;
  adProperties: INudge
  onAdLoaded?: (e: any) => void;
  onAdFailed?: (e: any) => void;
  onAdClicked?: () => void;
  gamContainerStyle?: any;
  adunitID?: string
  adSize?: string
  adUnitList?: AD_UNIT_LIST;
}

export function GamBannerView(props: IProps) {

  const [containerWidth, containerHeight] = getWidthHeight(props.containerSize);

  const [isAdRequestMade, setIsAdRequestMade] = React.useState(false)
  const [adRequest, setAdRequest] = React.useState<{ data?: INudgeResponse, isError: boolean }>({ isError: true })

  // Below line find nearest size ad from list of adIds
  // const adIDindex = getAdUnitID(
  //   props.adUnitList,
  //   containerWidth,
  //   containerHeight,
  // );
  //   const {id: adUnitID, size: adSize} = props.adUnitList[adIDindex.index]; 

  const adUnitID = props.adunitID || adRequest.data?.data.nudgeSegment.edges[0].adunitID;
  const adSize = props.adSize || getAdSize(adRequest.data?.data.nudgeSegment.edges[0].adWidth, adRequest.data?.data.nudgeSegment.edges[0].aspectRatio)

  const [adWidth, adHeight] = getWidthHeight(adSize);
  const [isGAMError, setIsGamError] = React.useState(false)

  const onAdfailed = (e: any) => {
    // console.log('onAdfailed sdk: ', e);
    setIsGamError(true)
    props.onAdFailed && props.onAdFailed(e);
  };

  const onAdOpened = () => {
    props.onAdClicked && props.onAdClicked();
  };

  const onAdLoad = (e: any) => {
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

  React.useEffect(() => {
    if (!props.adunitID && !isAdRequestMade) {
      fetchQuery(props.adProperties)
        .then((res: INudgeResponse) => {
          setAdRequest({ data: res, isError: false })
        })
        .catch((err: any) => {
          setAdRequest({ isError: true })
          setIsGamError(true)
          // console.log('E: ', err);
        });
      // @Todo: Handle error
      setIsAdRequestMade(true)
    }
  }, [])

  return adUnitID ?
    isGAMError ? null : (
      <View
        style={[
          {
            ...props.gamContainerStyle,
            width: containerWidth,
            height: containerHeight,
          },
          styles.container,
        ]}>
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
        </View>
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
});