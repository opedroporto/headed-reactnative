import * as React from 'react'
import { Alert, Image, KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native'
import * as ImagePicker from 'expo-image-picker';


import { connect  } from 'react-redux'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';

import { addCompany } from '../backendApi.js'

class AddCompany extends React.Component {

    state = {
        image: false,
        name: '',
        description: '',
        isLoading: false
    }

    componentDidMount = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Sorry!', 'Camera roll permissions are needed to make this work.');
            this.props.navigation.goBack()
        }
    }

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            base64: true,
            aspect: [5, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            this.setState({ image: `data:image/jpg;base64,${result.base64}` });
        }
    }

    _addCompany =  async () => {
        // toggle loading state
        this.setState({
            isLoading: true,
        })

        try {
            const company = {
                image: this.state.image,
                name: this.state.name,
                description: this.state.description    
            }
            await addCompany(this.props.user.accessToken, company)
            this.props.navigation.goBack()
        } catch(err) {
            const errMessage = err.message
            this.setState({err: errMessage})
        }

        // toggle loading state
        this.setState({
            isLoading: false,
        })
    }

    _handleNameUpdate = name => {
        name.length <= 260 &&
        this.setState({ name })
    }

    _handleDescriptionUpdate = description => {
        description.length <= 10000 &&
        this.setState({ description })
    }

    render() {
        try {
            this.props.navigation.getParent().setOptions({headerShown: false})
        } catch (e){}

        return (
            <ScrollView style={styles.container}>
                { !this.state.image ? (
                    <TouchableOpacity style={styles.image} onPress={this._pickImage}>
                        <Text style={styles.imageText}>Pick company image</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.image} onPress={this._pickImage}>
                        <Image source={{ uri: this.state.image }} style={styles.image} />
                    </TouchableOpacity>)}

                    <KeyboardAvoidingView style={styles.inputContainer} behavior={'padding'}>
                        <TextInput
                            style={styles.inputField}
                            placeholder='Company name'
                            value={this.state.name}
                            onChangeText={this._handleNameUpdate}
                        />
                        <TextInput
                            style={styles.descriptionField}
                            placeholder='Description'
                            value={this.state.description}
                            onChangeText={this._handleDescriptionUpdate}
                            multiline={true}
                        />
                    </KeyboardAvoidingView>
                    <Text style={styles.errorMsg}>{this.state.err}</Text>
                    <View style={styles.buttonContainer}>
                        { !this.state.isLoading? (
                            <TouchableOpacity style={styles.addCompanyButton} onPress={this._addCompany}>
                                <Text style={styles.addCompany}>Add Company</Text>
                            </TouchableOpacity>
                        ):(
                            <TouchableOpacity style={[styles.addCompanyButton, {backgroundColor: '#ccc'}]} onPress={this._addCompany} disabled={true}>
                                <Text style={styles.addCompany}>Add Company</Text>
                            </TouchableOpacity>
                        )}
                    </View>
            </ScrollView>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user
})

export default connect(mapStateToProps)(AddCompany)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    image: {
        width: '100%',
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ccc'
    },
    imageText: {
        fontWeight: 'bold'
    },
    inputContainer: {
        flex: 1,
        padding: 10
    },
    inputField: {
        borderWidth: 1,
        borderColor: '#db2745',
        padding: 5,
        borderRadius: 5,
        marginVertical: 5,
        height: 40
    },
    descriptionField: {
        borderWidth: 1,
        borderColor: '#db2745',
        padding: 5,
        borderRadius: 5,
        marginVertical: 5,
        height: 80
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignSelf: 'center',
        margin: 20
    },
    addCompanyButton: {
        backgroundColor: '#db2745',
        width: '100%',
        borderRadius: 5
    },
    addCompany: {
        color: 'white',
        padding: 10,
        paddingHorizontal: 40
    },
    errorMsg: {
        marginTop: 10,
        alignSelf: 'center',
        color: 'red'
    }
})