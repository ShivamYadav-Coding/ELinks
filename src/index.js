require('./config/db.config');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();

const staticPath = path.join(__dirname, './assets');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

const login = require('./routes/login');
const register = require('./routes/register');
const user = require('./routes/user');
const logout = require('./routes/logout');
const bookmark = require('./routes/bookmark');

app.use(express.json()); // works for postman but important for form also
app.use(cookieParser())
app.use(express.urlencoded({ extended: false })) // important for form
app.use(express.static(staticPath))

app.use(login);
app.use(register);
app.use(user);
app.use(logout);
app.use(bookmark);

app.get('*', (req, res) => {
    res.render('404');
})

const port = 3000||process.env.PORT;
app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`)
  })