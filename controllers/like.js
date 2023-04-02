const Sauce = require('../models/Sauce');

exports.likeSauce = (req, res, next) =>{
    //Chercher sauce dans la base de donnée 
    Sauce.findOne({_id:req.params.id})
    .then((sauce) => {
        console.log(sauce)
        //faire un like = 1
        //Si le userLiked n'est pas présent dans le tableau et si la requete envois like=1
        if(!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1){
            //Mise a jour sauce BDD
            Sauce.updateOne(
                {_id : req.params.id},//Chercher l'objet dans BDD
                {
                    $inc: {likes: 1},//incrémenter
                    $push: {usersLiked : req.body.userId}
                }
            )
        .then(()=> res.status(201).json({message: "Sauce like +1"}))
        .catch((error)=>res.status(400).json({error}));
            };


        //like = 0 (pas de vote) annuler le like
        if(sauce.usersLiked.includes(req.body.userId) && req.body.like === 0){
            //Mise a jour sauce BDD
            Sauce.updateOne(
                {_id : req.params.id},//Chercher l'objet dans BDD
                {
                    $inc: {likes: -1},
                    $pull: {usersLiked : req.body.userId}
                }
            )
        .then(()=> res.status(201).json({message: "Sauce like 0"}))
        .catch((error)=>res.status(400).json({error}));
        };


        //Dislike =-1
        if(!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1){
            //Mise a jour sauce BDD
            Sauce.updateOne(
                {_id : req.params.id},//Chercher l'objet dans BDD
                {
                    $inc: {dislikes: 1},
                    $push: {usersDisliked : req.body.userId} 
                }
            )
        .then(()=> res.status(201).json({message: "Sauce disLike +1"}))
        .catch((error)=>res.status(400).json({error}));
        };


        // Après un Dislike = -1 on met un like = 0
        if(sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0){
            //Mise a jour sauce BDD
            Sauce.updateOne(
                {_id : req.params.id},//Chercher l'objet dans BDD
                {
                    $inc: {dislikes: -1},
                    $pull: {usersDisliked : req.body.userId}
                }
            )
        .then(()=> res.status(201).json({message: "Sauce dislike 0"}))
        .catch((error)=>res.status(400).json({error}));
        };

    })
    .catch((error)=>res.status(404).json({error})); 
}