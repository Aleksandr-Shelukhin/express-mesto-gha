const router = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const { createCardValidate, cardIdValidation } = require('../middlewares/validations');

router.get('/', getCards);
router.post('/', createCardValidate, createCard);
router.delete('/:id', cardIdValidation, deleteCard);
router.put('/:id/likes', cardIdValidation, likeCard);
router.delete('/:id/likes', cardIdValidation, dislikeCard);

module.exports = router;
