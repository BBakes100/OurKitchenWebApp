<template>
    <v-container>
        <v-card>
            <v-card-title>Follow User Through Email</v-card-title>
            <v-text-field v-model="emailToAdd" class="text-black" label="Email"></v-text-field>
            <div>
                <v-btn @click="cancel">Cancel</v-btn>
                <v-btn :disabled="!isValidForm" @click="addFollowing">Follow</v-btn>
            </div>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { db } from '../firebase/config';
import { userDoc } from '../main';
import { doc, getDoc, setDoc } from 'firebase/firestore';


const appRouter = useRouter();
const emailToAdd = ref("")
const isValidForm = ref(false)
watch([() => emailToAdd.value], () => {
    console.log(emailToAdd.value)
      isValidForm.value = validateForm();
});

const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};


const validateForm = () => {
    return isValidEmail(emailToAdd.value);
};

function cancel(){
    appRouter.back()
}

const user = userDoc.value;
const addFollowing = async () => {
    if (isValidForm.value) {
        try {
            const profileRef = doc(db, 'Profiles', user);
            const profileSnapshot = await getDoc(profileRef);

            if (profileSnapshot.exists()) {
                const existingFriendList = profileSnapshot.data().friendList || [];
                const updatedFriendList = [...existingFriendList, emailToAdd.value];

                await setDoc(profileRef, {
                    friendList: updatedFriendList
                }, { merge: true });

                appRouter.back();
            } else {
                console.error('User profile does not exist.');
            }
        } catch (error) {
            console.error('Error adding following:', error);
        }
    }
};
</script>

<style>
.text-black input{
  color: black !important;
}
</style>