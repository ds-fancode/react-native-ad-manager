export function getTransformationStyle(
    containerWidth: number,
    containerHeight: number,
    adWidth: number,
    adHeight: number,
  ) {
    const adRatio = adWidth / adHeight;
    const containerRatio = containerWidth / containerHeight;
  
    const fitByWidth = containerRatio < adRatio ? true : false;
  
    const AD_WIDTH = adWidth;
    const AD_HEIGHT = adHeight;
  
    const placeHolderWidth = containerWidth;
    const placeHolderHeight = containerHeight;
  
    const scaleFactor = fitByWidth
      ? placeHolderWidth / AD_WIDTH
      : placeHolderHeight / AD_HEIGHT;
  
    const transformStyle = [{scale: scaleFactor}];
  
    return {
      transform: transformStyle,
      width: adWidth,
      height: adHeight,
    };
  }
  
  export function getWidthHeight(size: string) {
    return size ? size.split('x').map(i => parseInt(i, 10)) : [0, 0];
  }
  
  export function getAspectRatio(size: string) {
    const [width, height] = getWidthHeight(size);
    return width / height;
  }
  
  /*
      AD_UNIT_LIST provides list of ad unit ids
      e.g: [
          {id: '/22693816480/nativebanner', size: '300x250'},
          {id: '/22693816480/nativebanner', size: '1200x600'},
          {id: '/22693816480/banner//video', size: '320x50'},
      ]
  */
  
  export type AD_UNIT_LIST = Array<{id: string; size: string}>;
  
  export function getAdUnitID(
    AD_UNITS: AD_UNIT_LIST,
    containerWidth: number,
    containerHeight: number,
  ) {
    const containerRatio = containerWidth / containerHeight;
    return AD_UNITS.reduce(
      (acc, cur, index) => {
        if (
          Math.abs(getAspectRatio(cur.size) - containerRatio) < acc.currentMin
        ) {
          return {
            currentMin: Math.abs(getAspectRatio(cur.size) - containerRatio),
            index,
          };
        }
        return acc;
      },
      {currentMin: 1000, index: 0},
    );
  }

export const getAdSize = (width: number = 300, aspectRatio: string = "30:25") => {
    const [num, den] = aspectRatio.split(':').map(n => parseInt(n, 10))
    return `${width}x${(width*den) / num}`
}