const { selectAllTopics, selectAllEndpoints } = require("../models/app.model");

exports.getTopics = (req, res, next) => {
  selectAllTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getEndpoints = (req, res, next) => {
    selectAllEndpoints().then((result)=>{
        res.status(200).send(result)
    })
}
