<template>
    <v-container>
        <v-card>
            <v-card-title>Followed User Recipes</v-card-title>
        </v-card>
    </v-container>
    <v-container class="bg-red">
      <v-row v-if="recipe.length > 0">
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
      <v-row v-else>
        <v-col cols="12" class="text-center">
          <p>No recipes listed</p>
          <p>Try following more people, or encouraging more recipes!</p>
        </v-col>
      </v-row>
    </v-container>
  </template>

<script lang="ts" setup>
import Recipe from "./Recipe.vue"
import { Recipe as recipeType } from "../datatypes/Recipe.ts"
import { Firestore, QueryDocumentSnapshot, QuerySnapshot, collection, getDocs, onSnapshot, query, where} from "firebase/firestore"
import { db } from "../firebase/config"
import { ref, onBeforeMount, onMounted } from "vue"
import { userDoc } from "../main"

const user = userDoc.value;

const recipe = ref<recipeType[]>([]);
async function grabAllRecipes(db: Firestore){
    let profileArray : any
    const querySnapshot = await getDocs(collection(db, 'Profiles'));
    querySnapshot.forEach((doc) => {
        if(doc.id == user){
            const userData = doc.data();
            profileArray = userData.friendList;
            console.log(profileArray);
        }
    });

    const recipeCollection = collection(db, "Recipes");

    // Modify the query to filter recipes where the creator field is in the profileArray
    const q = query(recipeCollection, where("creator", "in", profileArray));
    getDocs(q).then((qs: QuerySnapshot) => {
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

onMounted(() => {
  listen(db);
});

onBeforeMount(() => {
    grabAllRecipes(db);
})

</script>