<template>
  <v-card class="card">
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="headline">
          {{ city }}
        </v-list-item-title>
        <v-list-item-subtitle>{{
            "Latitude: " + latitude + " / Longitude: " + longitude
          }}
        </v-list-item-subtitle>
        <!-- Mettre la date-->
      </v-list-item-content>
    </v-list-item>

    <v-card-text>
      <v-row align="center">
        <v-col class="display-3" cols="6"> {{ temperature }} &deg;C</v-col>
        <v-col cols="6">
          <v-icon class="icon"> {{ tempicon }}</v-icon>
        </v-col>
      </v-row>
    </v-card-text>

    <v-list-item>
      <v-list-item-icon>
        <v-icon>mdi-weather-windy</v-icon>
      </v-list-item-icon>
      <v-list-item-subtitle>{{ wind }}</v-list-item-subtitle>
    </v-list-item>

    <v-list-item>
      <v-list-item-icon>
        <v-icon>mdi-cloud-download</v-icon>
      </v-list-item-icon>
      <v-list-item-subtitle>{{ humidity }}</v-list-item-subtitle>
    </v-list-item>

    <v-list class="transparent">
      <v-list-item v-for="item in forecast" :key="item.day">
        <v-list-item-title>{{ item.type }}</v-list-item-title>

        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-subtitle class="text-right">
          {{ item.value }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import {defineComponent} from "@vue/composition-api";

export default defineComponent({
  props: {
    weatherbis: {},

  },
  data() {
    return {
      today: new Date(),
      wind: "--",
      city: "--",
      temperature: "--",
      humidity: "--",
      latitude: "--",
      longitude: "--",
      tempicon: "",
      forecast: [
        {type: "Temperature ressentie", icon: "mdi-thermometer", value: "--"},
        {type: "Pression", icon: "mdi-arrow-split-horizontal", value: "--"},
      ],
    };
  },
  mounted() {
    if(this.weatherbis) //Si weatherbis est bien chargé alors 
    {
    this.setup();
    }
  },
  watch: {
    weatherbis: function () {
      this.setup();
    }
  },
  methods: {
    setup() {// Méthode permettant d'affecter à des variables certaines valeurs de l'api openWeather
      this.weather = this.weatherbis;//Le body des données de l'api
      this.temperature = this.weather.main.temp;//La température de la recherche
      this.city = this.weather.name;//La vile de la recherche
      this.latitude = this.weather.coord.lat;//L'altitude de la recherche
      this.longitude = this.weather.coord.lon;//Longitude de la recherche
      this.forecast[0].value = this.weather.main.feels_like + " \xB0";//La température ressentie de la recherche
      this.humidity = this.weather.main.humidity + " %";//L'humidité' de la recherche
      this.wind = this.weather.wind.speed + " km";//La vitesse du vent de la recherche

      //Ajout d'une icone correspondant à la méteo de la recherche
      if (this.weather.weather[0].main === "Clouds") {
        this.tempicon = "mdi-cloud";
      } else if (this.weather.weather[0].main === "Thunderstorm") {
        this.tempicon = "mdi-weather-lightning";
      } else if (this.weather.weather[0].main === "Rain") {
        this.tempicon = "mdi-weather-pouring";
      } else if (this.weather.weather[0].main === "Snow") {
        this.tempicon = "mdi-snowflake";
      } else if (this.weather.weather[0].main === "Clear") {
        this.tempicon = "mdi-weather-partly-cloudy";
      }
      else if (this.weather.weather[0].main === "Drizzle") {
        this.tempicon = "mdi-weather-rainy";
      }
      this.forecast[1].value = this.weather.main.pressure + " hPa";
    },


  },
});
</script>

<style>
.card {
  width: 40%;
}

.icon {
  transform: scale(5);
  margin-left: 100px;
}

</style>
