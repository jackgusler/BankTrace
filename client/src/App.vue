<script setup lang="ts">
import { RouterView } from 'vue-router'
//import { getSession } from './model/session'
import NavBar from './components/NavBar.vue';

//const session = getSession();
</script>

<template>
  <div class="container">
    <!-- <progress class="progress is-small is-primary" max="100" v-if="session.loading">15%</progress> -->
    <RouterView />
  </div>
  <NavBar />

</template>

<style scoped>
  .container {
    background-color: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    padding: 5px;
    min-height: calc(100vh - 52px);
  }
</style>