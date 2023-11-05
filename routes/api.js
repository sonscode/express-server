const express = require('express')
const router = express.Router()
const Teacher = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const db = "mongodb+srv://Darksun:007darkpass@cluster0.i4ritoc.mongodb.net/?retryWrites=true&w=majority"

mongoose.set('strictQuery', false);
mongoose.connect(db, err => {
    if (err) {
        console.error('Error!' + err)
    }
    else {
        console.log('Connected to mongodb')
    }
})

router.get('/', (req, res) => {
    res.send("From api route")
})

router.get('/register', (req, res) => {
    res.send("From api register")
})

router.get('/login', (req, res) => {
    res.send("From api login: ")
// db.getUsers({showCredentials: true, filter: {mechanisms: "SCRAM-SHA-256"}})

})

// db.getUsers({showCredentials: true, filter: {mechanisms: "SCRAM-SHA-256"}})

router.post('/register', (req, res, next) => {
    let userData = req.body
    var name = req.body.name
    var email = req.body.email
    var password = req.body.password
    let teacher = new Teacher(userData)
    try {
        Teacher.findOne({ email: userData.email }, (_error, _teacher) => {
            if (_error) {
                console.log(_error)
            } else {
                if (_teacher) {
                    // res.send("This email already exists");
                    console.log("This email already exists");
                    
                } else {

                    const salt = bcrypt.genSaltSync(12)
                    const hash = bcrypt.hashSync(userData.password, salt)
                    teacher.save((error, registeredUser={name, email, hash}) => {
                        if (error) {
                            console.log(error)
                        } else {
                            let payload = { subject: registeredUser._id }
                            let token = jwt.sign(payload, process.env.secretKey)
                            res.status(200).send({ token })
                            console.log("Successfully added");
                            console.log("Password encryption:     " + hash)
                        }
                    })
                }
            }
        })
    }
    catch (error) {
        console.log(error)
    }


})

router.post('/login', (req, res) => {
    let userData = req.body
    try {
        Teacher.findOne({ email: userData.email }, (error, teacher) => {
            if (error) {
                console.log(error)
            } else {
                if (!teacher) {
                    res.status(401).send('Invalid email')
                } else
                    if (teacher.password !== userData.password) {
                        res.status(401).send('Invalid password')
                    } else {
                        let payload = { subject: teacher._id }
                        let token = jwt.sign(payload, process.env.secretKey)
                        res.status(200).send({ token })
                    }
            }
        })
    }
    catch (error) {
        console.log(error);
    }
})

router.post('/googleLogin', (req, res) => {
    console.log(req.body);
    res.redirect('https://akapp.onrender.com/reports')
});

/* router.post('/connection', (req, res) => {
    Teacher.findOne((error, teacher) => {
        if (error) {
            console.log(error)
        } else {
            return teacher.password;
        }
        return teacher.password;

    })
})
*/

function verifyToken(req, res, next) {
    try {
        let auth = req.headers.authorization
        let token = auth.split(' ')[1]
        if (token === 'null') {
            return res.status(401).json("Unauthorized access")
        }
        else if (!auth) {
            return res.status(401).json("Unauthorized access")

        }
        else {
            jwt.verify(token, process.env.secretKey, (error, teacher) => {
                if (error) {
                    return res.status(401).json("Not a valid token!")
                }
                else {

                    req.mksdetails = teacher
                    next()
                }
            })
        }
    }
    catch (error) {
        console.log(error);
    }
}

/*
function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send("Unauthorized request")
    }
    let token = req.headers.authorization.split(' ')[1]
    if (token === 'null') {
        return res.status(401).send("Unauthorized request")
    }
    let payload = jwt.verify(token, process.env.secretKey)
    if (!payload) {
        return res.status(401).send("Unauthorized request")
    }
    // return res.status(200).send("Authorization granted")
    req.mksdetails._id = payload.subject
    next()
} */


router.get('/home', (req, res) => {
    let events = [
        {
            "_id": "1",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date": "2022-13-23T18:25:43.5112"
        }
    ]
    res.json(events)

})

router.get('/marks', verifyToken, (req, res) => {
    try {
        let mksdetails = [
            {
                "_id": "1",
                "name": "Auto Expo",
                "description": "lorem ipsum",
                "date": "2022-13-23T18:25:43.5112"
            }
        ]
        res.json(mksdetails)
    }
    catch (error) {
        console.log(error);
    }
})



module.exports = router



