<template>
    <div>
    <v-btn v-if="!check" @click="showUpdateScreen">Missing Setup Info</v-btn>
    <!-- Make it so fields will display if check is true -->
    <v-container v-else>
      <v-card>
        Name: {{ name }} &nbsp;&nbsp;
        Bio: {{ bio }}
        <div>
        <v-btn @click="showUpdateScreen">Edit</v-btn>&nbsp;
        <v-btn @click="createPage">Create</v-btn> &nbsp;
        <v-btn @click="addFollowPage">Follow User</v-btn>
        </div>
      </v-card>
    </v-container>

    <v-container>
        <v-card>
            <v-card-title>Your Recipes</v-card-title>
        </v-card>
    </v-container>

    <v-container class="bg-red">
    <v-row>
      <v-col v-for="(item, index) in recipe" :key="index" cols="12" sm="6" md="3">
        <v-container color="#FFB300" width="300px" height="300px">
        <UserRecipe :name="item.name" :creator="item.creator" :ingredients="item.ingredients" :rating="item.rating" :comments="item.comments" :picture="item.picture" :id="item.id"></UserRecipe>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
  </div>
</template>

<script lang="ts" setup>

import { getDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { userDoc, name, bio } from '../main';
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';

import UserRecipe from "./UserRecipe.vue"
import { Recipe as recipeType } from "../datatypes/Recipe.ts"
import { Firestore, QueryDocumentSnapshot, QuerySnapshot, collection, getDocs} from "firebase/firestore"

const check = ref(true);
async function checkEmptyFields() {
  try {
    const docRef = doc(db, 'Profiles', userDoc.value);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      if (data.name !== "") {
        name.value = data.name || '';
      }

      if (data.bio !== "") {
        bio.value = data.bio || '';
      }

      if (data.name === "" || data.bio === "") {
        check.value = false;
      }
    } else {
      console.log('Document does not exist');
    }
  } catch (error) {
    console.error('Error checking fields:', error);
    check.value = false;
  }
}

const recipe = ref<recipeType[]>([]);
function grabProfileRecipes(db: Firestore){
  const recipeCollection = collection(db, "Recipes");
      const q = query(recipeCollection, where("creator", "==", userDoc.value));
      getDocs(q).then((qs: QuerySnapshot) => {
          qs.forEach((qd: QueryDocumentSnapshot) => {
          const recipeData = qd.data() as recipeType;
          recipe.value.push(recipeData);
          });
      });
}

const appRouter = useRouter();
function showUpdateScreen(){
  appRouter.push("/profileSetup");
}

function addFollowPage(){
  appRouter.push("/AddFriend");
}

onBeforeMount(() => {
  checkEmptyFields();
  grabProfileRecipes(db);
});

function createPage() {
appRouter.push("/Create")
}

</script>