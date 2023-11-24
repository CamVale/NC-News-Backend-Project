const express = require('express');

const { getTopics, getEndpoints, getArticlesByID, getCommentsByArticleID, postComment, getArticlesByTopic, getArticlesByQuery } = require('../controllers/app.controller');

const { handleSQLError, handleCustomErrors } = require('../errors/app.errors');
const app = express();

app.use(express.json())

app.get('/api/topics', getTopics)

app.get("/api", getEndpoints)

app.get('/api/articles/:article_id', getArticlesByID)

app.get('/api/articles', getArticlesByQuery)

app.get('/api/articles/:article_id/comments', getCommentsByArticleID)

app.post('/api/articles/:article_id/comments', postComment)



app.use(handleSQLError)
app.use(handleCustomErrors)


module.exports = app