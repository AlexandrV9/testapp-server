const { querySql } = require("../index.js");

class CardAPI {

  getAll = async () => {
    const sql = `SELECT * FROM cards`
    return querySql(sql);
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