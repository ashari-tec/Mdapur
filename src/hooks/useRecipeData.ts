import { useState, useEffect } from 'react';
import { Recipe, RecipeIngredient } from '@/types/recipe';
import { KitchenItem } from '@/types/kitchen';
import { convertToBaseUnit, isStockSufficient, getBaseUnit, convertFromBaseUnit } from '@/lib/unitConversion';

export const useRecipeData = (kitchenItems: KitchenItem[]) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // Load recipes from localStorage
  useEffect(() => {
    const storedRecipes = localStorage.getItem('recipes');
    if (storedRecipes) {
      setRecipes(JSON.parse(storedRecipes));
    } else {
      // Initialize with sample recipes
      const sampleRecipes = getSampleRecipes();
      setRecipes(sampleRecipes);
      localStorage.setItem('recipes', JSON.stringify(sampleRecipes));
    }
  }, []);

  // Save recipes to localStorage
  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }, [recipes]);

  // Check ingredient availability for all recipes with unit conversion
  const recipesWithAvailability = recipes.map(recipe => ({
    ...recipe,
    ingredients: recipe.ingredients.map(ingredient => {
      const kitchenItem = kitchenItems.find(
        item => item.name.toLowerCase() === ingredient.name.toLowerCase()
      );
      
      let isAvailable = false;
      let availableQuantity = 0;
      let availableBaseQuantity = 0;
      
      if (kitchenItem) {
        // Gunakan sistem konversi satuan untuk membandingkan
        isAvailable = isStockSufficient(
          ingredient.name,
          kitchenItem.quantity,
          kitchenItem.unit,
          ingredient.quantity,
          ingredient.unit
        );
        
        // Convert available stock to recipe's unit for display
        const convertedQuantity = convertFromBaseUnit(
          ingredient.name,
          kitchenItem.baseQuantity,
          ingredient.unit
        );
        
        availableQuantity = convertedQuantity || 0;
        availableBaseQuantity = kitchenItem.baseQuantity;
      }
      
      return {
        ...ingredient,
        isAvailable,
        availableQuantity,
        availableBaseQuantity,
      };
    }),
  }));

  const useRecipe = (recipeId: string) => {
    const recipe = recipesWithAvailability.find(r => r.id === recipeId);
    if (!recipe) return { success: false, message: 'Resep tidak ditemukan' };

    // Check if all ingredients are available
    const canCook = recipe.ingredients.every(ingredient => ingredient.isAvailable);
    if (!canCook) return { success: false, message: 'Bahan tidak cukup untuk memasak resep ini' };

    // Calculate consumption and return the data for kitchen hook to process
    const consumptionData = recipe.ingredients.map(ingredient => {
      const kitchenItem = kitchenItems.find(
        item => item.name.toLowerCase() === ingredient.name.toLowerCase()
      );
      
      if (!kitchenItem) return null;

      // Convert recipe requirement to same unit as stock for accurate calculation
      const baseRequirement = convertToBaseUnit(ingredient.name, ingredient.quantity, ingredient.unit);
      if (!baseRequirement) return null;

      return {
        kitchenItemId: kitchenItem.id,
        consumedBaseQuantity: baseRequirement.quantity,
        consumedDisplayQuantity: ingredient.quantity,
        consumedDisplayUnit: ingredient.unit
      };
    }).filter(Boolean);

    return { 
      success: true, 
      message: `Resep "${recipe.name}" berhasil digunakan!`,
      consumptionData 
    };
  };

  const addRecipe = (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRecipe: Recipe = {
      ...recipe,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setRecipes(prev => [...prev, newRecipe]);
  };

  const updateRecipe = (id: string, updates: Partial<Recipe>) => {
    setRecipes(prev =>
      prev.map(recipe =>
        recipe.id === id
          ? { ...recipe, ...updates, updatedAt: new Date().toISOString() }
          : recipe
      )
    );
  };

  const deleteRecipe = (id: string) => {
    setRecipes(prev => prev.filter(recipe => recipe.id !== id));
  };

  // Calculate recipe stats
  const stats = {
    totalRecipes: recipes.length,
    cookableRecipes: recipesWithAvailability.filter(recipe =>
      recipe.ingredients.every(ingredient => ingredient.isAvailable)
    ).length,
    missingIngredients: recipesWithAvailability.reduce((total, recipe) => {
      return total + recipe.ingredients.filter(ingredient => !ingredient.isAvailable).length;
    }, 0),
  };

  return {
    recipes: recipesWithAvailability,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    useRecipe,
    stats,
  };
};

const getSampleRecipes = (): Recipe[] => {
  const now = new Date().toISOString();
  
  // Helper function to create ingredient with proper conversion
  const createIngredient = (name: string, quantity: number, unit: string): RecipeIngredient => {
    const baseUnit = getBaseUnit(name) || 'gram';
    const conversion = convertToBaseUnit(name, quantity, unit);
    return {
      name,
      quantity,
      unit,
      baseQuantity: conversion?.quantity || quantity,
      baseUnit: conversion?.unit || baseUnit
    };
  };
  
  return [
    {
      id: '1',
      name: 'Nasi Goreng Sederhana',
      description: 'Nasi goreng klasik dengan bumbu dasar yang lezat',
      ingredients: [
        createIngredient('Beras', 2, 'porsi'),
        createIngredient('Bawang Merah', 3, 'siung'),
        createIngredient('Garam', 1, 'sdt'),
        createIngredient('Telur Ayam', 2, 'butir'),
      ],
      instructions: [
        'Masak nasi terlebih dahulu dan dinginkan',
        'Iris bawang merah tipis-tipis',
        'Panaskan minyak, tumis bawang merah hingga harum',
        'Masukkan telur, orak-arik',
        'Tambahkan nasi, aduk rata',
        'Bumbui dengan garam, aduk hingga merata',
        'Angkat dan sajikan'
      ],
      cookTime: 20,
      servings: 2,
      difficulty: 'Mudah',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '2',
      name: 'Tumis Bawang Merah',
      description: 'Tumisan sederhana untuk pelengkap makan',
      ingredients: [
        createIngredient('Bawang Merah', 200, 'gram'),
        createIngredient('Garam', 0.5, 'sdt'),
      ],
      instructions: [
        'Iris bawang merah sesuai selera',
        'Panaskan minyak dalam wajan',
        'Tumis bawang merah hingga layu',
        'Tambahkan garam, aduk rata',
        'Masak hingga matang dan angkat'
      ],
      cookTime: 10,
      servings: 4,
      difficulty: 'Mudah',
      createdAt: now,
      updatedAt: now,
    }
  ];
};