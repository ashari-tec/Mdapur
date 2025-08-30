import { Recipe } from '@/types/recipe';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Users, ChefHat, CheckCircle, XCircle, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface RecipeDialogProps {
  recipe: Recipe;
  open: boolean;
  onClose: () => void;
  onEdit: (id: string, updates: Partial<Recipe>) => void;
  onDelete: (id: string) => void;
  onUse: (recipeId: string) => void;
}

export const RecipeDialog = ({ recipe, open, onClose, onEdit, onDelete, onUse }: RecipeDialogProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const canCook = recipe.ingredients.every(ing => ing.isAvailable);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Mudah': return 'bg-success text-success-foreground';
      case 'Sedang': return 'bg-warning text-warning-foreground';
      case 'Sulit': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleDelete = () => {
    onDelete(recipe.id);
    setShowDeleteDialog(false);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] w-[95vw] sm:w-full overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-lg sm:text-xl md:text-2xl pr-2 leading-tight">
                  {recipe.name}
                </DialogTitle>
                <DialogDescription className="mt-1 sm:mt-2 text-sm sm:text-base">
                  {recipe.description}
                </DialogDescription>
              </div>
              <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                <Button variant="outline" size="sm" onClick={() => {/* TODO: Add edit functionality */}} className="h-8 w-8 sm:h-9 sm:w-auto sm:px-3">
                  <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline ml-2">Edit</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive hover:text-destructive h-8 w-8 sm:h-9 sm:w-auto sm:px-3"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline ml-2">Hapus</span>
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-6">
            {/* Recipe Info */}
            <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-6 text-xs sm:text-sm">
              <div className="flex items-center gap-1 sm:gap-2">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                <span className="truncate">{recipe.cookTime} menit</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                <span className="truncate">{recipe.servings} porsi</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 justify-end sm:justify-start">
                <ChefHat className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                <Badge className={`text-[10px] sm:text-xs ${getDifficultyColor(recipe.difficulty)}`}>
                  {recipe.difficulty}
                </Badge>
              </div>
            </div>

            {/* Cooking Status */}
            <div className={`p-3 sm:p-4 rounded-lg border ${canCook ? 'bg-success/10 border-success' : 'bg-warning/10 border-warning'}`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {canCook ? (
                    <>
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
                      <span className="font-medium text-success text-sm sm:text-base">Resep bisa dimasak!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-warning" />
                      <span className="font-medium text-warning text-sm sm:text-base">Ada bahan yang kurang</span>
                    </>
                  )}
                </div>
                {canCook && (
                  <Button 
                    size="sm" 
                    onClick={() => {
                      onUse(recipe.id);
                      onClose();
                    }}
                    className="text-xs sm:text-sm"
                  >
                    Masak Sekarang
                  </Button>
                )}
              </div>
            </div>

            <Separator />

            {/* Ingredients */}
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3">Bahan-bahan</h3>
              <div className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      {ingredient.isAvailable ? (
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-success flex-shrink-0" />
                      ) : (
                        <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-destructive flex-shrink-0" />
                      )}
                      <span className={`text-sm sm:text-base truncate ${ingredient.isAvailable ? '' : 'text-muted-foreground'}`}>
                        {ingredient.name}
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <div className="text-xs sm:text-sm font-medium">
                        {ingredient.quantity} {ingredient.unit}
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">
                        Tersedia: {(ingredient.availableQuantity || 0).toFixed(ingredient.availableQuantity && ingredient.availableQuantity < 1 ? 1 : 0)} {ingredient.unit}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Instructions */}
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3">Cara Memasak</h3>
              <div className="space-y-2 sm:space-y-3">
                {recipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-2 sm:gap-3">
                    <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs sm:text-sm font-medium">
                      {index + 1}
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed">{instruction}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Resep</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus resep "{recipe.name}"? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};