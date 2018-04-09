const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.listen(PORT, () => {
  console.log('Server started');
});