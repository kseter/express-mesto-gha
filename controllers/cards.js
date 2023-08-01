const Card = require('../models/cards')
const { default: mongoose } = require('mongoose');
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR, OK_STATUS, CREATED_STATUS } = require('../utils/contants.js')

const getCards = (req, res) => {
  return Card.find()
  .then((cards) => {
    return res.status(OK_STATUS).send(cards)
  })
  .catch((err) => {
    console.log(mongoose.Error);
    if(err instanceof mongoose.Error.DocumentNotFoundError) {
     return res.status(NOT_FOUND).send({ message: 'Карточки не найдены'})
    } else {
     return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка'})
    }
  })
};

const deleteCard = (req, res) => {
  const { cardId } = req.params
  return Card.findByIdAndDelete(cardId)
  .orFail()
  .then((card) => {
    return res.send(card)
  })
  .catch((err) => {
    console.log(mongoose.Error);
    if(err instanceof mongoose.Error.DocumentNotFoundError) {
     return res.status(NOT_FOUND).send({ message: 'Карточка с таким ID не найдена'})
    } else if(err instanceof mongoose.Error.CastError){
      return res.status(BAD_REQUEST).send({ message: 'Неверный ID'})
    } else {
     return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка'})
    }
  })
};

const createCard = (req, res) => {
  console.log(req.user._id)
  const { name, link } = req.body;
  return Card.create({
    name,
    link,
    owner: req.user._id
  })
  .then((card) => {
    return res.status(CREATED_STATUS).send(card)
  })
  .catch((err) => {
    console.log(mongoose.Error);
    if(err instanceof mongoose.Error.ValidationError) {
     return res.status(BAD_REQUEST).send({ message: `Переданы некорректные данные при создании карточки`})
    } else {
     return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка'})
    }
  })
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
  .then((card) => {
    return res.send(card)
  })
  .catch((err) => {
    console.log(mongoose.Error);
    if(err instanceof mongoose.Error.DocumentNotFoundError) {
     return res.status(NOT_FOUND).send({ message: 'Карточка с таким ID не найдена'})
    } else if(err instanceof mongoose.Error.CastError){
      return res.status(BAD_REQUEST).send({ message: 'Неверный ID'})
    } else {
     return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка'})
    }
  })
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .then((card) => {
    return res.status(201).send(card)
  })
  .catch((err) => {
    console.log(mongoose.Error);
    if(err instanceof mongoose.Error.DocumentNotFoundError) {
     return res.status(NOT_FOUND).send({ message: 'Карточка с таким ID не найдена'})
    } else if(err instanceof mongoose.Error.CastError){
      return res.status(BAD_REQUEST).send({ message: 'Неверный ID'})
    } else {
     return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка'})
    }
  })
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard
}


