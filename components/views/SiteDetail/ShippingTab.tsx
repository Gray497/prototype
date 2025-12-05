import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/Card';
import { Truck, Check } from 'lucide-react';
import { Site, ShippingMethod, availableShippingMethods } from '../../../data';

interface ShippingTabProps {
  site: Site;
  onSiteChange: (site: Site) => void;
  onMarkChanged: () => void;
}

export const ShippingTab: React.FC<ShippingTabProps> = ({ 
  site, 
  onSiteChange, 
  onMarkChanged 
}) => {
  const toggleShippingMethod = (method: ShippingMethod) => {
    const exists = site.shippingMethods.find(m => m.id === method.id);
    if (exists) {
      onSiteChange({
        ...site,
        shippingMethods: site.shippingMethods.filter(m => m.id !== method.id)
      });
    } else {
      onSiteChange({
        ...site,
        shippingMethods: [...site.shippingMethods, { ...method }]
      });
    }
    onMarkChanged();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>配送方式</CardTitle>
        <CardDescription>选择此站点支持的配送方式</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 max-w-lg">
          {availableShippingMethods.map(method => {
            const isSelected = site.shippingMethods.some(m => m.id === method.id);
            return (
              <div
                key={method.id}
                onClick={() => toggleShippingMethod(method)}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                  isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Truck className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div>
                    <span className="font-medium">{method.name}</span>
                    <p className="text-xs text-muted-foreground">{method.description}</p>
                  </div>
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

