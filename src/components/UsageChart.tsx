import { KitchenItem } from '@/types/kitchen';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface UsageChartProps {
  items: KitchenItem[];
}

export const UsageChart = ({ items }: UsageChartProps) => {
  // Generate monthly usage data (mock data for demo)
  const generateMonthlyData = () => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    return months.slice(-6).map((month, index) => ({
      month,
      totalItems: Math.floor(Math.random() * 50) + 20,
      totalValue: Math.floor(Math.random() * 500000) + 200000,
    }));
  };

  // Generate category distribution data
  const getCategoryData = () => {
    const categoryCount = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return Object.entries(categoryCount).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const monthlyData = generateMonthlyData();
  const categoryData = getCategoryData();

  const COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--primary-glow))',
    'hsl(var(--secondary))',
    'hsl(var(--accent))',
    'hsl(var(--muted))',
    'hsl(var(--warning))',
  ];

  return (
    <div className="space-y-6">
      {/* Monthly Usage Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Tren Pemakaian 6 Bulan Terakhir</CardTitle>
          <CardDescription>
            Jumlah item yang digunakan per bulan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number, name: string) => [
                  name === 'totalItems' ? `${value} items` : `Rp ${value.toLocaleString('id-ID')}`,
                  name === 'totalItems' ? 'Jumlah Item' : 'Total Nilai'
                ]}
              />
              <Bar 
                dataKey="totalItems" 
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Kategori</CardTitle>
            <CardDescription>
              Pembagian item berdasarkan kategori
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Statistik</CardTitle>
            <CardDescription>
              Data singkat tentang stok dapur Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">Total Item</span>
              <span className="text-lg font-bold">{items.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">Item Stok Habis</span>
              <span className="text-lg font-bold text-destructive">
                {items.filter(item => item.quantity === 0).length}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">Kategori Unik</span>
              <span className="text-lg font-bold">
                {new Set(items.map(item => item.category)).size}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};