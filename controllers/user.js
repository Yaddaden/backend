const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');


//Création de compte
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)// création de mot de passe
      .then((hash) => {
        const user = new User({//prendre ce mot de passe crypté qui va lui créer un nouveau (user) pour l'adresse mail
          email: req.body.email,
          password: hash
        });
        user.save() //enregistrement de l'utilisateur dans la base de donnée
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  };

//Connexion au compte
exports.login = (req, res, next) => {
  //Le cas ou l'utilisateur n'existe pas.
    User.findOne({ email: req.body.email })
    .then((user) => {
        if (!user) {
            return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'}); 
        }
        // Le cas ou l'utilisateur s'est trompé de mot de passe
        bcrypt.compare(req.body.password, user.password)
            .then((valid) => {
                if (!valid) {
                    return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
                }
                //Le cas ou le mot de passe est correcte
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign( //chiffrer un nouveau token avec une clé secrète
                        {userId: user._id},
                        'RANDOM_TOKEN_SECRET',
                        {expiresIn: '24h'}
                    )
                });
            })
            .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};