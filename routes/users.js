const router = require('express').Router();
// const User = require('../models/users')
const { getUsers, getUserByID, createUser, updateUserInfo, updateAvatar } = require('../controllers/users')

router.get('/users', getUsers);
router.get('/users/:userId', getUserByID);
router.post('/users', createUser);
router.patch('/users/me', updateUserInfo);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router