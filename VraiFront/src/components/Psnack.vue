<template>
  <div class="text-center ma-2">
    <v-btn
      dark
      @click="snackbar = true"
    >
      Voir les prévisions
    </v-btn>


    
    <v-snackbar
      v-model="snackbar"  
    
     
     
    >
    <span  v-for="(prevision, idx) in previsions" :key="idx">{{ "La météo "+ prevision.time + " sera" + prevision.donnee}}<br></span>
      

      <template v-slot:action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="snackbar = false"
          
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    
  </div>
</template>

<script>
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  props: {
    previsionbis: {},

  },
  data() {
    return {
      today : new Date(),
      previsions : [
        {donnee:undefined,time:" aujourdhui"},
        {donnee:undefined,time:" dans 1 jour"},
        {donnee:undefined,time:" dans 2 jours"},
        {donnee:undefined,time:" dans 3 jours"},
        {donnee:undefined,time:" dans 4 jours"},
      ],
     
      snackbar: false,
      
   

    };
  },
  mounted() {
    if(this.previsionbis) //Si weatherbis est bien chargé alors 
    {
    this.setup();
    }
  },
  watch: {
      previsionbis: function(){
        this.setup();
      }
    },
  methods: {

    changeDescription(arg){
      if(arg == "Clear"){
        arg = " éclairé";
      } 
      else if(arg == "Rain"){
        arg = " pluvieux";
      } 
      else if(arg == "Clouds"){
        arg = " nuageux";
      } 
      else if(arg == "Snow"){
        arg = " enneigé";
      } 
       else if(arg == "Drizzle"){
        arg = " brouillardeux";
      } 
       else if(arg == "Thunderstorm"){
        arg = " orageux";
      } 
      console.log(arg);
      return arg;
    },
    

    
     setup() {// Méthode permettant d'affecter à des variables certaines valeurs de l'api openWeather
      console.log(this.previsionbis);
      
      this.dataPrevision = this.previsionbis;//Le body des données de l'api

      //direct Jour meme
       //this.previsiontestdate = this.dataPrevision.list[0].dt_txt;
       this.previsions[0].donnee = this.dataPrevision.list[0].weather[0].main;
      
      //1 jour
      //this.previsiondate2= this.dataPrevision.list[13].dt_txt;
      this.previsions[1].donnee= this.dataPrevision.list[7].weather[0].main;


      //2 jours
      //this.previsiondate2= this.dataPrevision.list[13].dt_txt;
      this.previsions[2].donnee= this.dataPrevision.list[13].weather[0].main;


      //3 jours
      //this.previsiondate2= this.dataPrevision.list[13].dt_txt;
      this.previsions[3].donnee= this.dataPrevision.list[22].weather[0].main;

      // 4 jours 

      //this.previsiondate3= this.dataPrevision.list[30].dt_txt;
       this.previsions[4].donnee= this.dataPrevision.list[30].weather[0].main;


      this.previsions[0].donnee = this.changeDescription(this.previsions[0].donnee);
      this.previsions[1].donnee = this.changeDescription( this.previsions[1].donnee);
      this.previsions[2].donnee= this.changeDescription(this.previsions[2].donnee);
      this.previsions[3].donnee = this.changeDescription( this.previsions[3].donnee);
      this.previsions[4].donnee= this.changeDescription(this.previsions[4].donnee);

      
      
      this.snackbar = true;

      console.log(this.previsions);
      



      
      
    },


  },
});
</script>