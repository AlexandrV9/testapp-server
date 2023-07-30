const express = require("express");
const { 
  addNewCard, 
  // getAllCards, 
  getCards,
  deleteCard, 
  getCard, 
  updateCard, 
} = require("../controllers/cards.js");

const cardRouter = express.Router();

cardRouter.get('/', getCards);
cardRouter.get('/:id', getCard);
cardRouter.post('/', addNewCard);
cardRouter.delete('/:id', deleteCard);
cardRouter.patch('/:id', updateCard)

module.exports = cardRouter;