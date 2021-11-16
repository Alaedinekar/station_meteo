const mongoose = require('mongoose');

//structure de donnee d'un user
const UserSchema = mongoose.Schema({
    userFirstName: {
        type: String,
        required: true
    },
    userLastName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    userPassword: {
        type: String,
        required: true
    },
    userPhoneNumber: {
        type: String,
        required: false
    },
    userAddress: {
        type: String,
        required: true
    },
    picUrl: {
        type: String,
        required: false,
        default: "https://media.discordapp.net/attachments/807286057460039690/847914836046118983/E2Gi0QHXIAQtK1n.png"
    },
});

module.exports = mongoose.model('USER_DATA', UserSchema, 'USER_DATA');
