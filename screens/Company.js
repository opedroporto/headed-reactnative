import * as React from 'react'
import { FlatList, Image, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Slider from '@react-native-community/slider';
import { TextInput } from 'react-native-gesture-handler'
import { connect } from 'react-redux'

import { addComment, fetchEntrieComments, updateCompanyRatings, fetchUserRatings } from '../backendApi'

class Company extends React.Component {
    state = {
        company: this.props.route.params.company,
        comments: [],
        newComment: '',
        slide1Value: 0,
        slide2Value: 0,
        overallRating: 0
    }

    componentDidMount = async () => {
        // header shown false
        try {
            this.props.navigation.getParent().setOptions({headerShown: false})
        } catch (e){}

        // fetch comments
        this.fetchComments()

        // user ratings
        if (this.props.user.accessToken) {
            const userRatings = await fetchUserRatings(this.props.user.accessToken, this.state.company._id)
            this.setState({
                slide1Value: userRatings.ecoRating,
                slide2Value: userRatings.productsServicesRating,
                overallRating: (userRatings.ecoRating + userRatings.productsServicesRating) / 2
            })
        }
        
    }

    fetchComments = async () => {
        const comments = await fetchEntrieComments(this.props.user.accessToken, this.state.company._id)
        this.setState({ comments })
    }
    
    
    addComment = async () => {
        await addComment(this.props.user.accessToken, this.state.newComment, this.state.company._id)
        this.setState({ newComment: '' })
        this.fetchComments()
    }
    
    handleNewCommentUpdate = newComment => {
        newComment.length <= 6000 &&
        this.setState({ newComment })
    }
    
    handleSlide1ValueUpdate = async (slide1Value) => {
        await this.setState({ slide1Value })
        this._updateOverallRating()
    }
    
    handleSlide2ValueUpdate = async (slide2Value) => {
        await this.setState({ slide2Value })
        this._updateOverallRating()
    }
    
    _updateOverallRating = async () => {
        this.setState({ overallRating: (this.state.slide1Value + this.state.slide2Value) / 2 })
        const ratings = {
            rating1: this.state.slide1Value,
            rating2: this.state.slide2Value
        }
        await updateCompanyRatings(this.props.user.accessToken, this.state.company._id, ratings)
    }
    
    CompanyHeader = () => (
        <React.Fragment>
            <Image style={styles.image} source={{'uri': this.state.company.image}} />
            <Text style={styles.name}><Text style={styles.rating}>{((this.state.company.ratings.reduce((total, next) => total + next.ecoRating, 0) / this.state.company.ratings.length + this.state.company.ratings.reduce((total, next) => total + next.productsServicesRating, 0) / this.state.company.ratings.length) / 2) || 0}/10 ✦  </Text>{ this.state.company.name }</Text>
            <View style={styles.info}>
                <Text style={styles.descriptionTitle}>Description</Text>
                <Text style={styles.description}>{ this.state.company.description }</Text>
                <View style={styles.divisor}/>

                {/* average sliders */}
                <Text style={styles.title}>Community ratings:</Text>
                <View style={styles.sliderContainer}>
                    <View style={{flex: 1, flexDirection:'row', justifyContent:'center'}}>
                        <Text style={{margin: 10, color: '#db2745'}}>Overall rating:</Text>
                        <Text style={{margin: 10, color: '#db2745'}}>{((this.state.company.ratings.reduce((total, next) => total + next.ecoRating, 0) / this.state.company.ratings.length + this.state.company.ratings.reduce((total, next) => total + next.productsServicesRating, 0) / this.state.company.ratings.length) / 2) || 0}</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <Slider
                            style={{width: '90%', height: 10}}
                            value={((this.state.company.ratings.reduce((total, next) => total + next.ecoRating, 0) / this.state.company.ratings.length + this.state.company.ratings.reduce((total, next) => total + next.productsServicesRating, 0) / this.state.company.ratings.length) / 2) || 0}
                            minimumValue={0}
                            maximumValue={10}
                            minimumTrackTintColor='#db2745'
                            maximumTrackTintColor='#db2745'
                            thumbTintColor='#db2745'
                            disabled
                            />
                    </View> 
                </View>
                <View style={styles.sliderContainer}>
                    <View style={{flex: 1, flexDirection:'row', justifyContent:'center'}}>
                        <Text style={{margin: 10, color: '#7acc3b'}}>Eco:</Text>
                        <Text style={{margin: 10, color: '#7acc3b'}}>{(this.state.company.ratings.reduce((total, next) => total + next.ecoRating, 0) / this.state.company.ratings.length) || 0 }</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <Slider
                            style={{width: '90%', height: 10}}
                            value={(this.state.company.ratings.reduce((total, next) => total + next.ecoRating, 0) / this.state.company.ratings.length) || 0}
                            minimumValue={0}
                            maximumValue={10}
                            step={1}
                            minimumTrackTintColor='#7acc3b'
                            maximumTrackTintColor='#7acc3b'
                            thumbTintColor='#7acc3b'
                            disabled
                            />
                    </View>
                </View>
                <View style={styles.sliderContainer}>
                    <View style={{flex: 1, flexDirection:'row', justifyContent:'center'}}>
                        <Text style={{margin: 10, color: '#f04a1d'}}>Products / Services:</Text>
                        <Text style={{margin: 10, color: '#f04a1d'}}>{(this.state.company.ratings.reduce((total, next) => total + next.productsServicesRating, 0) / this.state.company.ratings.length) || 0 }</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <Slider
                            style={{width: '90%', height: 10}}
                            value={(this.state.company.ratings.reduce((total, next) => total + next.productsServicesRating, 0) / this.state.company.ratings.length) || 0}
                            minimumValue={0}
                            maximumValue={10}
                            step={1}
                            minimumTrackTintColor='#f04a1d'
                            maximumTrackTintColor='#f04a1d'
                            thumbTintColor='#f04a1d'
                            disabled
                            />
                    </View>
                </View>

                <View style={styles.divisor}/>

                {/* user sliders */}
                { this.props.user.accessToken &&
                    <React.Fragment>
                        <Text style={styles.title}>Your ratings:</Text>
                        <View style={styles.sliderContainer}>
                            <View style={{flex: 1, flexDirection:'row', justifyContent:'center'}}>
                                <Text style={{margin: 10, color: '#db2745'}}>Overall rating:</Text>
                                <Text style={{margin: 10, color: '#db2745'}}>{ this.state.overallRating }</Text>
                            </View>
                            <View style={{flex: 1, alignItems: 'center'}}>
                                <Slider
                                    style={{width: '90%', height: 10}}
                                    value={this.state.overallRating}
                                    minimumValue={0}
                                    maximumValue={10}
                                    minimumTrackTintColor='#db2745'
                                    maximumTrackTintColor='#db2745'
                                    thumbTintColor='#db2745'
                                    disabled
                                    />
                            </View> 
                        </View>
                        <View style={styles.sliderContainer}>
                            <View style={{flex: 1, flexDirection:'row', justifyContent:'center'}}>
                                <Text style={{margin: 10, color: '#7acc3b'}}>Eco:</Text>
                                <Text style={{margin: 10, color: '#7acc3b'}}>{ this.state.slide1Value }</Text>
                            </View>
                            <View style={{flex: 1, alignItems: 'center'}}>
                                <Slider
                                    style={{width: '90%', height: 10}}
                                    value={this.state.slide1Value}
                                    onValueChange={this.handleSlide1ValueUpdate}
                                    minimumValue={0}
                                    maximumValue={10}
                                    step={1}
                                    minimumTrackTintColor='#7acc3b'
                                    maximumTrackTintColor='#7acc3b'
                                    thumbTintColor='#7acc3b'
                                    />
                            </View>
                        </View>
                        <View style={styles.sliderContainer}>
                            <View style={{flex: 1, flexDirection:'row', justifyContent:'center'}}>
                                <Text style={{margin: 10, color: '#f04a1d'}}>Products / Services:</Text>
                                <Text style={{margin: 10, color: '#f04a1d'}}>{ this.state.slide2Value }</Text>
                            </View>
                            <View style={{flex: 1, alignItems: 'center'}}>
                                <Slider
                                    style={{width: '90%', height: 10}}
                                    value={this.state.slide2Value}
                                    onValueChange={this.handleSlide2ValueUpdate}
                                    minimumValue={0}
                                    maximumValue={10}
                                    step={1}
                                    minimumTrackTintColor='#f04a1d'
                                    maximumTrackTintColor='#f04a1d'
                                    thumbTintColor='#f04a1d'
                                    />
                            </View>
                        </View>
                        <View style={styles.divisor}/>
                    </React.Fragment>
                }
                <Text style={styles.commentSectionTitle}>Comments</Text>
                { this.props.user.accessToken &&
                    <KeyboardAvoidingView>
                        <TextInput
                            style={styles.commentBox}
                            placeholder={`Add a public comment as ${this.props.user.username}...`}
                            value={this.state.newComment}
                            onChangeText={this.handleNewCommentUpdate}
                            />
                        <TouchableOpacity style={styles.addCommentButton} onPress={this.addComment}>
                            <Text style={styles.addCommentTitle}>Comment</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                }
            </View>
        </React.Fragment>
    )
    
    renderCommentItem = (obj) => {
        return (
            <View style={styles.commentContainer}>
                <View style={styles.commentHeader}>
                    <Text style={styles.commentUser}>{ obj.item.user[0].username }</Text>
                    <Text style={styles.commentTime}>   { obj.item.time }</Text>
                </View>
                <Text>{ obj.item.messageContent }</Text>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container} >
                <FlatList
                    data={this.state.comments.reverse()}
                    ListHeaderComponent={this.CompanyHeader}
                    renderItem={this.renderCommentItem}
                    keyExtractor={(item, index) => item + index}
                    />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user
})

export default connect(mapStateToProps)(Company)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee'
    },
    divisor: {
        marginVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    image: {
        width: '100%',
        height: 250,
        resizeMode: 'cover'
    },
    name: {
        padding: 6,
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: '#db2745',
        width: '100%'
    },
    rating: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffc72e'
    },
    info: {
        flex: 1,
        alignContent: 'center',
        padding: 5,
    },
    descriptionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#db2745'
    },
    description: {
        color: '#db2745',
        fontSize: 20,
        paddingVertical: 10
    },
    commentSectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#db2745',
        paddingBottom: 10,
    },
    commentContainer: {
        color: '#db2745',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    commentUser: {
        fontWeight: 'bold'
    },
    commentTime: {
        color: '#ccc'
    },
    commentHeader: {
        flex: 1,
        flexDirection: 'row'
    },
    commentBox: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        height: 60
    },
    username: {
        padding: 10
    },
    addCommentButton: {
        backgroundColor: '#db2745',
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 5
    },
    addCommentTitle: {
        fontSize: 16,
        color: 'white'
    },
    sliderContainer: {
        flex: 1,
        padding: 20
    },
    title: {
        alignSelf: 'center',
        color: '#db2745',
        fontWeight: 'bold',
        fontSize: 22
    }
})