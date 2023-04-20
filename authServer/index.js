import express from 'express'
import limitter from 'express-rate-limit'
import bodyParser from 'body-parser'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

import { validateUsernameLength, validateUsernameASCII, validatePassword, validateEmail } from './helpers.js'

// db
import { MongoClient } from 'mongodb'
MongoClient.connect(process.env.MONGODB_URI,
    {useUnifiedTopology: true},
    (error, connection) => {
        if (error) return console.log(error);
        global.db = connection.db('app');
        console.log('Database connected')
    }
)   

// e-mail
import nodemailer from 'nodemailer'
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,               // true for 465, false for other ports
    secure: true,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
        },
});
const email_html = code => (
`<!doctype html>
    <html lang="en">
      <head>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    
        <!-- Bootstrap CSS -->
        <!-- <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.0/css/bootstrap.min.css" integrity="sha384-PDle/QlgIONtM1aqA2Qemk5gPOE7wFq8+Em+G/hmo5Iq0CCmYZLv3fVRDJ4MMwEA" crossorigin="anonymous"> -->
    
    
        <title>Headed: Verifiation code</title>
      </head>
      <body>
        <div style="
            margin: auto;
            padding: 0"
        >
          <div style=
            "width:50%;
            margin: auto; 
            border: 1px solid #ccc;
            align-items: center;
            padding: 0;
            borer-radius: 5px"
            >
            <div style="background-color:#db2745; color:#fff; text-align:center;padding:2px">
              <h1 style="margin:0;">Headed</h1>
            </div>
            <div style="text-align:center; padding:15px">
              <h2 style="margin:0; font-weight:normal">Your verification code is:</h2>
              <h1 style="margin:10px">${code}</h1>
            </div>
          </div>
        </div>
      </body>
    </html>`
)
var recoverPasswordVerifications = []

// app and port
const app = express()
const port = process.env.PORT || 8000
app.use(bodyParser.json())

// rate limitter
app.use(limitter({
    windowMs: 5000,
    max: 5,
    keyGenerator: (req, res) => {
        return req.ip
    },
    message: 'Slow down! Too many requests, try again in a few seconds'
})) 

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
    db.collection('users').findOne({'username': username}, function(err, result) {
        // user exists
        if (!result) return res.status(403).send('Invalid credentials')
        // compare username
        if (!(result.username == username)) return res.status(403).send('Invalid credentials')
        // compare passwords
        bcrypt.compare(password, result.password, function(err, match) {
            if (!match) return res.status(403).send('Invalid credentials')

            // valid: log user
            const accessToken = generateAccessToken({username})

            return res.status(200).json({accessToken: accessToken})
        })

    })
})

app.post('/signup', (req, res) => {
    const {username, password} = req.body

    // verify if fields exist
    // if (!email) return res.status(400).send('Missing e-mail')
    if (!username) return res.status(400).send('Missing username')
    if (!password) return res.status(400).send('Missing password')
    
    // verify if fields are valid
    // if (!validateEmail(email)) return res.status(400).send('E-mail is invalid')
    if (!validateUsernameLength(username)) return res.status(400).send('Username has to be between 3 and 18 characters long')
    if (!validateUsernameASCII(username)) return res.status(400).send('Username characters are invalid')
    if (!validatePassword(password)) return res.status(400).send('Password has to be between 8 and 128 characters long')

    // other verifications
    db.collection('users').findOne({'username': username}, function(err, result) {
        if (result) {
            return res.status(403).send('Username already exists')
        } else {
            // add user (with hashed password)
            let saltRounds = 10
            bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(password, salt, function(error, hash) {
                    if (error) return console.log(error)
                    db.collection('users').insertOne({
                        'username': username,
                        'password': hash
                    })
                })
            })

            // log user
            const accessToken = generateAccessToken({username})
            
            return res.status(200).json({accessToken: accessToken})
        }
    })
})

app.post('/sendRecoverPasswordCode', (req, res) => {
    const { email, username } = req.body

    if (!email) return res.status(400).send('Missing e-mail')
    if (!username) return res.status(400).send('Missing username')

    if (!validateEmail(email)) return res.status(400).send('E-mail is invalid')
    if (!validateUsernameLength(username)) return res.status(400).send('Username has to be between 3 and 18 characters long')
    if (!validateUsernameASCII(username)) return res.status(400).send('Username characters are invalid')

    db.collection('users').findOne({'email': email, 'username': username}, function(error, result) {
        console.log(result)
        if (error) return res.sendStatus(404)
        if (result !== null) {
            // user found
            const code = (Math.floor(Math.random() * (999999 - 100000)) + 100000).toString()
            recoverPasswordVerifications.push({email: email, code: code})

            const mailOptions = {
                from: process.env.EMAIL_ADDRESS,  // sender address
                to: email,   // list of receivers
                subject: 'Headed Verification code: ' + code,
                // text: 'CODE: '+ code,
                html: email_html(code)
            }
            
            transporter.sendMail(mailOptions, function (error, info) {
                if(error) {
                    console.log(error)
                    return res.status(404).send('Could not send e-mail')
                }
                else {
                    return res.status(200).send('Confirmation e-mail sent!')
                }
            })
        } else {
            // e-mail and username do not match
            return res.status(404).send('Could not send e-mail')
        }
    })
})

app.post('/verifyRecoverPasswordCode', (req, res) => {
    const {email, code} =  req.body

    let isCode = false
    recoverPasswordVerifications.forEach(function(item) {
        if (item.email == email && item.code == code) {
            isCode = true
        }
    })
    
    if (isCode) {
        recoverPasswordVerifications = recoverPasswordVerifications.filter(item => item.email !== email)

        // generate token for the user to access the password reset method
        const user = {email}
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10m'})
        return res.json({ token })

    } else {
        return res.status(403).send('Not authorized')
    }
})

app.post('/resetPassword', (req, res) => {
    const { username, password } = req.body

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).send('Missing token')

    // validate password
    if (!password) return res.status(400).send('Missing password')
    if (!validatePassword(password)) return res.status(400).send('Password has to be between 8 and 128 characters long')

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).send('Invalid token')
        req.user = user

        // reset password
        let saltRounds = 10
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(password, salt, function(error, hash) {
                if (error) return console.log(error)
                // find user and update password
                db.collection('users').findOneAndUpdate({'email': req.user.email, 'username': username},
                    {$set: { password: hash }},
                    function(err, result) {
                        if (!result) return res.status(404).send('Could not update password')
                        return res.status(200).send('Password updated!')
                    }
                )
            })
        })
    })
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '72h'})
}

// catch 404
app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})

app.use((err, req, res, next) => res.status(err.status || 500).send(err.message || 'There was a problem'))

app.listen(port, () => console.log(`Listening at http://localhost:${port}`))
