const jwt = require('jsonwebtoken');
const { token_secret } = require("../config.json");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, token_secret);
        const userId = decodedToken.userId;
        req.auth = { userId }; // == userId: userId
        if (req.body.userId && req.body.userId !== userId) {
            throw "L'id utilisateur faisant la requète ne correspond pas au token."
        } else {
            next();
        }

    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifié !'});
    }
}