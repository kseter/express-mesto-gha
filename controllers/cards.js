const { default: mongoose } = require('mongoose');
const Card = require('../models/cards');
const {
  BAD_REQUEST, NOT_FOUND, SERVER_ERROR, OK_STATUS, CREATED_STATUS,
} = require('../utils/contants');

const getCards = (req, res) => {
  Card.find()
    .then((cards) => {
      res.status(OK_STATUS).send(cards);
    })
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .orFail()
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      console.log(mongoose.Error);
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(NOT_FOUND).send({ message: 'Карточка с таким ID не найдена' });
      } else if (err instanceof mongoose.Error.CastError) {
        res.status(BAD_REQUEST).send({ message: 'Неверный ID' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const createCard = (req, res) => {
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
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => {
      res.status(OK_STATUS).send(card);
    })
    .catch((err) => {
      console.log(mongoose.Error);
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(NOT_FOUND).send({ message: 'Карточка с таким ID не найдена' });
      } else if (err instanceof mongoose.Error.CastError) {
        res.status(BAD_REQUEST).send({ message: 'Неверный ID' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.status(OK_STATUS).send(card);
    })
    .catch((err) => {
      console.log(mongoose.Error);
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(NOT_FOUND).send({ message: 'Карточка с таким ID не найдена' });
      } else if (err instanceof mongoose.Error.CastError) {
        res.status(BAD_REQUEST).send({ message: 'Неверный ID' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
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
