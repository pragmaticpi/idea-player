const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Load Idea Model
require('../models/Idea');
const ideaSchema = mongoose.model('ideas');

router.get('/', (req, res) => {
  ideaSchema.find({})
    .sort({date:'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas,
      });
    });
});

router.get('/edit/:id', (req, res) => {
  ideaSchema.findOne({
    _id: req.params.id,
  })
  .then(idea => {
    res.render('ideas/edit', {
      idea,
    });
  });
});

router.get('/add', (req, res) => {
  res.render('ideas/add');
});

router.post('/', (req, res) => {

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
    };

    new ideaSchema(newIdea)
      .save()
      .then(idea => {
        req.flash('success_msg', 'Idea Added');
        res.redirect('/ideas');
      });
  }
});

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
  ideaSchema.deleteOne({
    _id: req.params.id,
  })
  .then(() => {
    req.flash('success_msg', 'Idea Removed');
    res.redirect('/ideas');
  });
});

module.exports = router;