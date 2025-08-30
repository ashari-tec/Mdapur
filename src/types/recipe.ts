export interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
  baseQuantity: number; // Jumlah dalam satuan dasar (gram/ml)
  baseUnit: 'gram' | 'ml'; // Satuan dasar untuk bahan ini
  isAvailable?: boolean;
  availableQuantity?: number;
  availableBaseQuantity?: number; // Jumlah tersedia dalam satuan dasar
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  cookTime: number; // in minutes
  servings: number;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  createdAt: string;
  updatedAt: string;
}

export interface RecipeStats {
  totalRecipes: number;
  cookableRecipes: number;
  missingIngredients: number;
}