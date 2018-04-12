const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const router = express.Router();

require('../models/User');
const User = mongoose.model('users');
// User Login Route

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.get('/register', (req, res) => {
  res.render('users/register');
});

// Register Form Post
router.post('/register', (req, res) => {
  let errors = [];
  console.log(req.body);
  if(req.body.password !== req.body.password2) {
    errors.push({ text: 'Password do not match' });
  }

  if(req.body.password.length < 4) {
    errors.push({ text: 'Password must be atleast 4 characters'});
  }

  if(errors.length > 0) {
    res.render('users/register', {
      errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2,
    })
  } else {
    User.findOne({
      email: req.body.email,
    })
    .then(user => {
      if(user) {
        req.flash('error_msg', 'Email already exists');
        res.redirect('/users/register');
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        });
    
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(newUser => {
                req.flash('success_msg', 'Success');
                res.redirect('/users/register');
              })
              .catch(err => {
                req.flash('error_msg', 'Not Success');
                return;
              });
          });
        });
      }
    })
  }
});

// Login Post

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true,
  })(req, res, next);
});

module.exports = router;