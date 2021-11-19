import Express from 'express'
import db from './db.js'
import bodyParser from 'body-parser'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mongo from 'mongodb'

import { validateEmail, validateUsernameLength, validateUsernameASCII, validatePassword } from './helpers.js'

import dotenv from 'dotenv'
dotenv.config()

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

const url = 'mongodb://localhost:27017'

const app = Express()
const PORT = process.env.PORT || 8080
app.use(bodyParser.json())

app.post('/addEmail', (req, res) => {
    const {email} = req.body

    if (!email) return res.status(400).send('Missing e-mail')
    if (!validateEmail(email)) return res.status(400).send('E-mail is invalid')

    db.connect(url,
        {useUnifiedTopology: true},
        (error, connection) => {
            if (error) return console.log(error)
            // email must be unique
            connection.db('app').collection('users').findOne({'email': email}, function(err, result) {
                if (result) {
                    return res.status(403).send('E-mail already exists')
                } else {
                    // sent confirmation e-mail
                    
                    const mailOptions = {
                        from: process.env.EMAIL_ADDRESSs,  // sender address
                        to: email,   // list of receivers
                        subject: 'Here is you verification code, bro',
                        text: 'CODE',
                        // html: `<b>Hey there! </b>
                        //         <br> This is our first message sent with Nodemailer<br/>`,
                    }
                    
                    transporter.sendMail(mailOptions, function (error, info) {
                        if(error) {
                            console.log(error)
                            return res.status(403).send('Error sending e-mail')
                        }
                        else {
                            console.log(info)
                            return res.status(200).send('Confirmation e-mail sent!')
                        }
                    });

                }
            })
        })
})

app.post('/addUser', (req, res) => {
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
    db.connect(url,
            {useUnifiedTopology: true},
            (error, connection) => {
                if (error) return console.log(error)
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
                                    'password': hash
                                })
                            })
                        })
                        return res.status(200).send('New user added')
                    }
                })
            }
    )
})

app.post('/fetchUserData', authenticateToken, (req, res) => {
    db.connect(url, 
        {useUnifiedTopology: true},
        (error, connection) => {
            if (error) return console.log(error)
            connection.db('app').collection('users').findOne({'username': req.user.username}, function(err, result) {
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
    } else {
        db.connect(url,
            {useUnifiedTopology: true},
            (error, connection) => {
                if (error) return console.log(error)
                connection.db('app').collection('entries').find().toArray(function(err, result) {
                    if (!result) return res.status(404).send('Data not found')
                    return res.status(200).json(result)
                })
            })
    }
})

app.post('/fetchEntrieComments', (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            // guest
            db.connect(url,
                {useUnifiedTopology: true},
                (error, connection) => {
                    if (error) return console.log(error)
                    connection.db('app').collection('comments').aggregate([
                        {$match: {'company': new mongo.ObjectId(companyID)}},
                        {$lookup: {from: 'users', localField: 'user', foreignField: '_id', as: 'user'}},
                        {$project: {messageContent: 1, user: 1, user: {username: 'User'}}}])
                        .toArray(function(err, result) {
                            if (!result) return res.status(404).send('No comments')
                            return res.status(200).json(result)
                        })
                }
            )
        } else {
            // user
            db.connect(url,
                {useUnifiedTopology: true},
                (error, connection) => {
                    if (error) return console.log(error)
                    connection.db('app').collection('comments').aggregate([
                        {$match: {'company': new mongo.ObjectId(companyID)}},
                        {$lookup: {from: 'users', localField: 'user', foreignField: '_id', as: 'user'}},
                        {$project: {messageContent: 1, user: 1, user: {username: 1}}}])
                        .toArray(function(err, result) {
                            if (!result) return res.status(404).send('No comments')
                            return res.status(200).json(result)
                        })
                    
                }
            )
        }
    })
    
    const companyID = req.body.companyID
    if (!companyID) return res.status(400).send('Missing company indentifier')
})

app.put('/editProfile', authenticateToken, (req, res) => {
    const {email} = req.body

    // verify if field exists
    if (!email) return res.status(400).send('Missing e-mail')
    
    // verify if field is valid
    if (!validateEmail(email)) return res.status(400).send('E-mail is invalid')

    db.connect(url,
        {useUnifiedTopology: true},
        (error, connection) => {
            if (error) return console.log(error)

            //find user and update EMAIL
            connection.db('app').collection('users').findOneAndUpdate({'username': req.user.username},
                {$set: { email: req.body.email }},
                function(err, result) {
                    if (!result) return res.status(404).send('Data not found')
                    return res.status(200).json(result)
                })
        })
})

app.post('/addComment', authenticateToken, (req, res) => {

    const { newComment, companyID } = req.body

    // verify if fields exist
    if (!newComment) return res.status(400).send('Missing comment')
    if (!companyID) return res.status(400).send('Missing company indentifier')

    db.connect(url,
        {useUnifiedTopology: true},
        (error, connection) => {
            if (error) return console.log(error)
            connection.db('app').collection('users').findOne({'username': req.user.username}, function(error, result) {
                if (error) return res.sendStatus(404)
                db.connect(url,
                    {useUnifiedTopology: true},
                    (error, connection) => {
                        if (error) return console.log(error)
                        connection.db('app').collection('comments').insertOne({
                            'user': new mongo.ObjectId(result._id),
                            'messageContent': newComment,
                            'company': new mongo.ObjectId(companyID),
                        }, function(error, result) {
                            if (error) return res.sendStatus(404)
                            return res.sendStatus(204)
                        })
                    }
                )
            })
        }
    )
})

// catch 404
app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})

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

app.use((err, req, res, next) => res.status(err.status || 500).send(err.message || 'There was a problem'))

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`))