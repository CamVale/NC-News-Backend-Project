const express = require('express');
const { getTopics, getEndpoints, getArticles, postComment } = require('../controllers/app.controller');
const { handleSQLError, handleCustomErrors } = require('../errors/app.errors');
const app = express();

app.use(express.json())

app.get('/api/topics', getTopics)

app.get("/api", getEndpoints)

app.get('/api/articles/:article_id', getArticles)

app.post('/api/articles/:article_id/comments', postComment)

app.use(handleSQLError)
app.use(handleCustomErrors)

module.exports = app