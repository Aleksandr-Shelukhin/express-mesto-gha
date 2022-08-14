const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const errorCodes = require('./errors/errorsCode');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

// middleware
app.use((req, res, next) => {
  req.user = {
    _id: '62f2b5ce70583ab29f9731a3',
  };
  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(errorCodes.NotFoundError).send({ message: 'Запрашиваеме данные не найдены' });
});

app.listen(PORT, () => {
  console.log(`Запущено через порт ${PORT}`);
});
