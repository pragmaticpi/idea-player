const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

require('../models/User');
const User = mongoose.model('users');

module.exports = (passport) => {
  passport.use(new LocalStrategy({
    // because we are using email as username field
    usernameField: 'userEmail',
    passwordField: 'userPassword',

  }, (username, password, done) => {   // done function will be called after authentication
    console.log(password);
    
    User.findOne({
      email: username,
    })
      .then(user => {
      if(!user) {
        return done(null, false, { message: 'User Not Found' });
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if(isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Password not matched'});
        }
      });
    });

    
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}