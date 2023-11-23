exports.handleSQLError = (err, req, res, next) =>{
    if(err.code === '23502' || err.code === '22P02'){
        res.status(400).send({msg: 'Bad Request'})
    } else if (err.code === '23503'){
        res.status(404).send({msg: 'Not Found'})
    }
    next(err)
}

exports.handleCustomErrors = (err, req, res, next) => {
    if(err.status){
        res.status(err.status).send({msg: err.msg})
    }
}