<template>
  <v-container>
    <v-card>
        <v-card-title>Login</v-card-title>
        <v-card-text>
            Email: <input type="text" v-model="u_email" placeholder="Enter Your Email"><br>
            Password: <input type="password" v-model="u_pass" placeholder="Enter Your Password">
        </v-card-text>
        <v-btn @click="signUpPage">Don't have an account?</v-btn>
        <v-btn @click="homePage">Cancel</v-btn>
        <v-btn :disabled="!isValidInput" @click="handleInteraction">Confirm</v-btn>
        <span id="msgbox" v-show="message.length > 0">{{ message }}</span>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { computed, ref,} from "vue";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { loggedIn, userDoc } from "../main";

const u_email = ref("");
const u_pass = ref("");
const message = ref("");
const auth = getAuth();

const isValidInput = computed(
  () => u_email.value.length > 0 && u_pass.value.length > 0
);

const showMessage = (txt: string) => {
  message.value = txt;
  setTimeout(() => {
    message.value = "";
  }, 5000);
};

const withEmail = async () => {
  try {
    const cr = await signInWithEmailAndPassword(
      auth,
      u_email.value,
      u_pass.value
    );
    if (cr.user.emailVerified) {
    loggedIn.value = true;
    userDoc.value = u_email.value
    appRouter.replace("/");
    } else {
      showMessage("You must first verify your email");
      await signOut(auth);
    }
  } catch (err) {
    showMessage(`Unable to login`);
  }
};

const appRouter = useRouter();
function homePage() {
  appRouter.replace("/");
}

function signUpPage() {
  appRouter.replace("/signUpPage");
}

function BotPage() {
  appRouter.replace("/BotHeaven");
}

// const handleLoginButton = () => {
//   withEmail();
  

//   handleInteraction();
// }

import { onMounted } from 'vue';

let lastPageLoadTime = 0;

const handlePageLoad = () => {
  // Record the time when the page is loaded
  lastPageLoadTime = performance.now();
};

const handleInteraction = () => {
  // Calculate the time elapsed since the last page load
  const timeSinceLoad = performance.now() - lastPageLoadTime;
  // Check if the time elapsed is below a certain threshold
  if (timeSinceLoad < 3000) { //  (1000 milliseconds = 2 seconds)
    console.log('Potential bot detected: very fast interaction after page load.');
    BotPage();
  }
  else {
    withEmail();
  }
};

onMounted(() => {
  window.addEventListener('load', handlePageLoad);
});

</script>
