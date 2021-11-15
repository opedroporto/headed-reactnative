import {combineReducers} from 'redux'

import {UPDATE_ENTRY, UPDATE_USER} from './actions'

// redurcers
const addEntryReducer = (state = [], action) => {
    switch (action.type) {
        case UPDATE_ENTRY:
            return action.payload
        default:
            return state
    }
}
const addUserReducer = (state = [], action) => {
    switch (action.type) {
        case UPDATE_USER:
            return action.payload
        default:
            return state
    }
}

export default combineReducers({
	entries: addEntryReducer,
    user: addUserReducer
})