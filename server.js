const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;

app.engine('handlebars', exphbs({ defaultLayout: main }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.listen(PORT, () => {
  console.log('Server started');
});