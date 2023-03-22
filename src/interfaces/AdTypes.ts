interface SelectionOnArtwork {
  src: string;
}

export interface SelectionOnEdges {
  id: string;
  title: string;
  isAd: boolean;
  navigationLink: string;
  artwork: SelectionOnArtwork;
  isExternal: boolean;
  bannerStartDate: string | null;
  bannerEndDate: string | null;
  impressionLink: string | null;
}

enum SegmentContentType {
  DEFAULT = 'DEFAULT',
  PERSONALISED = 'PERSONALISED',
  DOMESTIC = 'DOMESTIC',
  INTERNATIONAL = 'INTERNATIONAL'
}

enum ContentDataType {
  DEFAULT = 'DEFAULT',
  FANTASY = 'FANTASY',
  RTH = 'RTH'
}

export enum GamType {
  BANNER = 'BANNER',
  NATIVE = 'NATIVE'
}

export interface INudge {
  collectionId?: number | null;
  matchId?: number | null;
  playerId?: number | null;
  tourId?: number | null;
  teamId?: number | null;
  segmentId?: number | null;
  segmentContentType?: SegmentContentType | null;
  contentDataType?: ContentDataType | null;
  tag?: string | null;
  placement?: string | null;
  medium?: string | null;
  isTvHomePage?: boolean | null;
  slug?: string | null;
  adIdentity: string;
}

export interface INudgeResponse {
  data: INudgeSegmentResponse
}

export interface SelectionOnEdges {
  id: string;
  title: string;
  isAd: boolean;
  navigationLink: string;
  artwork: SelectionOnArtwork;
  isExternal: boolean;
  bannerStartDate: string | null;
  shouldApplyAdvertiserId: boolean | null;
  bannerEndDate: string | null;
  impressionLink: string | null;
  adunitID: string | null
  adWidth: number | null
  aspectRatio: string | null
  gamType: any;
  nativeAdUnitID: string | null;
  type: any;
  animationLinkDark: string | null;
  animationLinkLight: string | null;
}

export enum BannerType {
  DEFAULT = 'DEFAULT',
  GAM = 'GAM',
  ANIMATED = 'ANIMATED',
}

export interface SelectionOnNudgeSegment {
  edges: Array<SelectionOnEdges>;
}

export interface INudgeSegmentResponse {
  nudgeSegment: SelectionOnNudgeSegment;
}

export type IBannerProperties = SelectionOnEdges

export interface IGamProperties {
  adProperties: INudge
  nudgeIndex: number
  adUnitId: string
  bannerSize: string
  type: string
  adType: string
  errormessage?: string
  bannerProperties?: IBannerProperties
}