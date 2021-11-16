<template>
    <div class="page">
        <div class="middle">
          <!--Titre-->
            <h1 class="titleguide">
                INSTRUCTIONS

            </h1>
    <!--Introduction-->
            <v-flex class="butappli">  Le but de l'application est de d'observer les données météorologiques données depuis l'api de openWeatherMeteo grâce à la page MAP qui nous permet de faire une recherche par ville en France, mais aussi d'analyser les données météorologiques qu'émettent les esp ajoutés par chaque utilisateur.
            </v-flex>
            <!--Partie MAP-->
            <v-flex class="fonce"> La page MAP :
            </v-flex>
            <v-flex class="introguide">  La page map permet de rechercher la météo d'une ville en particulier en France et d'en ressortir la position sur la carte et les résultats sous forme de statistiques :
            </v-flex>
            <!--Image-->
            <v-img :src="image1" class="image1"></v-img>

            <v-flex class="introguide">De plus, comme vous pouvez voir le marqueur rouge permet de connaître l'emplacement de la recherche avec des statistiques comme la température, l'humidité ou la pression de la ville.
            </v-flex>
            <v-flex class="introguide">Enfin, on peut voir des marqueurs bleus qui représente les esp de chaque utilisateur et on peut voir les détails de données en cliquant sur le marqueur.
            </v-flex>
            <!--Image-->
            <v-img :src="map2" class="image1"></v-img>



            <!--Partie PROFIL-->
            <v-flex class="fonce"> La page PROFIL :
            </v-flex>
            <v-flex class="introguide">  La page profil affiche les informations de l'utilisateur à gauche de la page et affiche les esp que l'utilisateur a ajouté avec l'adresse mac et leur localisation :
            </v-flex>
            <!--Image-->
            <v-img :src="profil" class="image1"></v-img>

            <v-flex class="introguide">  En clickant sur un de nos esp on peut voir sa localisation avec un marqueur sur la carte :
            </v-flex>
            <!--Image-->
            <v-img :src="esp" class="image1"></v-img>

            <v-flex class="introguide">  Et si on voudrait ajouter un nouveau esp, il faudra renseigner son adresse mac et pointer la position sur la carte:
            </v-flex>
            <!--Image-->
            <v-img :src="ajouteesp" class="image1"></v-img>



<v-flex class="fonce"> Configurer votre station météo ESP32
      </v-flex>
            <v-flex class="introguide"> Tout d'abbord récupérez votre ID utilisateur dans votre profil comme indiqué sur l'image si dessous:
            </v-flex>
            <v-img :src="copierID" class="image1"></v-img>
            <v-flex class="introguide"> Alimentez votre station météo, normalement celui-ci ne peut pas encore se connecter à internet, il faut alors appuyer sur le boutton "Boot" pour le mettre en mode configuration (la LED bleu reste allumée dans ce mode).
                <br> Connectez-vous au Wi-Fi "ESP32" et ouvrez la page 192.168.4.1 dans votre navigateur.
               <br>Copiez votre adresse MAC afin de la renseigner par la suite.
                <br> Remplissez les informations comme dans l'exemple ci-dessous:
            </v-flex>
      <v-img :src="configurerESP" class="image1"></v-img>

            <v-flex class="introguide"> Une fois vos données sauvegardées, pressez à nouveau le boutton boot de votre ESP32 et attendez que la LED ne clignote plus.
                <br>Une fois que c'est le cas, félicitation votre ESP envoie bien des données au serveur !
                <br>Si votre LED clignote c'est que l'ESP n'est pas connecté à internet ou que le brocker est indisponible (clignotement plus rapide)
            </v-flex>
            <v-img :src="saved" class="image1"></v-img>
            <v-flex class="introguide"> Vous n'avez plus qu'à aller dans votre profil pour ajouter l'ESP (adresse MAC et localisation) !
            </v-flex>
            <v-flex class="fin">  Merci pour votre attention, bonne navigation...
            </v-flex>



  
          
    </div>
  </div>
</template>

<script>
export default {
  
data: () => ({
  image1:null,
  map2:null,
  profil:null,
  esp:null,
  ajouteesp:null,
      
}),
mounted(){
  //On charge les images 
  this.image1 = require("@/assets/map.png");
  this.map2 = require("@/assets/map2.png");
  this.profil= require("@/assets/profil.png");
  this.esp= require("@/assets/esp.png");
  this.ajouteesp= require("@/assets/ajouteesp.png");
  this.copierID= require("@/assets/copieID.png");
    this.configurerESP= require("@/assets/configESP.png");
    this.saved= require("@/assets/saved.png");
}

}
</script>

<style>
.page {
color: rgb(255 255 255 / 87%);
}
.titleguide{
    text-align: center;
    margin-top: 20px;
    margin-bottom: 20px;
}
.introguide{
      font-weight: 500;
     
     margin-bottom: 20px;
     
}
.flexguide{
    display: flex;
    text-align: center;
}
.boutonguide{
    text-align: center;
   
}
.middle{
  margin-left: auto;
  margin-right: auto;
  width: 80%;
}
.fonce{
   font-weight: 600;
   font-size: 30px;
   margin-bottom: 20px;
   margin-top: 10px;
}
.image1{
  width: 50%;
  height: 50%;
  border: solid;
  margin-top: 10px;
  margin-bottom: 10px;
 
}
.fin{
  font-size: 35px;
  text-align: center;
  margin-bottom: 50px;
  margin-top: 50px;
}

.butappli{
     
     font-weight: 600;
     margin-bottom: 20px;
     font-size: 20px;
}

</style>
