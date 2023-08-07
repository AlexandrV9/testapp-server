const cardAPI = require("../db/api/cards.js")

const getAllCards = async (req, res) => {
  const data = await cardAPI.getAll();
  // console.log(req.user)
  res.send(data)
}

const getCards = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
    const data = await cardAPI.getCards({
      page,
      pageSize
    });
    res.send(data)
  } catch(error) {
    res.status(404).send({
      message: error.message
    })
  }
}

const getCardsUser = async (req, res) => {
  const { owner_id } = req.query;
  const data = await cardAPI.getCardsUser({ owner_id });
  res.send(data)
}

const likeCard = async (req, res) => {
  try {
    const { id: cardId } = req.params;
    const { emailUser } = req.body;
    const data = await cardAPI.likeCard({ cardId, emailUser });
    res.send(data)
  } catch (error) {
    res.status(404).send({
      message: error.message
    })
  }
}

const dislikeCard = async (req, res) => {
  try {
    const { id: cardId } = req.params;
    const { emailUser } = req.body;
    const data = await cardAPI.dislikeCard({ cardId, emailUser });
    res.send(data)
  } catch (error) {
    res.status(404).send({
      message: error.message
    })
  }
}

const addNewCard = async (req, res) => {
  const { ownerId , title, url } = req.body;
  const data = await cardAPI.create({ ownerId , title, url });
  res.send(data)
}

const getCard = async (req, res) => {
  const { id: cardId } = req.params;
  const data = await cardAPI.getById({ cardId });
  res.send(data)
}

const deleteCard = async (req, res) => {
  try {
    const { id: ownerId } = req.body;
    const { id: cardId } = req.params;
    await cardAPI.deleteById({ ownerId , cardId });
    res.send({
      message: "Карточка успешно удалена!"
    })
  } catch(error) {
    res.status(404).send({
      message: error.message
    })
  }
}

const updateCard = async (req, res) => {
  try {
    const { title,  url } = req.body;
    const { id: cardId } = req.params;
    const data = await cardAPI.updateCardById({ title , url, cardId });
    res.send(data)
  } catch(error) {
    res.status(404).send({
      message: error.message
    })
  }
}

module.exports = {
  getAllCards,
  getCardsUser,
  getCards,
  addNewCard,
  getCard,
  likeCard,
  dislikeCard,
  deleteCard,
  updateCard
}