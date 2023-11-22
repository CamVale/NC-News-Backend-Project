const express = require('express');
const { getTopics, getEndpoints, getArticles, getCommentsByArticleID } = require('../controllers/app.controller');
const { handleSQLError, handleCustomErrors } = require('../errors/app.errors');
const app = express();


app.get('/api/topics', getTopics)

app.get("/api", getEndpoints)

app.get('/api/articles/:article_id', getArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleID)

app.use(handleSQLError)
app.use(handleCustomErrors)


module.exports = app