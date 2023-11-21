const express = require('express');
const { getTopics, getEndpoints, getArticlesByID, getArticlesByQuery } = require('../controllers/app.controller');
const { handleSQLError, handleCustomErrors } = require('../errors/app.errors');
const app = express();


app.get('/api/topics', getTopics)

app.get("/api", getEndpoints)

app.get('/api/articles/:article_id', getArticlesByID)

app.get('/api/articles', getArticlesByQuery)

app.use(handleSQLError)
app.use(handleCustomErrors)

module.exports = app