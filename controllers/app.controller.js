

const { checkExists } = require("../db/seeds/utils");
const { selectAllTopics, selectAllEndpoints, selectArticles, selectCommentsByArticleID, selectArticlesByQuery, createComment, selectArticlesByTopic} = require("../models/app.model");



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

exports.getArticlesByID = (req, res, next) => {
  const { article_id: id } = req.params;
  selectArticles(id)
    .then((articles) => [res.status(200).send(articles)])
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const newComment = req.body;
  const { article_id: id } = req.params;
  createComment(id, newComment).then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
  }


exports.getCommentsByArticleID = (req, res, next) => {
  const { article_id : id } = req.params

  const commentPromises = [selectCommentsByArticleID(id), checkExists('articles', 'article_id', id)]

  Promise.all(commentPromises)
  .then((resolved)=> {
    const comments = resolved[0]
    res.status(200).send({ comments })
  })
  .catch(next)
}

exports.getArticles = (req, res, next) => {
  selectArticlesByQuery().then((articles)=>{
    res.status(200).send({articles})
  })
  .catch(next)
}

exports.getArticlesByTopic =(req,res,next)=>{
  const { topic } = req.params
  selectArticlesByTopic(topic).then((articles)=>{
    res.status(200).send(articles)
  })
  .catch(next)
}
