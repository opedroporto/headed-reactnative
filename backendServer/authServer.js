import Express from 'express'
import db from './db.js'
import bodyParser from 'body-parser'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

import { validateUsernameLength, validateUsernameASCII, validatePassword } from './helpers.js'

const url = 'mongodb://localhost:27017'

const app = Express()
const PORT = process.env.PORT2 || 8000
app.use(bodyParser.json())

let refreshTokens = []

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
                    const accessToken = generateAccessToken({username})

                    console.log(`User ${username} logged in`)
                    return res.status(200).json({accessToken: accessToken})
                })

            })
        })
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '12h'})
}

// catch 404
app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})

app.use((err, req, res, next) => res.status(err.status || 500).send(err.message || 'There was a problem'))

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`))