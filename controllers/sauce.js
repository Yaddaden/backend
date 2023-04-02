
const Sauce = require('../models/Sauce');

const fs = require('fs');// gerer les liens des fichiers

//Création de la sauce
exports.createSauce =  (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);//convertir l'objet sauce en format json pour son utilisation.
  delete sauceObject._id;
  delete sauceObject._userId;//suppresion id requette envoyé par le client.
  const sauce = new Sauce({
      ...sauceObject,
      likes:0,
      dislikes:0,
    
      userId: req.auth.userId,// Remplacement (user_id) extrait du token de middleware auth.
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`//l url complet pour l'image
  });
    sauce.save()//enregistrement
    .then(() => res.status(201).json({message:'Objet enregistré!'}))
    .catch(error => res.status(400).json({error}));
  };


//Modifier
  exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? { // on regarde si le champ fille existe ou pas.
      ...JSON.parse(req.body.sauce),//convertir l'objet sauce en format json pour son utilisation.
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body}; //Si on a pas d'objet de transmit, on récuper l'objet dans le corp de la requette.
    delete sauceObject._userId;//Suppression du (userId) venant de la requette.
    Sauce.findOne({_id: req.params.id})//Recuperer notre objet en base de donnée pour vérifier le bon utilisateur.
    .then((thing) =>{
      if(thing.userId != req.auth.userId){//si userid récuperé en base de donnée != userid de token, pour connaitre le bon utilisateur.
        res.status(401).json({message:'Non autorisé'});
      } else if (req.file) {
       const filename = thing.imageUrl.split('/images/') [1];
       fs.unlink(`images/${filename}`, (error)=>{if (error) throw error})// système de fichiers pour donner accée aux fonctions de modification.
      }//mettre a jour notre enregistrement
      Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
      .then(() => res.status(200).json({message:'Objet modifié!!'}))
      .catch(error => res.status(401).json({error}));
    })
    .catch((error) => {
      res.status(400).json({ error });
  });
  };
 
  //supprimer
  exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(thing => {
            if (thing.userId != req.auth.userId) {//vérification si l’utilisateur qui a fait la requête de suppression est bien celui qui a créé la sauce.
                res.status(401).json({message: 'Not authorized'});// Si c'est faux (error).
            } else {
              //supprimer l'objet de la base de donnée et l'image du système de fichier.
                const filename = thing.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {// permet de supprimer un fichier du système de fichiers.
                    Sauce.deleteOne({_id: req.params.id})//suppression notre enregistrement dans la base de donnée.
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })

        .catch( error => {
            res.status(500).json({ error });
        });
 };

//Récuperer une sauce
  exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}));
  };

//Récuperer tous les sauces
  exports.getAllSauce = (req, res, next) => {
    Sauce.find()
    .then(sauce => res.status(200).json(sauce))//promise
    .catch(error => res.status(400).json({error}));
  }
