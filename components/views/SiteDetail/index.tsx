import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/Button';
import { 
  ArrowLeft,
  Save,
  Globe,
  CreditCard,
  Truck,
  Package
} from 'lucide-react';
import { 
  Site,
  mockSites, 
  languageOptions, 
  regionOptions,
  mockProducts
} from '../../../data';
import { BasicInfoTab } from './BasicInfoTab';
import { PaymentTab } from './PaymentTab';
import { ShippingTab } from './ShippingTab';
import { SkusTab } from './SkusTab';

// Tab 类型
type TabValue = 'basic' | 'payment' | 'shipping' | 'skus';

// --- 主组件 ---
interface SiteDetailViewProps {
  siteId: string;
  onNavigate: (path: string) => void;
}

export const SiteDetailView: React.FC<SiteDetailViewProps> = ({ siteId, onNavigate }) => {
  const [site, setSite] = useState<Site | null>(null);
  const [activeTab, setActiveTab] = useState<TabValue>('basic');
  const [skuPrices, setSkuPrices] = useState<Record<string, number>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // 加载站点数据
  useEffect(() => {
    const found = mockSites.find(s => s.id === siteId);
    if (found) {
      setSite({ ...found });
      // 初始化 SKU 价格
      const initialPrices: Record<string, number> = {};
      found.availableSkuIds.forEach(skuId => {
        const product = mockProducts.find(p => p.skus.some(s => s.id === skuId));
        const sku = product?.skus.find(s => s.id === skuId);
        if (sku) {
          initialPrices[skuId] = sku.price;
        }
      });
      setSkuPrices(initialPrices);
    }
  }, [siteId]);

  const handleBack = () => {
    onNavigate('sites');
  };

  const handleSave = () => {
    setHasChanges(false);
    alert('保存成功！');
  };

  const markChanged = () => {
    setHasChanges(true);
  };

  if (!site) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4 text-center">
        <div className="text-4xl font-bold text-muted-foreground/30">404</div>
        <p className="text-muted-foreground">找不到该站点 (ID: {siteId})</p>
        <Button onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回列表
        </Button>
      </div>
    );
  }

  const region = regionOptions.find(r => r.value === site.region);

  const tabs: { value: TabValue; label: string; icon: React.ReactNode; count?: number }[] = [
    { value: 'basic', label: '基本信息', icon: <Globe className="h-4 w-4" /> },
    { value: 'payment', label: '支付方式', icon: <CreditCard className="h-4 w-4" /> },
    { value: 'shipping', label: '配送方式', icon: <Truck className="h-4 w-4" /> },
    { value: 'skus', label: '可售 SKU', icon: <Package className="h-4 w-4" />, count: site.availableSkuIds.length },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 顶部导航栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="text-3xl">{region?.label.split(' ')[0]}</div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight">{site.name}</h2>
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                  site.status === 'active' 
                    ? 'border-transparent bg-emerald-500/10 text-emerald-500' 
                    : 'border-transparent bg-muted text-muted-foreground'
                }`}>
                  {site.status === 'active' ? '启用' : '停用'}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                {region?.name} · {languageOptions.find(l => l.value === site.language)?.label} · {site.currency.symbol} {site.currency.code}
              </p>
            </div>
          </div>
        </div>
        {hasChanges && (
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            保存更改
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-0 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.value
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'basic' && (
        <BasicInfoTab 
          site={site} 
          onSiteChange={setSite} 
          onMarkChanged={markChanged} 
        />
      )}

      {activeTab === 'payment' && (
        <PaymentTab 
          site={site} 
          onSiteChange={setSite} 
          onMarkChanged={markChanged} 
        />
      )}

      {activeTab === 'shipping' && (
        <ShippingTab 
          site={site} 
          onSiteChange={setSite} 
          onMarkChanged={markChanged} 
        />
      )}

      {activeTab === 'skus' && (
        <SkusTab 
          site={site} 
          onSiteChange={setSite}
          skuPrices={skuPrices}
          onSkuPricesChange={setSkuPrices}
          onMarkChanged={markChanged} 
        />
      )}
    </div>
  );
};

