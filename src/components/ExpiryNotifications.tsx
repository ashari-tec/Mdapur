import { KitchenItem } from '@/types/kitchen';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock } from 'lucide-react';

interface ExpiryNotificationsProps {
  items: KitchenItem[];
}

export const ExpiryNotifications = ({ items }: ExpiryNotificationsProps) => {
  const getExpiringItems = () => {
    const today = new Date();
    const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);

    return items.filter(item => {
      const expiryDate = new Date(item.expiryDate);
      return expiryDate <= threeDaysFromNow && expiryDate >= today;
    }).sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
  };

  const expiringItems = getExpiringItems();

  if (expiringItems.length === 0) {
    return null;
  }

  const getDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Alert className="border-warning bg-warning/10">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Peringatan Kadaluarsa
      </AlertTitle>
      <AlertDescription>
        <p className="mb-3">
          Ada {expiringItems.length} item yang akan kadaluarsa dalam 3 hari ke depan:
        </p>
        <div className="space-y-2">
          {expiringItems.map((item) => {
            const daysLeft = getDaysUntilExpiry(item.expiryDate);
            return (
              <div key={item.id} className="flex items-center justify-between bg-background/50 p-2 rounded">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.name}</span>
                  <Badge variant="secondary">{item.category}</Badge>
                </div>
                 <div className="text-sm">
                   {daysLeft === 0 ? (
                     <Badge variant="destructive">Hari ini</Badge>
                   ) : daysLeft === 1 ? (
                     <Badge variant="destructive">Besok</Badge>
                   ) : (
                     <Badge variant="outline">{daysLeft} hari lagi</Badge>
                   )}
                 </div>
              </div>
            );
          })}
        </div>
      </AlertDescription>
    </Alert>
  );
};