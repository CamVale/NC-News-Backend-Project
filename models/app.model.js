const { response } = require('express')
const db = require('../db/connection')
const endpoints = require('../endpoints.json')

exports.selectAllTopics = () =>{
    return db.query(`SELECT * FROM topics`).then((result) => {
        return result.rows
    })
}

exports.selectAllEndpoints = () => {
    return new Promise((resolve, reject)=>{
        if (!endpoints){
            reject('No Information')
        } else {
            resolve(endpoints)
        }
    })
}

exports.selectArticles = (id) => {
    return db.query(`SELECT * FROM articles
    WHERE article_id = $1;`, [id]).then((result)=>{
        return result.rows.length ? result.rows[0] : Promise.reject({status : 404, msg: 'Not found'})
    })
}