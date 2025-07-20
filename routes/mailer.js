// routes/email.js
const express = require("express");
const router = express.Router();
const { sendOtpMail, verifyForgotOtp ,resetPassword} = require("../controllers/mailer");


router.get('/login/forget-password', (req, res) => {
    res.render('auth/verify-otp');
});

router.post("/login/send-otp", sendOtpMail);

router.post("/login/verify-otp", verifyForgotOtp);

router.get('/login/reset-password', (req, res) => {
     if (!req.session.verifiedOtp) {
        req.flash("error","Unauthorized");
        return  res.render('auth/signin');
    };
    res.render('auth/resetPassword');
});

router.post('/login/reset-password',resetPassword );

module.exports = router;
