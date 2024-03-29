import * as React from 'react'
import { Dimensions, FlatList, Image, Text, StyleSheet, View, SectionList, TextInput, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'

import { addEntry, searchEntries } from '../redux/actions'
import { connect  } from 'react-redux'

import { fetchEntriesData } from '../backendApi.js'

class Home extends React.Component {

    state = {
        searchInput: '',
        entries: this.props.entries,
        listRefreshing: false
    }

    componentDidMount = () => {
        this.fetchEntries()
    }

    fetchEntries = async() => {
        await this.setState({listRefreshing: true})
        let entries = await fetchEntriesData(this.props.user.accessToken)
        await this.props.dispatch(addEntry(entries))
        await this.setState({listRefreshing: false})
    }

    renderItem = (obj) => {
        if (obj.item.visible) {
            let numberOfLines = Math.floor(Dimensions.get('window').height / 325)
            let ratingNumber = Math.round((obj.item.ratings.reduce((total, next) => total + next.ecoRating, 0) / obj.item.ratings.length + obj.item.ratings.reduce((total, next) => total + next.productsServicesRating, 0) / obj.item.ratings.length) / 2) || 0
            return (
                <TouchableOpacity style={styles.card}
                    onPress={() => this.props.navigation.navigate('CompanyScreen', {company: obj.item})}
                >
                    <View style={styles.cardRow}>
                        <Image style={styles.image} source={{'uri': obj.item.image}}/>
                        <View style={styles.mainInfoContainer}>
                            <Text style={styles.mainInfoTitle} numberOfLines={1}>{ obj.item.name }</Text>
                            <Text style={styles.mainInfoSubtitle}>{ ratingNumber }/10 ✦</Text>
                            <View style={styles.mainInfoDescriptionSection}>
                                <Text style={styles.mainInfoDescription} numberOfLines={numberOfLines}>{ obj.item.description }</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }

    handleSearchInputUpdate = searchInput => {
        searchInput.length <= 10000 &&
        this.setState({ searchInput })

        // filter array
        this.props.dispatch(searchEntries(searchInput))
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <Icon
                        style={styles.icon}
                        name='magnifying-glass'  
                        type='entypo'
                        color='black'
                        size={10}
                        margin={1}
                    />
                    <TextInput
                        style={styles.inputField}
                        placeholder='Search for companies...'
                        value={this.state.searchInput}
                        onChangeText={this.handleSearchInputUpdate}
                        multiline={true}
                    />
                </View>
                { this.props.entries &&
                    <FlatList
                        renderItem={this.renderItem}
                        data={
                            this.props.entries.sort(function(one, other) {
                                return one.ratings.length < other.ratings.length
                            })
                        }
                        keyExtractor={(item, index) => item + index}
                        onRefresh={this.fetchEntries}
                        refreshing={this.state.listRefreshing}
                    />
                }
                { this.props.user.accessToken &&
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('AddCompanyScreen')}
                        style={styles.roundButton}>
                        <Text style={styles.plusIcon}>+</Text>
                    </TouchableOpacity>
                }
            </View>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
    entries: state.entries
})

export default connect(mapStateToProps)(Home)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#db2745'
    },
    card: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 5,
        marginHorizontal: 2,
        marginVertical: 1,
        height: 80,
    },
    cardRow: {
        height: 80,
        flexDirection: 'row',
    },
    mainInfoContainer: {
        flex: 1,
        paddingHorizontal: 6
    },
    image: {
        width: 80,
        height: 80,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5
    },
    mainInfoTitle: {
        fontSize: 18,
        color: '#db2745',
        fontWeight: 'bold'
    },
    mainInfoSubtitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ffc72e'
    },
    mainInfoDescriptionSection: {
        flex: 1,
    },
    mainInfoDescription: {    
        color: '#db2745',
    },
    roundButton: {
        width: 75,
        height: 75,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor: 'white',
        margin: 10,
        position: 'absolute',
        bottom: 0,
        right: 0,
        elevation: 20,
    },
    plusIcon: {
        fontSize: 50,
        color: '#db2745',
    },
    inputField: {
        flex: 1,
        width: '100%',
        padding: 5,
        // textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        marginBottom: 2
    },
    icon: {
        color: 'black',
        padding: 15
    }
})