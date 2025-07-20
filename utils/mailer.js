// require("dotenv").config();
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const nodemailer = require('nodemailer');


module.exports.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})