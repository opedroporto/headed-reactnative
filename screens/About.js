import * as React from 'react'
import { StyleSheet, Text , View } from 'react-native'

export default class About extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>TODO</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})