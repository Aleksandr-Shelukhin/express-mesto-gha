const Card = require('../models/card');

const NotFoundError = require('../errors/notFoundError');
const errorCodes = require('../errors/errorsCode');

const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(errorCodes.NotFoundError).send({ message: 'Карточка или пользователь не найден' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errorCodes.ValidationError).send({ message: 'Переданы некорректные данные для создания карточки' });
      } else {
        res.status(errorCodes.DefaultError).send({ message: 'Произошла ошибка' });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточки с таким id не существует');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        res.status(errorCodes.NotFoundError).send({ message: 'Запрашиваеме данные не найдены' });
      } else if (err.name === 'CastError') {
        res.status(errorCodes.ValidationError).send({ message: 'Переданы некорректные данные для удаления карточки' });
      } else {
        res.status(errorCodes.DefaultError).send({ message: 'Произошла ошибка' });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточки с таким id не существует');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        res.status(errorCodes.NotFoundError).send({ message: 'Запрашиваеме данные не найдены' });
      } else if (err.name === 'CastError') {
        res.status(errorCodes.ValidationError).send({ message: 'Переданы некорректные данные для удаления лайка' });
      } else {
        res.status(errorCodes.DefaultError).send({ message: 'Произошла ошибка' });
      }
    });
};

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.id,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Карточки с таким id не существует');
    }
    res.send({ data: card });
  })
  .catch((err) => {
    if (err instanceof NotFoundError) {
      res.status(errorCodes.NotFoundError).send({ message: 'Запрашиваеме данные не найдены' });
    } else if (err.name === 'CastError') {
      res.status(errorCodes.ValidationError).send({ message: 'Переданы некорректные данные для удаления лайка' });
    } else {
      res.status(errorCodes.DefaultError).send({ message: 'Произошла ошибка' });
    }
  });

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
