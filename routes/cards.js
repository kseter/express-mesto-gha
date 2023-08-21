const router = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const {
  validateCreateCard, validateCardId,
} = require('../utils/validation');
const auth = require('../middlewares/auth');

router.get('/cards', auth, getCards);
router.delete('/cards/:cardId', validateCardId, auth, deleteCard);
router.post('/cards', validateCreateCard, auth, createCard);
router.put('/cards/:cardId/likes', validateCardId, auth, likeCard);
router.delete('/cards/:cardId/likes', validateCardId, auth, dislikeCard);

module.exports = router;
