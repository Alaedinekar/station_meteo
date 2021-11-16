<template>
  <div class="small">
    <h2 v-if="prenom">Esp de l'utilisateur: {{ nom }} {{ prenom }}</h2>

    <h4 v-if="!aJour" style="color: orange">Donnees pas a jour</h4>
    <h4 v-if="aJour" style="color: green">Donnees a jour</h4>
    <h3 style="color: black">
      <v-icon large>mdi-image-filter-hdr</v-icon>
      Altitude : {{ this.valEsp[this.valEsp.length - 1].altitude }} m
    </h3>
    <div class="dataEsp">
      <line-chart :chart-data="datacollection" id="graph"></line-chart>
      <div class="liStyle" v-if="etatValiditeData">
        <table>
          <thead>
            <th>Type</th>
            <th>Fiabilité</th>
          </thead>
          <tbody>
            <tr v-for="(value, name) in etatValiditeData" :key="name">
              <td>
                {{ name }}
              </td>
              <td v-if="value">
                <v-tooltip bottom>
                  <template #activator="{ on }">
                    <span>
                      <v-icon style="color: green" dark v-on="on"
                        >mdi-check-circle-outline</v-icon
                      >
                    </span>
                  </template>
                  <span>Les données sont fiables.</span>
                </v-tooltip>
              </td>
              <td v-if="!value">
                <v-tooltip bottom>
                  <template #activator="{ on }">
                    <span>
                      <v-icon style="color: red" dark v-on="on"
                        >mdi-alert-circle-outline</v-icon
                      >
                    </span>
                  </template>
                  <span>Les données ne sont pas fiables.</span>
                </v-tooltip>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <v-app-bar color="rgba(0,0,0,0)" flat class="ma-1">
      <v-icon large>mdi-chart-bell-curve-cumulative</v-icon>
      <h3>Valeur</h3>
      <v-chip-group
        v-model="selection"
        active-class="teal accent-4 white--text"
        class="ma-1"
        mandatory
      >
        <v-chip @click="dataType('lumiere')">Lumière</v-chip>

        <v-chip @click="dataType('pression')">Pression</v-chip>

        <v-chip @click="dataType('humidite')">Humidité</v-chip>

        <v-chip @click="dataType('temperature')">Température</v-chip>

        <v-chip><input v-model="nbValeur" />Nb de Val</v-chip>
      </v-chip-group>
    </v-app-bar>
    <h3 style="color: black">Historique des 4 derniers jours :</h3>
    <div>
      <table>
        <thead>
          <th>Type/Date</th>
          <th
            v-for="(categorie, idx) in getMoyenneDataParSemaine(valeurSelec)"
            :key="idx"
          >
            {{ categorie.jour }}
          </th>
          <tr>
            <td>{{ valeurSelec }}</td>
            <td
              v-for="(categorie, idx) in getMoyenneDataParSemaine(valeurSelec)"
              :key="idx"
            >
              <span
                v-if="valeurSelec == 'pression' && categorie.moyenne != 'NaN'"
              >
                {{ (categorie.moyenne / 100).toFixed(2) }}
              </span>
              <span
                v-if="valeurSelec != 'pression' && categorie.moyenne != 'NaN'"
              >
                {{ categorie.moyenne }}
              </span>
              <span v-if="categorie.moyenne == 'NaN'">
                <v-tooltip bottom>
                  <template #activator="{ on }">
                    <v-icon style="color: red" dark v-on="on"
                      >mdi-alert-circle-outline</v-icon
                    >
                  </template>
                  <span>Pas de données ce jour là.</span>
                </v-tooltip>
              </span>
            </td>
          </tr>
        </thead>
      </table>
    </div>
  </div>
</template>

<script>
import { Line } from "vue-chartjs";
import LineChart from "./LineChart.js";
import urlApi from "./ConfApi.js";

export default {
  extends: Line,
  components: {
    LineChart,
  },
  data() {
    return {
      aJour: undefined,
      etatValiditeData: undefined,
      datacollection: null,
      prenom: undefined,
      nom: undefined,
      selection: 0,
      nbValeur: undefined, //A changer pour changer le nb de valeur du graph
      typeDataActuel: undefined,
      valeurSelec: "temperature",
    };
  },
  props: {
    valEsp: {},
  },
  mounted() {
    if (this.valEsp) {
      this.dataType("lumiere");
      this.getName();
      this.validationData();
      if (this.valEsp.length < 50) {
        this.nbValeur = 10;
      } else {
        this.nbValeur = 50;
      }
      this.getMoyenneDataParSemaine("temperature");
    }
  },
  methods: {
    //permet d'actualiser le Graph en fonction du type de data
    //les types de data possible: lumiere, pression, humidite, temperature
    dataType(typeData) {
      //On affecte typeData a valeurSelec pour pouvoir changer le tableua de l'historique
      this.valeurSelec = typeData;
      //permet de définir quel est le type de données en fonction du label
      let labelData =
        typeData === "lumiere"
          ? "Lumière en Lumens"
          : typeData === "pression"
          ? "Pression en hectoPascal"
          : typeData === "humidite"
          ? "Humidité en %"
          : "Température en °C";
      //défini le type de data en cours d'utilisation
      this.typeDataActuel = typeData;
      this.datacollection = {
        labels: this.getDate(),
        datasets: [
          {
            label: labelData,
            data: this.splitListData(typeData),
            backgroundColor: "transparent",
            borderColor: "rgba(1, 116, 188, 0.50)",
            pointBackgroundColor: "rgba(171, 71, 188, 1)",
          },
        ],
      };
    },
    //permet de prendre les données correspondantes au label donné par dataType(labelData);
    splitListData(typeData) {
      let res = [];
      let i = this.valEsp.length - this.nbValeur;
      let imax = this.valEsp.length;
      for (let index = i; index < imax; index++) {
        //on divise la valeur recue par 100 pour la pression car on recoit les valeurs sous forme de Pascal tandis que la norme et l'hectoPascal
        if (typeData === "pression") {
          res.push(this.valEsp[index][typeData] / 100);
        } else {
          res.push(this.valEsp[index][typeData]);
        }
      }
      return res;
    },

    getDate() {
      let res = [];
      let i = this.valEsp.length - this.nbValeur;
      let imax = this.valEsp.length;
      for (let index = i; index < imax; index++) {
        res.push(this.valEsp[index].date);
      }
      return res;
    },

    getName() {
      fetch(
        `${urlApi}/user/name/${this.valEsp[this.valEsp.length - 1].userId}`
      ).then((res) =>
        res.json().then((e) => {
          console.log("user: ", e);
          this.prenom = e.userFirstName;
          this.nom = e.userLastName;
        })
      );
    },

    //Recupere les données et fait une moyenne en fonction du type de donnée passé en param
    //données possiblent en param: lumiere, pression, humidite, temperature
    getMoyenneDataParSemaine(type) {
      const moment = require("moment");
      const dateFrom = moment().subtract(4, "d").format("YYYY-MM-DD");
      //filtre pour récuperer les données jusqu'a il y a 4 jours sans prendre la date du jour
      const dataOfTheWeek = this.valEsp
        .filter((data) => data.date > dateFrom)
        .filter((data) => data.date != moment());
      const days = [
        { moyenne: 0, jour: moment().subtract(1, "d").format("YYYY-MM-DD") },
        { moyenne: 0, jour: moment().subtract(2, "d").format("YYYY-MM-DD") },
        { moyenne: 0, jour: moment().subtract(3, "d").format("YYYY-MM-DD") },
        { moyenne: 0, jour: moment().subtract(4, "d").format("YYYY-MM-DD") },
      ];
      let cpt1 = 0;
      let cpt2 = 0;
      let cpt3 = 0;
      let cpt4 = 0;

      //pour chaque data de la semaine (4 jours) on cpt et on additionne pour la moyenne plus tard
      dataOfTheWeek.forEach((e) => {
        switch (moment(e.date).format("YYYY-MM-DD")) {
          case moment().subtract(4, "d").format("YYYY-MM-DD"):
            cpt4 = cpt4 + 1;
            days[3].moyenne = Number(days[3].moyenne) + Number(e[type]);
            break;
          case moment().subtract(3, "d").format("YYYY-MM-DD"):
            cpt3 = cpt3 + 1;
            days[2].moyenne = Number(days[2].moyenne) + Number(e[type]);
            break;
          case moment().subtract(2, "d").format("YYYY-MM-DD"):
            cpt2 = cpt2 + 1;
            days[1].moyenne = Number(days[1].moyenne) + Number(e[type]);
            break;
          case moment().subtract(1, "d").format("YYYY-MM-DD"):
            cpt1 = cpt1 + 1;
            days[0].moyenne = Number(days[0].moyenne) + Number(e[type]);
            break;
        }
      });

      //pour chaque jour de la semaine (4 jours) on calcule la moyenne à 2 décimals
      for (let i = 0; i < 4; i++) {
        switch (i) {
          case 0:
            days[i].moyenne = (days[i].moyenne / cpt1).toFixed(2);
            break;
          case 1:
            days[i].moyenne = (days[i].moyenne / cpt2).toFixed(2);
            break;
          case 2:
            days[i].moyenne = (days[i].moyenne / cpt3).toFixed(2);
            break;
          case 3:
            days[i].moyenne = (days[i].moyenne / cpt4).toFixed(2);
            break;
        }
      }
      console.log(days);
      return days;
    },

    //appel de l'api pour verifier les datas
    validationData() {
      fetch(urlApi + "/meteo/verif", {
        method: "post",
        body: JSON.stringify(this.valEsp[this.valEsp.length - 1]),
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": this.$session.get("token"),
        },
      }).then((res) => {
        try {
          res.json().then((data) => {
            if (!data.data) {
              this.etatValiditeData = data;
              this.aJour = true;
            } else {
              this.etatValiditeData = null;
              this.aJour = false;
            }
          });
          //
        } catch (err) {
          this.aJour = false;
          console.log("erreur");
        }
      });
    },
  },
  //permet de regarder la valeur d'une data dans le composant
  //https://vuejs.org/v2/guide/computed.html#Computed-vs-Watched-Property
  watch: {
    nbValeur: function () {
      this.dataType(this.typeDataActuel);
    },
    valEsp: function (val) {
      if (val) {
        console.log(val);
        this.dataType("lumiere");
        this.getName();
        this.validationData();
      }
      console.log(val);
    },
  },
};
</script>

<style scoped>
th,
td {
  border-bottom: 1px solid #ddd;
  padding: 15px;
  text-align: left;
}

tr:hover {
  background-color: #f5f5f5;
}

#graph {
  width: 60%;
}

h2 {
  color: #4299e1;
}

.dataEsp {
  display: flex;
}

.liStyle {
  margin-top: 50px;
  margin-left: 50px;
}
span {
  display: flex;
  justify-content: center;
}
</style>
