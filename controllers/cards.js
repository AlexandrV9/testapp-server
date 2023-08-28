const cardAPI = require("../db/api/cards.js");
const userAPI = require("../db/api/user.js");

const getAllCards = async (req, res) => {
  const data = await cardAPI.getAll();
  res.send(data);
};

const getCards = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
    const title = req.query.title || "";
    const data = await cardAPI.getCards({
      page,
      pageSize,
      title,
    });
    res.send(data);
  } catch (error) {
    res.status(404).send({
      message: error.message,
    });
  }
};

const getCardsUser = async (req, res) => {
  const data = await cardAPI.getCardsUser({ ownerId: req.user.id });
  res.send(data);
};

const likeCard = async (req, res) => {
  try {
    const { id: cardId } = req.params;
    const res1 = await userAPI.getById({ userId: req.user.id });
    const owner = res1[0];
    const data = await cardAPI.likeCard({ cardId, emailUser: owner.email });
    res.send(data);
  } catch (error) {
    res.status(404).send({
      message: error.message,
    });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const { id: cardId } = req.params;
    const res1 = await userAPI.getById({ userId: req.user.id });
    const owner = res1[0];
    const data = await cardAPI.dislikeCard({ cardId, emailUser: owner.email });
    res.send(data);
  } catch (error) {
    res.status(404).send({
      message: error.message,
    });
  }
};

const addNewCard = async (req, res) => {
  const { title = "", url = "", description = "" } = req.body;
  const res1 = await userAPI.getById({ userId: req.user.id });
  const owner = res1[0];
  const data = await cardAPI.create({
    ownerId: req.user.id,
    author: owner.name || "",
    title,
    url,
    description,
  });
  res.send(data);
};

const getCard = async (req, res) => {
  const { id: cardId } = req.params;
  const data = await cardAPI.getById({ cardId });
  res.send(data);
};

const deleteCard = async (req, res) => {
  try {
    const res1 = await userAPI.getById({ userId: req.user.id });
    const owner = res1[0];
    const { id: cardId } = req.params;
    await cardAPI.deleteById({ ownerId: owner.id, cardId });
    res.send({
      message: "Карточка успешно удалена!",
    });
  } catch (error) {
    res.status(404).send({
      message: error.message,
    });
  }
};

const updateCard = async (req, res) => {
  try {
    const { title = "", url = "", description = "" } = req.body;
    const { id: cardId } = req.params;
    const data = await cardAPI.updateCardById({
      title,
      url,
      cardId,
      description,
    });
    res.send(data);
  } catch (error) {
    res.status(404).send({
      message: error.message,
    });
  }
};

module.exports = {
  getAllCards,
  getCardsUser,
  getCards,
  addNewCard,
  getCard,
  likeCard,
  dislikeCard,
  deleteCard,
  updateCard,
};
