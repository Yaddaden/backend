const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator'); // pour eviter des erreurs illisible de mongoDB à l'inscription de l'adresse mail.

const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},// Sinscrire qu'une seule fois avec la meme adresse mail
    password: {type: String, required: true}
});

userSchema.plugin(uniqueValidator);// pour detecter les erreurs 

module.exports = mongoose.model('User', userSchema);