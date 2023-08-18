const { default: mongoose } = require('mongoose');
const Card = require('../models/cards');
const {
  OK_STATUS, CREATED_STATUS,
} = require('../utils/contants');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');

const getCards = (req, res, next) => {
  Card.find()
    .then((cards) => {
      res.status(OK_STATUS).send(cards);
    })
    .catch((err) => next(err));
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .orFail()
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с таким ID не найдена');
      } else if (card.owner._id !== req.user._id) {
        throw new BadRequestError('Нет прав для удаления карточки');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        throw new BadRequestError('Неверный ID');
      } else {
        next(err);
      }
    });
};

const createCard = (req, res, next) => {
  console.log(req.user._id);
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => {
      res.status(CREATED_STATUS).send(card);
    })
    .catch((err) => {
      console.log(mongoose.Error);
      if (err instanceof mongoose.Error.ValidationError) {
        throw new BadRequestError('Переданы некорректные данные при создании карточки');
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с таким ID не найдена');
      }
      res.status(OK_STATUS).send(card);
    })
    .catch((err) => {
      console.log(mongoose.Error);
      if (err instanceof mongoose.Error.CastError) {
        throw new BadRequestError('Неверный ID');
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с таким ID не найдена');
      }
      res.status(OK_STATUS).send(card);
    })
    .catch((err) => {
      console.log(mongoose.Error);
      if (err instanceof mongoose.Error.CastError) {
        throw new BadRequestError('Неверный ID');
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
