const express = require('express');
const router = express.Router();

const usersCtrl = require('../controllers/users');
const auth = require('../middleware/auth');

/**
 * GET
 * Retourne un utilisateur
 */
router.get('/:id', usersCtrl.getUser);
router.post('/inscription', usersCtrl.inscription);
router.post('/connexion', usersCtrl.connexion);
router.put('/modifierMail', auth, usersCtrl.modifyMail);
router.put('/modifierTelephone', auth, usersCtrl.modifyPhone);
router.put('/modifierMotDePasse', auth, usersCtrl.modifyPassword);
router.put('/motDePasse/oublie', usersCtrl.forgottenPassword);
router.put('/motDePasse/modifierAvecCode', usersCtrl.forgottenPasswordChange);

module.exports = router;
