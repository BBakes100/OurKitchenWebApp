<template>
  <div class="border">
    <div v-if="selectedItem !== null">
      <!-- Display image of the selected item -->
      <img class="images" :src="selectedItem.picture" />
      <h2>{{ selectedItem.name }}</h2>
      <p class="text"> Rating: {{ averageRating }}
        <v-btn v-if="loggedIn" @click="openRatingPopup">Add Rating</v-btn>

      <!-- Popup/Modal for rating input -->
      <v-dialog v-model="ratingPopup" max-width="400">
        <v-card>
          <v-card-title>Rate This Recipe</v-card-title>
          <v-card-text>
            <v-text-field v-model="newRating" label="Add a Rating" type="number" class="text-black"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="closeRatingPopup">Cancel</v-btn>
            <v-btn @click="addRating">Submit</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      </p>
      <p class="text">Ingredients: {{ selectedItem.ingredients.join(', ') }}</p>
      <p>
        Comments Section <br>
        <v-btn  v-if="commentButtonOn()" @click="toggleAddComment">Add Comment</v-btn>
        <v-text-field v-if="addingComment" v-model="newComment" label="Add New Comment" class="text-black"></v-text-field>
        <v-btn v-if="addingComment" @click="toggleAddComment">Cancel</v-btn> &nbsp;
        <v-btn v-if="addingComment" @click="addComment">Submit</v-btn>
      </p>
      <div class="overflow" v-if="selectedItem.comments && selectedItem.comments.length > 0">
        <div v-for="(comment, index) in selectedItem.comments" :key="index">
          <v-card class="comment-card">
            <v-divider inset></v-divider>
            <v-card-text>{{ comment }}</v-card-text>
          </v-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { Recipe } from '../datatypes/Recipe';
import { DocumentSnapshot, Firestore, arrayUnion, doc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { loggedIn } from "../main";

const ratingPopup = ref(false);
const newRating = ref<number | null>(null); 
const tempRatings = ref<number[]>([]); 

const commentButtonOn = () => {
  return !addingComment.value && loggedIn.value;
};

const openRatingPopup = () => {
      ratingPopup.value = true;
    };

const closeRatingPopup = () => {
      ratingPopup.value = false;
      newRating.value = null; 
    };

    const addRating = async () => {
  if (newRating.value !== null && newRating.value >= 1 && newRating.value <= 5) {
    tempRatings.value.push(Number(newRating.value)); 
    closeRatingPopup();
    updateFirestoreRatings(tempRatings.value);
  } else {
    if (newRating.value === null) {
      closeRatingPopup();
    } else if (newRating.value > 5) {
      newRating.value = 5;
      tempRatings.value.push(Number(newRating.value)); 
      closeRatingPopup();
      updateFirestoreRatings(tempRatings.value);
    } else {
      newRating.value = 1;
      tempRatings.value.push(Number(newRating.value)); 
      closeRatingPopup();
      updateFirestoreRatings(tempRatings.value);
    }
  }
};

const updateFirestoreRatings = async (ratings: number[]) => {
  if (selectedItem.value) {
    const recipeDocId = selectedItem.value.creator + '_' + selectedItem.value.name;
    const recipeDocRef = doc(db, 'Recipes', recipeDocId);

    try {
      // Update Firestore array with the new ratings
      await updateDoc(recipeDocRef, { rating: ratings });
      selectedItem.value.rating = ratings;
    } catch (error) {
      console.error('Error updating ratings:', error);
    }
  }
};

const route = useRoute();
const selectedItem = ref<Recipe | null>(null);
const addingComment = ref(false);
const newComment = ref('');

const toggleAddComment = () => {
  addingComment.value = !addingComment.value;
  if (!addingComment.value) {
    newComment.value = '';
  }
};

// const user = userDoc.value;
const addComment = async () => {
  try {
    if (newComment.value.trim() === '') {
      // Don't add empty comments
      return;
    }
    const recipeDocId = selectedItem.value?.creator + "_" + selectedItem.value?.name;
    const recipeDocRef = doc(db, 'Recipes', recipeDocId);

    // Append the new comment to the existing comments array
    await updateDoc(recipeDocRef, {
      comments: arrayUnion(newComment.value),
    });

    // Reset the newComment input and hide the text field
    newComment.value = '';
    addingComment.value = false;

    console.log(newComment.value)
    console.log(recipeDocId)
  } catch (error) {
    console.error('Error adding comment:', error);
  }
};

const listen = (db: Firestore) => {
  const docId = selectedItem.value?.creator + "_" + selectedItem.value?.name;
  const recipeDoc = doc(db, "Recipes", docId);
  
  onSnapshot(recipeDoc, (ds: DocumentSnapshot) => {
    console.log("Doc updated", ds.data());
    const updatedComments = ds.data()?.comments || [];
    
    
    // Update the local selectedItem with the new comments
    selectedItem.value = {
      ...selectedItem.value,
      comments: updatedComments,
    } as Recipe;
  });
};

const averageRating = computed(() => {
  if (selectedItem.value && selectedItem.value.rating && selectedItem.value.rating.length > 0) {
    const total = selectedItem.value.rating.reduce((acc, val) => acc + val, 0);
    return (total / selectedItem.value.rating.length).toFixed(1);
  }
  return 'N/A';
});

const fetchExistingRatings = async () => {
  if (selectedItem.value) {
    const recipeDocId = selectedItem.value.creator + '_' + selectedItem.value.name;
    const recipeDocRef = doc(db, 'Recipes', recipeDocId);

    try {
      const docSnap = await getDoc(recipeDocRef);
      if (docSnap.exists()) {
        const existingRatings = docSnap.data()?.rating || [];
        tempRatings.value = existingRatings; 
        selectedItem.value.rating = existingRatings;
      }
    } catch (error) {
      console.error('Error fetching existing ratings:', error);
    }
  }
};

onMounted(() => {
  listen(db);
  fetchExistingRatings();
});

onBeforeMount(() => {
  const itemId = route.params.itemId;
  const itemName = route.params.itemName;
  const creator = route.params.Creator;
  const itemImage = route.params.itemImage;

  let itemIngredients: string[] = [];
  let itemComments: string[] = [];
  let itemRating: number[] = [];

  if (Array.isArray(route.params.itemRating)) {
    itemRating = route.params.itemRating.map(Number);
  } else if (typeof route.params.itemRating === 'string') {
    itemRating = route.params.itemRating.split(',').map(Number);
  } else {
    itemRating = [Number(route.params.itemRating)];
  }

  if (Array.isArray(route.params.itemIngredients)) {
    itemIngredients = route.params.itemIngredients;
  } else if (typeof route.params.itemIngredients === 'string') {
    itemIngredients = route.params.itemIngredients.split(',');
  }

  if (Array.isArray(route.params.itemComments)) {
    itemComments = route.params.itemComments;
  } else if (typeof route.params.itemComments === 'string') {
    itemComments = route.params.itemComments.split(',');
  }

  selectedItem.value = {
    creator: `${creator}`,
    id: `${itemId}`,
    name: `${itemName}`,
    ingredients: itemIngredients,
    rating: itemRating,
    comments: itemComments,
    picture: `${itemImage}`,
  };
});
</script>

<style scoped>
.images {
  height: 250px;
  width: 350px;
}

.border {
  padding: 35px;
  border: 2px solid black;
  max-width: 100vw;
  min-width: 300px;
  max-height: 100vh;
  width: 100vw;
  height: 100vh;
  background-color: tan;
}

.text {
  font-size: 20px;
}

.ingr {
  font-size: 20px;
}

.text-black input{
  color: black !important;
}

.overflow{
  max-height: 225px; 
  overflow-y: auto; 
}
</style>
