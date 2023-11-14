<script setup lang="ts">
import { ref } from 'vue'
import { login } from '@/models/session'
import router from '@/router';

const email = ref('')
const password = ref('')

function doLogin() {
    login(email.value, password.value)
    router.push('/')
}

</script>

<template>
    <div>
        <div class="form">
            <form>
                <div class="field">
                    <label class="label">Email</label>
                    <div class="control">
                        <input class="input" type="text" v-model="email">
                    </div>
                </div>
                <div class="field">
                    <label class="label">Password</label>
                    <div class="control">
                        <input class="input" type="text" v-model="password">
                    </div>
                </div>
                <div class="buttons">
                    <div class="button" @click="doLogin">Login</div>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>

</style>