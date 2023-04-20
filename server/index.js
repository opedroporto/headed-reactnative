import Express from 'express'
import limitter from 'express-rate-limit'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import mongo from 'mongodb'
import dateFormat from 'dateformat'

import { validateEmail } from './helpers.js'

// env
import dotenv from 'dotenv'
dotenv.config()

//db
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
var verifications = []

// app and port
const app = Express()
const port = process.env.PORT || 8000

// request size limit
app.use(bodyParser.json({limit: '5mb'}))

// rate limitter
app.use(limitter({
    windowMs: 1000,
    max: 10,
    keyGenerator: (req, res) => {
        return req.ip
    },
    message: 'Slow down! Too many requests, try again in a few seconds'
})) 

app.post('/addEmail', (req, res) => {
    const {email} = req.body

    if (!email) return res.status(400).send('Missing e-mail')
    if (!validateEmail(email)) return res.status(400).send('E-mail is invalid')

    const code = (Math.floor(Math.random() * (999999 - 100000)) + 100000).toString()
    verifications.push({email: email, code: code})

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
            return res.status(403).send('Error sending e-mail')
        }
        else {
            return res.status(200).send('Confirmation e-mail sent!')
        }
    })
})

app.post('/verifyCode', authenticateToken, (req, res) => {
    const {email, code} =  req.body

    let isCode = false
    verifications.forEach(function(item) {
        if (item.email == email && item.code == code) {
            isCode = true
        }
    })
    
    if (isCode) {
        verifications = verifications.filter(item => item.email !== email)

        // add user email
        db.collection('users').findOneAndUpdate({'username': req.user.username},
                        {$set: { email: req.body.email }},
                        function(err, result) {
                            if (!result) return res.status(404).send('Data not found')
                            return res.status(200).json('Verified!')
                        })
    } else {
        return res.status(403).send('Not authorized')
    }
})

app.post('/fetchUserData', authenticateToken, (req, res) => {
    db.collection('users').findOne({'username': req.user.username}, function(err, result) {
        if (!result) return res.status(404).send('User not found')
        return res.status(200).json(result)
    })
})

app.post('/fetchEntriesData', async (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    // guest
    if (!token) {
        db.collection('companies').aggregate([
            {$lookup: {from: 'ratings', localField: '_id', foreignField: 'company', as: 'ratings' }},
            {$project: {image: 1, name: 1, description: 1, ratings: {ecoRating: 1, productsServicesRating: 1, attendanceRating: 1} }}]
        )
        .toArray(function(err, result) {
            if (!result) return res.status(404).send('Data not found')
            return res.status(200).json(result)
        })
    // user
    } else {
        db.collection('companies').aggregate([
            {$lookup: {from: 'ratings', localField: '_id', foreignField: 'company', as: 'ratings' }},
            {$project: {image: 1, name: 1, description: 1, ratings: {ecoRating: 1, productsServicesRating: 1, attendanceRating: 1} }}]
        )
        .toArray(function(err, result) {
            if (!result) return res.status(404).send('Data not found')
            return res.status(200).json(result)
        })
    }
})

app.post('/fetchEntrieComments', (req, res) => {
    const {companyID} = req.body
    if (!companyID) return res.status(400).send('Missing company indentifier')

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            // guest
            db.collection('comments').aggregate([
                {$match: {'company': new mongo.ObjectId(companyID)}},
                {$lookup: {from: 'users', localField: 'user', foreignField: '_id', as: 'user'}},
                {$project: {messageContent: 1, time: 1, user: 1, user: {username: 'User'}}}])
                .toArray(function(err, result) {
                    if (!result) return res.status(404).send('No comments')
                    return res.status(200).json(result)
                })
        } else {
            // user
            db.collection('comments').aggregate([
                {$match: {'company': new mongo.ObjectId(companyID)}},
                {$lookup: {from: 'users', localField: 'user', foreignField: '_id', as: 'user'}},
                {$project: {messageContent: 1, time: 1, user: 1, user: {username: 1}}}])
                .toArray(function(err, result) {
                    if (!result) return res.status(404).send('No comments')
                    return res.status(200).json(result)
                })
        }
    })
})

app.post('/addComment', authenticateToken, (req, res) => {
    const { newComment, companyID } = req.body
    
    // verify if fields exist
    if (!newComment) return res.status(400).send('Missing comment')
    if (!companyID) return res.status(400).send('Missing company indentifier')

    const currentTime = dateFormat(new Date(), "mm/dd/yy h:MM:ss").toString()

    db.collection('users').findOne({'username': req.user.username}, function(error, result) {
        if (error) return res.sendStatus(404)
        db.collection('comments').insertOne({
                'user': new mongo.ObjectId(result._id),
                'messageContent': newComment,
                'time': currentTime,
                'company': new mongo.ObjectId(companyID),
            }, function(error, result) {
                if (error) return res.sendStatus(404)
                return res.sendStatus(204)
        })
    })
})

app.post('/updateCompanyRatings', authenticateToken, (req, res) => {
    const { companyID, ratings } = req.body

    // verify if fields exist
    if (!ratings) return res.status(400).send('Missing ratings')
    if (!companyID) return res.status(400).send('Missing company indentifier')

    db.collection('users').findOne({'username': req.user.username}, function(error, result) {
        if (error) return res.sendStatus(404)
        const user_id = result._id
        
        // find ratings from this user
        db.collection('ratings').findOne({'user': new mongo.ObjectId(user_id), 'company': new mongo.ObjectId(companyID)}, function(error, result) {
            if (error) return res.sendStatus(404)

            // update existing rating
            if (result !== null) {
                db.collection('ratings').findOneAndUpdate(
                    {"user": new mongo.ObjectId(user_id), "company" : new mongo.ObjectId(companyID)},
                    {$set: {
                        "ecoRating": ratings.rating1,
                        "productsServicesRating": ratings.rating2,
                        "attendanceRating": ratings.rating3
                    }}, function(err, result) {
                        if (error) return res.sendStatus(404)
                        return res.sendStatus(204)
                    })
            // insert new rating
            } else {
                db.collection('ratings').insertOne({
                    "user" : new mongo.ObjectId(user_id),
                    "ecoRating": ratings.rating1,
                    "productsServicesRating": ratings.rating2,
                    "attendanceRating": ratings.rating3,
                    "company" : new mongo.ObjectId(companyID)
                }, function(error, result) {
                    if (error) return res.sendStatus(404)
                    return res.sendStatus(204)
                })
            }
        })
    })
})

app.post('/fetchUserRatings', authenticateToken, (req, res) => {
    const { companyID } = req.body

    // verify if fields exist
    if (!companyID) return res.status(400).send('Missing company indentifier')

    db.collection('users').findOne({'username': req.user.username}, function(error, result) {
        if (error) return res.sendStatus(404)
        // find user ratings
        db.collection('ratings').findOne({
                "user" : new mongo.ObjectId(result._id),
                "company": new mongo.ObjectId(companyID)
            }, function(error, result) {
                if (error) return res.status(404).send('User Ratings not found')
                try {
                    return res.status(200).send({ecoRating: result.ecoRating, productsServicesRating: result.productsServicesRating, attendanceRating: result.attendanceRating})
                } catch (error) {
                    return res.sendStatus(404)
                }
            }
        )
    })
})

app.post('/addCompany', authenticateToken, (req, res) => {
    const { company } = req.body

    // verify if fields exist
    if (!company.image) return res.status(400).send('Missing company image')
    if (!company.name) return res.status(400).send('Missing company name')
    if (!company.description) return res.status(400).send('Missing company description')

    // add company
    db.collection('companies').insertOne({
            'creator': req.user.username,
            'image': company.image,
            'name': company.name,
            'description': company.description
        }, function(error, result) {
            if (error) return res.status(404).send('Company failed to add')
            return res.status(200).send('Company added')
    })
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

/*
app.put('/editProfile', authenticateToken, (req, res) => {
    return res.status(503).send('Service not available')
    // const {username} = req.body

    // // verify if field exists
    // if (!username) return res.status(400).send('Missing username')

    // // verify if fields are valid
    // if (!validateUsernameLength(username)) return res.status(400).send('Username has to be between 3 and 18 characters long')
    // if (!validateUsernameASCII(username)) return res.status(400).send('Username characters are invalid')

    // db.connect(url,
    //     {useUnifiedTopology: true},
    //     (error, connection) => {
    //         if (error) return console.log(error)

    //         //find user and update username
    //         connection.db('app').collection('users').findOneAndUpdate({'username': req.user.username},
    //             {$set: { username: username }},
    //             function(err, result) {
    //                 if (!result) return res.status(404).send('Data not found')
    //                 return res.status(200).json(result)
    //             })
    //     })
})
*/

// catch 404
app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})

app.use((err, req, res, next) => res.status(err.status || 500).send(err.message || 'There was a problem'))

app.listen(port, () => console.log(`Listening at http://localhost:${port}`))	
