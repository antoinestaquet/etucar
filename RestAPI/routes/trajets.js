var express = require('express');
var router = express.Router();

const trajetsCtrl = require('../controllers/trajets');
const auth = require('../middleware/auth');

router.get('/', trajetsCtrl.getAllTrajets);
router.get('/recherche', trajetsCtrl.findTrajets);
router.get('/:id', trajetsCtrl.getTrajet);
router.get('/demandes/:id', auth, trajetsCtrl.getDemandesEnAttente)
router.get('/user/:id', auth, trajetsCtrl.getUserTrajet);
router.post('/', auth, trajetsCtrl.createTrajet);
router.post('/rejoindre/:idTrajet', auth, trajetsCtrl.rejoindreTrajet); 

module.exports = router;