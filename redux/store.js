import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import reducer from './reducer.js'
  
const persistConfig = {
  key: 'root',
  storage: AsyncStorage
}
 
const persistedReducer = persistReducer(persistConfig, reducer)
 
export const store = new createStore(persistedReducer)
export const persistor = persistStore(store) 