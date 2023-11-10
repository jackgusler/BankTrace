<script setup lang="ts">
import { ref } from "vue";

const rowValue = ref(0)
const columnValue = ref(0)
const isActive = ref(false)

function openModal() {
  isActive.value = true
} 
</script>

<template>
  <div>
    <div class="modal" :class="{'is-active': isActive}">
        <div class="modal-background"></div>
        <div class="modal-content">
            <div class="box">
            <div class="field">
                <label class="label">Category</label>
                <div class="control">
                <input class="input" type="text">
                </div>
            </div>
            <div class="field">
                <label class="label">Budget</label>
                <div class="control">
                <input class="input" type="text">
                </div>
            </div>
            <div class="field">
                <label class="label">Spent</label>
                <div class="control">
                <input class="input" type="text">
                </div>
            </div>
            <div class="buttons">
                <div class="button is-primary" @click="(isActive = false) && (rowValue++)">Save changes</div>
                <div class="button" @click="isActive = false">Cancel</div>
            </div>
            </div>
        </div>
        <button class="modal-close is-large" aria-label="close" @click="isActive = false"></button>
    </div>
    <div class="panel">
      <div class="panel-heading">
        <h3 class="panel-title">Budget</h3>
      </div>
      <div class="panel-body">
        <table class="table">
          <thead>
            <tr>
              <th>Categories</th>
              <th>Budget</th>
              <th>Spent</th>
            </tr>
          </thead>
          <tbody v-for="i in rowValue" :key="i">
            <tr>
              <td>{{ i }}</td>
              <td>$</td>
              <td>$</td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td>Total</td>
              <td>$</td>
              <td>$</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="buttons">
      <div class="button" @click="isActive = true">Row+</div>
      <div class="button" @click="rowValue--">Row-</div>
    </div>
  </div>
</template>

<style scoped>
.panel-title {
  text-align: center;
}
.buttons {
  display: flex;
  justify-content: center;
}
</style>
