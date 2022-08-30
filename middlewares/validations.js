const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const ValidationError = require('../errors/ValidationError');

const checkUrl = (url) => {
  const result = validator.isURL(url);
  if (result) {
    return url;
  }
  throw new ValidationError('Веден некорректный URL');
};

const createCardValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(checkUrl),
  }),
});

const signupValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(checkUrl),
  }),
});

const signinValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const userInfoValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const userIdValidate = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
});

const cardIdValidate = celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().hex().length(24),
  }),
});

const avatarUrlValidate = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(checkUrl),
  }),
});

module.exports = {
  createCardValidate,
  signupValidate,
  signinValidate,
  userInfoValidate,
  userIdValidate,
  cardIdValidate,
  avatarUrlValidate,
};
