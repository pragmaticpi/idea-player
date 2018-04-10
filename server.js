const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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

// Index Route
app.get('/', (req, res) => {
  res.render('index');
});

// About Route
app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

app.post('/ideas', (req, res) => {
  console.log(req.body.title);

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
    res.send("OK");
  }
});
// Server start
app.listen(PORT, () => {
  console.log('Server started');
});