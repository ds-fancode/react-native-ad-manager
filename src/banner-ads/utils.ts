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

  const transformStyle = [{ scale: scaleFactor }];

  return {
    transform: transformStyle,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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

export type AD_UNIT_LIST = Array<{ id: string; size: string }>;

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
    { currentMin: 1000, index: 0 },
  );
}

export const getAdSize = (width: number | null = 300, aspectRatio: string | null = "30:25") => {
  if (!width || !aspectRatio) {
    return '1x1'
  }
  const [num, den] = aspectRatio.split(':').map(n => parseInt(n, 10))
  return `${width}x${(width * den) / num}`
}