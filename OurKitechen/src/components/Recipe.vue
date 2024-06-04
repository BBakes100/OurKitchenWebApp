<template>
  <v-container color="#FFB300">
    <v-card color="#FFB300"
      ><h3>{{ name }}</h3></v-card
    >
    <v-btn height="100%" width="100%" block tile @click="showRecipe(recipe.creator,recipe.id,recipe.name,recipe.ingredients,recipe.rating,recipe.comments,recipe.picture)">
      <v-card width="200px" height="200px" :image="recipe.picture"></v-card>
    </v-btn>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Recipe } from "../datatypes/Recipe.ts";
//implement details button
import { useRouter } from 'vue-router';
// import { userDoc } from "../main";
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

//pushes product specific product data to new view
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

</script>

<style scoped>
.custom-title {
  font-weight: bold;
  color: black;
  background-color: white;
}
</style>
