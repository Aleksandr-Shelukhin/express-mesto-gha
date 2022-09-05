// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const NotFoundError = require('./errors/NotFoundError');

const { login, createUser } = require('./controllers/users');
const { signupValidate, signinValidate } = require('./middlewares/validations');
const auth = require('./middlewares/auth');
const error = require('./middlewares/error');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

app.use(cookieParser());
app.use(express.json());

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

// middleware
app.use(requestLogger); // подключаем логгер запросов

app.post('/signup', signupValidate, createUser);
app.post('/signin', signinValidate, login);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(errorLogger); // подключаем логгер ошибок

app.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваеме данные не найдены'));
});

app.use(errors());
app.use(error);

app.listen(PORT, () => {
  console.log(`Запущено через порт ${PORT}`);
});
