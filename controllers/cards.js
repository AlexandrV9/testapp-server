const cardAPI = require("../db/api/cards.js")

export const getAllCards = async (req, res) => {
  const data = await cardsDb.getAll();
  res.send(data)
}

export const getCardsUser = async (req, res) => {
  const { owner_id } = req.query;
  const data = await cardsDb.getCardsUser({ owner_id });
  res.send(data)
}


export const addNewCard = async (req, res) => {
  const { ownerId , title, url } = req.body;
  console.log("Выполнени запроса к БД")
  const data = await cardsDb.create({ ownerId , title, url });
  console.log("Отправка созданной карточки")
  res.send(data)
}

export const getCard = async (req, res) => {
  const { id: cardId } = req.params;
  const data = await cardsDb.getById({ cardId });
  res.send(data)
}

export const deleteCard = async (req, res) => {
  try {
    const { id: ownerId } = req.body;
    const { id: cardId } = req.params;
    await cardsDb.deleteById({ ownerId , cardId });
    res.send({
      message: "Карточка успешно удалена!"
    })
  } catch(error) {
    res.status(404).send({
      message: error.message
    })
  }
}

export const updateCard = async (req, res) => {
  try {
    const { title,  url } = req.body;
    const { id: cardId } = req.params;
    const data = await cardsDb.updateCardById({ title , url, cardId });
    res.send(data)
  } catch(error) {
    res.status(404).send({
      message: error.message
    })
  }
}
