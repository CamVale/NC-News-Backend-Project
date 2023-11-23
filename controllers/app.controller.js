const {
  selectAllTopics,
  selectAllEndpoints,
  selectArticles,
  createComment,
} = require("../models/app.model");

exports.getTopics = (req, res, next) => {
  selectAllTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getEndpoints = (req, res, next) => {
  selectAllEndpoints().then((endpoints) => {
    res.status(200).send(endpoints);
  });
};

exports.getArticles = (req, res, next) => {
  const { article_id: id } = req.params;
  selectArticles(id)
    .then((articles) => [res.status(200).send(articles)])
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const newComment = req.body;
  const { article_id: id } = req.params;
  createComment(id, newComment).then((comment) => {
      console.log(comment, 'returned comment')
      res.status(201).send({ comment });
    })
    .catch(next);
};
