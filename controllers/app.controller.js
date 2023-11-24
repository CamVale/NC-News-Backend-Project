const { checkExists } = require("../db/seeds/utils");

const { selectAllTopics, selectAllEndpoints, selectArticles, selectCommentsByArticleID, selectArticlesByQuery, createComment, removeCommentByID, updateVotesByArticleID} = require("../models/app.model");



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

  createComment(id, newComment)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};


exports.getCommentsByArticleID = (req, res, next) => {
  const { article_id: id } = req.params;

  const commentPromises = [
    selectCommentsByArticleID(id),
    checkExists("articles", "article_id", id),
  ];

  Promise.all(commentPromises)
    .then((resolved) => {
      const comments = resolved[0];
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  selectArticlesByQuery()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.patchVotes = (req, res, next) => {
  const { inc_votes : votes} = req.body
  const { article_id: id} = req.params
  updateVotesByArticleID(id, votes).then((article)=>{
    res.status(202).send({ article })
  })
  .catch(next)

};

}

exports.deleteCommentByID = (req, res, next) =>{
  const {comment_id : id} = req.params
  removeCommentByID(id).then((result)=>{
    res.status(204).send()
  })
  .catch(next)
}


