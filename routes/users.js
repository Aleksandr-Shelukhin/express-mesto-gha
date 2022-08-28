const router = require('express').Router();
const {
  getUsers, getUserById, getCurrentUser, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');

const {
  userIdValidate,
  userInfoValidate,
  avatarUrlValidate,
} = require('../middlewares/validations');

router.get('/', getUsers);
router.get('/:id', userIdValidate, getUserById);
router.get('/me', getCurrentUser);
router.patch('/me', userInfoValidate, updateUserInfo);
router.patch('/me/avatar', avatarUrlValidate, updateUserAvatar);

module.exports = router;
