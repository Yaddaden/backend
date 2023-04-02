const express = require('express');
const router = express.Router();// Création des routeurs séparés pour chaque route principale.
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const like = require('../controllers/like');

const sauceCtrl= require('../controllers/sauce');

router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauce);
router.post('/:id/like', auth, like.likeSauce);

module.exports = router;