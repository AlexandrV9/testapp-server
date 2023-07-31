const express = require("express");
const { 
  addNewCard, 
  likeCard,
  getCards,
  deleteCard, 
  getCard, 
  updateCard,
  dislikeCard, 
} = require("../controllers/cards.js");

const cardRouter = express.Router();

cardRouter.get('/', getCards);
cardRouter.get('/:id', getCard);
cardRouter.post('/', addNewCard);
cardRouter.delete('/:id', deleteCard);
cardRouter.patch('/:id', updateCard);
cardRouter.patch('/:id/likes', likeCard);
cardRouter.delete('/:id/likes', dislikeCard);

module.exports = cardRouter;