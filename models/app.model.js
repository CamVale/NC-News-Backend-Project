const { response } = require('express')
const db = require('../db/connection')
const endpoints = require('../endpoints.json')

exports.selectAllTopics = () =>{
    return db.query(`SELECT * FROM topics`).then((result) => {
        return result.rows
    })
}

exports.selectAllEndpoints = () => {
    return Promise.resolve(endpoints)
}