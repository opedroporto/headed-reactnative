import * as React from 'react'
import { Image, ImageBackground, StyleSheet, Text, TextInput, View, TouchableOpacity, KeyboardAvoidingView} from 'react-native'
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import { addUser } from '../redux/actions'

import { login, fetchUserData } from '../backendApi'

class Login extends React.Component {
    state = {
        username: '',
        password: '',
        guestWarning: false,
        isLoading: false
    }

    componentDidMount() {
        try {
            this.setState({successMsg: this.props.route.params.successMsg})
        } catch(e){}
    }

    _login = async () => {
        // toggle loading state
        this.setState({
            isLoading: true,
        })

        try {  
            // login attempt
            const { accessToken } = await login(this.state.username,  this.state.password)

            // add user from database to local storage
            const user = await fetchUserData(accessToken)
            user.accessToken = accessToken

            this.props.dispatch(addUser(user))

            // navigate to home
            this.props.navigation.reset({
                index: 0,
                routes: [{ name: 'MainNavigator' }],
              });

        } catch(err) {
            const errMessage = err.message
            this.setState({err: errMessage})
        }

        // toggle loading state
        this.setState({
            isLoading: false,
        })
    }

    _forgotPassword = () => {
        this.props.navigation.navigate('RecoverPasswordScreen')
    }

    _toggleGuestWarning = () => {
        this.setState({ guestWarning: !this.state.guestWarning })
    }

    _continueAsGuest = () => {
        this.props.dispatch(addUser({}))
        this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'MainNavigator' }],
        });
    }
    
    handleUsernameUpdate = username => {
        /^[\x00-\x7F]*$/.test(username) &&
        username.length <= 18 &&
        this.setState({ username })
    }

    handlePasswordUpdate = password => {
        password.length <= 128 &&
        this.setState({ password })
    }
    
    render() {
        return (
            <React.Fragment>
                <ImageBackground
                style={styles.backgroundImage}
                source={require('../assets/background.jpg')}
                resizeMode='cover'
                >
                    <View style={styles.container}>
                        <View style={styles.logoContainer}>
                            {/* <Text style={styles.title}>Headed</Text> */}
                            <Image style={styles.logo} source={require('../assets/headed_logo.png')} resizeMode='cover'/>
                        </View>
                        <View style={styles.whiteContainer}>
                            <KeyboardAvoidingView style={styles.inputContainer} behavior={'padding'}>
                                <Text style={styles.pageTitle}>Log into your account</Text>
                                { !this.state.err && (<Text style={styles.successMsg}>{this.state.successMsg}</Text>)}
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
                            <View style={styles.loginDiv}>
                                { !this.state.isLoading? (
                                    <TouchableOpacity style={styles.loginButton} onPress={this._login}>
                                        <Text style={styles.loginText}>Login</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity style={[styles.loginButton, {backgroundColor: '#ccc'}]} onPress={this._login} disabled={true}>
                                        <Text style={styles.loginText}>Login</Text>
                                    </TouchableOpacity>
                                )}
                                <Text style={styles.forgotPassword} onPress={this._forgotPassword}>Forgot password?</Text>
                            </View>
                            <View style={styles.bottomSection}>
                                <View style={styles.textContainer}>
                                    <Text>
                                        Don't have an account yet?
                                        <Text
                                            style={styles.clickableText}
                                            onPress={() => this.props.navigation.navigate('SignupScreen')}
                                        >  Create one </Text>
                                    </Text>
                                </View>
                                <View style={styles.textContainer}>
                                    <Text>
                                        <Text
                                            style={styles.secondaryText}
                                            onPress={this._toggleGuestWarning}>
                                            Continue as guest
                                        </Text>
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </ImageBackground>
                { this.state.guestWarning && (
                    <React.Fragment>
                        <View style={styles.warningBackground} />
                        {/* <TouchableOpacity
                            style={styles.touchableContainer}
                            onPress={this._toggleGuestWarning}
                        /> */}
                        <View style={styles.warningContainer}>
                            <View style={styles.warning}>
                                <Text style={styles.warningText}>If you proceed without an account, you will not be able to enjoy the full app experience</Text>
                                <View>
                                    <Text style={styles.warningMainText}>Do you wish to continue?</Text>
                                    <View style={styles.buttonsRow}>
                                        <TouchableOpacity style={[styles.button, styles.cancelButton]}>
                                            <Text style={styles.buttonText} onPress={this._toggleGuestWarning} >Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.button, styles.continueButton]}>
                                            <Text style={styles.buttonText} onPress={this._continueAsGuest}>Continue</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </React.Fragment>
                )}
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user
})

export default connect(mapStateToProps)(Login)

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
        height: '60%',
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
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        marginBottom: 10,
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white'
    },
    logo: {
        width: 180,
        height: 180
    },
    pageTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#db2745',
        marginBottom: 30
    },
    successMsg: {
        position: 'absolute',
        top: 50,
        color: 'green'
    },
    errorMsg: {
        position: 'absolute',
        top: 50,
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
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.25)'
    },
    inputField: {
        flex: 1,
        flexDirection: 'row'  
    },
    loginDiv: {
        padding: 10,
        width: '100%',
        alignItems: 'center',
    },
    loginButton: {
        backgroundColor: '#db2745',
        height: 40,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50
    },
    loginText: {
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
    },
    secondaryText: {
        color: '#888'
    },
    textContainer: {
        margin: 2
    },
    forgotPassword: {
        paddingLeft: 10,
        alignSelf: 'flex-start',
        color: '#db2745'
    },
    warningBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, .75)'
    },
    warningContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    warning: {
        width: '90%',
        height: '40%',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    warningText: {
        fontSize: 22
    },
    warningMainText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 22,
        marginVertical: 20
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    button: {
        margin: 5,
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 5
    },
    cancelButton: {
        backgroundColor: '#ccc'
    },
    continueButton: {
        backgroundColor: '#32a852'
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 18
    }
})