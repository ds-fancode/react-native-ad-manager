import { View } from 'react-native'
import React from 'react'
import type { IAdProps } from '../interfaces/IAdProps'
import {useAdCallbacks} from '../hooks'
import { PlaceHolderView } from '../banner-ads/Placeholder'
import DefaultBanner from '../banner-ads/DefaultBanner'
import { NativeAdsManager } from './NativeAdsManager'
import Interstitial from '../CTKAdManagerInterstitial';
import NativeAds from './native-ads'


const NativeAdsWrapper
 = (props: IAdProps) => {
    const {
        onAdLoad,
        onAdOpened,
        onAdfailed,
        onDefaultClick,
        adLoaded,
        isGAMError,
        showBanner,
        adUnitID
      } = useAdCallbacks(props)

      const adsManager = React.useMemo(
        () => new NativeAdsManager(adUnitID ?? '', [Interstitial.simulatorId]),
        [adUnitID]
      );
      
  return (
    <View>
      {!adLoaded && props.showGamBanner ? <PlaceHolderView /> : null}

      {isGAMError || !props.showGamBanner || !adUnitID ? (
        <DefaultBanner
        //   style={transformStyle}
          {...props.defaultBannerdata}
          onClick={onDefaultClick}
          index={props.index}
        />
      ) : showBanner ? (
        <NativeAds
        adsManager={adsManager}
        onAdLoaded={onAdLoad}
        onAdOpened={onAdOpened}
        onAdFailedToLoad={onAdfailed}
        /* size={getAdSize(adWidth, aspectRatio)} */
      />
      ) : (
        <PlaceHolderView />
      )}
    </View>
  )
}

export default NativeAdsWrapper
