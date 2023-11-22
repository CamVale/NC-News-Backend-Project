const { response } = require("express");
const db = require("../db/connection");
const endpoints = require("../endpoints.json");

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

exports.selectArticlesByQuery = () => {
  return db
    .query(
      `SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id`
    )
    .then((result) => {
      return result.rows;
    });
};
