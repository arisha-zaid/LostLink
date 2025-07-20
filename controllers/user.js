const User = require("../models/User");


module.exports.renderSignupForm = (req, res) => {
  res.render('auth/signup.ejs');
}

module.exports.signupUser = async(req, res, next) => {
  try {
    let {username, email, password, phone} = req.body;
     role = 'user';
    const newUser = new User({username, email, phone, role});
    const registeredUser = await User.register(newUser, password);
    
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash('success', 'Welcome to LostLink!');
      res.redirect('/items');
    });
  } catch(err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
}

module.exports.renderLoginForm = (req, res) => {
  res.render('auth/signin.ejs');
}

module.exports.loginUser = async(req, res) => {
     if (req.user.role === 'admin') {
       req.flash("success", "hello admin!");
      return res.redirect('/admin/dashboard');
      }
    req.flash("success", "Successfully logged in!");
    res.redirect(req.session.redirectUrl || "/items");
  }

module.exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Successfully Logged Out!");
    res.redirect('/items');
  });
}

module.exports.renderProfilePage = (req, res) => {
   console.log("Current User:", req.user); 
  res.render('auth/profile.ejs', { user: req.user });
}