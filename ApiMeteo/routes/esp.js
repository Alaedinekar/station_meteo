const espController = require('../controllers/esp');
const express = require('express');
const router = express.Router();
const token = require('../auth');

//GET
router.get('/', espController.getAll);
router.get('/getEsp/:id', token, espController.getEspById);

//POST
router.post('/addEsp',  token,espController.newEsp); // créer un nouvel utilisateur (voir le model pour le body)
router.post('/addEsp', token, espController.newEsp);

//DELETE
router.delete('/delete/:id', token, espController.deleteEsp);

//PUT
router.put('/put',token,espController.updateEsp);


module.exports = router;
