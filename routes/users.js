const router = require('express').Router();
const {
  getUsers, getUserByID, updateUserInfo, updateAvatar, getUserInfo,
} = require('../controllers/users');
const {
  validateUpdateProfile, validateAvatar, validateUserId,
} = require('../utils/validation');
const auth = require('../middlewares/auth');

router.get('/users', auth, getUsers);
router.get('/users/me', auth, getUserInfo);
router.patch('/users/me/avatar', validateAvatar, auth, updateAvatar);
router.patch('/users/me', validateUpdateProfile, auth, updateUserInfo);
router.get('/users/:userId', validateUserId, auth, getUserByID);

module.exports = router;
