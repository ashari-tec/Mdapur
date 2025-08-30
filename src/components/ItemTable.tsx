import { useState } from 'react';
import { KitchenItem } from '@/types/kitchen';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Edit, Trash2, Search, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ItemTableProps {
  items: KitchenItem[];
  onUpdate: (id: string, updates: Partial<KitchenItem>) => void;
  onDelete: (id: string) => void;
}

export const ItemTable = ({ items, onUpdate, onDelete }: ItemTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingItem, setEditingItem] = useState<KitchenItem | null>(null);

  const categories = Array.from(new Set(items.map(item => item.category)));

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (item: KitchenItem) => {
    setEditingItem({ ...item });
  };

  const handleUpdate = () => {
    if (!editingItem) return;
    
    onUpdate(editingItem.id, {
      name: editingItem.name,
      category: editingItem.category,
      quantity: editingItem.quantity,
      unit: editingItem.unit,
      expiryDate: editingItem.expiryDate,
    });
    
    setEditingItem(null);
    toast({
      title: "Item berhasil diperbarui",
      description: `${editingItem.name} telah diperbarui.`,
    });
  };

  const handleDelete = (item: KitchenItem) => {
    onDelete(item.id);
    toast({
      title: "Item berhasil dihapus",
      description: `${item.name} telah dihapus dari stok.`,
      variant: "destructive",
    });
  };

  const exportToCSV = () => {
    const headers = ['Nama', 'Kategori', 'Jumlah', 'Satuan', 'Tanggal Kadaluarsa'];
    const csvData = [
      headers.join(','),
      ...filteredItems.map(item => [
        item.name,
        item.category,
        item.quantity,
        item.unit,
        new Date(item.expiryDate).toLocaleDateString('id-ID')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `stok-dapur-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Berhasil mengekspor data",
      description: "File CSV telah diunduh.",
    });
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Cari nama bahan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Kadaluarsa</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{item.category}</Badge>
                </TableCell>
                <TableCell>
                  <span className={item.quantity === 0 ? 'text-destructive font-semibold' : ''}>
                    {item.quantity} {item.unit}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={isExpiringSoon(item.expiryDate) ? 'text-warning font-semibold' : ''}>
                    {new Date(item.expiryDate).toLocaleDateString('id-ID')}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Item</DialogTitle>
                        </DialogHeader>
                        {editingItem && (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="name">Nama</Label>
                              <Input
                                id="name"
                                value={editingItem.name}
                                onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="category">Kategori</Label>
                              <Input
                                id="category"
                                value={editingItem.category}
                                onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label htmlFor="quantity">Jumlah</Label>
                                <Input
                                  id="quantity"
                                  type="number"
                                  step="0.1"
                                  value={editingItem.quantity}
                                  onChange={(e) => setEditingItem({...editingItem, quantity: parseFloat(e.target.value)})}
                                />
                              </div>
                              <div>
                                <Label htmlFor="unit">Satuan</Label>
                                <Input
                                  id="unit"
                                  value={editingItem.unit}
                                  onChange={(e) => setEditingItem({...editingItem, unit: e.target.value})}
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="expiry">Tanggal Kadaluarsa</Label>
                              <Input
                                id="expiry"
                                type="date"
                                value={editingItem.expiryDate.split('T')[0]}
                                onChange={(e) => setEditingItem({...editingItem, expiryDate: new Date(e.target.value).toISOString()})}
                              />
                            </div>
                            <Button onClick={handleUpdate} className="w-full">
                              Perbarui Item
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(item)}
                      className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Tidak ada item yang ditemukan
        </div>
      )}
    </div>
  );
};