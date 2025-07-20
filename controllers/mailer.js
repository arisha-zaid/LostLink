const {transporter}  = require('../utils/mailer');
const User = require("../models/User");

module.exports.sendOtpMail =async (req, res) =>{
    try{
        
        const {email}=req.body;

        // Check if user exists
        let user= await User.findOne({email});
        if(!user){
            req.flash('error', 'User not found');
            return res.redirect('/login/forget-password');
        } 
        //  Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

       //  Store in session
       req.session.otp = otp;
       req.session.otpEmail = email;
       req.session.otpGeneratedAt = Date.now();  //expiry 
 
         await transporter.sendMail({
             from:`"LostLink OTP" <${process.env.EMAIL_USER}>`,
             to:email,
             subject: "Test OTP Email",
             html:`<h1>OTP is : ${otp}</h1><p>Valid for 5 minutes.</p>`
         });
         req.flash('success', 'Otp send to your mail');
          return res.redirect('/login/forget-password');
    }
    catch(err){
         console.error("Email error:", err);
          res.status(500).send(" Email failed");
    }
}

module.exports.verifyForgotOtp = async(req,res)=>{
  const enteredOtp = req.body.otp;
  const sessionOtp = req.session.otp;
  const email = req.session.otpEmail;
  const generatedAt = req.session.otpGeneratedAt;

  const isExpired = Date.now() - generatedAt > 5 * 60 * 1000;

   if (!sessionOtp || !email) {
     req.flash('error', ' No OTP session found.');
      return res.redirect('/login/forget-password');
   }
  if (isExpired){
     req.flash('error', ' OTP expired. Request again.');
      return res.redirect('/login/forget-password');
  }
  if (enteredOtp != sessionOtp) {
    req.flash('error', ' Incorrect OTP.');
    return res.redirect('/login/forget-password');
    };

  // OTP is valid
  req.session.verifiedOtp = true;
  res.redirect("/login/reset-password");
}

module.exports.resetPassword = async (req, res) => {
  const newPassword = req.body.password;
  const email = req.session.otpEmail;

  if (!req.session.verifiedOtp || !email) {
     req.flash('error', ' Unauthorized access');
      return res.redirect('/login');
  }

  const user = await User.findOne({ email });
  if (!user) {
     req.flash('error', ' User not found');
      return res.redirect('/login');
  }

  user.setPassword(newPassword, async (err) => {
    if (err) {
      console.error("Password reset error:", err);
      req.flash('error', 'Failed to reset password');
      return res.redirect('/login');
    }

    await user.save();

    // Clear OTP-related session
    req.session.otp = null;
    req.session.otpEmail = null;
    req.session.otpGeneratedAt = null;
    req.session.verifiedOtp = null;

    req.flash('success', ' Password reset successful! You can now log in.');
    res.redirect("/login"); // or wherever your login route is
  });
};


