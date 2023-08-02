const { default: mongoose } = require('mongoose');
const User = require('../models/users');
const {
  BAD_REQUEST, NOT_FOUND, SERVER_ERROR, OK_STATUS, CREATED_STATUS,
} = require('../utils/contants');

const getUsers = (req, res) => {
  User.find().then((users) => {
    if (users) {
      res.status(OK_STATUS).send(users);
    }
  })
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const getUserByID = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(OK_STATUS).send(user);
    })
    .catch((err) => {
      console.log(mongoose.Error);
      if (err instanceof mongoose.Error.CastError) {
        res.status(BAD_REQUEST).send({ message: 'Некорректный ID' });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const createUser = (req, res) => {
  User.create({ ...req.body })
    .then((user) => {
      res.status(CREATED_STATUS).send(user);
    })
    .catch((err) => {
      console.log(mongoose.Error);
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const updateAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.status(OK_STATUS).send(user);
    })
    .catch((err) => {
      console.log(mongoose.Error);
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else if (err instanceof mongoose.Error.ValidationError) {
        res.status(BAD_REQUEST).send({ message: 'Некорректно введены данные' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const updateUserInfo = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.status(OK_STATUS).send(user);
    })
    .catch((err) => {
      console.log(mongoose.Error);
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else if (err instanceof mongoose.Error.ValidationError) {
        res.status(BAD_REQUEST).send({ message: 'Некорректно введены данные' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports = {
  getUsers,
  getUserByID,
  createUser,
  updateAvatar,
  updateUserInfo,
};
