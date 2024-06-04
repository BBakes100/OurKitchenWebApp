import { Recipe } from "./Recipe.ts";
type Profile = {
    email: string;
    name?: string;
    bio: string;
    picture?: string;
    friendID?: number;
    friendList?: Array<Profile>;
    savedRecipes?: Array<Recipe>;
}

export type { Profile }