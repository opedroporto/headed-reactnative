// action types 
export const UPDATE_ENTRY = 'UPDATE_ENTRY'
export const UPDATE_USER = 'UPDATE_USER'

// action creators
export const addEntry = update => ({
	type: UPDATE_ENTRY,
	payload: update
})

export const addUser = update => ({
	type: UPDATE_USER,
	payload: update
})