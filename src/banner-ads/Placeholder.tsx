import { ActivityIndicator, StyleSheet, Text, View } from "react-native"
import React from 'react'

export const PlaceHolderView = () => {
    return (
        <>
            <View style={styles.placeholderTextContainer}>

                <View style={{}}>
                    <ActivityIndicator
                        size={22}
                        color={'#ff5000'}
                    />
                </View>
                <Text
                    children="Ad is Loading..."
                    style={{
                        fontFamily: 'Noto Sans Display',
                        fontSize: 11,
                        fontWeight: '500',
                        lineHeight: 16,
                        letterSpacing: 0.2,
                        color: '#c8c8c8'
                    }}
                />
            </View>
            <Text
                style={styles.placeholderAd}
                children="Ad"
            />
        </>
    )
}

const styles = StyleSheet.create({
    placeholderTextContainer: {
        position: 'absolute',
        zIndex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12
    },
    placeholderAd: {
        backgroundColor: '#FBAB33',
        position: 'absolute',
        top: 0,
        right: 0,
        margin: 12,
        paddingHorizontal: 4,
        borderRadius: 2,
        zIndex: 10,
        color: '#121212',
        fontFamily: 'Noto Sans Display',
        fontSize: 11,
        fontWeight: '500',
        lineHeight: 16,
        letterSpacing: 0.2
    },
})