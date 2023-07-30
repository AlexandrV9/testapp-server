const { querySql } = require("../index.js");

class CardAPI {

  getAll = async () => {
    const sql = `SELECT * FROM cards`;
    return querySql(sql);
  }
  
  getCards = async ({
    page,
    pageSize
  }) => {

    if(page <= 0 || pageSize <= 0) {
      throw new Error("Свойства page и pageSize не могут быть отрицательными")
    }

    const sql1 = `SELECT COUNT(*) as total_cards FROM cards`;
    const res1 = await querySql(sql1);

    const totalCards = res1[0].total_cards;
    const pageCount = Math.ceil(totalCards / pageSize);
    const offset = (page - 1) * pageSize;

    const sql2 = `SELECT * FROM cards LIMIT ${pageSize} OFFSET ${offset}`;
    const listCards = await querySql(sql2);

    return {
      data: listCards,
      page,
      pageSize,
      pageCount,
    }
  }

  create = async ({ ownerId, title, url }) => {
    console.log({ ownerId, title, url })
    const sql = `INSERT INTO cards (owner_id, title, url) VALUES (${ownerId}, '${title}', '${url}')`;
    const dataSuccessfulCreation = await querySql(sql);
    if (!dataSuccessfulCreation) {
      return new Error("Возникла ошибка при создании новой карточки")
    }
    const { insertId: cardId } = dataSuccessfulCreation;
    const dataNewCard = await this.getById({ cardId });
    return dataNewCard[0];
  }

  getById = async ({ cardId }) => {
    const sql = `SELECT * FROM cards WHERE id=${cardId}`;
    const data = await querySql(sql);
    return data;
  }

  deleteById = async ({ cardId }) => {
    const card = await this.getById({ cardId });
    if(card.length === 0) {
      throw new Error("Карточки с таким id не существует")
    }
    const sql = `DELETE FROM cards WHERE id=${cardId}`;
    const data = await querySql(sql);
    return data;
  }

  likeCard = async ({
    cardId
  }) => {

  }

  dislikeCard = async () => {

  }
  
  updateCardById = async ({ cardId, title = "",  url = "" }) => {
    const card = await this.getById({ cardId });
    let sql = ""
    if(card.length === 0) {
      throw new Error("Карточки с таким id не существует")
    }

    if(!title && !url) {
      throw new Error("Ни одно из полей: title или url не передано")
    } 
    if(!title && url === card[0].url) {
      throw new Error("Значение поля url должно иметь новое значение")
    } 
    if(!url && title === card[0].title) {
      throw new Error("Значение поля title должно иметь новое значение")
    }
    if(url === card[0].url && title === card[0].title) {
      throw new Error("Поля должны иметь новые значения")
    }

    if(url && !title) {
      sql = `UPDATE cards SET url='${url}' WHERE id=${cardId}`;
    } 
    if(title && !url) {
      sql = `UPDATE cards SET title='${title}' WHERE id=${cardId}`;
    } 
    if(title && url) {
      sql = `UPDATE cards SET title='${title}', url='${url}' WHERE id=${cardId}`;
    } 
   
    await querySql(sql);
    return this.getById({ cardId });
  }



}


const cardAPI = new CardAPI();

module.exports = cardAPI;