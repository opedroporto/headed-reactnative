import * as React from 'react'
import { KeyboardAvoidingView, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from 'react-native-elements'

import { resetPassword } from '../backendApi'

export default class NewPassword extends React.Component {
    
    state = {
        password: ''
    }

    _addNewPassword = async () => {
        try {
            this.setState({successMsg: '', errorMsg: ''})
            const result = await resetPassword(this.props.route.params.token, this.props.route.params.username, this.state.password)
            this.setState({successMsg: result, errorMsg: ''})
            this.props.navigation.reset({
                index: 0,
                routes: [
                {name: 'LoginScreen', params: {
                    successMsg: 'Password successfully updated!'
                }}]
            });
        } catch(err) {
            const errMessage = err.message
            this.setState({errorMsg: errMessage, successMsg: ''})
            this.forceUpdate()
        }
    }

    handlePasswordUpdate = password => {
        password.length <= 128 &&
        this.setState({ password })
    }

    render() {
        return (
            <ImageBackground
                style={styles.backgroundImage}
                source={require('../assets/background.jpg')}
                resizeMode='cover'
            >
                <LinearGradient colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.75)']} style={styles.container}>
                    <Text style={styles.pageTitle}>New password</Text>
                    <Text style={styles.successMsg}>{this.state.successMsg}</Text>
                    <Text style={styles.errorMsg}>{this.state.errorMsg}</Text>
                    <KeyboardAvoidingView style={styles.inputContainer} behavior={'margin'}>
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
                                placeholder='New password'
                                value={this.state.password}
                                onChangeText={this.handlePasswordUpdate}
                                autoCapitalize='none'
                                secureTextEntry
                            />
                        </View>
                    </KeyboardAvoidingView>
                    <TouchableOpacity style={styles.signupButton} onPress={this._addNewPassword}>
                        <Text style={styles.signupText}>Confirm</Text>
                    </TouchableOpacity>
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