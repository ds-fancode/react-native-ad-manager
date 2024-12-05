import React from 'react';
import type {IAdProps} from '../interfaces/IAdProps'
import { gamADConfiguration } from '../adConfig';

export const useAdCallbacks = (props: IAdProps) => {
  const [adLoaded, setIsAdLoaded] = React.useState(false);
  const [isGAMError, setIsGamError] = React.useState(false);
  const timeRef = React.useRef<{ value: any }>({ value: null });


  const adUnitID = props.adunitID || '';
  const adSize = props.adSize || '';

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

  const [showBanner, setShowBanner] = React.useState(true);

  React.useEffect(() => {
    timeRef.current.value = setTimeout(
      () => {
        if (!showBanner) {
          setIsGamError(false);
          setIsAdLoaded(false);
        }
        setShowBanner((_) => !showBanner);
      },
      showBanner
        ? gamADConfiguration.getRefreshInterval()
        : gamADConfiguration.getAdStaticInterval()
    );
  }, [showBanner]);

  React.useEffect(() => {
    props.onBannerAttempt && props.onBannerAttempt({ ...gamProperties });
  }, []);


  return {
    onAdLoad,
    onAdOpened,
    onAdfailed,
    onDefaultClick,
    adLoaded,
    isGAMError,
    showBanner,
    adUnitID
  }
}