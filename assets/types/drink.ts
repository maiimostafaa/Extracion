export interface drink {
    id: number; // Unique identifier for the drink
    name: string; // Name of the drink
    brewMethod: string; // Brew setting used to make it with extracion
    image: string; // URL or local path to the drink's image
    date: string; // Date when the drink was consumed
    rating?: number; // Optional rating for the drink
}