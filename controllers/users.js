const User = require('../models/user');

const NotFoundError = require('../errors/notFoundError');
const errorCodes = require('../errors/errorsCode');

const getUsers = ((req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(errorCodes.DefaultError).send({ message: 'Произошла ошибка' }));
});

const getUserById = ((req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Введенеы неверные данные');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        res.status(errorCodes.NotFoundError).send({ message: 'Запрашиваеме данные не найдены' });
      } else if (err.name === 'CastError') {
        res.status(errorCodes.ValidationError).send({ message: 'Пользователя с таким id не существует' });
      } else {
        res.status(errorCodes.DefaultError).send({ message: 'Произошла ошибка' });
      }
    });
});

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errorCodes.ValidationError).send({ message: 'Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля' });
      } else {
        res.status(errorCodes.DefaultError).send({ message: 'Произошла ошибка' });
      }
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  if (!name || !about) {
    res.status(errorCodes.ValidationError).send({ message: 'Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля' });
  }

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Введенеы неверные данные пользователя');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        res.status(errorCodes.NotFoundError).send({ message: 'Запрашиваеме данные не найдены' });
      } else if (err.name === 'ValidationError') {
        res.status(errorCodes.ValidationError).send({ message: 'Введенеы неверные данные пользователя' });
      } else {
        res.status(errorCodes.DefaultError).send({ message: 'Произошла ошибка' });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Введенеы неверные данные пользователя');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        res.status(errorCodes.NotFoundError).send({ message: 'Запрашиваеме данные не найдены' });
      } else if (err.name === 'ValidationError') {
        res.status(errorCodes.ValidationError).send({ message: 'Введенеы неверные данные пользователя' });
      } else {
        res.status(errorCodes.DefaultError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports = {
  createUser, getUsers, getUserById, updateUserInfo, updateUserAvatar,
};
