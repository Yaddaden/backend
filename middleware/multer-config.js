const multer = require('multer');//package téléchargé

const MIME_TYPES = {
    'image/jpg':'jpg',
    'image/jpeg':'jpg',
    'image/png':'png'
};
// Pour enregistrer les fichies entrants.
const storage = multer.diskStorage({
    destination: (req, file, Callback) =>{ //enregistrer les fichies dans le dossier images.
        Callback(null, 'images')
    },
    filename: (req, file, Callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        Callback(null, name + Date.now( ) + '.' + extension);

    }
});
//exporter multer et accorder que le téléchargements de fichiers image.
module.exports = multer({storage}).single('image');