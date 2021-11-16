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
    const response = await fetch('http://192.168.15.11:8000/addUser', {
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

export const fetchUserData = async (token, username) => {
    const response = await fetch('http://192.168.15.11:8000/fetchUserData', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
        },
        body: JSON.stringify({'username': username})
    })

    const result = await response.json()

    if(response.ok) {
        return result
    }

    const errMessage = await response.text()
    throw new Error(errMessage)
}

export const fetchEntriesData = async (token) => {
    const response = await fetch('http://192.168.15.11:8000/fetchEntriesData', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
        }
    })

    const result = await response.json()

    if(response.ok) {
        return result
    }

    const errMessage = await response.text()
    throw new Error(errMessage)
}