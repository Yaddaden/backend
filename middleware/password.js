const passwordValidator = require("password-validator");//package téléchargé
const passwordSchema = new passwordValidator();

passwordSchema
//Min 7 lettres
  .is()
  .min(7)
  // max 25 lettres
  .is()
  .max(25)
 //Majuscule
  .has()
  .uppercase()
  // Minuscule
  .has()
  .lowercase()
  //2 chiffres
  .has()
  .digits(2)
  // Pas d'espaces
  .has()
  .not()
  .spaces()
  //mettre ces valeurs à la liste noire
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]);


// verifier la qualite du password par rapport au schema
module.exports = (req, res, next) => {
  if (passwordSchema.validate(req.body.password)) {
    next();
  } else {
    return res.status(400).json({
      error: `Le mot de passe n'est pas assez fort 
        ${passwordSchema.validate("req.body.password", { list: true })}`,
    });
  }
};
