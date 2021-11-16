<template>
  <div>
    <v-app-bar
        dark
        style="background-color:#191970"

    >
    <!-- Drawer avec les différentes pages-->
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>PROJET METEO</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon @click="logout">
        <v-icon>mdi-export</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
        v-model="drawer"
        app
        absolute
        bottom
        temporary
    >
      <v-sheet
          color="grey lighten-4"
          class="pa-4">

      </v-sheet>

      <v-divider></v-divider>
      <v-list
          v-for="lien in navbarButtons"
          :key="lien.href"
      >
        <v-list-item :to="lien.href">
          <!-- ICON -->
          <v-list-item-icon>
            <v-icon>{{ lien.icon }}</v-icon>
          </v-list-item-icon>

          <!-- Text -->
          <v-list-item-content>
            <v-list-item-title>{{ lien.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>


  </div>
</template>

<script>
export default {
  data: () => ({
    drawer: false,
    group: null,
    navbarButtons: {
      Map: {
        icon: 'mdi-google-maps',
        title: 'Map',
        href: '/map'
      },
      Profil: {
        icon: 'mdi-account',
        title: 'Profil',
        href: '/user'
      },
      Guide :{
        icon: 'mdi-help-circle-outline',
        title: 'Guide',
        href: '/guide/'
      },

    }
  }),
  mounted() {
    this.drawer = false;

  },
  watch: {

    group() {
      this.drawer = false
    },
  },
  methods: {
    logout: function () {//Méthode pour se déconnecter
      this.$session.destroy();
      console.log("cancel")
      this.$router.replace('login');
    }
  }
};
</script>

<style>
</style>
