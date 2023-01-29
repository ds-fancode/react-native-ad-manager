import React from 'react'
import { Linking, Image, TouchableOpacity } from 'react-native'

interface IProps {
    width: number, height: number
    link?: string
    imagesrc?: string
}


export default function DefaultBanner(props: IProps) {
    function onClick() {
        if (props.link) {
            Linking.openURL(props.link).then().catch()
        }
    }
    return (
        <TouchableOpacity onPress={onClick}>
            <Image
                source={{
                    uri: props.imagesrc
                }}
                style={{
                    width: props.width,
                    height: props.height,
                    resizeMode: 'stretch'
                }}
            ></Image></TouchableOpacity>
    )
}
