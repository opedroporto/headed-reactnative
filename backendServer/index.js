import Express from 'express'
import db from './db.js'
import bodyParser from 'body-parser'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

import { validateEmail, validateUsernameLength, validateUsernameASCII, validatePassword } from './helpers.js'

const url = 'mongodb://localhost:27017'

const app = Express()
const PORT = process.env.PORT || 8000
app.use(bodyParser.json())

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).send('Missing token')

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).send('Invalid token')
        req.user = user
        next()
    })
}

app.post('/login', (req, res) => {
    const {username, password} = req.body

    // verify if fields exist
    if (!username) return res.status(400).send('Missing username')
    if (!password) return res.status(400).send('Missing password')

    // verify if fields are valid
    if (!validateUsernameLength(username)) return res.status(400).send('Username has to be between 3 and 18 characters long')
    if (!validateUsernameASCII(username)) return res.status(400).send('Username characters are invalid')
    if (!validatePassword(password)) return res.status(400).send('Password has to be between 8 and 128 characters long')

    // other verifications
    db.connect(url, 
        {useUnifiedTopology: true},
        (error, connection) => {
            if (error) return console.log(error)
            connection.db('app').collection('users').findOne({'username': username}, function(err, result) {
                // user exists
                if (!result) return res.status(403).send('Invalid credentials')
                // compare username
                if (!(result.username == username)) return res.status(403).send('Invalid credentials')
                // compare passwords
                bcrypt.compare(password, result.password, function(err, match) {
                    if (!match) return res.status(403).send('Invalid credentials')

                    // valid: log user
                    const acessToken = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET)

                    console.log(`User ${username} logged in`)
                    return res.status(200).json(acessToken)
                })
            })
        })
})

app.post('/addUser', (req, res) => {
    const {username, password, email} = req.body

    // verify if fields exist
    if (!email) return res.status(400).send('Missing e-mail')
    if (!username) return res.status(400).send('Missing username')
    if (!password) return res.status(400).send('Missing password')
    
    // verify if fields are valid
    if (!validateEmail(email)) return res.status(400).send('E-mail is invalid')
    if (!validateUsernameLength(username)) return res.status(400).send('Username has to be between 3 and 18 characters long')
    if (!validateUsernameASCII(username)) return res.status(400).send('Username characters are invalid')
    if (!validatePassword(password)) return res.status(400).send('Password has to be between 8 and 128 characters long')

    // other verifications
    db.connect(url,
            {useUnifiedTopology: true},
            (error, connection) => {
                if (error) return console.log(error)
                // email must be unique
                connection.db('app').collection('users').findOne({'email': email}, function(err, result) {
                    if (result) {
                        return res.status(403).send('E-mail already exists')
                    } else {
                        // username must be unique
                        connection.db('app').collection('users').findOne({'username': username}, function(err, result) {
                            if (result) {
                                return res.status(403).send('Username already exists')
                            } else {
                                // add user (with hashed password)
                                let saltRounds = 10
                                bcrypt.genSalt(saltRounds, function(err, salt) {
                                    bcrypt.hash(password, salt, function(error, hash) {
                                        if (error) return console.log(error)
                                        connection.db('app').collection('users').insertOne({
                                            'username': username,
                                            'password': hash,
                                            'email': email
                                        })
                                    })
                                })
                                console.log('New user added: ', username)
                                return res.status(200).send('New user added')
                            }
                        })
                    }
                })
                
            })
})

app.post('/fetchUserData', authenticateToken, (req, res) => {
    const {username} = req.body

    if (!username) return res.status(400).send('Missing username')
    if (username !== req.user ) return res.status(400).send('Invalid credentials')

    db.connect(url, 
        {useUnifiedTopology: true},
        (error, connection) => {
            if (error) return console.log(error)
            connection.db('app').collection('users').findOne({'username': req.user}, function(err, result) {
                if (!result) return res.status(404).send('User not found')
                return res.status(200).json(result)
            })
        })
})

app.post('/fetchEntriesData', (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    // guest
    if (!token) {
        db.connect(url,
            {useUnifiedTopology: true},
            (error, connection) => {
                if (error) return console.log(error)
                connection.db('app').collection('entries').find().toArray(function(err, result) {
                    if (!result) return res.status(404).send('Data not found')
                    return res.status(200).json(result)
                })
            })
    // user
    } else (
        db.connect(url,
            {useUnifiedTopology: true},
            (error, connection) => {
                if (error) return console.log(error)
                connection.db('app').collection('entries').find().toArray(function(err, result) {
                    if (!result) return res.status(404).send('Data not found')
                    return res.status(200).json(result)
                })
            })
    )
})
  
// catch 404
app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})

app.use((err, req, res, next) => res.status(err.status || 500).send(err.message || 'There was a problem'))

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`))