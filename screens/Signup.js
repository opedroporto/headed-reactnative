import * as React from 'react'
import { ImageBackground, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Icon } from 'react-native-elements'

import { connect } from 'react-redux'
import { addUser } from '../redux/actions'

import { signup, fetchUserData } from '../backendApi.js'

class Signup extends React.Component {
    state = {
        username: '',
        password: ''
    }

    _signup = async () => {
        try {
            // sign up user
            const { accessToken } = await signup(this.state.username,  this.state.password)
            
            // add user from database to local storage
            const user = {
                username: this.state.username,
                accessToken
            }
            this.props.dispatch(addUser(user))
            
            // navigate to email screen
            this.props.navigation.reset({
                index: 0,
                routes: [
                {name: 'EmailScreen', params: {
                    successMsg: 'Account successfully created!',
                    user: {
                        username: this.state.username,
                        password: this.state.password
                    }
                }}]
              });
        } catch(err) {
            const errMessage = err.message
            this.setState({err: errMessage})
        }
    }

    handleUsernameUpdate = username => {
        /^[\x00-\x7F]*$/.test(username) &&
        username.length <= 18 &&
        this.setState({ username: username })
    }

    handlePasswordUpdate = password => {
        password.length <= 128 &&
        this.setState({ password: password })
    }

    render() {  
        return (
            <ImageBackground
                style={styles.backgroundImage}
                source={require('../assets/background.jpg')}
                resizeMode="cover"
            >
                <View style={styles.container}>
                    <View style={styles.whiteContainer}>
                        <KeyboardAvoidingView style={styles.inputContainer} behavior='padding'>
                            <Text style={styles.title}>Create an account</Text>
                            <Text style={styles.errorMsg}>{this.state.err}</Text>
                            <View style={styles.input}>
                                <Icon
                                    style={styles.icon}
                                    name='user'
                                    type='font-awesome'
                                    color='#db2745'
                                    size={20}
                                />
                                <TextInput
                                    style={styles.inputField}
                                    placeholder='Username'
                                    value={this.state.username}
                                    onChangeText={this.handleUsernameUpdate}
                                    autoCapitalize='none'
                                />
                            </View>
                            <View style={styles.input}>
                                <Icon
                                    style={styles.icon}
                                    name='lock'
                                    type='font-awesome'
                                    color='#db2745'
                                    size={20}
                                />
                                <TextInput
                                    style={styles.inputField}
                                    placeholder='Password'
                                    value={this.state.password}
                                    onChangeText={this.handlePasswordUpdate}
                                    autoCapitalize='none'
                                    secureTextEntry
                                />
                            </View>
                        </KeyboardAvoidingView>
                        <TouchableOpacity style={styles.signupButton} onPress={this._signup}>
                            <Text style={styles.signupText}>Sign up</Text>
                        </TouchableOpacity>
                        <View style={styles.bottomSection}>
                            <Text>
                                Already have an account?  <Text style={styles.clickableText} onPress={() => this.props.navigation.push('LoginScreen')}>Login</Text>
                            </Text>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user
})

export default connect(mapStateToProps)(Signup)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    whiteContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        width: '100%',
        height: '90%',
        padding: 10,
        paddingBottom: 25,
        borderTopStartRadius: 50,
        borderTopEndRadius: 50
    },
    inputContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        padding: 10,
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center'
    },
    title: {
        marginBottom: 35,
        fontSize: 28,
        fontWeight: 'bold',
        color: '#db2745'
    },
    pageTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#db2745',
        marginBottom: 30
    },
    errorMsg: {
        position: 'absolute',
        top: 55,
        color: 'red'
    },
    icon: {
        paddingRight: 10,
        paddingTop: 5
    },
    input: {
        flexDirection: 'row',
        width: '100%',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.25)'
    },
    inputField: {
        flex: 1,
        flexDirection: 'row'  
    },
    signupButton: {
        margin: 30,
        padding: 10,
        backgroundColor: '#db2745',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50
    },
    signupText: {
        fontSize: 16,
        color: 'white',
    },
    bottomSection: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    clickableText: {
        color: '#66f'
    }
})