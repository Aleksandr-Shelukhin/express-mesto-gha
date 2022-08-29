const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const errorCodes = require('../errors/errorsCode');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');

const login = (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);
  return User.findUserByCredentials(email, password)
    .then((user) => {
      console.log(user);
      const { JWT_SECRET } = process.env;
      const jwtToken = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      res.cookie('jwt', jwtToken, {
        httpOnly: true,
        sameSite: true,
      });
      res.send({ token: jwtToken });
    })
    .catch(next);
};

const getUsers = ((req, res, next) => {
  User.find({}, { password: 0 })
    .then((users) => res.send({ data: users }))
    .catch(next);
});

const getUserById = ((req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Введенеы неверные данные');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        next(new NotFoundError('Запрашиваеме данные не найдены'));
      } else if (err.name === 'CastError') {
        next(new ValidationError('Пользователя с таким id не существует'));
      } else {
        next(err);
      }
    })
    .catch(next);
});

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw next(new NotFoundError('Запрашиваеме данные не найдены'));
      }
      res.status(200).send(user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({
      data: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля'));
      }
      if (err.code === 11000) {
        next(new ConflictError('Такой email уже существует'));
        return;
      }
      next(err);
    });
};

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Введенеы неверные данные пользователя');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.statusCode === errorCodes.NotFoundError) {
        next(new NotFoundError('Запрашиваеме данные не найдены'));
      } else if (err.statusCode === ValidationError || err.name === 'CastError') {
        next(new ValidationError('Введенеы неверные данные пользователя'));
      } else {
        next(err);
      }
    });
};

const updateUserAvatar = (req, res, next) => {
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
        next(new NotFoundError('Запрашиваеме данные не найдены'));
      } else if (err.name === 'ValidationError') {
        next(new ValidationError('Введенеы неверные данные пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  login,
  createUser,
  getUsers,
  getUserById,
  getCurrentUser,
  updateUserInfo,
  updateUserAvatar,
};
