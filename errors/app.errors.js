exports.handleSQLError = (err, req, res, next) =>{
    if(err.code === '23502' || err.code === '22P02'){
        res.status(400).send({msg: 'Bad Request'})
    }
    next(err)
}

exports.handleCustomErrors = (err, req, res, next) => {
    if(err.status){
        res.status(err.status).send({msg: err.msg})
    }
}