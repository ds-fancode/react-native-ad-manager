import { THEMES } from './Constants';

interface IAdConfig {
  endPoint?: string;
  isGAMEnabled?: boolean;
  themeColor?: {
    loaderText?: string;
  };
  refreshInterval?: number;
  adStaticInterval?: number;
  themeMode?: string;
  isExternalRedirectionEnabled?: boolean;
  gamAdTargetingURI?: string;
  staticAdTargetting?: Record<string, any>;
}

const parseURI = (uri: string) => {
  if (uri) {
    const decodedURI = decodeURIComponent(uri);
    const valueList = decodedURI.split('&');
    return valueList.reduce<Record<string, string>>((acc, keyvalue) => {
      const keyValueMap = keyvalue.split('=');
      const [key, value] = [keyValueMap[0], keyValueMap.splice(1).join('=')];
      if (key) {
        acc[key] = value;
      }
      return acc;
    }, {});
  }
  return {};
};

// Used to add initial config for ads
class AdConfiguration {
  private endPoint: string;
  private isGAMEnabled: boolean;
  private themeColor: {
    loaderText: string;
  };
  private refreshInterval: number;
  private adStaticInterval: number;
  private themeMode: string;
  private isExternalRedirectionEnabled: boolean;
  private gamAdTargetingURI: string;
  private staticAdTargetting?: Record<string, string>;
  constructor() {
    // Default endpoint
    this.endPoint = 'https://www.fancode.com/graphql';
    this.isGAMEnabled = true;
    this.themeColor = {
      loaderText: '#c8c8c8',
    };
    this.refreshInterval = 100000;
    this.adStaticInterval = 3000;
    this.themeMode = THEMES.LIGHT;
    this.isExternalRedirectionEnabled = false;
    this.gamAdTargetingURI = '';
    this.staticAdTargetting = {};
  }
  // update the endpoint when application is launched
  updateValue(options: IAdConfig) {
    if (options.endPoint) {
      this.endPoint = options.endPoint;
    }
    if (options.isGAMEnabled !== undefined) {
      this.isGAMEnabled = options.isGAMEnabled;
    }
    if (options.themeColor) {
      Object.assign(this.themeColor, options.themeColor);
    }
    if (options.refreshInterval) {
      this.refreshInterval = options.refreshInterval;
    }
    if (options.adStaticInterval) {
      this.adStaticInterval = options.adStaticInterval;
    }
    if (options.themeMode) {
      this.themeMode = options.themeMode;
    }
    if (options.isExternalRedirectionEnabled) {
      this.isExternalRedirectionEnabled = options.isExternalRedirectionEnabled;
    }
    if (options.gamAdTargetingURI) {
      this.gamAdTargetingURI = options.gamAdTargetingURI;
    }
    if (options.staticAdTargetting) {
      this.staticAdTargetting = {
        ...this.staticAdTargetting,
        ...options.staticAdTargetting,
      };
    }
  }
  setEndpoint(endpoint: string) {
    this.endPoint = endpoint;
  }
  getEndpoint() {
    return this.endPoint;
  }
  isGAMAdEnabled() {
    return this.isGAMEnabled;
  }
  getThemeColor() {
    return this.themeColor;
  }
  getRefreshInterval() {
    return this.refreshInterval;
  }
  getAdStaticInterval() {
    return this.adStaticInterval;
  }
  getThemeMode() {
    return this.themeMode;
  }

  getIsExternalRedirectionEnabled() {
    return this.isExternalRedirectionEnabled;
  }
  getGamAdTargeting() {
    return parseURI(this.gamAdTargetingURI);
  }
  getStaticAdTargetting() {
    return this.staticAdTargetting;
  }
  getAdTargetting() {
    return {
      ...this.getStaticAdTargetting(),
      ...this.getGamAdTargeting(),
    };
  }
}

export const gamADConfiguration = new AdConfiguration();
