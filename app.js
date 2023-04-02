const express = require('express');
const mongoose = require('mongoose'); 
const dotenv = require("dotenv");
dotenv.config();
mongoose.set('strictQuery', true)
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express();
app.use(express.json());

const sauceRoutes = require('./routes/sauce');//importer sauceRoutes
const userRoutes = require('./routes/user');//importer userRoutes


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


const path = require('node:path');
  app.use('/api/sauces', sauceRoutes);//enregistrement de router pour le frontend.
  app.use('/api/auth', userRoutes);//enregistrement de router pour le frontend.
  app.use('/images', express.static(path.join(__dirname, 'images')));// Gestion de la source image de manière statique

module.exports = app;