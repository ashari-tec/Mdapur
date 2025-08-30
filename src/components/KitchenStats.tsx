import { KitchenItem } from '@/types/kitchen';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, DollarSign, AlertTriangle, Grid3X3 } from 'lucide-react';

interface KitchenStatsProps {
  items: KitchenItem[];
}

export const KitchenStats = ({ items }: KitchenStatsProps) => {
  const totalItems = items.length;
  const outOfStockItems = items.filter(item => item.quantity === 0).length;
  const uniqueCategories = new Set(items.map(item => item.category)).size;

  const getExpiringCount = () => {
    const today = new Date();
    const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    
    return items.filter(item => {
      const expiryDate = new Date(item.expiryDate);
      return expiryDate <= threeDaysFromNow && expiryDate >= today;
    }).length;
  };

  const expiringCount = getExpiringCount();

  const stats = [
    {
      title: 'Total Item',
      value: totalItems.toString(),
      description: 'Jumlah total bahan makanan',
      icon: Package,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'Stok Habis',
      value: outOfStockItems.toString(),
      description: 'Item yang perlu dibeli',
      icon: AlertTriangle,
      color: 'bg-destructive/10 text-destructive',
    },
    {
      title: 'Kategori',
      value: uniqueCategories.toString(),
      description: 'Jenis kategori berbeda',
      icon: Grid3X3,
      color: 'bg-secondary/10 text-secondary-foreground',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground truncate">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              </div>
              
              {/* Special badges for certain stats */}
              {index === 1 && outOfStockItems > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <Badge variant="destructive" className="text-xs">
                    Perlu perhatian
                  </Badge>
                </div>
              )}
              
              {index === 0 && expiringCount > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <Badge variant="secondary" className="text-xs">
                    {expiringCount} akan kadaluarsa
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};