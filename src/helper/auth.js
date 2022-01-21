const jwt = require('jsonwebtoken')
const {client} = require('./db');

const auth = async(req, res, next) => {
    try {
        const token = req.body.token || req.query.token ||  req.headers.authorization.split(' ')[1];
        if(!token) return res.status(401).send();
        const {_id, exp} = jwt.decode(token, process.env.JWT_SEC);
        if(!_id || !exp) return res.status(401).send();
        const user = await( await client).db("Files").collection('User').findOne({_id});
        if(!user || !user._id) return res.status(401).send();

        req.user = user;
        req.token = token;

        next();
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
};

module.exports = {
    auth,
}