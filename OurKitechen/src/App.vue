<template>
  <v-app>
    <v-app-bar app color="surface">
      <v-btn @click="homePage">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn v-if="loggedIn" @click="profilePage">
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
      <v-btn v-if="loggedIn" @click="following">
        <v-icon>mdi-heart-outline</v-icon>
      </v-btn>
      <v-app-bar-title>Our Kitchen</v-app-bar-title>
      <v-btn v-if="!loggedIn" @click="handleLoginButton">
        Login
        <v-icon>mdi-account-box-outline</v-icon>
      </v-btn>
      <v-btn v-else="loggedIn" @click="leaveUser">
        Sign Out
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <transition mode="out-in">
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </transition>
    </v-main>
    <v-footer app color="grey">
      <span>Footer</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";

const handleLoginButton = () => {
  loginPage();
  handleInteraction();
}

const appRouter = useRouter();
function homePage() {
  appRouter.replace("/");
}

function loginPage() {
  appRouter.replace("/loginPage");
}

function following(){
  appRouter.replace("/Following");
}

function profilePage() {
  appRouter.replace("/profilePage");
}

function BotPage() {
  appRouter.replace("/BotHeaven");
}

import { loggedIn } from "./main";
import {
  Auth,
  getAuth,
  signOut,
} from "firebase/auth";

const auth: Auth | null = getAuth();
const leaveUser = () => {
  if (auth) signOut(auth);
  loggedIn.value = false;
  appRouter.push('/')
};

import { onMounted } from 'vue';

let lastPageLoadTime = 0;

const handlePageLoad = () => {
  
  lastPageLoadTime = performance.now();
};

const handleInteraction = () => {
  
  const timeSinceLoad = performance.now() - lastPageLoadTime;
  // Check if the time elapsed is below a certain threshold
  if (timeSinceLoad < 500) { // (500 milliseconds = .5 seconds)
    console.log('Potential bot detected: very fast interaction');
    BotPage();
  }
};

onMounted(() => {
  window.addEventListener('load', handlePageLoad);
});

</script>
