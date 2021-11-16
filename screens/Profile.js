import * as React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { Button } from 'react-native-elements/dist/buttons/Button'

import { addUser } from '../redux/actions'
import { connect } from 'react-redux'


class Profile extends React.Component {
    render() {  
        return (
            <View style={styles.container}>
                <Icon
                    style={styles.userIcon}
                    name='user-circle'
                    type='font-awesome'
                    color='#db2745'
                    size={100}
                />
                <Text style={styles.username}>{ this.props.user['username'] }</Text>
                <View style={styles.infoContainer}>
                    <Text style={styles.info}>
                        <Text style={styles.bold}>Username: </Text>
                        <Text>{ this.props.user['username'] }</Text>
                    </Text>
                    <Text style={styles.info}>
                        <Text style={styles.bold}>E-mail: </Text>
                        <Text>{ this.props.user['email'] }</Text>
                    </Text>
                    <View style={styles.bottomContainer}>
                        <Button
                            title='Edit profile' 
                            color='#f00'
                            onPress={() => {
                                this.props.dispatch(addUser(null))
                                this.props.navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'LoginNavigator' }],
                                  });                    
                            }}
                        />
                        <Button
                            title='Sign out' 
                            color='#f00'
                            onPress={() => {
                                this.props.dispatch(addUser(null))
                                this.props.navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'LoginNavigator' }],
                                  });                    
                            }}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user
})

export default connect(mapStateToProps)(Profile)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    userIcon: {
        marginTop: 20
    },
    username: {
        fontSize: 26,
        color: '#db2745',
        marginBottom: 20
    },
    infoContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: '#db2745',
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        padding: 15
    },
    info: {
        fontSize: 22,
        color: 'white',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'white'
    },
    bold: {
        fontWeight: 'bold'
    },
    bottomContainer: {
        flex: 1,
        justifyContent: 'flex-end'
    }
})