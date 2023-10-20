export interface NativeAd {
  headline?: string;
  body?: string;
  call_to_action?: string;
  advertiser?: string;
  image?: Image;
  secondary_image?: Image;
  tracking_urls_and_actions?: TrackingUrlsAndActions;
  type?: string;
  template_id?: string;
  is_first_party_ad?: boolean;
  uuid?: string;
  is_privileged_process?: boolean;
  unify_response?: boolean;
  enable_omid?: boolean;
  omid_settings?: OmidSettings;
}

interface Image {
  url?: string;
}

interface TrackingUrlsAndActions {
  click_actions?: ClickAction[];
  impression_tracking_urls?: string[];
  google_click_tracking_url?: string;
  gws_query_id?: string;
  use_custom_tabs?: boolean;
  signal_configuration?: SignalConfiguration;
}

interface ClickAction {
  type?: number;
  url?: string;
}

interface SignalConfiguration {
  impression_ping?: number;
  click_ping?: number;
}

interface OmidSettings {
  omid_html?: string;
}
