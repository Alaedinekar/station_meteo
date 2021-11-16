<template>
  <div class="page">
    <spinner :showSpinner="showSpinner"></spinner>
    <div class="section1">
      <v-flex class="saisir" style="color: white;">
        Veuillez saisir votre ville :
      </v-flex>
      <v-text-field
        v-model="position"
        placeholder="Exemple : (Nice, Paris, Guingamp ...)"
        label="Votre ville"
        filled
        rounded
        dense
        class="champ"
        :append-icon="(marker = 'mdi-magnify')"
        @click:append="loca"

      >
      </v-text-field>

      <!-- <v-text-field
      v-model= "esp"

            placeholder="adresse d'un esp"
          ></v-text-field> -->
    </div>
    <v-row>
      <v-col class="col1">
        <div class="map">
          <l-map
            :zoom="zoom"
            :center="center"
            :options="mapOptions"
            style="height: 100%; width: 50%; z-index: 1"
            @update:center="centerUpdate"
            @update:zoom="zoomUpdate"
          >
            <l-tile-layer :url="url" :attribution="attribution" />

            <l-marker
              v-for="item in listMarkersESP"
              :key="item.id"
              :lat-lng="item.position"
              @click="dataEspFetcherbyId(item.id)"
            >
              <l-popup>
                <v-dialog v-model="dialog" width="1000">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                    id="custom-disabled"
                      color="#191970"
                      dark
                      v-bind="attrs"
                      v-on="on"
                      :disabled="dataEsp == null"
                    >
                      Voir Détails
                    </v-btn>
                  </template>

                  <v-card>
                    <v-card-title class="headline grey lighten-2">
                      Graphiques de votre recherche
                    </v-card-title>

                    <v-card-text>
                      <Pgraph v-bind:valEsp="dataEsp" class="pgraph"></Pgraph>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" text @click="dialog = false">
                        Retour
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </l-popup>
            </l-marker>
            <l-marker v-if="weather" :lat-lng="markerOpenWeather">
              <l-icon
                :icon-size="dynamicSize"
                :icon-anchor="dynamicAnchor"
                :icon-url="iconOpenWeatherRed"
              />
            </l-marker>
          </l-map>
        </div>
      </v-col>
      <v-col>
        <Pstat v-bind:weatherbis="weather" class="pstat"></Pstat>
      </v-col>
    </v-row>
    <v-snackbar absolute top v-model="snackbarErrorCity">
      Ville Inconnue
      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="snackbarErrorCity = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    
    <Psnack v-if="dataPrevision" v-bind:previsionbis="dataPrevision"></Psnack>
    
   
  </div>
</template>


<script>
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup, LIcon } from "vue2-leaflet";
import Pgraph from "./Pgraph.vue";
import Pstat from "./Pstat.vue";
import Psnack from "./Psnack.vue";
import Spinner from "./Spinner.vue";
import urlApi from './ConfApi.js';

export default {
  name: "Pmap",

  components: {
    LMap,
    LTileLayer,
    LIcon,
    LMarker,
    LPopup,
    Pgraph,
    Pstat,
    Psnack,
    Spinner,
    
  },

  data() {
    return {
      esp: "",
      dataPrevision: undefined,
      position: "",
      zoom: 5,
      weather: undefined,
      dataEsp: undefined,
      dialog: false,
      showSpinner: false,
      markerOpenWeather: null,
      iconOpenWeatherRed: null,
      listMarkersESP: [],
      snackbarErrorCity: false,
      valid: true,
      center: latLng(46.232192999999995, 2.209666999999996),
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',

      currentZoom: 11.5,

      mapOptions: {
        zoomSnap: 0.5,
      },
      showMap: true,
    };
  },

  mounted() {
    this.iconOpenWeatherRed = require("@/assets/marker-icon-red.png");// On charge l'image du marqueur rouge
    this.getInfoEsp();
  },
  computed: {
    dynamicSize() {
      return [this.iconSize, this.iconSize * 1.15];
    },
    dynamicAnchor() {
      return [this.iconSize / 2, this.iconSize * 1.15];
    },
  },
  methods: {
    dataEspFetcherbyId: async function (mac) {//Méthode permettant d'envoyer les données météo de notre esp
      //on affiche le spinner qui sert de loader
      this.showSpinner = true;
      console.log("ESP ID: ", mac);
      await fetch(`${urlApi}/meteo/freshData/${mac}`)
          .then((res) => {
            res.json().then((body) => {
              if (body.erreur) {
                this.dataEsp = null;
              } else {
                this.dataEsp = body;
              }
              //on cache le spinner une fois qu'on a les données
              this.showSpinner = false;
            });
          })
          .catch((err) => {
            console.error(err);
            //on set les data de l'esp qu'on veut recup a null pour désactiver le bouton si aucune données trouvés
            this.dataEsp = null;
            //on cache le spinner si on arrive pas àa récupèrer les données pour ne pas géner l'utilisateur
            this.showSpinner = false;
          });
    },

    fetchApiWeather: async function () {//Méthode permettant de charger les données météo de l'api OpenWeather
      //on affiche le spinner qui sert de loader
      this.showSpinner = true;
      await fetch(urlApi + 
          "/meteo/openWeatherMeteo/" + this.position
      )
          .then((res) => {
            res.json().then((body) => {
              if (body.cod === "404") {
                this.snackbarErrorCity = true;
                //on cache le spinner avant de sortir
                this.showSpinner = false;
                //permet de quitter la fonction prématurement et ne pas continuer et initialiser weather
                return;
              }

              this.weather = body;

              //On ajoute a markerOpenWeather la longitude et la latitude de la position exacte de la station météo
              this.markerOpenWeather = latLng(
                  this.weather.coord.lat,
                  this.weather.coord.lon
              );
              this.center = latLng(
                  this.weather.coord.lat,
                  this.weather.coord.lon
              );

              //on cache le spinner une fois qu'on a les données ( obligé de le faire une seconde fois car on sort prématurement avec la 404)
              this.showSpinner = false;

            });
          })
          .catch((err) => {
            console.error(err);
            //on cache le spinner si on arrive pas àa récupèrer les données pour ne pas géner l'utilisateur
            this.showSpinner = false;
          });
      this.zoom = 12;

    },

    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    showLongText() {
      this.showParagraph = !this.showParagraph;
    },

    getPrevision: async function () {//Méthode permmettant d'obtenir la prévision météo de la recherche
      //on affiche le spinner qui sert de loader
      this.showSpinner = true;
      await fetch(`${urlApi}/meteo/prevision/${this.position}`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": this.$session.get("token"),
        }
      })
          .then((res) => {
            res.json().then((body) => {
              if (body.erreur) {
                this.dataPrevision = null;
              } else {
                console.log('prevision: ', body);
                this.dataPrevision = body;
              }
              //on cache le spinner une fois qu'on a les données
              this.showSpinner = false;
            });
          })
          .catch((err) => {
            console.error(err);
            this.dataPrevision = null;
            this.showSpinner = false;
          });
    },


    loca: async function () {//Permet a la recherche d'obtenir les données méteo actuelle et futures
      this.show = true;
      this.fetchApiWeather();
      this.getPrevision();
    },


    getInfoEsp() {
      //on affiche le spinner qui sert de loader
      this.showSpinner = true;
      fetch(urlApi + "/esp/")
          .then((response) => {
            response.json().then((res) => {

              res.forEach((e) => {
                this.listMarkersESP.push({
                  id: e.adresseMac,
                  position: e.adresse,
                });
                //on cache le spinner une fois qu'on a les données
                this.showSpinner = false;
              });
            });
          })
          .catch((err) => {
            console.error(err);
            //on cache le spinner si on arrive pas àa récupèrer les données pour ne pas géner l'utilisateur
            this.showSpinner = false;
          });
    },

  }
};
</script>
<style>
.section1 {
  margin-left: 40px;

}

.title {
  text-align: center;
}

.map {
  width: 100%;
  height: 500px;
}

.saisir {
  margin-top: 20px;
  margin-bottom: 20px;
}

.champ {
  width: 39%;
}

.col1 {
  position: absolute;
  top: 15%;
  /* display: block; */

  left: 48%;
  /* bottom: 10px; */
}

.pgraph {
  position: relative;
  width: 100%;
  height: 70%;
}

.dialog {
  position: relative;
  top: 400px;
  right: 250px;
  height: 20%;
}

.pstat {
  margin-left: 40px;
  margin-top: 30px;
}

.mr-4 {
  margin-left: 20px;
}

.page {
  background-color: #4299e1;
  /*width: 120%;*/
}


body{
  background-color: #191970;
}

.v-text-field--filled.v-input--dense > .v-input__control > .v-input__slot, .v-text-field--full-width.v-input--dense > .v-input__control > .v-input__slot, .v-text-field--outlined.v-input--dense > .v-input__control > .v-input__slot {
  min-height: 52px;
  background: white;
}

/*vuetify cache les boutons disabled sur un fond blanc pour parer ça il faut suivre la règle de priorité du css
https://stackoverflow.com/a/63762909*/
#custom-disabled.v-btn--disabled {
  background-color: #78797a !important;
}

</style>
