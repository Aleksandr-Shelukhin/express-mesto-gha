const Card = require('../models/card');

const DefaultError = require('../errors/defaultError');
const NotFoundError = require('../errors/notFoundError');
const ValidationError = require('../errors/validationError');

const getCards = ((req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(404).send({ message: 'Карточка или пользователь не найден' }));
});

const createCard = ((req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(400).send({ message: 'Переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля' }));
});

const deleteCard = ((req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
});

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.id,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .then((card) => res.send({ data: card }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.id,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((card) => res.send({ data: card }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
