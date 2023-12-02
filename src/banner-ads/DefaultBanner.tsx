import * as React from 'react';
import { TouchableOpacity, Image as RNImage } from 'react-native';

interface IProps {
  link?: string;
  imagesrc?: string;
  style?: any;
  onClick?: () => void;
  index: number;
  isExternal?: boolean;
}

export default function DefaultBanner(props: IProps) {
  const imageStyle = React.useMemo(
    () => [
      {
        resizeMode: 'stretch',
      },
      props.style,
    ],
    [props.style]
  );

  return (
    <TouchableOpacity
      onPress={props.onClick}
      testID={'nudges_container' + props.index}
      accessibilityLabel={'nudges_container' + props.index}
    >
      {/* @ts-ignore */}
      <RNImage
        source={{
          uri: props.imagesrc,
        }}
        style={imageStyle}
      />
    </TouchableOpacity>
  );
}
