const router = require('express').Router();

const usersRouter = require('./users');
const cardsRouter = require('./cards');
const {
  validateSignUp, validateSignIn,
} = require('../utils/validation');
const {
  login, createUser,
} = require('../controllers/users');

router.post('/signup', validateSignUp, createUser);
router.post('/signin', validateSignIn, login);

router.use(usersRouter);
router.use(cardsRouter);

module.exports = router;
