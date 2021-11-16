const meteoController = require('../controllers/meteo');
const express = require('express');
const router = express.Router();
const token = require('../auth');

//GET
router.get('/', meteoController.getMeteo);
router.get('/adresseMac/:id',meteoController.getMeteoById);
router.get('/freshData/:id', meteoController.getFreshMeteoById);
router.get('/openWeatherMeteo/:adress',meteoController.getMeteoOpenWeatherByAdress);
router.get('/prevision/:adress', meteoController.prevision);
router.get('/previsionbyid/:id' ,token,meteoController.previsionbyId);

//POST
router.post('/verif' ,meteoController.verificationDonnes);



module.exports = router;
