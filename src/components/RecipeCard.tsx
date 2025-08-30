import { Recipe } from '@/types/recipe';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, ChefHat, CheckCircle, AlertCircle } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onView: (recipe: Recipe) => void;
  onUse: (recipeId: string) => void;
}

export const RecipeCard = ({ recipe, onView, onUse }: RecipeCardProps) => {
  const availableIngredients = recipe.ingredients.filter(ing => ing.isAvailable).length;
  const totalIngredients = recipe.ingredients.length;
  const canCook = availableIngredients === totalIngredients;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Mudah': return 'bg-success text-success-foreground';
      case 'Sedang': return 'bg-warning text-warning-foreground';
      case 'Sulit': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="shadow-card hover:shadow-warm transition-all duration-300 cursor-pointer group" 
          onClick={() => onView(recipe)}>
      <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg group-hover:text-primary transition-colors line-clamp-2">
              {recipe.name}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm mt-1 line-clamp-2">
              {recipe.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {canCook ? (
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
            ) : (
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-warning" />
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-6 pt-0">
        <div className="grid grid-cols-3 gap-2 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="truncate">{recipe.cookTime}m</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="truncate">{recipe.servings} porsi</span>
          </div>
          <div className="flex items-center gap-1 justify-end">
            <ChefHat className="h-3 w-3 sm:h-4 sm:w-4" />
            <Badge className={`text-[10px] sm:text-xs px-1 sm:px-2 ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </Badge>
          </div>
        </div>

        <div className="space-y-1 sm:space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">Bahan tersedia:</span>
            <span className={`font-medium ${canCook ? 'text-success' : 'text-warning'}`}>
              {availableIngredients}/{totalIngredients}
            </span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-1.5 sm:h-2">
            <div 
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                canCook ? 'bg-success' : 'bg-warning'
              }`}
              style={{ width: `${(availableIngredients / totalIngredients) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2 sm:mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 sm:h-9 text-xs sm:text-sm"
            onClick={(e) => {
              e.stopPropagation();
              onView(recipe);
            }}
          >
            Lihat
          </Button>
          <Button 
            variant={canCook ? "default" : "secondary"}
            size="sm" 
            className="h-8 sm:h-9 text-xs sm:text-sm"
            disabled={!canCook}
            onClick={(e) => {
              e.stopPropagation();
              onUse(recipe.id);
            }}
          >
            {canCook ? 'Masak' : 'Kurang'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};