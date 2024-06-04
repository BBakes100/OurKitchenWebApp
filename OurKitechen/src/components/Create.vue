<template>
  <div>
    <v-container>
      <v-card>
        <v-card-title>Create Recipe</v-card-title>
        <v-card-subtitle>Create your custom recipe</v-card-subtitle>

        <!-- Input for editing name -->
        <v-text-field v-model="newRecipe.name" label="Name" required class="text-black"></v-text-field>

        <v-text-field v-model="userIngredients" label="Ingredients (comma-separated)" required class="text-black"></v-text-field>

        <v-text-field v-model="userComments" label="Explain Why You Love This Recipe" required class="text-black"></v-text-field>

        <v-text-field v-model="newRecipe.picture" label="Picture URL" required class="text-black"></v-text-field>

        <!-- Save button to update the recipe -->
        <v-btn @click="cancel">Cancel</v-btn> &nbsp;
        <v-btn @click="createRecipe" :disabled="!isValidForm">Create Recipe</v-btn>
      </v-card>
    </v-container>
  </div>
</template>

<script lang="ts">
import { ref, watch } from 'vue';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Recipe } from '../datatypes/Recipe.ts'; // Import Recipe type
import { useRouter } from 'vue-router';
import { userDoc } from '../main';

export default {
  setup() {
    const newRecipe = ref<Recipe>({
      creator: userDoc.value,
      id: '',
      name: '',
      ingredients: [],
      rating: [],
      comments: [],
      picture: '',
    });

    const userIngredients = ref('');
    const userComments = ref('');

    const handleUserInput = () => {
      const ingredientsArray = userIngredients.value.split(',').map(item => item.trim());
      newRecipe.value.ingredients = ingredientsArray;
    };

    const handleUserComments = () => {
      const commentsArray = userComments.value.split(',').map(item => item.trim());
      newRecipe.value.comments = commentsArray;
    };

    
    const isValidForm = ref(false);
    const appRouter = useRouter();

    const cancel = () => {
      appRouter.back();
    }

    // Watch for changes in form fields and update the isValidForm flag
    watch([() => newRecipe.value.name, () => userIngredients.value, () => userComments.value, () => newRecipe.value.picture], () => {
      isValidForm.value = validateForm();
    });

    const validateForm = () => {
      return newRecipe.value.name.trim() !== '' &&
        userIngredients.value.length > 0 &&
        isValidUrl(newRecipe.value.picture.trim());
    };

    const isValidUrl = (url: string) => {
      // Basic URL validation
      const urlRegex = new RegExp('^(data|http).*.$');
      return urlRegex.test(url);
    };

    const createRecipe = async () => {
      try {
        if (!isValidForm.value) {
          // Form is not valid, do not proceed with recipe creation
          return;
        }

        const user = userDoc.value;
        const idNum = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        const docId = user + "_" + newRecipe.value.name;
        const recipeRef = doc(db, 'Recipes', docId);

        // Set the data for the document
        await setDoc(recipeRef, {
          name: newRecipe.value.name,
          creator: user,
          id: idNum.toString(),
          ingredients: userIngredients.value.split(',').map(item => item.trim()),
          rating: 0,
          comments: userComments.value.split(',').map(item => item.trim()),
          picture: newRecipe.value.picture,
        });
        appRouter.replace("/profilePage");
      } catch (error) {
        console.error('Error creating recipe:', error);
      }
    };

    return {
      newRecipe,
      userIngredients,
      userComments,
      createRecipe,
      handleUserInput,
      handleUserComments,
      isValidForm,
      cancel,
    };
  },
};
</script>

<style>

.text-black input{
  color: black !important;
}

</style>
