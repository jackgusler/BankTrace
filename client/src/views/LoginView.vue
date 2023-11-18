<script setup lang="ts">
import { ref } from 'vue';
import { login, signUp } from '@/models/session';
import router from '@/router';

const email = ref('');
const password = ref('');
const signUpName = ref('');
const signUpEmail = ref('');
const signUpPassword = ref('');
const isSignUp = ref(false);

function doLogin() {
    login(email.value, password.value);
    router.push('/');
}

async function doSignUp() {
    signUp(signUpName.value, signUpEmail.value, signUpPassword.value);
    await login(signUpEmail.value, signUpPassword.value);
    router.push('/');
}

function toggleSignUp() {
    isSignUp.value = !isSignUp.value;
}
</script>

<template>
    <div>
        <div class="panel">
            <p class="panel-heading is-centered">
                {{ isSignUp ? 'Sign Up' : 'Login' }}
            
            <div class="buttons">
                <div class="button" @click="toggleSignUp">{{ isSignUp ? 'Go to Login' : 'Go to Sign Up' }}</div>
            </div>
        </p>
            <div class="form">
                <form v-if="!isSignUp">
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
                <form v-else>
                    <div class="field">
                        <label class="label">Name</label>
                        <div class="control">
                            <input class="input" type="text" v-model="signUpName">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Email</label>
                        <div class="control">
                            <input class="input" type="text" v-model="signUpEmail">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Password</label>
                        <div class="control">
                            <input class="input" type="text" v-model="signUpPassword">
                        </div>
                    </div>
                    <div class="buttons">
                        <div class="button" @click="doSignUp">Sign Up</div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.is-centered {
    text-align: center;
    justify-content: center;
}

.panel {
    width: 100%;
    margin: auto;
    height: calc(100vh - 62px);
}


.panel-heading {
    font-size: 2rem;
    font-weight: bold;
}

.label {
    font-size: 1.5rem;
    font-weight: bold;
}

.form {
    padding: 1rem;
}

.input {
    font-size: 1.5rem;
}
</style>