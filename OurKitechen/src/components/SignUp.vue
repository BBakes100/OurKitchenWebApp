<template>
  <v-container>
    <v-card>
        <v-card-title>Sign Up</v-card-title>
        <v-card-text>
            Email: <input type="text" v-model="u_email" placeholder="Enter Your Email"><br>
            Password: <input type="password" v-model="u_pass" placeholder="Create Password">
            <div>
          <input type="checkbox" v-model="emailVerification" />
          <label for="verif">Send verification email</label>
        </div>
        </v-card-text>
        <v-btn @click="loginPage">Already have an account?</v-btn>
        <v-btn @click="homePage">Cancel</v-btn>
        <v-btn :disabled="!isValidInput" @click="createAccount">Confirm</v-btn>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { computed, ref } from "vue";

import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";

const u_email = ref("");
const u_pass = ref("");
const message = ref("");
const emailVerification = ref(false);
const auth = getAuth();
const appRouter = useRouter();

const isValidInput = computed(
  () => u_email.value.length > 0 && u_pass.value.length > 0
);

const showMessage = (txt: string) => {
  message.value = txt;
  setTimeout(() => {
    message.value = "";
  }, 5000);
};

import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const createAccount = async () => {
  try {
    const cr = await createUserWithEmailAndPassword(
      auth,
      u_email.value,
      u_pass.value
    );

    const friendNum = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    const profile = {
      email: cr.user.email,
      bio: '',
      name: '',
      picture: '',
      friendID: friendNum,
      friendList: null,
      savedRecipes: null
    };

    // Adding the profile to Firestore
    const profileDoc = doc(db, "Profiles", u_email.value);
    await setDoc(profileDoc, profile);

    if (emailVerification.value) {
      await sendEmailVerification(cr.user);
      await signOut(auth);
      showMessage(`An email verification has been sent to ${cr.user.email}`);
    } else {
      showMessage(`New account created with UID ${cr.user.uid}`);
    }
    appRouter.replace("/loginPage");
  } catch (err) {
    showMessage(`Unable to create account`);
  }
};

function homePage() {
  appRouter.replace("/");
}

function loginPage() {
  appRouter.replace("/loginPage");
}

</script>