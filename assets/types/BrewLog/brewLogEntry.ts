// Organized taste categories
type mouthFeelCategory = 'Gritty' | 'Smooth' | 'Body' | 'Clean';
type aromaCategory = 'Fruity' | 'Floral' | 'Chocolate' | 'Nutty' | 'Caramel' | 'Roasted' | 'Cereal' | 'Green';
type tasteCategory = 'Sour' | 'Bitter' | 'Sweet' | 'Salty';

// All taste categories combined for compatibility
type allTasteCategories = mouthFeelCategory | aromaCategory | tasteCategory;

type brewMethod = 'pour over' | 'cold brew' | 'brew bar' | 'french press';

export interface brewLogEntry {
    id: number; // Unique identifier for the coffee
    date: Date; // Date when the coffee was consumed (Changed from String to Date as it better reflects property)
    name: string; // The name of the coffee / drink
    brewMethod: brewMethod; // Brew setting used to make it with extracion
    image: any; // URL or local path to the coffee's image
    coffeeBeanDetail: coffeeBeanDetail; // Custom interface to log the details of the coffee beans used
    brewDetail: brewDetail; // Custom interface to hold brew data
    tasteRating: Record<allTasteCategories, number>;  // Dictionary to hold taste : rating (0-3)
    rating: number; // Rating for the coffee
}

export interface coffeeBeanDetail {
    coffeeName: string; // Name of the coffee
    origin: string; // Name of origin of the coffee
    roasterDate: string; // The date that the coffee bean was roasted
    roasterLevel: string; // The level of the roast
    bagWeight: number; // Weight of the bag that contains the coffee beans
}

export interface brewDetail {
    grindSize: number; // Size of grind
    beanWeight: number; // Weight of the coffee beans used
    waterAmount: number; // Amount of water used
    ratio: number; // It will be interpreted as 1 : X where X is stored in ratio
    brewTime: number; // Brew time in seconds
    temperature: number; // Configured temperature of the coffee machine
}