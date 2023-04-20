export const login = async (username, password) => {
    const response = await fetch('https://headed-auth.herokuapp.com/login', {
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
    
    const errStatus = await response.status
    if (errStatus  === 503) {
        throw new Error("Erro ao fazer login")
    }
    const errMessage = await response.text()
    throw new Error(errMessage)
}

export const signup = async (username, password) => {
    const response = await fetch('https://headed-auth.herokuapp.com/signup', {
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

    const errStatus = await response.status
    if (errStatus  === 503) {
        throw new Error("Erro ao criar conta")
        
    }
    const errMessage = await response.text()
    throw new Error(errMessage)
}

export const fetchUserData = async (token) => {
    const response = await fetch('https://headed.herokuapp.com/fetchUserData', {
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
    const response = await fetch('https://headed.herokuapp.com/fetchEntriesData', {
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

    const errStatus = await response.status
    if (errStatus  === 503) {
        throw new Error("Erro ao carregar")
    }
    const errMessage = await response.text()
    throw new Error(errMessage)
}

export const fetchEntrieComments = async (token, companyID) => {
    const response = await fetch('https://headed.herokuapp.com/fetchEntrieComments', {
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

    const errStatus = await response.status
    if (errStatus  === 503) {
        throw new Error("Erro ao carregar")
    }
    const errMessage = await response.text()
    throw new Error(errMessage)
}

export const editProfile = async (token, userData) => {
    const response = await fetch('https://headed.herokuapp.com/editProfile', {
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

    const errStatus = await response.status
    if (errStatus  === 503) {
        throw new Error("Erro ao editar perfil")
    }
    const errMessage = await response.text()
    throw new Error(errMessage)
}

export const addComment = async (token, newComment, companyID) => {
    const response = await fetch('https://headed.herokuapp.com/addComment', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
        },
        body: JSON.stringify({newComment, companyID})
    })

    if(response.ok) {
        return true
    }

    const errStatus = await response.status
    if (errStatus  === 503) {
        throw new Error("Erro ao adicionar comentário")
    }
    const errMessage = await response.text()
    throw new Error(errMessage)
}

export const addEmail = async (token, email) => {
    const response = await fetch('https://headed.herokuapp.com/addEmail', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
        },
        body: JSON.stringify({email})
    })

    if(response.ok) {
        const result = await response.text()
        return result
    }

    const errStatus = await response.status
    if (errStatus  === 503) {
        throw new Error("Erro ao adicionar e-mail")
    }
    const errMessage = await response.text()
    throw new Error(errMessage)
}

export const verifyCode = async(token, email, code) => {
    const response = await fetch('https://headed.herokuapp.com/verifyCode', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
        },
        body: JSON.stringify({email, code})
    })

    if(response.ok) {
        const result = await response.text()
        return result
    }

    const errStatus = await response.status
    if (errStatus  === 503) {
        throw new Error("Erro ao verificar código")
    }
    const errMessage = await response.text()
    throw new Error(errMessage)
}

export const updateCompanyRatings = async(token, companyID, ratings) => {
    const response = await fetch('https://headed.herokuapp.com/updateCompanyRatings', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
        },
        body: JSON.stringify({companyID, ratings})
    })

    if(response.ok) {
        const result = await response.text()
        return result
    }

    const errStatus = await response.status
    if (errStatus  === 503) {   
        throw new Error("Erro ao atualizar")
    }
    const errMessage = await response.text()
    throw new Error(errMessage)
}

export const fetchUserRatings = async(token, companyID) => {
    const response = await fetch('https://headed.herokuapp.com/fetchUserRatings', {
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

    const errStatus = await response.status
    if (errStatus  === 503) {
        throw new Error("Erro ao carregar")
    }
    const errMessage = await response.text()
    throw new Error(errMessage)
}

export const addCompany = async (token, company) => {
    const response = await fetch('https://headed.herokuapp.com/addCompany', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
        },
        body: JSON.stringify({company})
    })

    if(response.ok) {
        const result = await response.text()
        return result
    }

    const errStatus = await response.status
    if (errStatus  === 503) {
        throw new Error("Erro ao adicionar")
    }
    const errMessage = await response.text()
    throw new Error(errMessage)
}

export const sendRecoverPasswordCode = async (email, username) => {
    const response = await fetch('https://headed-auth.herokuapp.com/sendRecoverPasswordCode', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({email, username})
    })

    if(response.ok) {
        const result = await response.text()
        return result
    }

    const errStatus = await response.status
    if (errStatus  === 503) {
        throw new Error("Erro ao enviar")
    }
    const errMessage = await response.text()
    throw new Error(errMessage)
}

export const verifyRecoverPasswordCode = async (email, code) => {
    const response = await fetch('https://headed-auth.herokuapp.com/verifyRecoverPasswordCode', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({email, code})
    })

    if(response.ok) {
        const result = await response.json()
        return result
    }

    const errStatus = await response.status
    if (errStatus  === 503) {
        throw new Error("Erro ao verificar")
    }
    const errMessage = await response.text()
    throw new Error(errMessage)
}

export const resetPassword = async (token, username, password) => {
    const response = await fetch('https://headed-auth.herokuapp.com/resetPassword', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
        },
        body: JSON.stringify({username, password})
    })

    if(response.ok) {
        const result = await response.text()
        return result
    }

    const errStatus = await response.status
    if (errStatus  === 503) {
        throw new Error("Erro ao resetar")
    }
    const errMessage = await response.text()
    throw new Error(errMessage)
}