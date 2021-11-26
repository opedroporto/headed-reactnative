import * as React from 'react'
import { KeyboardAvoidingView, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from 'react-native-elements'

import { sendRecoverPasswordCode, verifyRecoverPasswordCode } from '../backendApi'

export default class RecoverPassword extends React.Component {
    
    state = {
        email: '',
        username: '',
        code: '',
        codeInput: false,
        currentUsername: ''
    }

    _confirm = async () => {
        try {
            this.setState({emailSentMsg: '', successMsg: '', errorMsg: ''})
            const result = await sendRecoverPasswordCode(this.state.email, this.state.username)
            this.setState({emailSentMsg: result, successMsg: '', errorMsg: '', codeInput: true, currentUsername: this.state.username})
        } catch(err) {
            const errMessage = err.message
            this.setState({errorMsg: errMessage, successMsg: '', emailSentMsg: ''})
            this.forceUpdate()
        }
    }

    _verifyCode = async () => {
        try {
            const { token } = await verifyRecoverPasswordCode(this.state.email, this.state.code)
            this.setState({emailSentMsg: 'Verified!', successMsg: '', errorMsg: '', codeInput: true})
            this.props.navigation.navigate('NewPasswordScreen', {token, username: this.state.currentUsername})
        } catch(err) {
            const errMessage = err.message
            this.setState({errorMsg: errMessage, successMsg: '', emailSentMsg: ''})
            this.forceUpdate()
        }
    }

    handleEmailUpdate = email => {
        email.length <= 320 &&
        this.setState({ email: email })
    }

    handleUsernameUpdate = username => {
        /^[\x00-\x7F]*$/.test(username) &&
        username.length <= 18 &&
        this.setState({ username: username })
    }

    handleCodeUpdate = code => {
        code.length <= 6 &&
        this.setState({ code: code.replace(/[^0-9]/g, ''), })
    }

    render() {
        return (
            <ImageBackground
                style={styles.backgroundImage}
                source={require('../assets/background.jpg')}
                resizeMode='cover'
            >
                <LinearGradient colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.75)']} style={styles.container}>
                    <Text style={styles.pageTitle}>Recover password</Text>
                    <Text style={styles.successMsg}>{this.state.successMsg}</Text>
                    <Text style={styles.errorMsg}>{this.state.errorMsg}</Text>
                    <Text style={styles.successMsg}>{this.state.emailSentMsg}</Text>
                    <KeyboardAvoidingView style={styles.inputContainer} behavior={'margin'}>
                        <View style={styles.input}>
                            <Icon
                                style={styles.icon}
                                name='mail'
                                type='entypo'
                                color='#db2745'
                                size={20}
                            />
                            <TextInput
                                style={styles.inputField}
                                placeholder='E-mail'
                                value={this.state.email}
                                onChangeText={this.handleEmailUpdate}
                                autoCapitalize='none'
                            />
                        </View>
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
                    </KeyboardAvoidingView>
                    { this.state.codeInput  &&
                    (<KeyboardAvoidingView style={styles.codeContainer} behavior='height'>
                        <TextInput
                            style={styles.codeInput}
                            value={this.state.code}
                            onChangeText={this.handleCodeUpdate}
                            keyboardType='numeric'
                            maxLength={6}
                        />
                        <TouchableOpacity style={styles.signupButton} onPress={this._verifyCode}>
                            <Text style={styles.signupText}>Verify code</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                    )}
                    { !this.state.codeInput ?
                    (<TouchableOpacity style={styles.signupButton} onPress={this._confirm}>
                        <Text style={styles.signupText}>Confirm</Text>
                    </TouchableOpacity>) :
                    (<Text style={styles.clickableText} onPress={this._confirm}>Request code again</Text>)}
                </LinearGradient>
            </ImageBackground>
        )
    }
}

// const mapStateToProps = state => ({
//     user: state.user
// })

// export default connect(mapStateToProps)(RecoverPassword)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginHorizontal: 10,
        padding: 15,
    },
    backgroundImage: {
        width: '100%',
        height: '100%'
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15
    },
    pageTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#db2745',
        marginBottom: 30
    },
    icon: {
        paddingRight: 10,
        paddingTop: 5
    },
    inputContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        padding: 10,
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
    codeContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 30
    },
    codeInput: {
        borderColor: 'black',
        borderRadius: 5,
        borderWidth: 1,
        width: 140,
        height: 60,
        padding: 5,
        textAlign: 'center',
        fontSize: 34,
    },
    clickableText: {
        color: '#66f'
    },
    errorMsg: {
        position: 'absolute',
        top: 50,
        color: 'red'
    },
    successMsg: {
        position: 'absolute',
        top: 50,
        color: 'green'
    }
})