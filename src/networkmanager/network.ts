import { Platform } from "react-native";
import { gamADConfiguration } from "../adConfig";
import type { INudge } from "../interfaces/AdTypes";

export const fetchQuery = (nudgeVariables: INudge) => {
  return fetch(gamADConfiguration.getEndpoint(), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      source: Platform.OS === 'ios' ? 'sportsguruios' : 'sportsguruand'
    },
    body: JSON.stringify({
      "variables": {
        "input": nudgeVariables
      },
      "query":
        `query NudgeSegment($input: SegmentFilter!) { nudgeSegment(input: $input) { edges { id title isAd navigationLink artwork { src } isExternal bannerStartDate bannerEndDate impressionLink type adunitID adWidth aspectRatio type } }}`,
    }),
  })
    .then(res => res.json())
};

// Needed for testing
// Can be ignored
export const AdNudgeResponseMocks = () => ({
  data: {
    nudgeSegment: {
      edges: [
        {
          id: 123,
          title: '123',
          isAd: true,
          navigationLink: 'https://www.fancode.com/match/25027',
          artwork: {src: 'https://fancode.com/skillup-uploads/prod-images/2022/11/fancodefinalbanner.jpeg'},
          isExternal: 'boolean',
          bannerStartDate: '',
          bannerEndDate: '',
          impressionLink: '/6499/example/banner',
          adunitID: '/22693816480/nativebanner',
          adWidth: 300,
          aspectRatio: '300:250', // change x into :
          gamType: "DEFAULT",
          nativeAdUnitID: "",
          type: 'GAM'
        },
        {
          id: 124,
          title: '123',
          isAd: true,
          navigationLink: 'https://www.fancode.com/match/25027',
          artwork: {src: 'https://fancode.com/skillup-uploads/prod-images/2022/11/fancodefinalbanner.jpeg'},
          isExternal: 'boolean',
          bannerStartDate: '',
          bannerEndDate: '',
          impressionLink: '',
          adunitID: '/22693816480/dream11-zomato',
          adWidth: 320,
          aspectRatio: '320:50',
          gamType: "DEFAULT",
          nativeAdUnitID: "",
          type: 'GAM'
        },
        {
          id: 125,
          title: '123',
          isAd: true,
          navigationLink: 'https://www.fancode.com/match/25027',
          artwork: {src: 'https://fancode.com/skillup-uploads/prod-images/2022/11/fancodefinalbanner.jpeg'},
          isExternal: 'boolean',
          bannerStartDate: '',
          bannerEndDate: '',
          impressionLink: '/6499/example/banner',
          adunitID: '/22693816480/dream11-winner',
          adWidth: 320,
          aspectRatio: '320:50', // change x into :
          gamType: "DEFAULT",
          nativeAdUnitID: "",
          type: 'GAM'
        },
      ]
    }
  }
})