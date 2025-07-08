export enum RoasterLevel {
  LIGHT = 'light',
  MEDIUM = 'medium',
  DARK = 'dark',
}

export interface CoffeeBean {
  coffeeName: string;
  origin: string;
  roasterDate: Date; // Using Date for better type safety and date operations
  roasterLevel: RoasterLevel;
  bagWeightG: number; // Using number instead of Int as TypeScript doesn't have Int type
  rating: number;
}
