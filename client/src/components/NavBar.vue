<script setup lang="ts">
import { RouterLink } from "vue-router";
import LoginBadge from "./LoginBadge.vue";
import { getSession } from "@/models/session";


const session = getSession();
</script>

<template>
  <nav class="navbar is-black is-flex-touch">
    <div class="navbar-menu is-flex-touch" v-if="session.user">
      <div class="navbar-start">
        <RouterLink class="navbar-item" to="/" :class="{ 'is-selected': $route.path === '/' }">
          <span class="icon">
            <i class="fas fa-house"></i>
          </span>
        </RouterLink>
      </div>
      <div class="navbar-brand" style="flex-shrink: 0;">
        <img src="/BankTrace-logos_white.png" alt="logo" class="logo">
      </div>
      <div class="navbar-end" :class="{ 'is-selected': $route.path === '/account' }">
        <LoginBadge />
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar-menu {
  justify-content: space-between;
  width: 100%;
  padding: 0 10px;
  background-color: #000000;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.is-selected {
  background-color: #ffffff;
  color: #000000;
}

a.navbar-item:focus {
  background-color: #ffffff;
  color: #000000;
}
.navbar-item{
  color: #ffffff;
}

.logo {
  margin-top: 5px;
  height: 2.5rem;
  width: auto;
}</style>