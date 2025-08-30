import { useState } from 'react';
import { Recipe, RecipeIngredient } from '@/types/recipe';
import { convertToBaseUnit, getBaseUnit } from '@/lib/unitConversion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Minus, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddRecipeFormProps {
  open: boolean;
  onClose: () => void;
  onAdd: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const AddRecipeForm = ({ open, onClose, onAdd }: AddRecipeFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cookTime: 30,
    servings: 2,
    difficulty: 'Mudah' as 'Mudah' | 'Sedang' | 'Sulit',
  });
  
  const [ingredients, setIngredients] = useState<Omit<RecipeIngredient, 'isAvailable' | 'availableQuantity' | 'availableBaseQuantity'>[]>([
    { name: '', quantity: 0, unit: '', baseQuantity: 0, baseUnit: 'gram' }
  ]);
  
  const [instructions, setInstructions] = useState<string[]>(['']);

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: 0, unit: '', baseQuantity: 0, baseUnit: 'gram' }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const updateIngredient = (index: number, field: keyof RecipeIngredient, value: string | number) => {
    const updated = ingredients.map((ing, i) => {
      if (i === index) {
        const updatedIng = { ...ing, [field]: value };
        
        // Auto-calculate base quantity when quantity, unit, or name changes
        if (field === 'quantity' || field === 'unit' || field === 'name') {
          if (updatedIng.name && updatedIng.quantity > 0 && updatedIng.unit) {
            const baseUnit = getBaseUnit(updatedIng.name) || 'gram';
            const baseConversion = convertToBaseUnit(updatedIng.name, updatedIng.quantity, updatedIng.unit);
            if (baseConversion) {
              updatedIng.baseQuantity = baseConversion.quantity;
              updatedIng.baseUnit = baseConversion.unit;
            } else {
              // Fallback jika konversi gagal
              updatedIng.baseQuantity = updatedIng.quantity;
              updatedIng.baseUnit = baseUnit;
            }
          }
        }
        
        return updatedIng;
      }
      return ing;
    });
    setIngredients(updated);
  };

  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const removeInstruction = (index: number) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((_, i) => i !== index));
    }
  };

  const updateInstruction = (index: number, value: string) => {
    const updated = instructions.map((inst, i) => 
      i === index ? value : inst
    );
    setInstructions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Nama resep harus diisi",
        variant: "destructive",
      });
      return;
    }

    const validIngredients = ingredients.filter(ing => 
      ing.name.trim() && ing.quantity > 0 && ing.unit.trim()
    );

    if (validIngredients.length === 0) {
      toast({
        title: "Error", 
        description: "Minimal harus ada satu bahan yang valid",
        variant: "destructive",
      });
      return;
    }

    const validInstructions = instructions.filter(inst => inst.trim());
    
    if (validInstructions.length === 0) {
      toast({
        title: "Error",
        description: "Minimal harus ada satu langkah memasak",
        variant: "destructive",
      });
      return;
    }

    const recipe = {
      ...formData,
      ingredients: validIngredients,
      instructions: validInstructions,
    };

    onAdd(recipe);
    
    toast({
      title: "Berhasil",
      description: "Resep berhasil ditambahkan",
    });

    // Reset form
    setFormData({
      name: '',
      description: '',
      cookTime: 30,
      servings: 2,
      difficulty: 'Mudah',
    });
    setIngredients([{ name: '', quantity: 0, unit: '', baseQuantity: 0, baseUnit: 'gram' }]);
    setInstructions(['']);
    
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Resep Baru</DialogTitle>
          <DialogDescription>
            Buat resep baru yang akan tersinkronisasi dengan stok dapur Anda
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Resep *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Nama resep"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="difficulty">Tingkat Kesulitan</Label>
              <Select 
                value={formData.difficulty} 
                onValueChange={(value) => 
                  setFormData({...formData, difficulty: value as 'Mudah' | 'Sedang' | 'Sulit'})
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mudah">Mudah</SelectItem>
                  <SelectItem value="Sedang">Sedang</SelectItem>
                  <SelectItem value="Sulit">Sulit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Deskripsi singkat resep"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cookTime">Waktu Memasak (menit)</Label>
              <Input
                id="cookTime"
                type="number"
                value={formData.cookTime}
                onChange={(e) => setFormData({...formData, cookTime: parseInt(e.target.value)})}
                min="1"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="servings">Porsi</Label>
              <Input
                id="servings"
                type="number"
                value={formData.servings}
                onChange={(e) => setFormData({...formData, servings: parseInt(e.target.value)})}
                min="1"
              />
            </div>
          </div>

          {/* Ingredients */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Bahan-bahan *</Label>
              <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
                <Plus className="h-4 w-4 mr-1" />
                Tambah
              </Button>
            </div>
            
            <div className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Input
                      placeholder="Nama bahan"
                      value={ingredient.name}
                      onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      placeholder="Jumlah"
                      value={ingredient.quantity || ''}
                      onChange={(e) => updateIngredient(index, 'quantity', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      placeholder="Satuan"
                      value={ingredient.unit}
                      onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeIngredient(index)}
                    disabled={ingredients.length === 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Langkah Memasak *</Label>
              <Button type="button" variant="outline" size="sm" onClick={addInstruction}>
                <Plus className="h-4 w-4 mr-1" />
                Tambah
              </Button>
            </div>
            
            <div className="space-y-2">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium mt-1">
                    {index + 1}
                  </div>
                  <Textarea
                    placeholder="Langkah memasak"
                    value={instruction}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    rows={2}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeInstruction(index)}
                    disabled={instructions.length === 1}
                    className="mt-1"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Batal
            </Button>
            <Button type="submit" className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Simpan Resep
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};