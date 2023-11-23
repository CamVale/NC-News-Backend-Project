const { response } = require("express");
const db = require("../db/connection");
const endpoints = require("../endpoints.json");

const { convertTimestampToDate } = require("../db/seeds/utils");
const format = require("pg-format");


exports.selectAllTopics = () => {
  return db.query(`SELECT * FROM topics`).then((result) => {
    return result.rows;
  });
};

exports.selectAllEndpoints = () => {
  return Promise.resolve(endpoints);
};

exports.selectArticles = (id) => {
  return db
    .query(
      `SELECT * FROM articles
    WHERE article_id = $1;`,
      [id]
    )
    .then((result) => {
      return result.rows.length
        ? result.rows[0]
        : Promise.reject({ status: 404, msg: "Not found" });
    });
};

exports.createComment = (id, comment) => {
  const values = [[comment.body, id, comment.username]];

  return db.query(format(`INSERT INTO comments (body, article_id, author) VALUES %L RETURNING *;`, values))
  .then((result) => {
    return result.rows.length ? result.rows[0]: Promise.reject({status : 404, msg: 'Not found'})
  })
};
exports.selectCommentsByArticleID = (id) => {
    return db.query(`SELECT comments.* FROM comments JOIN articles ON comments.article_id = articles.article_id
    WHERE comments.article_id = $1
    ORDER BY created_at DESC`, [id]).then((result) => {
        return result.rows
    })
}

exports.selectArticlesByQuery = () => {
  return db
    .query(
      `SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id`
    )
    .then((result) => {
      return result.rows;
    });
};

exports.removeCommentByID= (id) =>{
    return db.query(`DELETE FROM comments
    WHERE comment_id = $1 RETURNING *;`, [id]).then((result)=>{
        return result.rows.length ? result.rows[0] : Promise.reject({status : 404, msg: 'Not Found'})
    })
}

