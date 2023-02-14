import * as React from 'react'
import { FlatList, View, ViewStyle } from 'react-native';
import { getAdSize } from '../banner-ads/utils';
import { GamBannerView } from '../banner-ads/BannerView';
import { IGamProperties, BannerType, INudge, INudgeResponse } from '../interfaces/AdTypes';
import { fetchQuery } from '../networkmanager/network';
import { gamADConfiguration } from '../adConfig';

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
  isRefreshing?: boolean
}


export function GAMNudge(props: IProps) {
  const [adRequest, setAdRequest] = React.useState<{ data?: INudgeResponse, isError: boolean }>({ isError: true })
  const [isGAMError, setIsGamError] = React.useState(false)

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

  if (!gamADConfiguration.isGAMAdEnabled()) {
    return null
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
                link: item.item.navigationLink
              }}
              showGamBanner={item.item.type === BannerType.GAM}
              onAdClicked={props.adCallbacks?.onClick}
              onAdFailed={props.adCallbacks?.onError}
              onAdLoaded={props.adCallbacks?.onLoad}
              onBannerAttempt={props.adCallbacks?.onBannerAttempt}
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
