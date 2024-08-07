import * as React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { PlaceHolderView } from './Placeholder';
import { Banner } from '../CTKAdManagerBanner';
import Interstitial from '../CTKAdManagerInterstitial';
import { getTransformationStyle, getWidthHeight } from './utils';
import DefaultBanner from './DefaultBanner';
import type {
  IBannerProperties,
  IDefaultBannerProps,
  IGamProperties,
  INudge,
} from '../interfaces/AdTypes';
import { gamADConfiguration } from '../adConfig';

interface IProps {
  containerSize: string;
  onAdLoaded?: (e: IGamProperties) => void;
  onAdFailed?: (e: IGamProperties) => void;
  onAdClicked?: (e: IGamProperties) => void;
  onBannerAttempt?: (e: IGamProperties) => void;
  onDefaultClick?: (e: { url: string }) => void;
  gamContainerStyle?: any;
  adunitID?: string | null;
  adSize?: string;
  defaultBannerdata?: IDefaultBannerProps;
  defaultBannerView?: (props: IDefaultBannerProps) => React.ReactNode;
  showGamBanner: boolean;
  adProperties: INudge;
  index: number;
  bannerProperties: IBannerProperties;
}

export function GamBannerView(props: IProps) {
  const [containerWidth, containerHeight] = getWidthHeight(props.containerSize);
  const [adLoaded, setIsAdLoaded] = React.useState(false);

  const adUnitID = props.adunitID || '';
  const adSize = props.adSize || '';

  const [adWidth, adHeight] = getWidthHeight(adSize);
  const [isGAMError, setIsGamError] = React.useState(false);

  const gamProperties = React.useMemo(() => {
    return {
      adProperties: props.adProperties,
      nudgeIndex: props.index,
      adUnitId: adUnitID,
      bannerSize: adSize,
      type: props.showGamBanner ? 'GAM' : 'DEFAULT',
      adType: 'Banner',
      bannerProperties: props.bannerProperties,
    };
  }, [props.index, adUnitID]);

  const onAdfailed = React.useCallback((error: any) => {
    setIsGamError(true);
    setIsAdLoaded(true);
    props.onAdFailed &&
      props.onAdFailed({
        errormessage: error?.toString(),
        ...gamProperties,
      });
  }, []);

  const onAdOpened = React.useCallback(() => {
    props.onAdClicked && props.onAdClicked(gamProperties);
  }, []);

  const onAdLoad = React.useCallback(() => {
    setIsAdLoaded(true);
    props.onAdLoaded && props.onAdLoaded(gamProperties);
  }, []);

  const onDefaultClick = React.useCallback(() => {
    if (
      props.defaultBannerdata?.link &&
      (props.defaultBannerdata.isExternal ||
        gamADConfiguration.getIsExternalRedirectionEnabled())
    ) {
      Linking.openURL(props.defaultBannerdata.link).then().catch();
    }
    if (
      props.onDefaultClick &&
      props.defaultBannerdata?.link &&
      !props.defaultBannerdata.isExternal
    ) {
      props.onDefaultClick({ url: props.defaultBannerdata?.link });
      props.onAdClicked &&
        props.onAdClicked({
          ...gamProperties,
          type: 'DEFAULT',
        });
    } else {
      props.onAdClicked &&
        props.onAdClicked({
          ...gamProperties,
          type: 'DEFAULT',
        });
    }
  }, []);

  const transformStyle = React.useMemo(
    () =>
      getTransformationStyle(
        containerWidth,
        containerHeight,
        adWidth,
        adHeight
      ),
    [containerWidth, containerHeight]
  );

  React.useEffect(() => {
    props.onBannerAttempt && props.onBannerAttempt({ ...gamProperties });
  }, []);

  const containerStyles = React.useMemo(() => {
    return [
      props.gamContainerStyle,
      {
        width: containerWidth,
        height: containerHeight,
      },
      styles.container,
    ];
  }, []);

  const BannerComponent = React.useMemo(
    () => (
      <View style={transformStyle as any}>
        <Banner
          style={styles.bannerContainer}
          onAdFailedToLoad={onAdfailed}
          onAdOpened={onAdOpened}
          adSize={`${adWidth}x${adHeight}` as any}
          onAdLoaded={onAdLoad}
          validAdSizes={['fluid', `${adWidth}x${adHeight}`]}
          adUnitID={adUnitID}
          testDevices={[Interstitial.simulatorId]}
          targeting={{
            customTargeting: gamADConfiguration.getAdTargetting(),
          }}
        />
      </View>
    ),
    [
      gamADConfiguration.getStaticAdTargetting(),
      gamADConfiguration.getGamAdTargeting(),
    ]
  );

  return (
    <View style={containerStyles}>
      {!adLoaded && props.showGamBanner ? <PlaceHolderView /> : null}
      {isGAMError || !props.showGamBanner || !adUnitID ? (
        props.defaultBannerView && props.defaultBannerdata ? (
          props.defaultBannerView({
            ...props.defaultBannerdata,
            style: transformStyle,
          })
        ) : (
          <DefaultBanner
            style={transformStyle}
            {...props.defaultBannerdata}
            onClick={onDefaultClick}
            index={props.index}
          />
        )
      ) : (
        BannerComponent
      )}
    </View>
  );
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
    fontFamily: 'Roboto',
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.2,
  },
});
