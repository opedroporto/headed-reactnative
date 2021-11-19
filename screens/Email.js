import * as React from 'react'
import { ImageBackground, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import { addUser } from '../redux/actions'

import { login, fetchUserData, addEmail } from '../backendApi'

class Email extends React.Component {
    state = {
        email: ''
    }

    componentDidMount = async () => {
        try {
            this.setState({successMsg: this.props.route.params.successMsg})
        } catch(e){}

        // login
        const { accessToken } = await login(this.props.route.params.user.username,  this.props.route.params.user.password)

        // add user from database to local storage
        const user = await fetchUserData(accessToken)
        user.accessToken = accessToken

        this.props.dispatch(addUser(user))
    }

    _confirmEmail = async () => {
        try {
            const result = await addEmail(this.props.user.accessToken, this.state.email)
            this.setState({emailSentMsg: result, successMsg: '', errorMsg: ''})
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
                            <Text style={styles.title}>Add e-mail</Text>
                            {/* { (!this.state.err) && (<Text style={styles.successMsg}>{this.state.successMsg}</Text>)}
                            <Text style={styles.successMsg}>{this.state.emailSentMsg}</Text>
                            { (!this.state.emailSentMsg) && (<Text style={styles.errorMsg}>{this.state.err}</Text>)} */}
                            <Text style={styles.successMsg}>{this.state.successMsg}</Text>
                            <Text style={styles.errorMsg}>{this.state.errorMsg}</Text>
                            <Text style={styles.successMsg}>{this.state.emailSentMsg}</Text>
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
                        </KeyboardAvoidingView>
                        <TouchableOpacity style={styles.signupButton} onPress={this._confirmEmail}>
                            <Text style={styles.signupText}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user
})

export default connect(mapStateToProps)(Email)


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
    clickableText: {
        color: '#66f'
    },
    successMsg: {
        position: 'absolute',
        top: 50,
        color: 'green'
    },
})