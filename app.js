const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
// const path = require('path');
const PORT = 3000;
const router = require('./routes');
const { NOT_FOUND } = require('./utils/contants');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('connected to db');
});

const app = express();

// app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '64c908bd9f9ff24c4f7e2379',
  };

  next();
});

app.use(router);

app.use((req, res, next) => {
  res.status(NOT_FOUND).send({ message: 'Страница не найдена' });

  next();
});

app.listen(PORT, () => {
  console.log(`App has started on port ${PORT}...`);
});
