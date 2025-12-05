import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/Card';
import { CreditCard, Check } from 'lucide-react';
import { Site, PaymentMethod, availablePaymentMethods } from '../../../data';

interface PaymentTabProps {
  site: Site;
  onSiteChange: (site: Site) => void;
  onMarkChanged: () => void;
}

export const PaymentTab: React.FC<PaymentTabProps> = ({ 
  site, 
  onSiteChange, 
  onMarkChanged 
}) => {
  const togglePaymentMethod = (method: PaymentMethod) => {
    const exists = site.paymentMethods.find(m => m.id === method.id);
    if (exists) {
      onSiteChange({
        ...site,
        paymentMethods: site.paymentMethods.filter(m => m.id !== method.id)
      });
    } else {
      onSiteChange({
        ...site,
        paymentMethods: [...site.paymentMethods, { ...method, enabled: true }]
      });
    }
    onMarkChanged();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>支付方式</CardTitle>
        <CardDescription>选择此站点支持的支付方式</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 max-w-lg">
          {availablePaymentMethods.map(method => {
            const isSelected = site.paymentMethods.some(m => m.id === method.id);
            return (
              <div
                key={method.id}
                onClick={() => togglePaymentMethod(method)}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                  isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="font-medium">{method.name}</span>
                </div>
                {isSelected && <Check className="h-5 w-5 text-primary" />}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
