import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { Button } from 'react-native-elements/dist/buttons/Button'
import { TextInput, KeyboardAvoidingView      } from 'react-native'

import { addUser } from '../redux/actions'
import { connect } from 'react-redux'

import { fetchUserData, editProfile } from '../backendApi'

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
        if ((this.state.newEmail) !== (this.props.user.email)) {
            // update email (with verification)
            this.props.navigation.navigate('EmailScreen', {newEmail: this.state.newEmail, profileEdit: true})
        } else {
            // leave edit mode
            this.setState({ editMode: false })
        }

        // try {
        //     let newData = {
        //         email: this.state.newEmail
        //     }
    
        //     // edit
        //     await editProfile(this.props.user.accessToken, newData)
    
        //     // reload user data
        //     const user = await fetchUserData(this.props.user.accessToken)
        //     if (user.username) {
        //         user.accessToken = this.props.user.accessToken
        //     }
        //     this.props.dispatch(addUser(user))
            
        //     // leave edit mode
        //     this.setState({ editMode: false })
        // } catch(error){
        //     this.setState({errorMsg: error.message})
        // }
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
                                    <TouchableOpacity 
                                        onPress={() => this._editMode()}
                                        style={styles.editButton}
                                    >
                                            <Text style={styles.buttonText}>Edit profile</Text>
                                    </TouchableOpacity>
                                    <Button
                                        title='Sign out' 
                                        color='#f00'
                                        onPress={() => this._signout() }
                                    />
                                </View>
                            </View>
                        </React.Fragment>
                ) : (
                    // edit profile mode
                    <React.Fragment>
                        <View style={styles.infoContainer}>
                            <Text style={styles.info}>
                                <Text style={styles.bold}>Username: </Text>
                                <Text>{ this.props.user['username'] }</Text>
                            </Text>
                            <KeyboardAvoidingView style={styles.editableContainer} behavior={'padding'}>
                                <Text style={styles.tag}>E-mail: </Text>
                                <TextInput
                                    style={styles.inputField}
                                    value={this.state.newEmail}
                                    onChangeText={this._handleEmailUpdate}
                                    autoCapitalize='none'
                                />
                                <Icon
                                    style={styles.pencilIcon}
                                    name='pencil'  
                                    type='font-awesome'
                                    color='white'
                                    size={10}
                                    margin={1}
                                />
                            </KeyboardAvoidingView>
                            <Text style={styles.errorMsg}>{this.state.errorMsg}</Text>
                            <View style={styles.bottomEditContainer}>
                                <TouchableOpacity 
                                    onPress={() => this._editProfile()}
                                    style={styles.editButton}
                                >
                                        <Text style={styles.buttonText}>Save edits</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={() => this._normalMode() }
                                    style={styles.discardButton}
                                >
                                        <Text style={styles.buttonText}>Discard changes</Text>
                                </TouchableOpacity>
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
        padding: 15,
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
    bottomEditContainer: {
        flex: 1
    },
    editableContainer: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        marginBottom: 15
    },
    tag: {
        fontWeight: 'bold',
        fontSize: 22,
        color: 'white'
    },
    inputField: {
        flex: 1,
        flexWrap: 'wrap',
        fontSize: 22,
        color: 'white',
        minWidth: '60%',
        marginBottom: 10
    },
    errorMsg: {
        color: 'red',
        alignSelf: 'center',
        margin: 10
    },
    editButton: {
        backgroundColor: '#1da6f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        height: 40,
        margin: 5
    },
    discardButton: {
        backgroundColor: '#c21b26',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        height: 40,
        margin: 5
    },
    buttonText: {
        fontSize: 18,
        color: 'white'
    },
    pencilIcon: {
        marginTop: 15,
        marginLeft: 5
    }
})