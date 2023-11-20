const express = require('express');
const { getTopics, getEndpoints } = require('../controllers/app.controller');
const app = express();


app.get('/api/topics', getTopics)

app.get("/api", getEndpoints)



module.exports = app