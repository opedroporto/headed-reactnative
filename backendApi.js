export const login = async (username, password) => {
    const response = await fetch('http://192.168.15.11:8000/login', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({username, password})
    })
    
    
    if(response.ok) {
        const result = await response.json()
        return result
    }

    const errMessage = await response.text()
    throw new Error(errMessage)
}

export const signup = async (email, username, password) => {
    const response = await fetch('http://192.168.15.11:8080/addUser', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({email, username, password})
    })
        
    if(response.ok) {
        return true
    }

    const errMessage = await response.text()
    throw new Error(errMessage)
}

export const fetchUserData = async (token) => {
    const response = await fetch('http://192.168.15.11:8080/fetchUserData', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
        }
    })

    
    if(response.ok) {
        const result = await response.json()
        return result
    }
    
    return {}
}

export const fetchEntriesData = async (token) => {
    const response = await fetch('http://192.168.15.11:8080/fetchEntriesData', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
        }
    })
    if(response.ok) {
        const result = await response.json()
        return result
    }

    const errMessage = await response.text()
    throw new Error(errMessage)
}

export const fetchEntrieComments = async (token, companyID) => {
    const response = await fetch('http://192.168.15.11:8080/fetchEntrieComments', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
        },
        body: JSON.stringify({companyID})
    })
    if(response.ok) {
        const result = await response.json()
        return result
    }

    const errMessage = await response.text()
    throw new Error(errMessage)
}

export const editProfile = async (token, userData) => {
    const response = await fetch('http://192.168.15.11:8080/editProfile', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
        },
        body: JSON.stringify({...userData})
    })

    if(response.ok) {
        const result = await response.json()
        return result
    }

    const errMessage = await response.text()
    throw new Error(errMessage)
}