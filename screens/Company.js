import * as React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default class Company extends React.Component {
    state = {
        company: this.props.route.params.company
    }

    render() {  
        return (
            <View style={styles.container}>
                <Image style={styles.image} source={{'uri': this.state.company.image}} />
                <Text style={styles.name}><Text style={styles.rating}>{ this.state.company.rating } ✦  </Text>{ this.state.company.name }</Text>
                <View style={styles.info}>
                    <Text style={styles.descriptionTitle}>Description</Text>
                    <Text style={styles.description}>{ this.state.company.description }</Text>
                </View>
                {/* <TouchableOpacity style={styles.commentSection}>
                    <Text style={styles.commentSectionTitle}>Comments</Text>                
                </TouchableOpacity> */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    image: {
        width: '100%',
        height: '50%',
        resizeMode: 'cover'
    },
    name: {
        padding: 6,
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: '#db2745',
        width: '100%'
    },
    rating: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffc72e'
    },
    info: {
        flex: 1,
        alignContent: 'center',
        padding: 5,
    },
    descriptionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#db2745'
    },
    description: {
        color: '#db2745',
        fontSize: 20,
        marginTop: 5
    },
    commentSection: {
        alignSelf: 'center',
        width: '100%',
        position: 'absolute',
        bottom: 0,
        padding: 10
    },
    commentSectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffc72e'
    }
})