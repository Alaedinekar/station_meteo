const mongoose = require('mongoose');


//structure de donnee d'une adresse Esp
const adresseEspSchema = mongoose.Schema({
    lng: { type: Number, required: true },
    lat: { type: Number, required: true },

});

//structure de donnee d'un esp
const EspSchema = mongoose.Schema({
    adresseMac: { type: String, required: true },
    adresse: {
        type: adresseEspSchema, required: true
    },
    userId: { type: String, required: true }
});

module.exports = mongoose.model('ESP_DATA', EspSchema, 'ESP_DATA');
