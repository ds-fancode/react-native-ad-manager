import React, { useEffect } from 'react'
import { FlatList, View, ViewStyle } from 'react-native';
import { getAdSize } from '../banner-ads/utils';
import { GamBannerView } from '../banner-ads/BannerView';
import { IGamProperties, BannerType, INudge, INudgeResponse } from '../interfaces/AdTypes';
import { fetchQuery } from '../networkmanager/network';
import { gamADConfiguration } from 'react-native-ad-manager/src/adConfig';

interface IProps {
  containerSize: string;
  adProperties: INudge
  gamContainerStyle?: ViewStyle
  adCallbacks?: {
    onLoad?: (e: IGamProperties) => void
    onError?: (e: IGamProperties) => void
    onClick?: (e: IGamProperties) => void
    onBannerAttempt?: (e: IGamProperties) => void
  }
}


export function GAMNudge(props: IProps) {

  const [isAdRequestMade, setIsAdRequestMade] = React.useState(false)
  const [adRequest, setAdRequest] = React.useState<{ data?: INudgeResponse, isError: boolean }>({ isError: true })
  const [isGAMError, setIsGamError] = React.useState(false)

  console.log("GAM: adrequest: ", adRequest, gamADConfiguration.getEndpoint(), gamADConfiguration.isGAMAdEnabled())
  function getNetworkResponse() {
    if (!isAdRequestMade && gamADConfiguration.isGAMAdEnabled()) {
      fetchQuery(props.adProperties)
        .then((res: INudgeResponse) => {
          console.log("GAM: Res: ", res, props.adProperties)
          setAdRequest({ data: res, isError: false })
        })
        .catch((err: any) => {
          setAdRequest({ isError: true })
          setIsGamError(true)
          console.log('E: ', err);
        });
      // @Todo: Handle error
      setIsAdRequestMade(true)
    }
  }

  useEffect(() => {
    getNetworkResponse()
  }, [])

  if (!gamADConfiguration.isGAMAdEnabled()) {
    return null
  }

  return isGAMError ? null :
    (
      <View>
        <FlatList
          renderItem={(item) => {
            const { adunitID, adWidth, aspectRatio } = item.item
            return <GamBannerView
              key={item.index}
              adunitID={adunitID}
              adSize={getAdSize(adWidth, aspectRatio)}
              containerSize={props.containerSize || '320x80'}
              gamContainerStyle={props.gamContainerStyle}
              defaultBannerdata={{
                imagesrc: item.item.artwork.src,
                link: item.item.navigationLink
              }}
              showGamBanner={item.item.type === BannerType.GAM}
              onAdClicked={props.adCallbacks?.onClick}
              onAdFailed={props.adCallbacks?.onError}
              onAdLoaded={props.adCallbacks?.onLoad}
              onBannerAttempt={props.adCallbacks?.onBannerAttempt}
              adProperties={props.adProperties}
              index={item.index}
              bannerProperties={{
                isAd: item.item.isAd,
                title: item.item.title,
                id: item.item.id
              }}
            />
          }}
          data={adRequest.data?.data.nudgeSegment.edges}
          horizontal
        >
        </FlatList>
      </View>
    )
}
