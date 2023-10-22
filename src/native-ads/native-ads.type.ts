export interface INativeAd {
  headline?: string;
  body?: string;
  call_to_action?: string;
  advertiser?: string;
  image?: IImage;
  secondary_image?: IImage;
  tracking_urls_and_actions?: ITrackingUrlsAndActions;
  type?: string;
  template_id?: string;
  is_first_party_ad?: boolean;
  uuid?: string;
  is_privileged_process?: boolean;
  unify_response?: boolean;
  enable_omid?: boolean;
  omid_settings?: IOmidSettings;
}

interface IImage {
  url?: string;
}

interface ITrackingUrlsAndActions {
  click_actions?: IClickAction[];
  impression_tracking_urls?: string[];
  google_click_tracking_url?: string;
  gws_query_id?: string;
  use_custom_tabs?: boolean;
  signal_configuration?: ISignalConfiguration;
}

interface IClickAction {
  type?: number;
  url?: string;
}

interface ISignalConfiguration {
  impression_ping?: number;
  click_ping?: number;
}

interface IOmidSettings {
  omid_html?: string;
}
