import * as React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { Button } from 'react-native-elements/dist/buttons/Button'

import { addUser } from '../redux/actions'
import { connect } from 'react-redux'

import { fetchUserData, editProfile } from '../backendApi'
import { TextInput } from 'react-native-gesture-handler'

class Profile extends React.Component {

    state = {
        editMode: false,
        newEmail: this.props.user['email']
    }

    componentDidMount = async () => {
        try {
            let user = await fetchUserData(this.props.user.accessToken)

            // if token is still valid, keep using the same token
            if (user.username) {
                user.accessToken = this.props.user.accessToken
            }

            this.props.dispatch(addUser(user))
        } catch(err) {
            const errMessage = err.message
            this.setState({err: errMessage})
        }
    }

    _editMode () {
        this.setState({ editMode: true })
    }

    _normalMode () {
        this.setState({
            newEmail: this.props.user['email'],
            editMode: false
        })
    }

    _editProfile = async () => {
        try {
            let newData = {
                email: this.state.newEmail
            }
    
            // edit
            await editProfile(this.props.user.accessToken, newData)
    
            // reload user data
            const user = await fetchUserData(this.props.user.accessToken)
            if (user.username) {
                user.accessToken = this.props.user.accessToken
            }
            this.props.dispatch(addUser(user))
            
            // leave edit mode
            this.setState({ editMode: false })
        } catch(error){
            this.setState({errorMsg: error.message})
        }
    }

    _signout () {
        this.props.dispatch(addUser({}))
        this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'LoginNavigator' }],
            });
    }

    _handleUsernameUpdate = newUsername => {
        /^[\x00-\x7F]*$/.test(newUsername) &&
        newUsername.length <= 18 &&
        this.setState({ newUsername })
    }

    _handleEmailUpdate = newEmail => {
        newEmail.length <= 320 &&
        this.setState({ newEmail })
    }

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
                    { !this.state.editMode ? (
                        <React.Fragment>
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
                                        onPress={() => this._editMode()}
                                    />
                                    <Button
                                        title='Sign out' 
                                        color='#f00'
                                        onPress={() => this._signout() }
                                    />
                                </View>
                            </View>
                        </React.Fragment>
                ) : (
                    <React.Fragment>
                        <View style={styles.infoContainer}>
                            <Text style={styles.info}>
                                <Text style={styles.bold}>Username: </Text>
                                <Text>{ this.props.user['username'] }</Text>
                            </Text>
                            <View style={styles.editableContainer}>
                                <Text style={styles.tag}>E-mail: </Text>
                                <TextInput
                                    style={styles.inputField}
                                    value={this.state.newEmail}
                                    onChangeText={this._handleEmailUpdate}
                                    autoCapitalize='none'
                                />
                                <Icon
                                    style={styles.userIcon}
                                    name='pencil'  
                                    type='font-awesome'
                                    color='white'
                                    size={10}
                                    margin={1}
                                />
                            </View>
                            <Text style={styles.errorMsg}>{this.state.errorMsg}</Text>
                            <View style={styles.bottomContainer}>
                                <Button
                                    title='Save edits' 
                                    color='#0ff'
                                    onPress={() => this._editProfile()}
                                />
                                <Button
                                    title='Discard changes' 
                                    color='#f00'
                                    onPress={() => this._normalMode() }
                                />
                            </View>
                        </View>
                    </React.Fragment>
                )}
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
    },
    editableContainer: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'white'
    },
    tag: {
        fontWeight: 'bold',
        fontSize: 22,
        color: 'white'
    },
    inputField: {
        fontSize: 22,
        color: 'white'
    },
    errorMsg: {
        color: 'red',
        alignSelf: 'center'
    }
})