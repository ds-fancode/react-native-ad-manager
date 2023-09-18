import * as React from 'react'
import { FlatList, View, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';
import { getAdSize } from '../banner-ads/utils';
import { GamBannerView } from '../banner-ads/BannerView';
import { IGamProperties, BannerType, INudge, INudgeResponse } from '../interfaces/AdTypes';
import { fetchQuery } from '../networkmanager/network';
import { gamADConfiguration } from '../adConfig';
import { THEMES } from '../Constants';
import NativeAds from '../native-ads/NativeAds'
import {NativeAdsManager} from '../native-ads/NativeAdsManager'
import Interstitial from '../CTKAdManagerInterstitial';


let x =  true

interface IProps {
  containerSize: string;
  adProperties: INudge
  gamContainerStyle?: ViewStyle
  containerStyle?: ViewStyle
  adCallbacks?: {
    onLoad?: (e: IGamProperties) => void
    onError?: (e: IGamProperties) => void
    onClick?: (e: IGamProperties) => void
    onBannerAttempt?: (e: IGamProperties) => void
    onDefaultClick?: (e: {url: string}) => void
  }
  isRefreshing?: boolean
}

function GAMNudgeView(props: IProps) {
  const [adRequest, setAdRequest] = React.useState<{ data?: INudgeResponse, isError: boolean }>({ isError: true })
  const [isGAMError, setIsGamError] = React.useState(false)

  console.log("..RUSHI: GamNudgeView", isGAMError)

  if (x) {
    console.log("..RUSHI: Test inside of condition")
    const adsManager = new NativeAdsManager( '/22693816480/nativebanner', [
      Interstitial.simulatorId
    ])
    return <NativeAds adsManager={adsManager} 
    validAdTypes={['native']}/>
  }

  const getNetworkResponse = React.useCallback(() => {
    if (gamADConfiguration.isGAMAdEnabled()) {
      fetchQuery(props.adProperties)
        .then((res: INudgeResponse) => {
          setAdRequest({ data: res, isError: false })
        })
        .catch(() => {
          setAdRequest({ isError: true })
          setIsGamError(true)
        })
    }
  }, [])

  React.useEffect(() => {
    if (!props.isRefreshing) {
      getNetworkResponse()
    }
  }, [props.isRefreshing])
  
  const NudgeData = adRequest.data?.data?.nudgeSegment?.edges && 
      adRequest.data?.data?.nudgeSegment?.edges.length > 0 ? adRequest.data?.data.nudgeSegment.edges.slice(0, 1) : []

  const themeMode = gamADConfiguration.getThemeMode()

  const animationUri = React.useMemo(() => {
    if (!isGAMError && NudgeData[0]?.type && NudgeData[0]?.type === BannerType.ANIMATED) {
      const {animationLinkDark, animationLinkLight} = NudgeData[0]
      if (animationLinkDark && animationLinkLight) {
        return {uri: themeMode === THEMES.DARK ? animationLinkDark : animationLinkLight}
      }
    }
    return null;
  }, [isGAMError, NudgeData, themeMode])

  if (!gamADConfiguration.isGAMAdEnabled()) {
    return null
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
    )
  }

  return isGAMError ? null :
    (
      <View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          renderItem={(item) => {
            const { adunitID, adWidth, aspectRatio } = item.item
            return <GamBannerView
              adunitID={adunitID}
              adSize={getAdSize(adWidth, aspectRatio)}
              containerSize={props.containerSize || '320x80'}
              gamContainerStyle={props.gamContainerStyle}
              defaultBannerdata={{
                imagesrc: item.item.artwork.src,
                link: item.item.navigationLink,
                isExternal: item.item.isExternal
              }}
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
          }}
          data={NudgeData}
          horizontal
          keyExtractor={(item) => {
            return item.id + item.adunitID
          }}
        >
        </FlatList>
      </View>
    )
}

export const GAMNudge = React.memo(GAMNudgeView)
