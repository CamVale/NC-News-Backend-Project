const { response } = require("express");
const db = require("../db/connection");
const endpoints = require("../endpoints.json");

const { convertTimestampToDate, checkExists } = require("../db/seeds/utils");
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
      `SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1
      GROUP BY articles.article_id;`,
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

  return db
    .query(
      format(
        `INSERT INTO comments (body, article_id, author) VALUES %L RETURNING *;`,
        values
      )
    )
    .then((result) => {
      return result.rows.length
        ? result.rows[0]
        : Promise.reject({ status: 404, msg: "Not found" });
    });
};
exports.selectCommentsByArticleID = (id) => {
  return db
    .query(
      `SELECT comments.* FROM comments JOIN articles ON comments.article_id = articles.article_id
    WHERE comments.article_id = $1
    ORDER BY created_at DESC`,
      [id]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.selectArticlesByQuery = (topic) => {
  const queryValues = [];

  let queryString = `SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `;

  if (topic && checkExists("topics", "slug", topic).catch(()=>{})) {
    queryValues.push(topic);
    queryString += 'WHERE "topic" = $1 ';
  }

  queryString += "GROUP BY articles.article_id;";

  return db.query(queryString, queryValues).then((result) => {
    return result.rows
  })
  }
