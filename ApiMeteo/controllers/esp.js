const EspModel = require('../models/esp.model');

const getAll = async (req, res) => {//Requete qui permet de get tous les esp
    console.log('alooo')
    await EspModel.find()
        .then(result => {
            console.log(result);
            res.status(200).send(result)
        })
        .catch(error => {
            console.log(error)
            res.send({message: error.message})
        })
}
const newEsp = async (req, res) => {//Requete qui permet d'ajouter un nouvel esp
    const data = req.body;
    console.log(data.adresseMac)
    if (await EspModel.find({"adresseMac": data.adresseMac}).limit(1).length === 1) {//Si adresse mac de esp ajouté = esp existant, on ajoute pas l'esp
        console.log('---------esp existant-------')

        res.status(400).json({message: "il existe deja un esp avec la meme signature"});

    } else {//Sinon on ajoute l'esp avec ses paramètres
        console.log('---------nouvel esp-------')
        const newEsp = new EspModel({
            adresseMac: data.adresseMac,
            adresse: data.adresse,
            userId: data.userId,
        });
        await newEsp.save()
            .then(data => {
                res.json({message: "Sucess, correctly added to the dataBASE"});
            })
            .catch(err => {
                res.status(400).json({message: err.message});
            })
    }
}

const deleteEsp = async (req, res) => {//Requête qui permet de supprimer un esp grace a id
    const id = req.params.id;
    await EspModel.deleteOne({_id: id})
        .then(rslt => {
            res.status(200).send({message: "Great Success ! ESP has been deleted !"})
        })
        .catch(err => {
            res.status(400).send({message: err.message});
        })
}

const updateEsp = async (req, res) => {//Requête qui permet de modifier les donnees  d'un esp via le body grace a son id
    let id = req.body._id;
    let update = req.body;
    if (!req.body) {
        return res.status(400).json({
            success: false,
            error: 'pas de bo(r)dy :hihi',
        })
    }
    EspModel.findByIdAndUpdate(id, {$set: update}, function (err, result) {
        if (err) {
            console.log(err);
            return res.status(404).json({
                error,
                message: 'Esp not updated.',
            })
        }

        return res.status(200).json({
            success: true,
            id: id,
            message: 'Esp updated successfully.',
        })
    });
}

const getEspById = async (req, res) => {//Requete qui permet de get un esp par rapport à son id
    const idUser = req.params.id;
    await EspModel.find({userId: idUser})
        .then(rslt => {
            rslt.length ? res.status(200).json(rslt) : res.status(200).json({erreur: "pas d'ESP connu ...."})
        })
        .catch(err => {
            res.status(400).send({message: err.message});
        })
}

module.exports = {
    getAll: getAll,
    newEsp: newEsp,
    getEspById: getEspById,
    deleteEsp: deleteEsp,
    updateEsp: updateEsp
}
