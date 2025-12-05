import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/Card';
import { CreditCard, Check, Store, Clock, Smartphone } from 'lucide-react';
import { 
  Site, 
  PaymentMethod, 
  onlinePaymentMethods, 
  codPaymentMethods,
  codStores 
} from '../../../data';

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
    // 如果是即将推出的功能，不允许选择
    if (method.comingSoon) return;
    
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

  const isMethodSelected = (methodId: string) => {
    return site.paymentMethods.some(m => m.id === methodId);
  };

  return (
    <div className="space-y-6">
      {/* 线上支付 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            线上支付
          </CardTitle>
          <CardDescription>选择此站点支持的线上支付方式</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 max-w-lg">
            {onlinePaymentMethods.map(method => {
              const isSelected = isMethodSelected(method.id);
              const isComingSoon = method.comingSoon;
              
              return (
                <div
                  key={method.id}
                  onClick={() => togglePaymentMethod(method)}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    isComingSoon 
                      ? 'cursor-not-allowed opacity-60 bg-muted/30' 
                      : isSelected 
                        ? 'border-primary bg-primary/5 cursor-pointer' 
                        : 'hover:bg-muted/50 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className={`h-5 w-5 ${isSelected && !isComingSoon ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div>
                      <span className="font-medium">{method.name}</span>
                      {isComingSoon && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <Clock className="h-3 w-3" />
                          <span>即将推出</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {isSelected && !isComingSoon && <Check className="h-5 w-5 text-primary" />}
                  {isComingSoon && (
                    <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      以后做
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 货到付款 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            货到付款
          </CardTitle>
          <CardDescription>选择此站点支持的货到付款方式（超商取货付款）</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 max-w-lg">
            {codPaymentMethods.map(method => {
              const isSelected = isMethodSelected(method.id);
              const store = codStores.find(s => method.stores?.includes(s.id));
              
              return (
                <div
                  key={method.id}
                  onClick={() => togglePaymentMethod(method)}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Store className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div>
                      <span className="font-medium">{method.name}</span>
                      {store && (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {store.description}
                        </div>
                      )}
                    </div>
                  </div>
                  {isSelected && <Check className="h-5 w-5 text-primary" />}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 已选支付方式统计 */}
      <div className="rounded-lg border p-4 bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            已启用的支付方式
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span>
              线上支付: <strong>{site.paymentMethods.filter(m => m.category === 'online').length}</strong>
            </span>
            <span>
              货到付款: <strong>{site.paymentMethods.filter(m => m.category === 'cod').length}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
