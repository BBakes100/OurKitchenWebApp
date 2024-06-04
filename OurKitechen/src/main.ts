import { createApp, ref } from "vue";
import "./style.css";
import App from "./App.vue";
import { vuetify } from "./vuetify/setup.ts";
import { myRouter } from "./routing/routes.ts";

import { collection, QuerySnapshot, getDocs } from "firebase/firestore";

import { addMultipleDocsWithAwait } from "./firebase/create-funcs.ts";
import { db } from "./firebase/config.ts";

// Runs when no documents are present
const RecipeColl = collection(db, "Recipes");
getDocs(RecipeColl).then((qs: QuerySnapshot) => {
  if (qs.size == 0) {
    addMultipleDocsWithAwait(db);
  }
});

export const loggedIn = ref(false)
export const userDoc = ref("")
export const recipeToEdit = ref("")

// FIGURE OUT WHERE TO PUT THESE
export const name = ref('');
export const bio = ref('');

addMultipleDocsWithAwait(db)

createApp(App).use(vuetify).use(myRouter).mount("#app");
