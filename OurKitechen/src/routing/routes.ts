import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../components/Home.vue";
import RecipeDetails from "../components/RecipeDetails.vue";
import LoginPage from "../components/Login.vue";
import SignUpPage from "../components/SignUp.vue";
import Profile from "../components/Profile.vue";
import ProfileSetup from "../components/ProfileSetup.vue";
import Create from "../components/Create.vue";
import EditRecipe from "../components/EditRecipe.vue";
import AddFriend from "../components/AddFriend.vue";
import Following from "../components/Following.vue";
import BotHeaven from "../components/BotHeaven.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/recipeDetails", component: RecipeDetails },
  { path: "/loginPage", component: LoginPage },
  { path: "/signUpPage", component: SignUpPage },
  {
    path: '/recipeDetails/:Creator/:itemName/:itemIngredients/:itemRating*/:itemComments/:itemImage', // Defines a dynamic route
    name: 'RecipeDetails',
    component: RecipeDetails,
    props: true, // Allows passing route params as props to components
  },
  { path: "/profilePage", component: Profile },
  { path: "/profileSetup", component: ProfileSetup },
  { path: "/Create", component: Create },
  { path: "/EditRecipe", component: EditRecipe },
  { path: "/AddFriend", component: AddFriend },
  { path: "/Following", component: Following },
  { path: "/BotHeaven", component: BotHeaven}
];

const myRouter = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});

export { myRouter };