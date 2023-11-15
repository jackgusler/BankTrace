<script setup lang="ts">
import { RouterLink } from "vue-router";
import LoginBadge from "./LoginBadge.vue";
</script>

<template>
  <nav class="navbar is-black is-flex-touch">
    <div class="navbar-menu is-flex-touch">
      <div class="navbar-start">
        <RouterLink class="navbar-item" to="/">
          <span class="icon">
            <i class="fas fa-house"></i>
          </span>
        </RouterLink>
        </div>
        <div class="navbar-end">
          <LoginBadge />
        </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar-menu{
  justify-content: space-between;
  width: 100%;
  padding: 0 10px;
  background-color: #1a1a1a;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
</style>