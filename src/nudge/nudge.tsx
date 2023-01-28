import React, { useEffect } from 'react'
import { ScrollView, View, ViewStyle } from 'react-native';
import { GamBannerView } from '../banner-ads/BannerView';
import type { INudge, INudgeResponse } from '../interfaces/AdTypes';
import { fetchQuery } from '../networkmanager/network';

interface IProps {
  containerSize: string;
  adProperties: INudge
  gamContainerStyle?: ViewStyle
}


export function GAMNudge(props: IProps) {

  const [isAdRequestMade, setIsAdRequestMade] = React.useState(false)
  const [adRequest, setAdRequest] = React.useState<{ data?: INudgeResponse, isError: boolean }>({ isError: true })
  const [isGAMError, setIsGamError] = React.useState(false)

  function getNetworkResponse() {
    if (!isAdRequestMade) {
      fetchQuery(props.adProperties)
        .then((res: INudgeResponse) => {
          setAdRequest({ data: res, isError: false })
        })
        .catch((err: any) => {
          setAdRequest({ isError: true })
          setIsGamError(true)
        });
      // @Todo: Handle error
      setIsAdRequestMade(true)
    }
  }

  useEffect(() => {
    getNetworkResponse()
  }, [])

  return isGAMError ? null : (
    <View>
      <ScrollView horizontal>{
        adRequest.data?.data.nudgeSegment.edges.map((nudgeEdge, idx) => {
          const { adunitID, aspectRatio } = nudgeEdge
          return <GamBannerView
            key={idx}
            adunitID={adunitID}
            adSize={aspectRatio}
            adProperties={{}}
            containerSize={props.containerSize || '320x80'}
            gamContainerStyle={props.gamContainerStyle}
          />
        })
      }</ScrollView>
    </View>
  )
}
