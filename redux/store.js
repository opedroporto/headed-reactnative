import { createStore } from 'redux'
import reducer from './reducer.js'
import { addEntry } from './actions.js'

const store = new createStore(reducer)

export default store