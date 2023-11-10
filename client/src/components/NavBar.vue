<script setup lang="ts">
import { RouterLink } from "vue-router";
import LoginBadge from "./LoginBadge.vue";
//import { getSession } from "@/models/session";
import { ref } from "vue";

//const session = getSession();
const isActive = ref(false);
</script>

<template>
    <div>
        <nav class="navbar is-black" role="navigation" aria-label="main navigation">
          <div class="navbar-brand">
            <RouterLink class="navbar-item" to="/">
              <img
                src="https://bulma.io/images/bulma-logo-white.png"
                width="112"
                height="28"
              />
            </RouterLink>
            <a
              role="button"
              class="navbar-burger"
              :class="{ 'is-active': isActive }"
              @click="isActive = !isActive"
              aria-label="menu"
              aria-expanded="false"
              data-target="navbarBasicExample"
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>
          <div
            class="navbar-menu"
            id="navbarMenu"
            :class="{ 'is-active': isActive }"
          >
            <div class="navbar-start">
              <RouterLink class="navbar-item" to="/my-workouts"
                >My Workouts</RouterLink
              >
              <RouterLink class="navbar-item" to="/statistics"
                >Stats</RouterLink
              >
              <RouterLink class="navbar-item" to="/friends">Friends</RouterLink>
            </div>
            <LoginBadge />
          </div>
        </nav>
      </div>
</template>

<style scoped>

</style>