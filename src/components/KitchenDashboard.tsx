import { useState } from 'react';
import { useKitchenData } from '@/hooks/useKitchenData';
import { useRecipeData } from '@/hooks/useRecipeData';
import { toast } from 'sonner';
import { ItemTable } from './ItemTable';
import { AddItemForm } from './AddItemForm';
import { ShoppingList } from './ShoppingList';
import { ExpiryNotifications } from './ExpiryNotifications';
import { UsageChart } from './UsageChart';
import { RecipeList } from './RecipeList';


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChefHat, ShoppingCart, TrendingUp, BookOpen, Plus } from 'lucide-react';

export const KitchenDashboard = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  
  const {
    items,
    shoppingList,
    addItem,
    updateItem,
    deleteItem,
    addShoppingItem,
    updateShoppingItem,
    markAsPurchased,
    removeShoppingItem,
    consumeIngredients,
  } = useKitchenData();

  const {
    recipes,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    useRecipe,
    stats: recipeStats,
  } = useRecipeData(items);

  const handleUseRecipe = (recipeId: string) => {
    const result = useRecipe(recipeId);
    if (result.success && result.consumptionData) {
      consumeIngredients(result.consumptionData);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 px-2">
          <div className="flex items-center justify-center gap-2 mb-2 sm:mb-4">
            <ChefHat className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Manajemen Dapur
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg px-4">
            Kelola stok bahan makanan dan daftar belanja Anda dengan mudah
          </p>
        </div>

        {/* Expiry Notifications */}
        <ExpiryNotifications items={items} />


        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-4 sm:space-y-6 pb-20 md:pb-0">
          {/* Desktop Navigation */}
          <TabsList className="hidden md:grid w-full grid-cols-4 bg-card shadow-card">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 text-sm">
              <ChefHat className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="recipes" className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4" />
              <span>Resep</span>
            </TabsTrigger>
            <TabsTrigger value="shopping" className="flex items-center gap-2 text-sm">
              <ShoppingCart className="h-4 w-4" />
              <span>Belanja</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>Analitik</span>
            </TabsTrigger>
          </TabsList>

          <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border/50 shadow-lg">
            <div className="px-2 py-2">
              <TabsList className="grid w-full grid-cols-4 h-14 bg-card/50 rounded-xl shadow-inner">
                <TabsTrigger 
                  value="dashboard" 
                  className="flex flex-col items-center justify-center gap-0.5 h-full mx-1 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted/70 transition-all duration-200 ease-in-out"
                >
                  <ChefHat className="h-4 w-4" />
                  <span className="text-[9px] font-medium">Stok</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="recipes" 
                  className="flex flex-col items-center justify-center gap-0.5 h-full mx-1 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted/70 transition-all duration-200 ease-in-out"
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="text-[9px] font-medium">Resep</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="shopping" 
                  className="flex flex-col items-center justify-center gap-0.5 h-full mx-1 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted/70 transition-all duration-200 ease-in-out"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span className="text-[9px] font-medium">Belanja</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="flex flex-col items-center justify-center gap-0.5 h-full mx-1 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted/70 transition-all duration-200 ease-in-out"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-[9px] font-medium">Grafik</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="dashboard" className="space-y-4 sm:space-y-6 mx-2 sm:mx-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-2 order-2 lg:order-1">
                <Card className="shadow-card">
                  <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
                    <CardTitle className="text-lg sm:text-xl">Stok Bahan Makanan</CardTitle>
                    <CardDescription className="text-sm">
                      Daftar lengkap bahan makanan dan bumbu dapur
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-2 sm:px-6 pb-4 sm:pb-6">
                    <ItemTable
                      items={items}
                      onUpdate={updateItem}
                      onDelete={deleteItem}
                    />
                  </CardContent>
                </Card>
              </div>
              
              <div className="order-1 lg:order-2 space-y-4">
                <div className="flex justify-center lg:justify-start">
                  <Button 
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-glow"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {showAddForm ? 'Tutup Form' : 'Tambah Barang Baru'}
                  </Button>
                </div>
                
                <AddItemForm 
                  isVisible={showAddForm}
                  onClose={() => setShowAddForm(false)}
                  onAdd={addItem} 
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recipes" className="mx-2 sm:mx-0">
            <Card className="shadow-card">
              <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Koleksi Resep
                </CardTitle>
                <CardDescription className="text-sm">
                  Resep masakan dengan informasi ketersediaan bahan di dapur
                </CardDescription>
                <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                  <span>Total: {recipeStats.totalRecipes} resep</span>
                  <span className="text-success">Bisa dimasak: {recipeStats.cookableRecipes}</span>
                  <span className="text-warning">Kurang bahan: {recipeStats.totalRecipes - recipeStats.cookableRecipes}</span>
                </div>
              </CardHeader>
              <CardContent className="px-2 sm:px-6 pb-4 sm:pb-6">
                <RecipeList
                  recipes={recipes}
                  onAdd={addRecipe}
                  onUpdate={updateRecipe}
                  onDelete={deleteRecipe}
                  onUse={handleUseRecipe}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shopping" className="mx-2 sm:mx-0">
            <Card className="shadow-card">
              <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
                <CardTitle className="text-lg sm:text-xl">Daftar Belanja</CardTitle>
                <CardDescription className="text-sm">
                  Kelola daftar belanja dan sinkronisasi dengan stok
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2 sm:px-6 pb-4 sm:pb-6">
        <ShoppingList 
          items={shoppingList}
          onAdd={addShoppingItem}
          onUpdate={updateShoppingItem}
          onMarkPurchased={markAsPurchased}
          onRemove={removeShoppingItem}
        />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mx-2 sm:mx-0">
            <div className="space-y-4 sm:space-y-6">
              <Card className="shadow-card">
                <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
                  <CardTitle className="text-lg sm:text-xl">Tren Pemakaian Bulanan</CardTitle>
                  <CardDescription className="text-sm">
                    Grafik penggunaan dan pengeluaran dapur
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-2 sm:px-6 pb-4 sm:pb-6">
                  <UsageChart items={items} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};