import * as React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Text,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { getAdSize } from '../banner-ads/utils';
import { GamBannerView } from '../banner-ads/BannerView';
import {
  IGamProperties,
  BannerType,
  INudge,
  INudgeResponse,
  GamType,
  SelectionOnEdges,
  IDefaultBannerProps,
} from '../interfaces/AdTypes';
import { fetchQuery } from '../networkmanager/network';
import { gamADConfiguration } from '../adConfig';
import { THEMES } from '../Constants';
import NativeAds from '../native-ads/native-ads';
import { NativeAdsManager } from '../native-ads/NativeAdsManager';
import Interstitial from '../CTKAdManagerInterstitial';
// const TEST_AD_TEMPLATE_ID = '10104090';

export interface IGAMNudgeProps {
  containerSize: string;
  containerWidth?: number;
  adProperties: INudge;
  gamContainerStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  adCallbacks?: {
    onLoad?: (e: IGamProperties) => void;
    onError?: (e: IGamProperties) => void;
    onClick?: (e: IGamProperties) => void;
    onBannerAttempt?: (e: IGamProperties) => void;
    onDefaultClick?: (e: { url: string }) => void;
  };
  defaultBannerView?: (props: IDefaultBannerProps) => React.ReactNode;
  isRefreshing?: boolean;
}

const NudgeItem = (props: {
  item: ListRenderItemInfo<SelectionOnEdges>;
  adProps: IProps;
}) => {
  const { adunitID, adWidth, aspectRatio, gamType } = props.item.item;

  const adsManager = React.useMemo(
    () => new NativeAdsManager(adunitID ?? '', [Interstitial.simulatorId]),
    [adunitID]
  );

  return gamType === GamType.NATIVE && adunitID ? (
    <NativeAds
      adsManager={adsManager}
      /* size={getAdSize(adWidth, aspectRatio)} */
    />
  ) : gamType === GamType.BANNER && adunitID ? (
    <GamBannerView
      adunitID={adunitID}
      adSize={getAdSize(adWidth, aspectRatio)}
      containerSize={props.adProps.containerSize || '320x80'}
      gamContainerStyle={props.adProps.gamContainerStyle}
      defaultBannerdata={{
        imagesrc: props.item.item.artwork.src,
        link: props.item.item.navigationLink,
        isExternal: props.item.item.isExternal,
      }}
      showGamBanner={props.item.item.type === BannerType.GAM}
      onAdClicked={props.adProps.adCallbacks?.onClick}
      onAdFailed={props.adProps.adCallbacks?.onError}
      onAdLoaded={props.adProps.adCallbacks?.onLoad}
      onBannerAttempt={props.adProps.adCallbacks?.onBannerAttempt}
      onDefaultClick={props.adProps.adCallbacks?.onDefaultClick}
      adProperties={props.adProps.adProperties}
      index={props.item.index}
      bannerProperties={props.item.item}
    />
  ) : null;
};

function GAMNudgeView(props: IGAMNudgeProps) {
  const [adRequest, setAdRequest] = React.useState<{
    data?: INudgeResponse;
    isError: boolean;
  }>({ isError: true });
  const [isGAMError, setIsGamError] = React.useState(false);

  console.log('..RUSHI: GamNudgeView', isGAMError);
  const [adUnitInput, setAdUnitInput] = React.useState(
    '/22693816480/nudge//native'
  );
  const [validAdSizes, setValidAdSizes] = React.useState(
    '300x250,320x100,300x50'
  );
  const [validAdTypes, setValidAdTypes] = React.useState('native,template');
  if (x) {
    console.log('..RUSHI: Test inside of condition');
    const adsManager = React.useMemo(
      () => new NativeAdsManager(adUnitInput, [Interstitial.simulatorId]),
      [adUnitInput]
    );

    // const customTemplateIds = [TEST_AD_TEMPLATE_ID];
    return (
      <>
        <Text style={{ backgroundColor: 'red' }}>
          /22693816480/nudge//native
        </Text>
        <TextInput
          onChangeText={setAdUnitInput}
          value={adUnitInput}
          style={{ color: 'red' }}
          placeholder="enter ad unit id"
        />

        <TextInput
          onChangeText={(text) => setValidAdSizes(text as any)}
          value={validAdSizes as any}
          style={{ color: 'green' }}
          placeholder="enter validAdSizes"
        />

        <TextInput
          onChangeText={(text) => setValidAdTypes(text as any)}
          value={validAdTypes as any}
          style={{ color: 'blue' }}
          placeholder="enter validAdSizes"
        />

        <View style={{ width: 300, height: 250 }}>
          <NativeAds
            adsManager={adsManager}
            key={adUnitInput}
            // correlator={correlator}
            // targeting={adTargeting}
            // style={styles.nativeAd}
            // adsManager={adsManager}
            validAdTypes={validAdTypes.split(',').map((i) => i.trim()) as any}
            // customTemplateIds={customTemplateIds}
            // onAdLoaded={this.onAdLoaded}
            // onAdFailedToLoad={(error) => {
            //   console.log(error);
            // }}
            // customClickTemplateIds={[]}
            validAdSizes={validAdSizes.split(',').map((i) => i.trim()) as any}
          />
        </View>
      </>
    );
  }

  const getNetworkResponse = React.useCallback(() => {
    if (gamADConfiguration.isGAMAdEnabled()) {
      fetchQuery(props.adProperties)
        .then((res: INudgeResponse) => {
          setAdRequest({ data: res, isError: false });
        })
        .catch(() => {
          setAdRequest({ isError: true });
          setIsGamError(true);
        });
    }
  }, []);

  React.useEffect(() => {
    if (!props.isRefreshing) {
      getNetworkResponse();
    }
  }, [props.isRefreshing]);

  const NudgeData =
    adRequest.data?.data?.nudgeSegment?.edges &&
    adRequest.data?.data?.nudgeSegment?.edges.length > 0
      ? adRequest.data?.data.nudgeSegment.edges.slice(0, 1)
      : [];

  const themeMode = gamADConfiguration.getThemeMode();

  const animationUri = React.useMemo(() => {
    if (
      !isGAMError &&
      NudgeData[0]?.type &&
      NudgeData[0]?.type === BannerType.ANIMATED
    ) {
      const { animationLinkDark, animationLinkLight } = NudgeData[0];
      if (animationLinkDark && animationLinkLight) {
        return {
          uri:
            themeMode === THEMES.DARK ? animationLinkDark : animationLinkLight,
        };
      }
    }
    return null;
  }, [isGAMError, NudgeData, themeMode]);

  if (!gamADConfiguration.isGAMAdEnabled()) {
    return null;
  }

  if (animationUri) {
    return (
      <View style={props.containerStyle}>
        <LottieView
          source={animationUri}
          style={props.gamContainerStyle}
          autoPlay={true}
          loop={false}
        />
      </View>
    );
  }

  const keyExtractor = React.useCallback((item: SelectionOnEdges) => {
    return item.id + item.adunitID;
  }, []);

  return isGAMError ? null : (
    <View>
      <FlatList
        showsHorizontalScrollIndicator={false}
        renderItem={(item) => {
          const { adWidth, aspectRatio } = item.item;
          const adunitID = '/22693816480/nativebanner'
          return (
            <GamBannerView
              adunitID={adunitID}
              adSize={getAdSize(adWidth, aspectRatio)}
              containerSize={
                props.containerSize ??
                (props.containerWidth
                  ? getAdSize(props.containerWidth, aspectRatio)
                  : '320x80')
              }
              gamContainerStyle={props.gamContainerStyle}
              defaultBannerdata={{
                index: item.index,
                imagesrc: item.item.artwork.src,
                link: item.item.navigationLink,
                isExternal: item.item.isExternal,
              }}
              defaultBannerView={props.defaultBannerView}
              showGamBanner={item.item.type === BannerType.GAM}
              onAdClicked={props.adCallbacks?.onClick}
              onAdFailed={props.adCallbacks?.onError}
              onAdLoaded={props.adCallbacks?.onLoad}
              onBannerAttempt={props.adCallbacks?.onBannerAttempt}
              onDefaultClick={props.adCallbacks?.onDefaultClick}
              adProperties={props.adProperties}
              index={item.index}
              bannerProperties={item.item}
            />
          );
        }}
        data={NudgeData}
        horizontal
        keyExtractor={keyExtractor}
      />
    </View>
  );
}

export const GAMNudge = React.memo(GAMNudgeView);
