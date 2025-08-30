import { useState, useEffect } from 'react';
import { KitchenItem, ShoppingItem, MonthlyUsage, KitchenStats } from '@/types/kitchen';
import { convertToBaseUnit, getBaseUnit } from '@/lib/unitConversion';

export const useKitchenData = () => {
  const [items, setItems] = useState<KitchenItem[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedItems = localStorage.getItem('kitchenItems');
    const storedShopping = localStorage.getItem('shoppingList');
    
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    } else {
      // Initialize with dummy data
      const dummyItems = getDummyData();
      setItems(dummyItems);
      localStorage.setItem('kitchenItems', JSON.stringify(dummyItems));
    }
    
    if (storedShopping) {
      setShoppingList(JSON.parse(storedShopping));
    }
  }, []);

  // Save items to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('kitchenItems', JSON.stringify(items));
  }, [items]);

  // Save shopping list to localStorage
  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
  }, [shoppingList]);

  const addItem = (item: Omit<KitchenItem, 'id' | 'createdAt' | 'updatedAt' | 'baseQuantity' | 'baseUnit'>) => {
    // Konversi ke satuan dasar
    const baseUnit = getBaseUnit(item.name) || 'gram';
    const baseConversion = convertToBaseUnit(item.name, item.quantity, item.unit);
    const baseQuantity = baseConversion?.quantity || item.quantity;

    const newItem: KitchenItem = {
      ...item,
      baseQuantity,
      baseUnit,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setItems(prev => [...prev, newItem]);
  };

  const updateItem = (id: string, updates: Partial<KitchenItem>) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, ...updates, updatedAt: new Date().toISOString() };
          
          // Jika quantity atau unit berubah, hitung ulang baseQuantity
          if (updates.quantity !== undefined || updates.unit !== undefined) {
            const baseUnit = getBaseUnit(updatedItem.name) || updatedItem.baseUnit || 'gram';
            const baseConversion = convertToBaseUnit(updatedItem.name, updatedItem.quantity, updatedItem.unit);
            updatedItem.baseQuantity = baseConversion?.quantity || updatedItem.quantity;
            updatedItem.baseUnit = baseUnit;
          }
          
          return updatedItem;
        }
        return item;
      })
    );
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const addShoppingItem = (item: Omit<ShoppingItem, 'id' | 'createdAt' | 'baseQuantity' | 'baseUnit'>) => {
    // Konversi ke satuan dasar
    const baseUnit = getBaseUnit(item.name) || 'gram';
    const baseConversion = convertToBaseUnit(item.name, item.quantity, item.unit);
    const baseQuantity = baseConversion?.quantity || item.quantity;

    const newItem: ShoppingItem = {
      ...item,
      baseQuantity,
      baseUnit,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setShoppingList(prev => [...prev, newItem]);
  };

  const markAsPurchased = (shoppingId: string) => {
    const shoppingItem = shoppingList.find(item => item.id === shoppingId);
    if (!shoppingItem) return;

    // Find existing kitchen item or create new one
    const existingItem = items.find(
      item => item.name.toLowerCase() === shoppingItem.name.toLowerCase()
    );

    if (existingItem) {
      // Update existing item quantity - gunakan baseQuantity untuk perhitungan yang akurat
      const newBaseQuantity = existingItem.baseQuantity + shoppingItem.baseQuantity;
      updateItem(existingItem.id, {
        quantity: existingItem.quantity + shoppingItem.quantity,
        baseQuantity: newBaseQuantity,
      });
    } else {
      addItem({
        name: shoppingItem.name,
        category: shoppingItem.category,
        quantity: shoppingItem.quantity,
        unit: shoppingItem.unit,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    // Remove from shopping list
    setShoppingList(prev => prev.filter(item => item.id !== shoppingId));
  };

  const updateShoppingItem = (id: string, updates: Partial<ShoppingItem>) => {
    setShoppingList(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, ...updates }
          : item
      )
    );
  };

  const removeShoppingItem = (id: string) => {
    setShoppingList(prev => prev.filter(item => item.id !== id));
  };

  const consumeIngredients = (consumptionData: any[]) => {
    consumptionData.forEach(consumption => {
      if (!consumption) return;
      
      const item = items.find(i => i.id === consumption.kitchenItemId);
      if (item) {
        const newBaseQuantity = Math.max(0, item.baseQuantity - consumption.consumedBaseQuantity);
        const newDisplayQuantity = Math.max(0, item.quantity - consumption.consumedDisplayQuantity);
        
        updateItem(consumption.kitchenItemId, {
          quantity: newDisplayQuantity,
          baseQuantity: newBaseQuantity
        });
      }
    });
  };

  // Auto-generate shopping items for out-of-stock items
  useEffect(() => {
    const outOfStockItems = items.filter(item => item.quantity === 0);
    
    outOfStockItems.forEach(item => {
      const exists = shoppingList.some(
        shop => shop.name.toLowerCase() === item.name.toLowerCase() && shop.isAutoGenerated
      );
      
      if (!exists) {
        addShoppingItem({
          name: item.name,
          category: item.category,
          quantity: 1,
          unit: item.unit,
          isAutoGenerated: true,
          isPurchased: false,
        });
      }
    });
  }, [items]);

  return {
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
  };
};

const getDummyData = (): KitchenItem[] => {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  return [
    {
      id: '1',
      name: 'Beras',
      category: 'Bahan Pokok',
      quantity: 5,
      unit: 'kg',
      baseQuantity: 5000, // 5 kg = 5000 gram
      baseUnit: 'gram' as const,
      expiryDate: nextMonth.toISOString(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: '2',
      name: 'Susu Segar',
      category: 'Dairy',
      quantity: 2,
      unit: 'liter',
      baseQuantity: 2000, // 2 liter = 2000 ml
      baseUnit: 'ml' as const,
      expiryDate: tomorrow.toISOString(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: '3',
      name: 'Bawang Merah',
      category: 'Bumbu',
      quantity: 0.5,
      unit: 'kg',
      baseQuantity: 500, // 0.5 kg = 500 gram
      baseUnit: 'gram' as const,
      expiryDate: nextWeek.toISOString(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: '4',
      name: 'Garam',
      category: 'Bumbu',
      quantity: 1,
      unit: 'kg',
      baseQuantity: 1000, // 1 kg = 1000 gram
      baseUnit: 'gram' as const,
      expiryDate: nextMonth.toISOString(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: '5',
      name: 'Telur Ayam',
      category: 'Protein',
      quantity: 0,
      unit: 'butir',
      baseQuantity: 0, // 0 butir = 0 gram
      baseUnit: 'gram' as const,
      expiryDate: nextWeek.toISOString(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    }
  ];
};