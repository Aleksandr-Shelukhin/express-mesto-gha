const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле "name" должно быть заполнено'],
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: [true, 'Поле "about" должно быть заполнено'],
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: [true, 'Поле "avatar" должно быть заполнено'],
    validate: [validator.isURL, 'Неверная ссылка аватара'],
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    validate: [validator.isEmail, 'Неверный email'],
    unique: true,
    required: [true, 'Не указан email'],
  },
  password: {
    type: String,
    select: false,
    required: [true, 'Не указан пароль'],
  },
});

module.exports = mongoose.model('user', userSchema);
