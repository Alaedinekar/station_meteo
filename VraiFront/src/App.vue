<template>
  <v-app>

    <PHeader/>
    <router-view/>


  </v-app>

</template>

<script>

import PHeader from "./components/PHeader";

export default {
  name: "App",
  mounted() {
    if (!this.authenticated) {
      // this.$router.replace({ name: "login" });

    } else {
      this.$router.replace({name: "map"});

    }
  },
  components: {
    "PHeader": PHeader,

  },
  data() {
    return {

      authenticated: false,
      userId: ''
    }
  }
  ,
  methods:
      {}
}
</script>

<style>
#app {
  background-color: #4299e1;
}
</style>
