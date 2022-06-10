const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//Pour avoir une seule sauce
router.get('/:id', auth, sauceCtrl.getOneSauce);

//Liste de toutes les sauces
router.get('/', auth, sauceCtrl.getAllSauce);

//Ajouter une sauce
router.post('/', auth, multer, sauceCtrl.createSauce);

//modification d'une sauce
router.put('/:id', auth, sauceCtrl.modifySauce);

//suppression d'une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce);

//Evalutation de sauce
router.post('/:id/like', auth, sauceCtrl.evaluateSauce);

module.exports = router;
