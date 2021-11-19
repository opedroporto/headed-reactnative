import * as React from 'react'
import { FlatList, Image, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { connect } from 'react-redux'

import { addComment, fetchEntrieComments } from '../backendApi'



class Company extends React.Component {
    state = {
        company: this.props.route.params.company,
        comments: [],
        newComment: ''
    }

    componentDidMount = async () => {
        this.props.navigation.getParent().setOptions({headerShown: false})
        this.fetchComments()
    }

    fetchComments = async () => {
        const comments = await fetchEntrieComments(this.props.user.accessToken, this.state.company._id)
        this.setState({ comments })
    }
    
    renderCommentItem = (obj) => {
        return (
            <View style={styles.commentContainer}>
                <Text style={styles.commentUser}>{ obj.item.user[0].username }</Text>
                <Text>{ obj.item.messageContent }</Text>
            </View>
        )
    }

    addComment = async () => {
        const result = await addComment(this.props.user.accessToken, this.state.newComment, this.state.company._id)
        this.setState({ newComment: '' })
        this.fetchComments()
    }

    handleNewCommentUpdate = newComment => {
        newComment.length <= 6000 &&
        this.setState({ newComment })
    }

    CompanyHeader = () => (
        <React.Fragment>
            <Image style={styles.image} source={{'uri': this.state.company.image}} />
            <Text style={styles.name}><Text style={styles.rating}>{ this.state.company.rating } ✦  </Text>{ this.state.company.name }</Text>
            <View style={styles.info}>
                <Text style={styles.descriptionTitle}>Description</Text>
                <Text style={styles.description}>{ this.state.company.description }</Text>
                <View style={styles.divisor}/>
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

    render() {
        return (
            <View style={styles.container} >
                <FlatList
                    data={this.state.comments.reverse()}
                    ListHeaderComponent={this.CompanyHeader}
                    renderItem={this.renderCommentItem}
                    keyExtractor={(item, index) => item.index}
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
        marginVertical: 25,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    image: {
        width: '100%',
        height: 300,
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
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 5
    },
    addCommentTitle: {
        fontSize: 16,
        color: 'white'
    }
})