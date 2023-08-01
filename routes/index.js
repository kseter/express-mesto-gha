const router = require('express').Router()
const { NOT_FOUND } = require('../utils/contants.js')

const usersRouter = require('./users')
const cardsRouter = require('./cards')

router.use(usersRouter);
router.use(cardsRouter);

const handleNotFoundPage = (req, res) => {
  return res.status(NOT_FOUND).send({ message: 'Страница не найдена'})
};

router.patch('/404', handleNotFoundPage);

module.exports = router