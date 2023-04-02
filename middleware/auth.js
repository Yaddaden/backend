const jwt = require('jsonwebtoken');//Package téléchargé.

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];//Pour récuperer le token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // vérification et décodage du token
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch(error) { 
    res.status(401).json({error});
    }
};