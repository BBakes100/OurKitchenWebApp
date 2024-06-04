<template>
    <div v-if="!isDeleted">
      <v-container color="#FFB300">
        <v-card color="#FFB300">
          <h3>{{ name }}</h3>
        </v-card>
        <v-btn height="100%" width="100%" block tile @click="showRecipe(recipe.creator, recipe.id, recipe.name, recipe.ingredients, recipe.rating, recipe.comments, recipe.picture)">
          <v-card width="200px" height="200px" :image="recipe.picture"></v-card>
        </v-btn>
        <v-card>
          <v-btn @click="editRecipe">Edit</v-btn>&nbsp;
          <v-btn @click="deleteRecipe">Delete</v-btn>
        </v-card>
      </v-container>
    </div>
  </template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { Recipe } from "../datatypes/Recipe.ts";
import { useRouter } from 'vue-router';
import { DocumentSnapshot, Firestore, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { recipeToEdit, userDoc } from "../main";

const route = useRouter();

const recipeType = defineProps<Recipe>();
const recipe = ref({
  creator: recipeType.creator,
  id: recipeType.id,
  name: recipeType.name,
  ingredients: recipeType.ingredients,
  rating: recipeType.rating,
  comments: recipeType.comments,
  picture: recipeType.picture,
});

const user = userDoc.value;
const docId = `${user}_${recipe.value.name}`;
const isDeleted = ref(false);

function showRecipe(Creator: string,itemId: string,itemName: string,itemIngredients: Array<string>,itemRating: Array<number> | undefined,itemComments: Array<string> | undefined,itemImage: string) {
  const ingredientsString = itemIngredients.join(',');
  
  let commentsString = '';
  if (itemComments) {
  commentsString = itemComments.join(',');
}
  let ratingsString = '';
  if (itemRating) {
    ratingsString = itemRating.join(',');
  }

  route.push({ name: 'RecipeDetails', params: { Creator: Creator,itemId,itemName,itemIngredients: ingredientsString,itemRating: ratingsString,itemComments: commentsString,itemImage}});
}

async function deleteRecipe() {
  try {
    await deleteDoc(doc(db, 'Recipes', docId));
    console.log('Recipe deleted successfully');
    isDeleted.value = true;
  } catch (error) {
    console.error('Error deleting recipe:', error);
  }
}

function editRecipe(){
    recipeToEdit.value = recipe.value.name;
    route.push("/EditRecipe")
}

function listen(db: Firestore) {
  const recipeDoc = doc(db, "Recipes", docId);
  onSnapshot(recipeDoc, (ds: DocumentSnapshot) => {
    console.log("Doc updated", ds.data());
  });
}

onMounted(() => {
  listen(db);
});
</script>

<style scoped>
.custom-title {
  font-weight: bold;
  color: black;
  background-color: white;
}
</style>
