const express = require('express');
const { getTopics, getEndpoints, getArticles } = require('../controllers/app.controller');
const { handleSQLError, handleCustomErrors } = require('../errors/app.errors');
const app = express();


app.get('/api/topics', getTopics)

app.get("/api", getEndpoints)

app.get('/api/articles/:article_id', getArticles)

app.use(handleSQLError)
app.use(handleCustomErrors)

module.exports = app