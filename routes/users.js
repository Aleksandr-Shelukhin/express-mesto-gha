const router = require('express').Router();
const {
  getUser, getUserById, createUser, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUser);
router.get('/:id', getUserById);
router.post('/', createUser);
router.patch('/me', updateUserInfo);
router.post('/me/avatar', updateUserAvatar);

module.exports = router;
