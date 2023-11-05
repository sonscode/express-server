require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sendMail = require('./mail');
// const PORT = 8080
const api = require('./routes/api')
const app = express();

const log = console.log;

app.use(bodyParser.json())
app.use(cors());
app.use(bodyParser.json());
app.use('/api', api)
const PORT = process.env.PORT

//parsing data
app.use(express.urlencoded({
    extended: false
}));

app.use(express.json());

app.get('/', function (req, res) {
    res.send('Hi, it works');
})

app.get('/register', function (req, res) {
    res.send('From register');
})

app.get('/login', function (req, res) {
    res.send('From login');
})
//..
app.listen(PORT, function() {
    log("Backend server listening at http://localhost:" + PORT);  
})



//Mail function manager...
//..receiving data
app.post('/enroll', (req, res) => {
    const { name, email, phone, message } = req.body;
    log('Data', req.body);

    sendMail(name, email, phone, message, function (err, data) {
        if (err) {
            res.status(500).json({message: 'Internal error'});
        } else{
            res.status(200).json({message: 'Message sent !!'});
        }
    });
    // res.json({message: "Data received"});
});

//data for marks




// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Conrol-Allow-Headers", "Origin, X-requetsed-width, content-Type, Accept");
//     next();
// });

app.post

