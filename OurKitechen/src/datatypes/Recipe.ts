type Recipe = {
    creator: string;
    id: string;
    name: string;
    ingredients: Array<string>;
    rating?: Array<number>;
    comments?: Array<string>;
    picture: string;
}

export type { Recipe }