import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import withNativeAd from './withNativeAd';
import { TriggerableView } from './TriggerableViewManager';
import { gamADConfiguration } from '../adConfig';
import type { NativeAd } from './native-ads.type';

interface IProps {
  nativeAd?: NativeAd;
  size?: string;
}

const NativeAdsView: React.FC = (props: IProps) => {
  const { nativeAd } = props;
  // if (nativeAd?.type && !['native', 'template'].includes(nativeAd?.type)) {
  //   console.log('...RUSHI: NativeAdsView returning null', nativeAd);
  //   return null;
  // }

  const themeMode = gamADConfiguration.getThemeMode();
  console.log('DEBUG: themeMode', themeMode);

  console.log('...RUSHI: NativeAds.tsx', nativeAd);

  const NativeComponent = React.useMemo(
    () => gamADConfiguration.getNativeAdComponent(props.size),
    [props.size]
  );
  console.log(
    '...RUSHI: NativeAdsView NativeComponent',
    NativeComponent,
    typeof NativeComponent
  );

  return (
    <View style={styles.container}>
      <TriggerableView style={styles.triggerableView} />
      {props.nativeAd && NativeComponent ? (
        <NativeComponent {...props.nativeAd} />
      ) : null}
      <View style={{ backgroundColor: 'yellow' }}>
        <Text>Native ad is rendered</Text>
        <Text>{props.nativeAd?.headline ?? 'No Title'}</Text>
        <Text>{props.nativeAd?.call_to_action ?? 'No cta'}</Text>
        <Text>{props.nativeAd?.secondary_image?.url ?? 'No logo'}</Text>
        <Text>{props.nativeAd?.body ?? 'No secondaryText'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  triggerableView: {
    position: 'absolute',
    zIndex: 99,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});

export default withNativeAd(NativeAdsView);
