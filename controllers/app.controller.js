const { selectAllTopics, selectAllEndpoints, selectArticles, selectArticlesByQuery } = require("../models/app.model");

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
  const { article_id: id } = req.params
  selectArticles(id).then((articles)=>{
    res.status(200).send(articles)
})
  .catch(next)
};

exports.getArticlesByQuery = (req, res, next) => {
  selectArticlesByQuery().then((articles)=>{
    res.status(200).send(articles)
  })
  .catch(next)
}
