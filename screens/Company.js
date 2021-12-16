import * as React from 'react'
import { Dimensions, FlatList, Image, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Slider from '@react-native-community/slider';
import Svg, {G, Circle, Text as SVG_Text} from 'react-native-svg'

import { TextInput } from 'react-native-gesture-handler'
import { connect } from 'react-redux'

import { addComment, fetchEntrieComments, updateCompanyRatings, fetchUserRatings } from '../backendApi'

const radius = 40
const strokeWidth = 10
const circleFontSize = 35

const circumference = 2 * Math.PI * radius;
const halfCircle = radius + strokeWidth;

const CircleRating = (props) => {
    return (
        <View style={{margin: 5, alignItems: 'center', width: '23%'}}>
            <Svg
                width={radius * 2}
                height={radius * 2}
                viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
            >
                <SVG_Text
                    fill={props.color}
                    fontSize={circleFontSize}
                    x={50}
                    y={50 + (circleFontSize / 3)}
                    textAnchor='middle'
                >
                    {props.value}
                </SVG_Text>
                <G
                rotation="-90"
                origin={`${halfCircle}, ${halfCircle}`}>
                    <Circle
                        cx='50%'
                        cy='50%'
                        stroke={props.color}
                        strokeWidth={strokeWidth}
                        r={radius}
                        fill='transparent'
                        strokeOpacity={0.2}
                    />
                    <Circle
                        cx='50%'
                        cy='50%'
                        // stroke={props.color}
                        strokeWidth={strokeWidth}
                        r={radius}
                        fill='transparent'
                        stroke={props.color}
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - (circumference * props.value) / 10}
                        strokeLinecap='square'
                        />
                </G>
            </Svg>
            <Text style={{fontSize: 16, textAlign: 'center', color: props.color}}>{props.title}</Text>
        </View>
    )
}

const SliderRating = (props) =>{
    return (
        <View style={styles.sliderContainer}>
            <View style={{flex: 1, flexDirection:'row', justifyContent:'center'}}>
                <Text style={{margin: 10, color: props.color}}>{props.title}:</Text>
                <Text style={{margin: 10, color: props.color}}>{ props.value }</Text>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
                <Slider
                    style={{width: '90%', height: 10}}
                    value={props.value}
                    onValueChange={props.handleSlideUpdate}
                    minimumValue={0}
                    maximumValue={10}
                    step={1}
                    minimumTrackTintColor={props.color}
                    maximumTrackTintColor={props.color}
                    thumbTintColor={props.color}
                    disabled={props.disabled}
                    />
            </View> 
        </View>
    )
}

class Company extends React.Component {
    state = {
        company: this.props.route.params.company,
        comments: [],
        newComment: '',
        
        // comunnity ratings
        ecoRatingNumber: 0,
        productsServicesRatingNumber: 0,
        attendanceRatingNumber: 0,
        overallRatingNumber: 0,
        
        // user ratings
        ecoRatingSlider: 0,
        productsServicesSlider: 0,
        attendanceSlider: 0,
        overallRatingSlider: 0,
        isLoading: false
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
            try {
                const userRatings = await fetchUserRatings(this.props.user.accessToken, this.state.company._id)
                this.setState({
                    ecoRatingSlider: userRatings.ecoRating,
                    productsServicesSlider: userRatings.productsServicesRating,
                    attendanceSlider: userRatings.attendanceRating,
                    overallRatingSlider: Math.round((userRatings.ecoRating + userRatings.productsServicesRating + userRatings.attendanceRating) / 3)
                })
            } catch (e) {}
        }

        // set community ratings
        this.setState({
            ecoRatingNumber: Math.round((this.state.company.ratings.reduce((total, next) => total + next.ecoRating, 0) / this.state.company.ratings.length) || 0),
            productsServicesRatingNumber: Math.round((this.state.company.ratings.reduce((total, next) => total + next.productsServicesRating, 0) / this.state.company.ratings.length) || 0),
            attendanceRatingNumber: Math.round((this.state.company.ratings.reduce((total, next) => total + next.attendanceRating, 0) / this.state.company.ratings.length) || 0),
            overallRatingNumber: Math.round(((this.state.company.ratings.reduce((total, next) => total + next.ecoRating, 0) / this.state.company.ratings.length + this.state.company.ratings.reduce((total, next) => total + next.productsServicesRating, 0) / this.state.company.ratings.length) / 2) || 0)
        })
    }

    fetchComments = async () => {
        const comments = await fetchEntrieComments(this.props.user.accessToken, this.state.company._id)
        this.setState({ comments })
    }
    
    addComment = async () => {
        // toggle loading state
        this.setState({
            isLoading: true,
        })

        await addComment(this.props.user.accessToken, this.state.newComment, this.state.company._id)
        this.setState({ newComment: '' })
        this.fetchComments()

        // toggle loading state
        this.setState({
            isLoading: false,
        })
    }
    
    handleNewCommentUpdate = newComment => {
        newComment.length <= 6000 &&
        this.setState({ newComment })
    }
    
    handleEcoRatingValueUpdate = async (ecoRatingSlider) => {
        await this.setState({ ecoRatingSlider })
        this._updateOverallRating()
    }
    
    handleProductsServicesRatingValueUpdate = async (productsServicesSlider) => {
        await this.setState({ productsServicesSlider })
        this._updateOverallRating()
    }
    
    handleAttendanceSliderValueUpdate = async (attendanceSlider) => {
        await this.setState({ attendanceSlider })
        this._updateOverallRating()
    }

    _updateOverallRating = async () => {
        this.setState({ overallRatingSlider: Math.round((this.state.ecoRatingSlider + this.state.productsServicesSlider + this.state.attendanceSlider) / 3) })
        const ratings = {
            rating1: this.state.ecoRatingSlider,
            rating2: this.state.productsServicesSlider,
            rating3: this.state.attendanceSlider,
        }
        await updateCompanyRatings(this.props.user.accessToken, this.state.company._id, ratings)
    }
    
    CompanyHeader = () => (
        <React.Fragment>
            <Image style={styles.image} source={{'uri': this.state.company.image}} />
            <Text style={styles.name}><Text style={styles.rating}>{this.state.overallRatingNumber}/10 ✦  </Text>{ this.state.company.name }</Text>
            <View style={styles.info}>
                <Text style={styles.descriptionTitle}>Description</Text>
                <Text style={styles.description}>{ this.state.company.description }</Text>
                <View style={styles.divisor}/>

        
                {/* community average sliders */}
                <Text style={styles.title}>Community ratings:</Text>
                <View style={styles.circleRatingsContainer}>
                    <CircleRating color='#db2745' value={this.state.overallRatingNumber}  title='Overall rating'/>
                    <CircleRating color='#f04a1d' value={this.state.productsServicesRatingNumber} title='Products/services'/>
                    <CircleRating color='#349beb' value={this.state.attendanceRatingNumber} title='Attendance'/>
                    <CircleRating color='#7acc3b' value={this.state.ecoRatingNumber} title='Eco'/>
                </View>

                <View style={styles.divisor}/>

                {/* user sliders */}
                { this.props.user.accessToken &&
                    <React.Fragment>
                        <Text style={styles.title}>Your ratings:</Text>
                        <SliderRating color='#f04a1d' value={this.state.productsServicesSlider} handleSlideUpdate={this.handleProductsServicesRatingValueUpdate} title='Products/services'/>
                        <SliderRating color='#349beb' value={this.state.attendanceSlider} handleSlideUpdate={this.handleAttendanceSliderValueUpdate} title='Attendance'/>
                        <SliderRating color='#7acc3b' value={this.state.ecoRatingSlider} handleSlideUpdate={this.handleEcoRatingValueUpdate} title='Eco'/>

                        <SliderRating color='#db2745' value={this.state.overallRatingSlider} title='Overall rating' disabled/>

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
                        { !this.state.isLoading ? (
                            <TouchableOpacity style={styles.addCommentButton} onPress={this.addComment}>
                                <Text style={styles.addCommentTitle}>Comment</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={[styles.addCommentButton, {backgroundColor: '#ccc'}]} onPress={this._login} disabled={true}>
                                <Text style={styles.addCommentTitle}>Comment</Text>
                            </TouchableOpacity>
                        )}
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
        color: '#aaa'
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
    },
    circleRatingsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20
    }
})