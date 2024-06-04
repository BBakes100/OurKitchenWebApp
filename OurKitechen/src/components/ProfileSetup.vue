<template>
  <v-container>
    <v-card>
    <span>Name:</span>
      <input type="text" v-model="name" :placeholder="name"><br>

      <span>Bio:</span>
      <input type="text" v-model="bio" :placeholder="bio"><br>
      <v-btn @click="cancel">Cancel</v-btn>
      <v-btn @click="updateFields" :disabled="!isValidForm">Confirm Updates</v-btn>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { doc, updateDoc } from 'firebase/firestore';
import { userDoc, name, bio } from '../main';
import { db } from '../firebase/config';
import { useRouter } from 'vue-router';
import { ref, watch } from 'vue';
const appRouter = useRouter();
const isValidForm = ref(false);

watch([() => name.value, () => bio.value], () => {
      isValidForm.value = validateForm();
    });

    const validateForm = () => {
      return name.value.length > 0 &&
        bio.value.length > 0;
    };

async function updateFields(){
  try {
    const docRef = doc(db, 'Profiles', userDoc.value);

    // Update the document with the new values of name and bio
    await updateDoc(docRef, {
      name: name.value,
      bio: bio.value,
    });

    console.log('Document updated successfully');
    appRouter.replace("/profilePage")
  } catch (error) {
    console.error('Error updating document:', error);
  }
}

function cancel(){
    appRouter.back()
  }

</script>