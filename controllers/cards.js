const cardAPI = require("../db/api/cards.js")

const getAllCards = async (req, res) => {
  const data = await cardAPI.getAll();
  res.send(data)
}

const getCardsUser = async (req, res) => {
  const { owner_id } = req.query;
  const data = await cardAPI.getCardsUser({ owner_id });
  res.send(data)
}


const addNewCard = async (req, res) => {
  const { ownerId , title, url } = req.body;
  console.log("Выполнени запроса к БД")
  const data = await cardAPI.create({ ownerId , title, url });
  console.log("Отправка созданной карточки")
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
  addNewCard,
  getCard,
  deleteCard,
  updateCard
}