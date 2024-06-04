<template>
    <v-container>
      <v-card>
        <v-card-title>Edit Recipe</v-card-title>
        <v-card-subtitle>Edit the ingredients and picture of the recipe</v-card-subtitle>

        <v-text-field v-model="editedIngredientsString" label="Ingredients (comma-separated)" class="text-black"></v-text-field>
  
        <!-- Input for editing picture -->
        <v-text-field v-model="editedPicture" label="Picture URL" class="text-black"></v-text-field>
  
        <!-- Save button to update the recipe -->
        <v-btn @click="cancel">Cancel</v-btn>
        <v-btn @click="saveChanges" :disabled="!isValidForm">Save Changes</v-btn>
      </v-card>
    </v-container>
  </template>
  
  <script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { userDoc, recipeToEdit } from '../main';
  import { doc, updateDoc } from 'firebase/firestore';
  import { db } from '../firebase/config';

  const router = useRouter();
  const editedPicture = ref("");
  const editedIngredients = ref([""]);
  const editedIngredientsString = ref("");
  const isValidForm = ref(false);
  const user = userDoc.value;

  const handleUserInput = () => {
      const ingredientsArray = editedIngredientsString.value.split(',').map(item => item.trim());
      editedIngredients.value = ingredientsArray;
  };

  function cancel(){
    router.back()
  }

  watch([() => editedIngredientsString.value, () => editedPicture.value], () => {
      isValidForm.value = validateForm();
    });

    const validateForm = () => {
      return editedIngredientsString.value.length > 0 &&
        isValidUrl(editedPicture.value.trim());
    };

    const isValidUrl = (url: string) => {
      // Basic URL validation
      const urlRegex = new RegExp('^(data|http).*.$');
      return urlRegex.test(url);
    };

  const recipeDocId = user + "_" + recipeToEdit.value
  console.log(recipeDocId)

  async function saveChanges(){
    try {
      handleUserInput()
      const docRef = doc(db, 'Recipes', recipeDocId);
      await updateDoc(docRef, {
        ingredients: editedIngredients.value,
        picture: editedPicture.value,
      });

      console.log('Document updated successfully');
      router.back()
  } catch (error) {
    console.error('Error updating document:', error);
  }
  }
  </script>

<style scoped>
.text-black input{
  color: black !important;
}
</style>
  