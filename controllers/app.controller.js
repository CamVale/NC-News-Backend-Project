const { selectAllTopics } = require("../models/app.model")

exports.getTopics = (req, res, next) => {
    selectAllTopics().then((topics)=>{
        res.status(200).send({ topics })
    })
}