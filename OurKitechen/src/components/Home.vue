<template>
    <v-container>
        <v-card>
            <v-card-title>All Recipes</v-card-title>
        </v-card>
    </v-container>
    <v-container class="bg-red">
    <v-row>
      <v-col v-for="(item, index) in recipe" :key="index" cols="12" sm="6" md="3">
        <v-container color="#FFB300" width="300px" height="300px">
        <Recipe
          :name="item.name"
          :creator="item.creator"
          :ingredients="item.ingredients"
          :rating="item.rating"
          :comments="item.comments"
          :picture="item.picture"
          :id="item.id"
        ></Recipe>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import Recipe from "./Recipe.vue"
import { Recipe as recipeType } from "../datatypes/Recipe.ts"
import { Firestore, QueryDocumentSnapshot, QuerySnapshot, collection, getDocs, onSnapshot} from "firebase/firestore"
import { db } from "../firebase/config"
import { ref, onBeforeMount, onMounted } from "vue"

const recipe = ref<recipeType[]>([]);
function grabAllRecipes(db: Firestore){
    const recipeColl = collection(db, "Recipes");
    getDocs(recipeColl).then((qs: QuerySnapshot) => {
        qs.forEach((qd: QueryDocumentSnapshot) => {
            const recipeData = qd.data() as recipeType;
            recipe.value.push(recipeData);
        });
    });
}

const listen = (db: Firestore) => {
  const recipeCollection = collection(db, "Recipes");
  
  onSnapshot(recipeCollection, (querySnapshot) => {
    querySnapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        // Document added
        console.log("Document added", change.doc.data());
      }
    });
  });
};

const startTime = performance.now(); // Record start time

const detectBot = () => {
      const userAgent = navigator.userAgent;
      const loadTime = performance.now() - startTime;
      //console.log("Bot", { userAgent });
        console.log("LOAD TIME: " + loadTime);
       // Check for Selenium-like behavior
       if (userAgent.includes("HeadlessChrome") || loadTime < 6) {
        console.log("Possible bot detected:", { userAgent, loadTime });
        
      }
}


onMounted(() => {
  listen(db);
  detectBot();
});

onBeforeMount(() => {
    grabAllRecipes(db);
})

</script>

<style>

</style>