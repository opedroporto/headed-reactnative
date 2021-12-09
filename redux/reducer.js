import {combineReducers} from 'redux'

import {UPDATE_ENTRY, UPDATE_USER, SEARCH} from './actions'

// redurcers
const addEntryReducer = (state = [], action) => {
    switch (action.type) {
        case UPDATE_ENTRY:
            // set property visible to every entry
            action.payload.forEach((element, index) => {
                action.payload[index].visible = true
            })
            return action.payload
        case SEARCH: {
            
            // filter array
            state.forEach((element, index) => {
                // match
                if(element.name.toLowerCase().includes(action.payload.toLowerCase())) {
                    state[index].visible = true
                // not match
                } else {
                    state[index].visible = false
                }
            });

            return state
            // return state.filter(entry => entry.name.toLowerCase().includes(action.payload.toLowerCase()))
        }
        default:
            return state
    }
}
const addUserReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_USER:
            return action.payload
        default:
            return state
    }
}

export default combineReducers({
	entries: addEntryReducer,
    user: addUserReducer,
    // entries: searchEntriesReducer
})