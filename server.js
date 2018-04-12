const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();


// Use native promise library instead of mongoose mpromise library
mongoose.Promise = global.Promise;

// Connect to local mongodb
mongoose.connect('mongodb://localhost/ideaplayer-dev')
  .then(() => console.log('mongo connected'))
  .catch(err => Error(err));

// Load Idea Model
require('./models/Idea');
const ideaSchema = mongoose.model('ideas');

const PORT = process.env.PORT || 3000;

// Handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');

  next();
})
// Index Route
app.get('/', (req, res) => {
  res.render('index');
});

// About Route
app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/ideas', (req, res) => {
  ideaSchema.find({})
    .sort({date:'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas,
      });
    });
});

app.get('/ideas/edit/:id', (req, res) => {
  ideaSchema.findOne({
    _id: req.params.id,
  })
  .then(idea => {
    res.render('ideas/edit', {
      idea,
    });
  });
});

app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

app.post('/ideas', (req, res) => {

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

app.put('/ideas/:id', (req, res) => {
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

app.delete('/ideas/:id', (req, res) => {
  ideaSchema.deleteOne({
    _id: req.params.id,
  })
  .then(() => {
    req.flash('success_msg', 'Idea Removed');
    res.redirect('/ideas');
  })
})
// Server start
app.listen(PORT, () => {
  console.log('Server started');
});