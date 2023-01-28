import { AdNudgeResponse } from "src/__tests__/mocks";
import type { INudge } from "../interfaces/AdTypes";


export const fetchQuery = (nudgeVariables: INudge) => {
  return fetch('https://eng-01.fancodedev.com/graphql', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      "variables": {
        "input": nudgeVariables
      },
      "query":
        `query NudgeSegment($input: SegmentFilter!) {
            nudgeSegment(input: $input) {
              edges {
                id
                title
                isAd
                navigationLink
                artwork {
                  src
                }
                isExternal
                bannerStartDate
                bannerEndDate
                impressionLink
                type
                adunitID
                adWidth
                aspectRatio
                type
              }
            }
          }`,
    }),
  })
    // .then(res => res.json())
    .then(_ => {
      return AdNudgeResponse
    })
};
