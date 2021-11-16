<template>

<!-- FORMULAIRE -->
  <v-dialog v-model="dialog" persistent max-width="600px" min-width="360px">
    <div>
      <v-tabs
        v-model="tab"
        show-arrows
        background-color="deep-purple accent-4"
        icons-and-text
        dark
        grow
      >
        <v-tabs-slider color="purple darken-4"></v-tabs-slider>
        <v-tab v-for="i in tabs" :key="i.icon">
          <v-icon large>{{ i.icon }}</v-icon>
          <div class="caption py-1">{{ i.name }}</div>
        </v-tab>

        <!-- CONNEXION AVEC COMPTE-->
        <v-tab-item>
          <v-card class="px-4">
            <v-card-text>
              <v-form ref="loginForm" v-model="valid" lazy-validation>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="loginEmail"
                      :rules="loginEmailRules"
                      label="E-mail"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="loginPassword"
                      :append-icon="show1 ? 'eye' : 'eye-off'"
                      :rules="[rules.required, rules.min]"
                      :type="show1 ? 'text' : 'password'"
                      name="input-10-1"
                      label="Mot de passe"
                      hint="8 caractères minimum"
                      counter
                      @click:append="show1 = !show1"
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="6" xsm="12"></v-col>
                  <v-spacer></v-spacer>
                  <v-col class="d-flex" cols="12" sm="4" xsm="12" align-end>
                    <v-btn
                      x-large
                      block
                      :disabled="!valid"
                      color="success"
                      @click="checkConnection"
                      >Connexion
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <!-- END CONNEXION AVEC COMPTE-->

        <!-- CREATION COMPTE-->
        <v-tab-item>
          <v-card class="px-4">
            <v-card-text>
              <v-form ref="registerForm" v-model="valid" lazy-validation>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="lastName"
                      :rules="[rules.required]"
                      label="Nom"
                      maxlength="20"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="firstName"
                      :rules="[rules.required]"
                      label="Prénom"
                      maxlength="20"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="email"
                      :rules="emailRules"
                      label="E-mail"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="phone"
                      label="Numéro de Téléphone"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="address"
                      :rules="[rules.required]"
                      label="Ville de référence"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="password"
                      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                      :rules="[rules.required, rules.min]"
                      :type="show1 ? 'text' : 'password'"
                      name="input-10-1"
                      label="Mot de passe"
                      hint="At least 8 characters"
                      counter
                      @click:append="show1 = !show1"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      block
                      v-model="verify"
                      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                      :rules="[rules.required, passwordMatch]"
                      :type="show1 ? 'text' : 'password'"
                      name="input-10-1"
                      label="Confirmer le Mot de passe"
                      counter
                      @click:append="show1 = !show1"
                    ></v-text-field>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col class="d-flex ml-auto" cols="12" sm="3" xsm="12">
                    <v-btn
                      x-large
                      block
                      :disabled="!valid"
                      color="success"
                      @click="register"
                      >Envoyer
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-tab-item>

        <!-- END CREATION COMPTE-->

        <!-- CONNEXION INVITE-->
        <v-tab-item>
          <v-card class="px-12">
            <v-card-text>
              <v-form ref="guestForm" v-model="valid" lazy-validation>
                <v-row>
                  <v-card-title primary-title class="justify-center">
                    <div>
                      <h3 class="headline black--text text--accent-2">
                        Continuer en tant qu'invité ?
                      </h3>
                    </div>
                  </v-card-title>
                  <v-spacer></v-spacer>
                  <v-col class="d-flex" cols="12" sm="3" xsm="12" align-end>
                    <v-btn
                      x-large
                      block
                      :disabled="!valid"
                      color="success"
                      @click="guest"
                    >
                      Continuer
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-tab-item>

        <!-- END CONNEXION INVITE-->
      </v-tabs>
    </div>
  </v-dialog>

  <!-- END FORMULAIRE -->
</template>

<script>
import urlApi from './ConfApi.js';

export default {
  name: "login",
  mounted() {
    if (this.$session.get("userId")) {//Si la session get l'id de l'utilisateur, alors on change la route en ajoutant l'iduser
      this.$router.replace({
        name: `user`,
        params: {
          idUser: this.$session.get("userId"),
        },
      });
    }
  },
  computed: {
    passwordMatch() {//Méthode pour comparer si les mots de passe sont les memes
      return () =>
        this.password === this.verify || "Le mot de passe n'est pas le meme.";
    },
  },
  methods: {
    validate() {
      if (this.$refs.loginForm.validate()) {
        // submit form to server/API here...
      }
    },
    isAlreadyLogged: () => {
      //
    },
    register: async function () {//Sauvegarder les données de l'utilisateur lors de sa création
      let body = {
        userFirstName: this.firstName,
        userLastName: this.lastName,
        userEmail: this.email,
        userAddress: this.address,
        userPassword: this.password,
        userPhoneNumber: this.phone,
        picUrl: this.picUrl,
        skillsList: [],
        linkList: [],
        location: {
          longitude: 0.0,
          latitude: 0.0,
        },
      };
      fetch(urlApi + "/user/isAlreadyRegistered", {//Si l'utilisateur a déjà été crée 
        method: "post",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }).then((res) => {
        if (res.status === 200) {
          fetch(urlApi +"/user/addUser", {//Sinon on ajoute l'user
            method: "post",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
          });
          alert(
            `Utilisateur ${
              this.firstName + " " + this.lastName
            } ajouté avec succès !`
          );
          this.$refs.registerForm.reset();
          this.$router.go("/");
        } else if (res.status === 403) {//Sinon on ne fait rien si il est deja inscrit
          alert("Deja inscrit");
          this.$refs.registerForm.reset();
          this.$router.go("/");
        }
      });
    },
    guest() {
      console.log("redirected map");
      this.$router.push({ name: "map" });
    },
    checkConnection: async function () {//Méthode permettant de se connecter
      let body = {
        userEmail: this.loginEmail,
        userPassword: this.loginPassword,
      };
      fetch(urlApi + "/user/connection", {//Permet de faire appel à la requete connection qui nous permet de vérifier si l'email et password sont bons
        method: "post",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }).then((res) => {
        if (res.ok) {//Si les informations sont bonnes
          // this.$router.push({name : `user/${res.json()}`});

          res.json().then((data) => {//On start la session 
            this.$session.start();
            this.$session.set("token", data.token);
            this.$session.set("userId", data.userId);
            this.$router.go("user/" + data.userId);
            /*this.$router.replace({
              name: `user`,
              params: {
                idUser: data.userId,
              },
            });*/
          });
          //
        } else {
          this.loginPassword = "";
          alert("Mauvais identifiants");
        }
      });
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
  data: () => ({
    dialog: true,
    tab: 0,
    tabs: [
      { name: "Se connecter", icon: "mdi-account-key" },
      { name: "S'enregistrer", icon: "mdi-account-plus" },
      { name: "Invité", icon: "mdi-account-search" },
    ],
    valid: true,

    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    verify: "",
    loginPassword: "",
    loginEmail: "",
    loginEmailRules: [
      (v) => !!v || "Requis.",
      (v) => /.+@.+\..+/.test(v) || "l'E-mail doit être valide",
    ],
    emailRules: [
      (v) => !!v || "Requis.",
      (v) => /.+@.+\..+/.test(v) || "l'E-mail doit être valide",
    ],

    show1: false,
    rules: {
      required: (value) => !!value || "Requis.",
      min: (v) => (v && v.length >= 8) || "Minimum de 8 caractères",
    },
  }),
};
</script>
<style>
</style>
