// action types 
export const UPDATE_ENTRY = 'UPDATE_ENTRY'
export const UPDATE_USER = 'UPDATE_USER'
export const SEARCH = 'SEARCH';

// action creators
export const addEntry = update => ({
	type: UPDATE_ENTRY,
	payload: update
})

export const addUser = update => ({
	type: UPDATE_USER,
	payload: update
})

export const searchEntries = value => ({
  type: SEARCH,
  payload: value
})