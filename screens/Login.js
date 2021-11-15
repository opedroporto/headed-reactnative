import * as React from 'react'
import { Image, ImageBackground, StyleSheet, Text, TextInput, View, TouchableOpacity, KeyboardAvoidingView} from 'react-native'
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import { addUser } from '../redux/actions'

import { login, fetchUserData } from '../backendApi'

class Login extends React.Component {
    state = {
        username: '',
        password: ''
    }

    componentDidMount() {
        try {
            this.setState({sucsessMsg: this.props.route.params.sucsessMsg})
        } catch(e){}
    }

    _login = async () => {
        try {
            
            // login attempt
            await login(this.state.username,  this.state.password)

            // add user from database to local storage
            const user = await fetchUserData(this.state.username)
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
            resizeMode='cover'
            >
                <View style={styles.container}>
                    <View style={styles.logoContainer}>
                        {/* <Text style={styles.title}>Headed</Text> */}
                        <Image style={styles.logo} source={require('../assets/headed_logo.png')} resizeMode='cover'/>
                    </View>
                    <View style={styles.whiteContainer}>
                        <KeyboardAvoidingView style={styles.inputContainer} behavior='padding'>
                            <Text style={styles.pageTitle}>Login into your account</Text>
                            { !this.state.err && (<Text style={styles.sucsessMsg}>{this.state.sucsessMsg}</Text>)}
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
                        <TouchableOpacity style={styles.loginButton} onPress={this._login}>
                            <Text style={styles.loginText}>Login</Text>
                        </TouchableOpacity>
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
                                        onPress={() => {
                                            this.props.dispatch(addUser(null))
                                            this.props.navigation.reset({
                                                index: 0,
                                                routes: [{ name: 'MainNavigator' }],
                                              });
                                        }}
                                    >
                                        Continue as guest
                                    </Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        )
    }
}

const mapStateToProps = state => ({
    user: state.userusername
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
    sucsessMsg: {
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
    loginButton: {
        margin: 30,
        padding: 10,
        backgroundColor: '#db2745',
        width: '100%',
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
        margin: 5
    }
})