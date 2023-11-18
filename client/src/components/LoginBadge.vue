<script setup lang="ts"></script>

<template>
  <RouterLink class="navbar-item" to="/account" :class="{ 'is-selected': $route.path === '/account' }">
    <i class="fas fa-user"></i>
  </RouterLink>
</template>

<style scoped>
.is-selected{
  background-color: #4a4a4a;
  color: #1a1a1a;
}
</style>
