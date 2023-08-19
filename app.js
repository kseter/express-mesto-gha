const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes');
const auth = require('./middlewares/auth');
const {
  login, createUser,
} = require('./controllers/users');
const NotFoundError = require('./errors/not-found-error');
const {
  validateSignUp, validateSignIn,
} = require('./utils/validation');

const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('connected to db');
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', validateSignUp, createUser);
app.post('/signin', validateSignIn, login);

app.use(auth);

app.use(router);

app.use(errors());

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;
  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT, () => {
  console.log(`App has started on port ${PORT}...`);
});
