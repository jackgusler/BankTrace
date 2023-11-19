<script setup lang="ts">
import { ref } from 'vue';
import { login, signUp } from '@/models/session';
import { getUserByEmail } from '@/models/users';
import router from '@/router';

const email = ref('');
const password = ref('');
const signUpName = ref('');
const signUpEmail = ref('');
const signUpPassword = ref('');
const signUpPassword2 = ref('');
const isSignUp = ref(false);
const errorMessage = ref('');
const isLoginSubmitted = ref(false);
const isSignUpSubmitted = ref(false);

function validateLogin() {
    if (email.value === '' || password.value === '') {
        errorMessage.value = 'Email and password cannot be empty.';
        return false;
        /*check if account exists in database by email and password*/
    } else if (!getUserByEmail(email.value) || getUserByEmail(email.value)?.password !== password.value) {
        errorMessage.value = 'That email or password does not exist. Please sign up or try again.';
        return false;
    }
    errorMessage.value = '';
    return true;
}

function validateSignUp() {
    if (isSignUp.value) {
        if (signUpName.value.length < 3) {
            errorMessage.value = 'Name must be at least 3 characters long.';
            return false;
        }
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(signUpEmail.value)) {
            errorMessage.value = 'Email must be valid.';
            return false;
        }
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
        if (!passwordRegex.test(signUpPassword.value)) {
            errorMessage.value = 'Password must be at least 8 characters long and contain at least one uppercase letter and one symbol.';
            return false;
        }
        if (signUpPassword.value !== signUpPassword2.value) {
            errorMessage.value = 'Passwords do not match.';
            return false;
        }
    }
    errorMessage.value = '';
    return true;
}

async function doLogin() {
    isLoginSubmitted.value = true;
    if (!validateLogin()) return;
    isLoginSubmitted.value = false;
    login(email.value, password.value);
    router.push('/');
}

async function doSignUp() {
    isSignUpSubmitted.value = true;
    if (!validateSignUp()) return;
    isSignUpSubmitted.value = false;
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
                            <input class="input" type="password" v-model="password">
                        </div>
                    </div>
                    <div class="field">
                        <div class="message is-danger" v-if="isLoginSubmitted">
                            <div class="message-body">{{ errorMessage }}</div>
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
                            <input class="input" type="password" v-model="signUpPassword">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Confirm Password</label>
                        <div class="control">
                            <input class="input" type="password" v-model="signUpPassword2">
                        </div>
                    </div>                    
                    <div class="field">
                        <div class="message is-danger" v-if="isSignUpSubmitted">
                            <div class="message-body">{{ errorMessage }}</div>
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