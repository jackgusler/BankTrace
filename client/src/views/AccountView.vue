<script setup lang="ts">
import { getSession } from '@/models/session';
import router from '@/router';
import { computed } from 'vue';
import { change } from '@/models/utilities';
import ChangeModal from '@/components/ChangeModal.vue';

const session = getSession();

const blockedPassword = computed(() => {
    return session.user?.password.replace(/./g, '*');
});

const logout = () => {
    router.push('/login');
    session.user = null;
}

</script>

<template>
    <div>
        <ChangeModal />
        <div class="panel">
            <p class="panel-heading is-centered">
                {{ session.user?.name }}'s Account
            </p>
            <div class="panel-block">
                <div class="box">
                    <div class="content">
                        <p class="title is-4">Name</p>
                        <p class="subtitle is-6">{{ session.user?.name }}</p>
                        <div class="button" @click="change('name')">Change Name</div>
                    </div>
                    <div class="content">
                        <p class="title is-4">Email</p>
                        <p class="subtitle is-6">{{ session.user?.email }}</p>
                        <div class="button" @click="change('email')">Change Email</div>
                    </div>
                    <div class="content">
                        <p class="title is-4">Password</p>
                        <p class="subtitle is-6">{{ blockedPassword }}</p>
                        <div class="button" @click="change('password')">Change Password</div>
                    </div>
                </div>
            </div>
            <div class="panel-block is-centered">
                <div class="button" @click="logout">Logout</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.is-centered {
    text-align: center;
    justify-content: center;
}
.box{
    background: transparent;
    border: 0;
    box-shadow: none;
    width: 100%;
    margin: 0 auto;
}
</style>