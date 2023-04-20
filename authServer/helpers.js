export function validateUsernameLength(username) {
    // beetween 3 and 18 characters
    return username.length >= 3 && username.length <= 30
}

export function validateUsernameASCII(username) {
    // ASCII only
    return /^[\x00-\x7F]*$/.test(username);
}

export function validateEmail(email) {
    // *@*.**
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function validatePassword(password) {
    return password.length >= 8 && password.length <= 128
}
