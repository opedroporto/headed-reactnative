import * as React from 'react'
import {Dimensions, Image, Text, StyleSheet, View, SectionList, TouchableOpacity} from 'react-native'
import { fetchEntriesData } from '../backendApi.js'

import { addEntry } from '../redux/actions'
import {connect} from 'react-redux'

class Home extends React.Component {

    componentDidMount = async() => {
        let entries = await fetchEntriesData()
        this.props.dispatch(addEntry(entries))
    }

    renderItem = (obj) => {
        let numberOfLines = Math.floor(Dimensions.get('window').height / 325)
        return (
            <TouchableOpacity style={styles.card}
                onPress={() => this.props.navigation.navigate('CompanyScreen', {company: obj.item})}
            >
                <View style={styles.cardRow}>
                    <Image style={styles.image} source={{'uri': obj.item.image}}/>
                    <View style={styles.mainInfoContainer}>
                        <Text style={styles.mainInfoTitle}>{ obj.item.name }</Text>
                        <Text style={styles.mainInfoSubtitle}>{ obj.item.rating } ✦</Text>
                        <View style={styles.mainInfoDescriptionSection}>
                            <Text style={styles.mainInfoDescription} numberOfLines={numberOfLines}>{ obj.item.description }</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                { this.props.entries &&
                    <SectionList
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => item + index}
                        sections={[{data: this.props.entries}]}
                    />
                }
            </View>
        )
    }
}

const mapStateToProps = state => ({
    entries: state.entries
})

export default connect(mapStateToProps)(Home)

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    card: {
        flex: 1,
        backgroundColor: '#db2745',
        borderBottomWidth: 1,
        borderBottomColor: '#ea8192',
        height: 80,
    },
    cardRow: {
        height: 80,
        flexDirection: 'row',
    },
    mainInfoContainer: {
        flex: 1,
        paddingHorizontal: 6,
        paddingBottom: 4
    },
    image: {
        width: 80,
        height: 80
    },
    mainInfoTitle: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold'
    },
    mainInfoSubtitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ffc72e'
    },
    mainInfoDescriptionSection: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    mainInfoDescription: {    
        color: '#fff'
    }
})