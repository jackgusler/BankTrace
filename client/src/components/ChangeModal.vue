<script setup lang="ts">
import { change, changeType, isChangeModalActive } from '@/models/utilities';
import { getSession } from '@/models/session';
import { ref } from 'vue';
import { useUpdateUser } from '@/models/session';

const { updateUser } = useUpdateUser();

const session = getSession();
const changeValue = ref('');
const errorMessage = ref('');
const isSubmitted = ref(false);

let validateInput = () => {
    if (changeType.value === 'name') {
        if (changeValue.value.length < 3) {
            errorMessage.value = 'Name must be at least 3 characters long.';
            return false;
        }
    } else if (changeType.value === 'email') {
        // Check if the email is in the format of 'name@example.com'
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(changeValue.value)) {
            errorMessage.value = 'Email must be valid.';
            return false;
        }
    } else if (changeType.value === 'password') {
        // Check if the password is at least 8 characters long and contains at least one uppercase letter and one symbol
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
        if (!passwordRegex.test(changeValue.value)) {
            errorMessage.value = 'Password must be at least 8 characters long and contain at least one uppercase letter and one symbol.';
            return false;
        }
    }
    errorMessage.value = '';
    return true;
}

const updateChangeValue = async () => {  // Make the function async
    if (!validateInput()) {
        isSubmitted.value = true;
        return;
    }

    try {
        if (changeType.value === 'name') {
            await updateUser(String(session.user!.id), changeValue.value, session.user!.email, session.user!.password, session.user!.monthlyData);
        } else if (changeType.value === 'email') {
            await updateUser(String(session.user!.id), session.user!.name, changeValue.value, session.user!.password, session.user!.monthlyData);
        } else if (changeType.value === 'password') {
            await updateUser(String(session.user!.id), session.user!.name, session.user!.email, changeValue.value, session.user!.monthlyData);
        }
    } catch (error) {
        console.error('Failed to update user:', error);
        return;
    }

    changeValue.value = '';
    isSubmitted.value = false;
    isChangeModalActive.value = false;
}

const cancel = () => {
    changeValue.value = '';
    isSubmitted.value = false;
    isChangeModalActive.value = false;
}

</script>

<template>
    <div>
        <div class="modal" :class="{ 'is-active': isChangeModalActive }">
            <div class="modal-background"></div>
            <div class="modal-content">
                <div class="box">
                    <div class="field">
                        <label class="label">Change {{ changeType }}</label>
                        <div class="control">
                            <input class="input" type="text" placeholder="Text input" v-model="changeValue">
                        </div>
                    </div>
                    <div class="field">
                        <div class="message is-danger" v-if="isSubmitted">
                            <div class="message-body">{{ errorMessage }}</div>
                        </div>
                    </div>
                    <div class="buttons">
                        <div class="button" @click="updateChangeValue">Save changes</div>
                        <div class="button" @click="cancel">Cancel</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>