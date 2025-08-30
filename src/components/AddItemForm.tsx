import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AddItemFormProps {
  isVisible: boolean;
  onClose: () => void;
  onAdd: (item: {
    name: string;
    category: string;
    quantity: number;
    unit: string;
    expiryDate: string;
  }) => void;
}

export const AddItemForm = ({ isVisible, onClose, onAdd }: AddItemFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 0,
    unit: 'kg',
    expiryDate: '',
  });

  const categories = [
    'Bahan Pokok',
    'Bumbu',
    'Protein',
    'Dairy',
    'Sayuran',
    'Buah',
    'Minuman',
    'Snack',
    'Lainnya'
  ];

  const units = [
    'kg', 'g', 'liter', 'ml', 'butir', 'buah', 'lembar', 'bungkus', 'botol', 'kaleng'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.expiryDate) {
      toast({
        title: "Form tidak lengkap",
        description: "Harap isi semua field yang diperlukan.",
        variant: "destructive",
      });
      return;
    }

    onAdd({
      ...formData,
      expiryDate: new Date(formData.expiryDate).toISOString(),
    });

    // Reset form
    setFormData({
      name: '',
      category: '',
      quantity: 0,
      unit: 'kg',
      expiryDate: '',
    });

    onClose(); // Close form after successful submission

    toast({
      title: "Item berhasil ditambahkan",
      description: `${formData.name} telah ditambahkan ke stok.`,
    });
  };

  if (!isVisible) return null;

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nama Bahan *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Beras, Garam, dll"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Kategori *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="quantity">Jumlah</Label>
              <Input
                id="quantity"
                type="number"
                step="0.1"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="unit">Satuan</Label>
              <Select 
                value={formData.unit} 
                onValueChange={(value) => setFormData({ ...formData, unit: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map(unit => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="expiry">Tanggal Kadaluarsa *</Label>
            <Input
              id="expiry"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1 flex items-center gap-2 bg-gradient-to-r from-primary to-primary-glow">
              <Plus className="h-4 w-4" />
              Tambah ke Stok
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};