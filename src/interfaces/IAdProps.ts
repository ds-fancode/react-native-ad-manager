import type { IGamProperties, SelectionOnEdges, INudge, IBannerProperties } from './AdTypes';
export interface IAdProps {
    containerSize: string;
    onAdLoaded?: (e: IGamProperties) => void;
    onAdFailed?: (e: IGamProperties) => void;
    onAdClicked?: (e: IGamProperties) => void;
    onBannerAttempt?: (e: IGamProperties) => void;
    onDefaultClick?: (e: { url: string }) => void;
    gamContainerStyle?: any;
    adunitID?: string | null;
    adSize?: string;
    defaultBannerdata?: {
      imagesrc?: string;
      link?: string;
      onClickDefault?: (e: any, p: SelectionOnEdges) => void;
      isExternal?: boolean;
    };
    showGamBanner: boolean;
    adProperties: INudge;
    index: number;
    bannerProperties: IBannerProperties;
}