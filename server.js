const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

const ideaRoutes = require('./routes/ideas');
const userRoutes = require('./routes/users');

require('./middlewares/passport')(passport);
// Use native promise library instead of mongoose mpromise library
mongoose.Promise = global.Promise;

// Connect to local mongodb
mongoose.connect('mongodb://localhost/ideaplayer-dev')
  .then(() => console.log('mongo connected'))
  .catch(err => Error(err));


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

app.use('/ideas', ideaRoutes);
app.use('/users', userRoutes);

// Server start
app.listen(PORT, () => {
  console.log('Server started');
});