const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');

// Load Idea Model
require('../models/Idea');
const ideaSchema = mongoose.model('ideas');

router.get('/', ensureAuthenticated, (req, res) => {
  ideaSchema.find({ user: req.user.id, })
    .sort({ date: 'desc' })
    .then(ideas => {
      res.render('ideas/index', {
        ideas,
      });
    });
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  ideaSchema.findOne({
    _id: req.params.id,
  })
    .then(idea => {
      if (idea.user != req.user.id) {
        req.flash('error_msg', 'Not Authorized');
        res.redirect('/ideas');
      } else {
        res.render('ideas/edit', {
          idea,
        });
      }
    });
});

router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add');
});

router.post('/', ensureAuthenticated, (req, res) => {

  // Manual server-side validation
  let errors = [];

  if (!req.body.title) {
    errors.push({ text: 'Please add a title' });
  }
  if (!req.body.details) {
    errors.push({ text: 'Please add some details' });
  }

  if (errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details,
    });
  } else {
    const newIdea = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id,
    };

    new ideaSchema(newIdea)
      .save()
      .then(idea => {
        req.flash('success_msg', 'Idea Added');
        res.redirect('/ideas');
      });
  }
});

router.put('/:id', ensureAuthenticated, (req, res) => {
  ideaSchema.findOne({
    _id: req.params.id,
  })
    .then(idea => {
      idea.title = req.body.title;
      idea.details = req.body.details;

      idea.save()
        .then(idea => {
          req.flash('success_msg', 'Idea Updated');
          res.redirect('/ideas');
        });
    });
});

router.delete('/:id', ensureAuthenticated, (req, res) => {
  ideaSchema.deleteOne({
    _id: req.params.id,
  })
    .then(() => {
      req.flash('success_msg', 'Idea Removed');
      res.redirect('/ideas');
    });
});

module.exports = router;