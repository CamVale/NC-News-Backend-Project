const express = require('express');


const { getTopics, getEndpoints, getArticlesByID, getArticles, getCommentsByArticleID, postComment, deleteCommentByID, patchVotes, getUsers, getArticlesByTopic, getArticlesByQuery } = require('../controllers/app.controller');



const { handleSQLError, handleCustomErrors } = require('../errors/app.errors');
const app = express();

app.use(express.json())

app.get('/api/topics', getTopics)

app.get("/api", getEndpoints)

app.get('/api/articles/:article_id', getArticlesByID)

app.get('/api/articles', getArticlesByQuery)

app.get('/api/articles/:article_id/comments', getCommentsByArticleID)

app.post('/api/articles/:article_id/comments', postComment)



app.get('/api/users', getUsers)


app.patch('/api/articles/:article_id', patchVotes)

app.delete('/api/comments/:comment_id', deleteCommentByID)




app.use(handleSQLError)
app.use(handleCustomErrors)


module.exports = app