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
    cardId,
    emailUser
  }) => {
    const card = await this.getById({ cardId });

    if(card.length === 0) {
      throw new Error("Карточки с таким id не существует")
    }

    // Проверяем есть в массиве лайков хоть одна почта пользователя лайкнувшего карточку. 
    // Если никто не лайкал будет has_likes = 0
    const sql1 = `SELECT IFNULL(JSON_LENGTH(likes) > 0, false) AS has_likes FROM cards WHERE id = ${cardId}`;
    const res1 = await querySql(sql1);

    if(res1[0].has_likes === 0) {
      let sql2 = `UPDATE cards SET likes = JSON_ARRAY('${emailUser}') WHERE id = ${cardId}`;
      await querySql(sql2);
      return this.getById({ cardId });
    }

    // Проверям лайкал ли пользователь уже эту карточку. Если нет, то res3[0].email будет равный null
    const sql3 = `SELECT JSON_SEARCH(likes, 'one', '${emailUser}') AS email FROM cards WHERE id = ${cardId}`;
    const res3 = await querySql(sql3);

    if(res3[0].email) {
      throw new Error("Вы уже лайкнули эту карточку")
    }

    // В массиве лайков есть почты других пользователей, но нашего нет. Просто добавляем его
    let sql4 = `UPDATE cards SET likes = JSON_ARRAY_APPEND(likes, '$', '${emailUser}') WHERE id = ${cardId};`;
    await querySql(sql4);

    return this.getById({ cardId });
  }

  dislikeCard = async ({
    cardId,
    emailUser
  }) => {
    const card = await this.getById({ cardId });

    if(card.length === 0) {
      throw new Error("Карточки с таким id не существует")
    }

    // Проверям лайкал ли пользователь уже эту карточку. Если нет, то res3[0].email будет равный null
    const sql1 = `SELECT JSON_SEARCH(likes, 'one', '${emailUser}') AS email FROM cards WHERE id = ${cardId}`;
    const res1 = await querySql(sql1);
    const indexEmail = res1[0].email;

    if(!indexEmail) {
      throw new Error("Такой пользователь на лайкал данную карточку")
    }

    // Если пользователь лайкал эту карточку, то в indexEmail будет лежать индекс почты пользователя.
    // Далее просто по этому индексу удаляем почту

    const sql2 = `UPDATE cards SET likes = JSON_REMOVE(likes, '${indexEmail}') WHERE id = ${cardId}`;
    await querySql(sql2);

    return this.getById({ cardId });
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