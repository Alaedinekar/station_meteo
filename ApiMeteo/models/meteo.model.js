const mongoose = require('mongoose');
//structure de donnee d'une adresse
const adresseSchema = mongoose.Schema({
    lat: Number,
    lng: Number
})
//structure de donnee d'une donnee meteo
const MeteoSchema = mongoose.Schema({
    temperature: {
        type: String,
        required: true
    }
    ,
    id: {
        type: String,
        required: true
    },
    pression: {
        type: String,
        required: true
    },
    altitude: {
        type: String,
        required: true
    },
    lumiere: {
        type: String,
        required: true
    },
    humidite: {type: String, required: true},
    idUser: {
        type: String,
        required: true},
    adresse: adresseSchema,
});

module.exports = mongoose.model('METEO_DATA', MeteoSchema, 'datas');
