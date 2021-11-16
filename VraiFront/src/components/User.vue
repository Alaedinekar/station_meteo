<template>
  <div class="page">
    <div v-if="token === undefined" class="pasCo">
      <v-btn href="/iotMeteo/#/login">
        Veuillez vous connecter pour acceder a ce contenu
      </v-btn
      >
    </div>
    <div v-if="token">
      <spinner :showSpinner="showSpinner"></spinner>
      <v-main>
        <v-container>
          <v-row>
            <v-col cols="12" sm="3">
              <v-card
                  rounded="lg"
                  v-if="userInfos"
                  min-height="268"
                  elevation="5"
              >
                <v-img rounded="lg" :src="`${userInfos.picUrl}`"></v-img>
                <!--  -->
                <v-card-text>
                  <h3>
                    {{ userInfos.userLastName + " " + userInfos.userFirstName }}
                  </h3>
                  <div>
                    <a :href="`mailto:${userInfos.userEmail}`">
                      {{ userInfos.userEmail }}</a
                    ><br/>
                    {{ userInfos.userAddress }}<br/>
                    {{ userInfos.userPhoneNumber }}
                  </div>


                  <button type="button" @click="doCopy"><u>Copier votre ID</u></button>


                </v-card-text>
              </v-card>

              <v-spacer></v-spacer>
              <v-flex class="pa-2">
                <v-layout justify-center>
                  <v-btn color="red" dark v-on:click="logout" width="80%">
                    Se déconnecter
                  </v-btn>
                </v-layout>
              </v-flex>
            </v-col>

            <v-col cols="12" sm="7">
              <!-- <v-container > -->

              <v-card v-if="listEsp">
                <v-col
                    v-for="(esp, index) in listEsp"
                    :key="esp.adresseMac"
                    cols="12"
                    rounded="lg"
                >
                  <v-card elevation="5" class="pa-5" v-if="listEsp">
                    <p>
                      <v-btn
                          class="mx-2"
                          fab
                          dark
                          x-small
                          color="red"
                          @click="deleteEsp(esp._id)"
                      >
                        <v-icon dark> mdi-delete</v-icon>
                      </v-btn>
                      <b>Esp n° {{ index + 1 }} : </b> {{ esp.adresseMac }}
                    </p>
                    <hr/>
                    <a @click="afficherModalCarte(esp)">
                      <span>
                        Localisation de l'esp :
                        {{ esp.adresse.lat + " " + esp.adresse.lng }}</span
                      >
                    </a>
                  </v-card>
                </v-col>
              </v-card>

              <!--DEBUT CARTE ESP SELECTIONNE -->
              <v-dialog v-model="afficherCarte" max-width="600px">
                <v-card>
                  <v-card-title>
                    <span class="headline">Localisation de l'esp : </span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <div class="map">
                            <l-map
                                :zoom="zoom"
                                :center="center"
                                style="height: 100%; width: 100%; z-index: 1"
                                @update:center="centerUpdate"
                                @update:zoom="zoomUpdate"
                                @update:bounds="boundsUpdated"
                                @click="addMarkerModif"
                                v-if="espEnCoursMap"
                            >
                              <l-tile-layer
                                  :url="url"
                                  :attribution="attribution"
                              />

                              <l-marker :lat-lng="markerEspEnCoursMap">
                              </l-marker>
                              <l-marker v-if="modifEspPosition" :lat-lng="markerModifEsp">
                                <l-icon
                                    :icon-size="dynamicSize"
                                    :icon-anchor="dynamicAnchor"
                                    :icon-url="iconOpenWeatherRed"
                                />
                              </l-marker>
                            </l-map>
                          </div>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        v-if="!modifierPosition"
                        color="blue darken-1"
                        text
                        @click="modifierPosition = true"
                    >
                      Modifier
                    </v-btn>
                    <v-btn
                        v-if="modifierPosition"
                        color="blue darken-1"
                        text
                        @click="modifierEsp(espEnCoursMap)"
                    >
                      Envoyer
                    </v-btn>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="afficherCarte = false"
                    >
                      Fermer
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <!--FIN CARTE ESP SELECTIONNE -->

              <!--DEBUT FORMULAIRE AJOUT ESP -->
              <v-card>
                <v-card-subtitle> Ajouter un esp:</v-card-subtitle>
                <v-form
                    @submit.prevent="validateNewEsp()"
                    ref="form"
                    v-model="valid"
                >
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-text-field
                            v-model="newEspAdressMac"
                            :rules="adressMacRules"
                            label="Adresse Mac de votre esp"
                            required
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" md="6">
                        <a @click="afficherModalCarteAddNewEsp()">
                          <span v-if="!newEspPosition">
                            Cliquez pour choisir la localisation de l'esp.
                          </span>
                          <span v-if="newEspPosition">
                            Localisation de l'esp :{{
                              "lat: " +
                              Math.round(newEspPosition.lat * 100) / 100 +
                              " lng: " +
                              Math.round(newEspPosition.lng * 100) / 100
                            }}
                          </span>
                        </a>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-btn
                            id="custom-disabled"
                            class="mx-2"
                            fab
                            dark
                            x-small
                            color="green"
                            type="submit"
                            :disabled="!valid"
                        >
                          <v-icon dark> mdi-plus</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-card>
              <!--FIN FORMULAIRE AJOUT ESP -->

              <!--DEBUT CARTE NOUVEAU ESP -->
              <v-dialog v-model="modalCarteNewEsp" max-width="900px">
                <v-card>
                  <v-card-title>
                    <span class="headline"
                    >Cliquez sur la carte pour ajouter la localisation de
                      votre esp :
                    </span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <div class="map">
                            <l-map
                                :zoom="zoom"
                                :center="center"
                                style="height: 100%; width: 100%; z-index: 1"
                                @update:center="centerUpdate"
                                @update:zoom="zoomUpdate"
                                @update:bounds="boundsUpdated"
                                @click="addMarker"
                            >
                              <l-tile-layer
                                  :url="url"
                                  :attribution="attribution"
                              />

                              <l-marker
                                  v-if="markerNewEsp"
                                  :lat-lng="markerNewEsp"
                              >
                                <l-icon
                                    :icon-size="dynamicSize"
                                    :icon-anchor="dynamicAnchor"
                                    :icon-url="iconOpenWeatherRed"
                                />
                              </l-marker>
                            </l-map>
                          </div>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="modalCarteNewEsp = false"
                    >
                      Fermer
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <!--FIN CARTE NOUVEAU ESP -->
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </div>
      
  </div>
</template>

<script>
// Popup Import
import Spinner from "@/components/Spinner";
import {latLng} from "leaflet";
import {LMap, LTileLayer, LMarker, LIcon} from "vue2-leaflet";
import urlApi from './ConfApi.js';


export default {
  components: {Spinner, LMap, LTileLayer, LMarker, LIcon,  },
  name: "user",

  data() {
    return {
      listEsp: [],
      message: '',
      copiedText: '',
      iconOpenWeatherRed: null,
      showSpinner: false,
      dialog: false,
      show: false,
      adresseMac: undefined,
      adresse: undefined,
      userInfos: undefined,
      userId: undefined,
      token: undefined,
      nom: undefined,
      prenom: undefined,
      afficherCarte: false, //on cache la carte par defaut
      espEnCoursMap: undefined, //esp en cours d'utilisation dans la map
      markerEspEnCoursMap: undefined,
      center: undefined,
      bounds: null,
      zoom: 10,
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      //partie formulaire add esp
      valid: false, //si le formulaire est valide ou non
      newEspAdressMac: null, //premier champ du formulaire d'ajout d'esp champ adresseMac
      adressMacRules: [
        (v) => !!v || "l'adresse mac est requises",
        (v) =>
            /^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$/.test(v) ||
            "L'adresse mac n'est pas valide.", //permet de tester avec un regex si l'adresse mac a un bon format
      ],
      newEspPosition: null, //second champ du formulaire d'ajout d'esp champ position ( latlng )
      modalCarteNewEsp: false, //modal a afficher ou non pour l'esp
      markerNewEsp: null,
      //partie modif position esp:
      markerModifEsp: null,
      modifEspPosition: null,
      modifierPosition: false,
      myPrevision: undefined,
    };
  },
  mounted() {
    this.iconOpenWeatherRed = require("@/assets/marker-icon-red.png");//On charge l'image depuis assets
    if (this.$session.get("userId")) {//Si on arrive a avoir l'id utilisateur de cette session alors on affecte ces valeurs
      this.token = this.$session.get("token");
      this.userId = this.$session.get("userId");
      this.message = this.userId;
      this.getMyEsps();
      this.getUserInfos();
      this.getMyPrevision();
    }
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
    getUserInfos: function () {
      this.showSpinner = true;
      fetch(`${urlApi}/user/id/${this.userId}`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": this.$session.get("token"),
        },
      })
          .then((e) => {
            e.json().then((json) => {
              this.userInfos = json[0];
              this.nom = this.capitalizeFirstLetter(json[0].userFirstName);
              this.nom = json[0].userLastName;
              this.showSpinner = false;
            });
          })
          .catch((err) => {
            console.error(err);
            //on cache le spinner si on arrive pas àa récupèrer les données pour ne pas géner l'utilisateur
            this.showSpinner = false;
          });
    },
    zoomUpdate(zoom) {
      this.zoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    boundsUpdated(bounds) {
      this.bounds = bounds;
    },
    capitalizeFirstLetter: function (string) {
      string = string.toLowerCase();
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    logout: function () {
      this.$session.destroy();
      console.log("cancel");
      this.$router.go("/");
    },
    //permet d'afficher la modal de la carte avec les données de l'esp correspondant
    //prend en parametre l'esp a mettre
    afficherModalCarte: function (esp) {
      //hack permettant d'afficher la map correctement.
      //la carte étant caché puis affiché on a besoin de redimensionné la fenetre pour l'afficher  :
      //https://github.com/vue-leaflet/Vue2Leaflet/issues/96#issuecomment-341459943
      setTimeout(function () {
        window.dispatchEvent(new Event("resize"));
      }, 250);
      this.espEnCoursMap = esp;
      this.afficherCarte = true;
      this.modifierPosition = false;
      //on set la position du marker
      this.markerEspEnCoursMap = latLng(
          this.espEnCoursMap.adresse.lat,
          this.espEnCoursMap.adresse.lng
      );
      //on set la position du centre
      this.center = latLng(
          this.espEnCoursMap.adresse.lat,
          this.espEnCoursMap.adresse.lng
      );
    },
    //affiche la modal pour le formulaire d'ajout d'esp
    afficherModalCarteAddNewEsp() {
      setTimeout(function () {
        window.dispatchEvent(new Event("resize"));
      }, 250);
      this.modalCarteNewEsp = true;

      //on centre sur paris pour ne pas avoir des coordonées dans l'océan si aucun marker n'est encore posé
      if (!this.markerNewEsp) {
        this.center = latLng(48.866667, 2.333333);
        this.zoom = 6;
      } else {
        this.center = latLng(this.markerNewEsp.lat, this.markerNewEsp.lng);
      }

    },
    addMarker(event) {//On ajoute un marqueur 
      this.markerNewEsp = event.latlng;
      this.newEspPosition = {lat: event.latlng.lat, lng: event.latlng.lng};
    },
    addMarkerModif(event) {//Permet de modifier le marqueur
      if (this.modifierPosition) {
        this.markerModifEsp = event.latlng;
        this.modifEspPosition = {lat: event.latlng.lat, lng: event.latlng.lng};
      }
    },
    getMyEsps: async function () {//Permet de get les esp de l'utilisateur
      this.showSpinner = true;
      await fetch(`${urlApi}/esp/getEsp/${this.userId}`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": this.$session.get("token"),
        },
      })
          .then((res) => {
            res.json().then((resJson) => {
              //on cache le spinner
              this.showSpinner = false;
              this.listEsp = resJson;
              //on recupere un code 200 mais on a pas d'esp, juste un objet "erreur" on remet donc la list vide
              if (this.listEsp.erreur) {
                this.listEsp = [];
              }
            });
            this.showSpinner = false;
          })
          .catch((err) => {
            console.error(err);
            //on cache le spinner si on arrive pas àa récupèrer les données pour ne pas géner l'utilisateur
            this.showSpinner = false;
          });
    },
    deleteEsp(id) {//Permet de supprimer un esp de l'utilisateur
      this.showSpinner = true;
      const deleteMethod = {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": this.$session.get("token"),
        },

      }
      fetch(`${urlApi}/esp/delete/${id}`, deleteMethod)
          .then(response => response.json())
          .then(data => {
            this.showSpinner = false;
            this.listEsp = this.listEsp.filter(esp => esp._id !== id)
            console.log('delete: ', data)
          })
          .catch(err => {
            console.log(err);
            this.showSpinner = false;
          })

    },

    getMyPrevision: async function () {//Permet de get les prevision de l'api
      this.showSpinner = true;
      await fetch(`${urlApi}/meteo/previsionbyid/${this.userId}`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": this.$session.get("token"),
        },
      })
          .then((res) => {

            if (res.status === 404) {
              console.log('ville inconnu');
            } else {
              res.json().then((resJson) => {
                //on cache le spinner
                this.showSpinner = false;
                this.myPrevision = resJson;
                //on recupere un code 200 mais on a pas d'esp, juste un objet "erreur" on remet donc la list vide
              });
              this.showSpinner = false;
            }

          })
          .catch((err) => {
            console.error(err);
            //on cache le spinner si on arrive pas àa récupèrer les données pour ne pas géner l'utilisateur
            this.showSpinner = false;
          });
    },

    modifierEsp(esp) {//Permet de modifier l'esp
      this.showSpinner = true;
      const putMethod = {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": this.$session.get("token"),
        },
        body: JSON.stringify({
          _id: esp._id,
          adresseMac: esp.adresseMac,
          adresse: {lng: this.modifEspPosition.lng, lat: this.modifEspPosition.lat},
          userId: esp.userId,
        })
      }
      fetch(`${urlApi}/esp/put`, putMethod)
          .then(response => response.json())
          .then(() => {
            this.showSpinner = false;
            alert('la position de votre esp a bien été modifié.')
            //on remet tout a 0
            this.markerModifEsp = null;
            this.modifEspPosition = false;
            this.afficherCarte = false;
            this.getMyEsps();
          })
          .catch(err => {
            this.showSpinner = false;
            console.log(err)
          })
    },
    //permet d'ajouter l'esp
    validateNewEsp() {
      //on verifie la validite du fomr
      this.$refs.form.validate();
      //on verifie si on a bien une position
      if (!this.newEspPosition) {
        alert("Veuillez renseigner une adresse pour votre esp.");
        return;
      }

      let body = {
        adresseMac: this.newEspAdressMac,
        adresse: this.newEspPosition,
        userId: this.userId,
      };
      fetch(urlApi + "/esp/addEsp", {
        method: "post",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": this.$session.get("token"),
        },
      }).then((res) => {
        if (res.ok) {
          console.log("l'esp a bien été ajouté");
          alert("l'esp a bien été ajouté à votre compte");
          res.json().then((data) => {
            console.log("res.json de l'add esp", data);
            this.listEsp.push(body);
          });
          //
        } else {
          alert("l'esp n'a pas pu être ajouté.");
        }
      });
    },
    doCopy: function () {
      this.$copyText(this.message).then(function (e) {
        alert('Copie reussi')
        console.log(e)
      }, function (e) {
        alert('echec de la copie')
        console.log(e)
      })
    }


  },
};
</script>

<!-- la balise style ne doit pas comporter de scoped pour des questions de compatibillité leaflet
en attendant de trouver une solution viable il faut bien baliser le css utilisé-->
<style>
h3.capitalize {
  text-transform: capitalize;
}

.map {
  width: 0%;
  height: 0%;
  display: inline-block;
}

.pasCo {
  display: flex;
  justify-content: center;
  margin-top: 300px;
}

/*vuetify cache les boutons disabled sur un fond blanc pour parer ça il faut suivre la règle de priorité du css
https://stackoverflow.com/a/63762909*/
#custom-disabled.v-btn--disabled {
  background-color: #78797a !important;
}
</style>
