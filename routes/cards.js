const router = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const { createCardValidate, cardIdValidate } = require('../middlewares/validations');

router.get('/', getCards);
router.post('/', createCardValidate, createCard);
router.delete('/:id', cardIdValidate, deleteCard);
router.put('/:id/likes', cardIdValidate, likeCard);
router.delete('/:id/likes', cardIdValidate, dislikeCard);

module.exports = router;
