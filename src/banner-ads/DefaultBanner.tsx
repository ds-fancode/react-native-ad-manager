import * as React from 'react'
import { Linking, TouchableOpacity } from 'react-native'
import { gamADConfiguration } from '../adConfig'
import * as FastImage from 'react-native-fast-image'

interface IProps {
    link?: string
    imagesrc?: string
    style?: any
    onClick?: () => void;
    index:  number
    isExternal?: boolean
}


export default function DefaultBanner(props: IProps) {
    function onClick() {
        props.onClick && props.onClick()
        if (props.link && (props.isExternal || gamADConfiguration.getIsExternalRedirectionEnabled())) {
            Linking.openURL(props.link).then().catch()
        }
    }
    const imageStyle = React.useMemo(() => ([{
        resizeMode: 'stretch'
    }, props.style]), [props.style])

    return (
        <TouchableOpacity 
        onPress={onClick} 
        testID={'nudges_container' + props.index}
        accessibilityLabel={'nudges_container' + props.index}>
            {/* @ts-ignore */}
            <FastImage
                source={{
                    uri: props.imagesrc
                }}
                style={imageStyle}
            />
            </TouchableOpacity>
    )
}
