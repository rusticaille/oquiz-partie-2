
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 5050;

const express = require('express');

const app = express();

app.set('views', 'app/views');
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(express.urlencoded({extended: true}));

const session = require('express-session');
app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: 'Un Super Secret',
  cookie: { maxAge: 60000 }
}));

const userMiddleware = require('./app/middlewares/user');
app.use(userMiddleware);


const router = require('./app/router');
app.use(router);


app.listen( PORT,  () => {
  console.log(`Listening on ${PORT}`);
});