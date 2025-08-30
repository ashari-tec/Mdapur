import { useState } from 'react';
import { Recipe } from '@/types/recipe';
import { RecipeCard } from './RecipeCard';
import { RecipeDialog } from './RecipeDialog';
import { AddRecipeForm } from './AddRecipeForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter } from 'lucide-react';

interface RecipeListProps {
  recipes: Recipe[];
  onAdd: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (id: string, updates: Partial<Recipe>) => void;
  onDelete: (id: string) => void;
  onUse: (recipeId: string) => void;
}

export const RecipeList = ({ recipes, onAdd, onUpdate, onDelete, onUse }: RecipeListProps) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDifficulty = difficultyFilter === 'all' || recipe.difficulty === difficultyFilter;
    
    const canCook = recipe.ingredients.every(ing => ing.isAvailable);
    const matchesAvailability = availabilityFilter === 'all' || 
                               (availabilityFilter === 'cookable' && canCook) ||
                               (availabilityFilter === 'missing' && !canCook);

    return matchesSearch && matchesDifficulty && matchesAvailability;
  });

  return (
    <div className="space-y-3 sm:space-y-6 px-2 sm:px-0">
      {/* Search and Filters */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari resep..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="h-11">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tingkat</SelectItem>
              <SelectItem value="Mudah">Mudah</SelectItem>
              <SelectItem value="Sedang">Sedang</SelectItem>
              <SelectItem value="Sulit">Sulit</SelectItem>
            </SelectContent>
          </Select>

          <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
            <SelectTrigger className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Resep</SelectItem>
              <SelectItem value="cookable">Bisa Dimasak</SelectItem>
              <SelectItem value="missing">Kurang Bahan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={() => setShowAddForm(true)}
          size="default"
          className="w-full h-11 sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Resep
        </Button>
      </div>

      {/* Recipe Grid */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {filteredRecipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onView={setSelectedRecipe}
              onUse={onUse}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-6 sm:py-12 px-4">
          <p className="text-muted-foreground text-sm sm:text-lg">
            {searchTerm || difficultyFilter !== 'all' || availabilityFilter !== 'all' 
              ? 'Tidak ada resep yang sesuai dengan filter'
              : 'Belum ada resep tersimpan'
            }
          </p>
          {!searchTerm && difficultyFilter === 'all' && availabilityFilter === 'all' && (
            <Button 
              onClick={() => setShowAddForm(true)}
              className="mt-4 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Resep Pertama
            </Button>
          )}
        </div>
      )}

      {/* Recipe Detail Dialog */}
      {selectedRecipe && (
        <RecipeDialog
          recipe={selectedRecipe}
          open={!!selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onEdit={onUpdate}
          onDelete={onDelete}
          onUse={onUse}
        />
      )}

      {/* Add Recipe Dialog */}
      {showAddForm && (
        <AddRecipeForm
          open={showAddForm}
          onClose={() => setShowAddForm(false)}
          onAdd={onAdd}
        />
      )}
    </div>
  );
};