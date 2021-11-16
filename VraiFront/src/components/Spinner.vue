<template>
  <div class="spinner" id="spinner">
    <v-progress-circular
      :size="70"
      :width="7"
      color="white"
      indeterminate
    ></v-progress-circular>
  </div>
</template>


<script>
export default {
  name: "Spinner",
  props: ["showSpinner"],
  data: () => {
    return {};
  },
  mounted() {
    if (this.showSpinner) {
      console.log("spinner", this.showSpinner);
      this.showSpinner ? this.afficherLeSpinner() : this.cacherLeSpinner();
    }
  },
  watch: {
    showSpinner: function () {
      this.showSpinner ? this.afficherLeSpinner() : this.cacherLeSpinner();
    },
  },
  methods: {
    cacherLeSpinner() {
      this.showSpinner = false;
      var overlay = document.getElementById("spinner");
      overlay.style.display = "none";
    },
    afficherLeSpinner() {
      this.showSpinner = true;
      var overlay = document.getElementById("spinner");
      overlay.style.display = "block";
    },
  },
};
</script>

<style scoped>
.v-progress-circular {
  position: fixed;
}
.spinner {
  z-index: 999;
  position: fixed;
  display: none;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  padding-top: 25%;
  text-align: center;
}
</style>