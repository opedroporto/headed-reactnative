import Express from 'express'
import db from './db.js'
import bodyParser from 'body-parser'
import { validateEmail, validateUsernameLength, validateUsernameASCII, validatePassword } from './helpers.js'

const url = 'mongodb://localhost:27017'

const app = Express()
const PORT = process.env.PORT || 8000
app.use(bodyParser.json())

app.post('/fetchUserData', (req, res) => {
    const {username} = req.body

    if (!username) return res.status(400).send('Missing username')

    db.connect(url, 
        {useUnifiedTopology: true},
        (error, connection) => {
            if (error) return console.log(error)
            connection.db('app').collection('users').findOne({'username': username}, function(err, result) {
                if (!result) return res.status(404).send('User not found')
                return res.status(200).send(result)
            })
        })
})

app.post('/login', (req, res) => {
    const {username, password} = req.body

    // verify if fields exist
    if (!username) return res.status(400).send('Missing username')
    if (!password) return res.status(400).send('Missing password')

    // verify if fields are valid
    if (!validateUsernameLength(username)) return res.status(400).send('Username has to be between 3 and 18 characters long')
    if (!validateUsernameASCII(username)) return res.status(400).send('Username characters are invalid')
    if (!validatePassword(password)) return res.status(400).send('Password has to be between 8 and 128 characters long')

    db.connect(url, 
        {useUnifiedTopology: true},
        (error, connection) => {
            if (error) return console.log('Database error: ', error)
            connection.db('app').collection('users').findOne({'username': username}, function(err, result) {
                if (!result) return res.status(403).send('Invalid credentials')
                if (!(result.username == username && result.password == password))return res.status(403).send('Invalid credentials')
                console.log(`User ${username} logged in`)
                return res.status(200).send(result)
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
                    console.log(result)
                    if (result) {
                        return res.status(403).send('E-mail already exists')
                    } else {
                        // username must be unique
                        connection.db('app').collection('users').findOne({'username': username}, function(err, result) {
                            if (result) {
                                return res.status(403).send('Username already exists')
                            } else {
                                // add user
                                connection.db('app').collection('users').insertOne({
                                    'username': username,
                                    'password': password,
                                    'email': email
                                })
                                console.log('New user added: ', username)
                                return res.status(200).send('New user added')
                            }
                        })
                    }
                })
                
            })
})
  
// catch 404
app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})

app.use((err, req, res, next) => res.status(err.status || 500).send(err.message || 'There was a problem'))

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`))