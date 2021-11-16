// Importation des modules
var path = require('path');
var ObjectId = require('mongodb').ObjectID;

// var, const, let :
// https://medium.com/@vincent.bocquet/var-let-const-en-js-quelles-diff%C3%A9rences-b0f14caa2049

//--- MQTT module
const mqtt = require('mqtt')
// Topics MQTT
const TOPIC_datas = 'sensors/IOTMIAGE/datas'

//---  The MongoDB module exports MongoClient, and that's what
// we'll use to connect to a MongoDB database.
// We can use an instance of MongoClient to connect to a cluster,
// access the database in that cluster,
// and close the connection to that cluster.
const {MongoClient} = require('mongodb');

//----------------------------------------------------------------
// This function will retrieve a list of databases in our cluster and
// print the results in the console.
async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
    
    console.log("Databases in Mongo Cluster : \n");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};


//----------------------------------------------------------------
// asynchronous function named main() where we will connect to our
// MongoDB cluster, call functions that query our database, and
// disconnect from our cluster.
async function v0(){
    const mongoName = "METEO"                   //Nom de la base
    const mongoUri = 'mongodb://localhost:27017/'; //URL de connection		
    //const uri = 'mongodb://10.9.128.189:27017/'; //URL de connection		
    //const mongoUri = 'mongodb+srv://admin:admin@cluster0.qd2by.mongodb.net/test?retryWrites=true&w=majority';
    
    //Now that we have our URI, we can create an instance of MongoClient.
    const mg_client = new MongoClient(mongoUri,
				      {useNewUrlParser:true, useUnifiedTopology:true});

    // Connect to the MongoDB cluster
    mg_client.connect(function(err,  mg_client){
	if(err) throw err; // If connection to DB failed ... 
   
	//===============================================    
	// Print databases in our cluster
	listDatabases(mg_client);

	//===============================================    
	// Get a connection to the DB "lucioles" or create
	dbo = mg_client.db(mongoName);



	dbo.listCollections({name: "datas"})
	    .next(function(err, collinfo) {
		if (collinfo) { // The collection exists
		    //console.log('Collection datas already exists');
		}
	    });

	//===============================================
	// Connexion au broker MQTT distant
	//
	const mqtt_url = 'mqtt://127.0.0.1:1883'
	//const mqtt_url = 'http://broker.hivemq.com'
	var client_mqtt = mqtt.connect(mqtt_url, {
		username: 'iot',
		password: 'salutcestleprojetiot' 
	});
	
	//===============================================
	// Des la connexion, le serveur NodeJS s'abonne aux topics MQTT 
	//
	client_mqtt.on('connect', function () {
	    client_mqtt.subscribe(TOPIC_datas, function (err) {
		if (!err) {
		    console.log('Node Server has subscribed to ', TOPIC_datas);
		}
	    })
	   
	})

	//================================================================
	// Callback de la reception des messages MQTT pour les topics sur
	// lesquels on s'est inscrit.
	// => C'est cette fonction qui alimente la BD !
	//
	client_mqtt.on('message', function (topic, message) {
	    console.log("\nMQTT msg on topic : ", topic.toString());
	    console.log("Msg payload : ", message.toString());

			var isValidJSON = true;
			try { JSON.parse(message) } catch { isValidJSON = false }

			if(isValidJSON)
			{
	    // Parsing du message suppos� recu au format JSON
	    message = JSON.parse(message);
	    wh = message.id

	    // Debug : Gerer une liste de who pour savoir qui utilise le node server	
	    let wholist = []
	    var index = wholist.findIndex(x => x.who==wh)
	    if (index === -1){
		wholist.push({who:wh});	    
	    }
	    console.log("wholist using the node server :", wholist);


	    // Mise en forme de la donnee � stocker => dictionnaire
	    // Le format de la date est iomportant => compatible avec le
	    // parsing qui sera realise par hightcharts dans l'UI
	    // cf https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_tolocalestring_date_all
	    // vs https://jsfiddle.net/BlackLabel/tgahn7yv
	    // var frTime = new Date().toLocaleString("fr-FR", {timeZone: "Europe/Paris"});
	    var frTime = new Date().toLocaleString("sv-SE", {timeZone: "Europe/Paris"});
			message.date = frTime; 
	    
			//myquery permet de verifier si l'userId et l'adresseMac sont les memes que données par l'esp
			let myquery = { "userId": message.userId, "adresseMac": message.id };

			dbo.collection("ESP_DATA")
				.findOne(myquery, function (err, data) {
					
					//si il n'y a pas d'erreur
					if (!err) {
						if(data)
						{
							//on ajoute l'adresse de ESP_DATA dans message
							message.adresse = data.adresse;
							var new_entry = message;
							// On recupere le nom basique du topic du message
							var key = path.parse(topic.toString()).base;
							// Stocker le dictionnaire qui vient d'etre cr�� dans la BD
							// en utilisant le nom du topic comme key de collection
							dbo.collection(key).insertOne(new_entry, function(err, res) {
						if (err) throw err;
						console.log("\nItem : ", new_entry, 
						"\ninserted in db in collection :", key);
							});
						}
						else {
							console.log("aucun esp ne correspond a l'utilisateur donné par l'esp");
						}
					}
				});	
			}//end if JSON

	    // Debug : voir les collections de la DB 
	    //dbo.listCollections().toArray(function(err, collInfos) {
		// collInfos is an array of collection info objects
		// that look like: { name: 'test', options: {} }
	    //	console.log("List of collections currently in DB: ", collInfos); 
	    //});
	}) // end of 'message' callback installation

	//================================================================
	// Fermeture de la connexion avec la DB lorsque le NodeJS se termine.
	//
	process.on('exit', (code) => {
	    if (mg_client && mg_client.isConnected()) {
		console.log('mongodb connection is going to be closed ! ');
		mg_client.close();
	    }
	})
	
    });// end of MongoClient.connect
}// end def main

//================================================================
//==== Demarrage BD et MQTT =======================
//================================================================
v0().catch(console.error);
