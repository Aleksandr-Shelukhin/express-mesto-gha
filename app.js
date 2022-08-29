// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const errorCodes = require('./errors/errorsCode');

const { login, createUser } = require('./controllers/users');
const { signupValidate, signinValidate } = require('./middlewares/validations');
const auth = require('./middlewares/auth');
const error = require('./middlewares/error');

const { PORT = 3000 } = process.env;
const app = express();

app.use(cookieParser());
app.use(express.json());

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

// middleware
app.post('/signup', signupValidate, createUser);
app.post('/signin', signinValidate, login);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(errorCodes.NotFoundError).send({ message: 'Запрашиваеме данные не найдены' });
});

app.use(errors());
app.use(error);

app.listen(PORT, () => {
  console.log(`Запущено через порт ${PORT}`);
});
