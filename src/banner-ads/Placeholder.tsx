import { ActivityIndicator, StyleSheet, Text, View } from "react-native"
import React from 'react'

export const PlaceHolderView = () => {
    return (
        <View style={styles.placeholderTextContainer}>
            <View>
                <ActivityIndicator
                    size={22}
                    color={'#ff5000'}
                />
            </View>
            <Text
                children="Ad is Loading..."
                style={styles.loading}
            />
        </View>

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
    loading: {
        fontFamily: 'Noto Sans Display',
        fontSize: 11,
        fontWeight: '500',
        lineHeight: 16,
        letterSpacing: 0.2,
        color: '#c8c8c8'
    }
})