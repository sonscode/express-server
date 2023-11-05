const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');


const auth = {
    auth: {
        api_key: '68fad3ae4973b807d634c0f4e9204352-8845d1b1-79cc679d',
        domain: 'sandbox38fbe769622b4cf9ae0e29e04c8c3977.mailgun.org'
    }
};

const transporter = nodemailer.createTransport(mailGun(auth));

//...LOW4
const sendMail = (name, email, phone, message, cb) => {
    const mailOptions = {
        from: email,
        to: 'ulrichsonna20@gmail.com',
        subject: name,
        tel: phone,
        text: message
    };

    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            cb(err, null);
        } else {
            cb(null, data);
        }
    });
}

module.exports = sendMail;
