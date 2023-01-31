import * as React from 'react'
import { Linking, Image, TouchableOpacity } from 'react-native'

interface IProps {
    link?: string
    imagesrc?: string
    style?: any
    onClick?: () => void;
    index:  number
}


export default function DefaultBanner(props: IProps) {
    function onClick() {
        if (props.link) {
            props.onClick && props.onClick()
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
            <Image
                source={{
                    uri: props.imagesrc
                }}
                style={imageStyle}
            ></Image></TouchableOpacity>
    )
}
