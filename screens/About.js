import * as React from 'react'
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'

export default class About extends React.Component {
    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image
                        source={require('../assets/company3.png')}
                        style={{width: 180, height: 180}}
                        resizeMode='cover'
                    />
                </View>
                <View style={styles.infoContainer}>

                    <View style={styles.subInfoContainer}>
                        <Text style={styles.title}>About</Text>
                        <Text style={styles.text}>
                            The Headed project is a mobile application that relies on people will of building a better
                            community with better companies and the provision of better products and services for every
                            individual. By this private initiative of creating this simple rating system where people
                            can express themselves and let everyone know the many aspects of a company, we hope we can
                            promote the free market and competition between companies all around the world,
                            being one step closer to a better world.
                        </Text>
                    </View>

                    <View style={styles.subInfoContainer}>
                        <Text style={styles.title}>Credits</Text>
                        <Text style={styles.text}>This project was presented as my final project of
                            <Text
                                style={styles.clickableText}
                                onPress={() => Linking.openURL('https://cs50.harvard.edu/mobile/2018')}
                            > CS50’s Mobile App Development with React Native </Text>
                            , and the credit and aknowledgment goes to the whole CS50 team and everyone that helped make it happen,
                            in particular to Jordan Hayashi, the course's teacher.
                        </Text>
                    </View>

                    <View style={styles.subInfoContainer}>
                        <Text style={styles.title}>Developer Contact</Text>
                        <Text style={styles.text}>The app was developed and published by Pedro Porto in 2021.</Text>
                        <View style={styles.logosContainer}>
                            <TouchableOpacity
                                onPress={() => Linking.openURL('linkedin://in/opedroporto')
                                    .catch(() => Linking.openURL('https://linkedin.com/in/opedroporto'))}
                                activeOpacity={1}
                            >
                                <Image
                                    source={require('../assets/linkedin.png')}
                                    style={styles.icon}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => Linking.openURL('instagram://user?username=pedroporto._')
                                    .catch(() => Linking.openURL('https://instagram.com/pedroporto._'))}
                                activeOpacity={1}
                            >
                                <Image
                                    source={require('../assets/instagram.png')}
                                    style={styles.icon}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={(() => Linking.openURL('https://github.com/opedroporto'))}
                                activeOpacity={1}
                            >
                                <Image
                                    source={require('../assets/github.png')}
                                    style={styles.icon}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => Linking.openURL('mailto:portopdr@gmail.com')
                                .catch(() => Linking.openURL('https://mailto:portopdr@gmail.com'))}
                                activeOpacity={1}
                            >
                                <Image
                                    source={require('../assets/email.png')}
                                    style={styles.icon}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 250,
    },
    infoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15
    },
    subInfoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 15
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 10
    },
    text: {
        fontSize: 16
    },
    clickableText: {
        color: '#666'
    },
    logosContainer: {
        flexDirection: 'row',
        padding: 20 
    },
    icon: {
        width: 50, 
        height: 50,
        margin: 5
    }
})