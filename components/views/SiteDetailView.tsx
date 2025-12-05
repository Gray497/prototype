import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  ArrowLeft,
  Save,
  Globe,
  CreditCard,
  Truck,
  Package,
  Check,
  Search,
  Settings,
  ChevronDown,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import { 
  Site, 
  PaymentMethod, 
  ShippingMethod,
  mockSites, 
  currencies, 
  languageOptions, 
  regionOptions,
  availablePaymentMethods,
  availableShippingMethods,
  mockProducts
} from '../../data';

// Tab 类型
type TabValue = 'basic' | 'payment' | 'shipping' | 'skus';

// 站点 SKU 价格类型
interface SiteSkuPrice {
  skuId: string;
  price: number;
}

// 获取按 SPU 分组的 SKU 数据
const getSkusGroupedBySpu = () => {
  return mockProducts.map(product => ({
    id: product.id,
    name: product.name,
    image: product.image,
    skus: product.skus.map(sku => ({
      id: sku.id,
      code: sku.code,
      specs: sku.specs,
      stock: sku.stock
    }))
  }));
};

// --- 主组件 ---
interface SiteDetailViewProps {
  siteId: string;
  onNavigate: (path: string) => void;
}

export const SiteDetailView: React.FC<SiteDetailViewProps> = ({ siteId, onNavigate }) => {
  const [site, setSite] = useState<Site | null>(null);
  const [activeTab, setActiveTab] = useState<TabValue>('basic');
  const [skuSearch, setSkuSearch] = useState('');
  const [expandedSpus, setExpandedSpus] = useState<Set<string>>(new Set());
  const [skuPrices, setSkuPrices] = useState<Record<string, number>>({});
  const [hasChanges, setHasChanges] = useState(false);

  const spuGroups = getSkusGroupedBySpu();
  
  // 加载站点数据
  useEffect(() => {
    const found = mockSites.find(s => s.id === siteId);
    if (found) {
      setSite({ ...found });
      // 初始化 SKU 价格（模拟数据）
      const initialPrices: Record<string, number> = {};
      found.availableSkuIds.forEach(skuId => {
        // 从产品中获取默认价格
        const product = mockProducts.find(p => p.skus.some(s => s.id === skuId));
        const sku = product?.skus.find(s => s.id === skuId);
        if (sku) {
          initialPrices[skuId] = sku.price;
        }
      });
      setSkuPrices(initialPrices);
    }
  }, [siteId]);

  // 过滤搜索
  const filteredSpuGroups = spuGroups.map(spu => ({
    ...spu,
    skus: spu.skus.filter(sku => 
      !skuSearch || 
      sku.code.toLowerCase().includes(skuSearch.toLowerCase()) ||
      spu.name.toLowerCase().includes(skuSearch.toLowerCase()) ||
      sku.specs.toLowerCase().includes(skuSearch.toLowerCase())
    )
  })).filter(spu => spu.skus.length > 0);

  const handleBack = () => {
    onNavigate('sites');
  };

  const handleSave = () => {
    // 实际项目中这里应该调用 API 保存
    setHasChanges(false);
    alert('保存成功！');
  };

  const togglePaymentMethod = (method: PaymentMethod) => {
    if (!site) return;
    const exists = site.paymentMethods.find(m => m.id === method.id);
    if (exists) {
      setSite(prev => prev ? ({
        ...prev,
        paymentMethods: prev.paymentMethods.filter(m => m.id !== method.id)
      }) : null);
    } else {
      setSite(prev => prev ? ({
        ...prev,
        paymentMethods: [...prev.paymentMethods, { ...method, enabled: true }]
      }) : null);
    }
    setHasChanges(true);
  };

  const toggleShippingMethod = (method: ShippingMethod) => {
    if (!site) return;
    const exists = site.shippingMethods.find(m => m.id === method.id);
    if (exists) {
      setSite(prev => prev ? ({
        ...prev,
        shippingMethods: prev.shippingMethods.filter(m => m.id !== method.id)
      }) : null);
    } else {
      setSite(prev => prev ? ({
        ...prev,
        shippingMethods: [...prev.shippingMethods, { ...method }]
      }) : null);
    }
    setHasChanges(true);
  };

  const toggleSkuAvailability = (skuId: string) => {
    if (!site) return;
    const exists = site.availableSkuIds.includes(skuId);
    if (exists) {
      setSite(prev => prev ? ({
        ...prev,
        availableSkuIds: prev.availableSkuIds.filter(id => id !== skuId)
      }) : null);
      // 移除价格
      setSkuPrices(prev => {
        const next = { ...prev };
        delete next[skuId];
        return next;
      });
    } else {
      setSite(prev => prev ? ({
        ...prev,
        availableSkuIds: [...prev.availableSkuIds, skuId]
      }) : null);
      // 设置默认价格
      const product = mockProducts.find(p => p.skus.some(s => s.id === skuId));
      const sku = product?.skus.find(s => s.id === skuId);
      if (sku) {
        setSkuPrices(prev => ({ ...prev, [skuId]: sku.price }));
      }
    }
    setHasChanges(true);
  };

  const updateSkuPrice = (skuId: string, price: number) => {
    setSkuPrices(prev => ({ ...prev, [skuId]: price }));
    setHasChanges(true);
  };

  const toggleSpuExpand = (spuId: string) => {
    setExpandedSpus(prev => {
      const next = new Set(prev);
      if (next.has(spuId)) {
        next.delete(spuId);
      } else {
        next.add(spuId);
      }
      return next;
    });
  };

  // 切换整个 SPU 的所有 SKU
  const toggleAllSkusInSpu = (spu: typeof spuGroups[0]) => {
    if (!site) return;
    const allSkuIds = spu.skus.map(s => s.id);
    const allSelected = allSkuIds.every(id => site.availableSkuIds.includes(id));
    
    if (allSelected) {
      setSite(prev => prev ? ({
        ...prev,
        availableSkuIds: prev.availableSkuIds.filter(id => !allSkuIds.includes(id))
      }) : null);
      // 移除价格
      setSkuPrices(prev => {
        const next = { ...prev };
        allSkuIds.forEach(id => delete next[id]);
        return next;
      });
    } else {
      setSite(prev => prev ? ({
        ...prev,
        availableSkuIds: [...new Set([...prev.availableSkuIds, ...allSkuIds])]
      }) : null);
      // 设置默认价格
      const product = mockProducts.find(p => p.id === spu.id);
      if (product) {
        const newPrices: Record<string, number> = {};
        product.skus.forEach(sku => {
          if (!skuPrices[sku.id]) {
            newPrices[sku.id] = sku.price;
          }
        });
        setSkuPrices(prev => ({ ...prev, ...newPrices }));
      }
    }
    setHasChanges(true);
  };

  // 统计总 SKU 数
  const totalSkus = spuGroups.reduce((acc, spu) => acc + spu.skus.length, 0);

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

  const tabs: { value: TabValue; label: string; icon: React.ReactNode }[] = [
    { value: 'basic', label: '基本信息', icon: <Globe className="h-4 w-4" /> },
    { value: 'payment', label: '支付方式', icon: <CreditCard className="h-4 w-4" /> },
    { value: 'shipping', label: '配送方式', icon: <Truck className="h-4 w-4" /> },
    { value: 'skus', label: '可售 SKU', icon: <Package className="h-4 w-4" /> },
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
              {tab.value === 'skus' && (
                <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded">
                  {site.availableSkuIds.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 基本信息 */}
      {activeTab === 'basic' && (
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
            <CardDescription>站点的基本配置信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">站点名称</label>
              <Input
                value={site.name}
                onChange={(e) => {
                  setSite(prev => prev ? ({ ...prev, name: e.target.value }) : null);
                  setHasChanges(true);
                }}
                placeholder="如：台湾站"
                className="max-w-md"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div className="grid gap-2">
                <label className="text-sm font-medium">地区</label>
                <select
                  value={site.region}
                  onChange={(e) => {
                    setSite(prev => prev ? ({ ...prev, region: e.target.value as Site['region'] }) : null);
                    setHasChanges(true);
                  }}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {regionOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">语言</label>
                <select
                  value={site.language}
                  onChange={(e) => {
                    setSite(prev => prev ? ({ ...prev, language: e.target.value as Site['language'] }) : null);
                    setHasChanges(true);
                  }}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {languageOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div className="grid gap-2">
                <label className="text-sm font-medium">货币</label>
                <select
                  value={site.currency.code}
                  onChange={(e) => {
                    setSite(prev => prev ? ({ ...prev, currency: currencies[e.target.value] }) : null);
                    setHasChanges(true);
                  }}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {Object.values(currencies).map(c => (
                    <option key={c.code} value={c.code}>{c.symbol} {c.name} ({c.code})</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">状态</label>
                <select
                  value={site.status}
                  onChange={(e) => {
                    setSite(prev => prev ? ({ ...prev, status: e.target.value as Site['status'] }) : null);
                    setHasChanges(true);
                  }}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="active">启用</option>
                  <option value="inactive">停用</option>
                </select>
              </div>
            </div>

            {/* 税规则提示 */}
            <div className="rounded-lg border border-dashed p-4 bg-muted/30 max-w-md">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-sm">💡 税规则功能</span>
                <span className="text-xs px-2 py-0.5 rounded bg-muted">暂不做</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 支付方式 */}
      {activeTab === 'payment' && (
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
      )}

      {/* 配送方式 */}
      {activeTab === 'shipping' && (
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
      )}

      {/* 可售 SKU */}
      {activeTab === 'skus' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  可售 SKU 管理
                </CardTitle>
                <CardDescription>
                  已选 {site.availableSkuIds.length} / {totalSkus} 个 SKU · 设置站点销售价格
                </CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索产品或 SKU..."
                  value={skuSearch}
                  onChange={(e) => setSkuSearch(e.target.value)}
                  className="pl-8 h-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredSpuGroups.map(spu => {
                const isExpanded = expandedSpus.has(spu.id);
                const selectedCount = spu.skus.filter(s => site.availableSkuIds.includes(s.id)).length;
                const allSelected = selectedCount === spu.skus.length;
                const partialSelected = selectedCount > 0 && selectedCount < spu.skus.length;
                
                return (
                  <div key={spu.id} className="rounded-lg border overflow-hidden">
                    {/* SPU Header */}
                    <div 
                      className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                        allSelected ? 'bg-primary/5' : partialSelected ? 'bg-primary/5' : 'hover:bg-muted/50'
                      }`}
                    >
                      <button
                        onClick={() => toggleSpuExpand(spu.id)}
                        className="shrink-0"
                      >
                        {isExpanded 
                          ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          : <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        }
                      </button>
                      
                      <input
                        type="checkbox"
                        checked={allSelected}
                        ref={el => {
                          if (el) el.indeterminate = partialSelected;
                        }}
                        onChange={() => toggleAllSkusInSpu(spu)}
                        className="rounded shrink-0"
                      />
                      
                      <img
                        src={spu.image}
                        alt={spu.name}
                        className="h-10 w-10 rounded object-cover shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0" onClick={() => toggleSpuExpand(spu.id)}>
                        <div className="font-medium truncate">{spu.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {selectedCount} / {spu.skus.length} 个 SKU 已选
                        </div>
                      </div>
                    </div>
                    
                    {/* SKU List */}
                    {isExpanded && (
                      <div className="border-t bg-muted/20">
                        {spu.skus.map(sku => {
                          const isSelected = site.availableSkuIds.includes(sku.id);
                          const currentPrice = skuPrices[sku.id] || 0;
                          return (
                            <div
                              key={sku.id}
                              className={`flex items-center gap-3 px-4 py-3 pl-14 border-b last:border-0 transition-colors ${
                                isSelected ? 'bg-primary/5' : 'hover:bg-muted/30'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSkuAvailability(sku.id)}
                                className="rounded shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm">{sku.specs}</div>
                                <div className="text-xs text-muted-foreground font-mono">{sku.code}</div>
                              </div>
                              <div className="text-sm text-muted-foreground shrink-0">
                                库存: <span className={sku.stock < 10 ? 'text-destructive font-medium' : ''}>{sku.stock}</span>
                              </div>
                              {/* 价格输入 */}
                              {isSelected && (
                                <div className="flex items-center gap-1 shrink-0">
                                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">{site.currency.symbol}</span>
                                  <Input
                                    type="number"
                                    value={currentPrice}
                                    onChange={(e) => updateSkuPrice(sku.id, Number(e.target.value))}
                                    onClick={(e) => e.stopPropagation()}
                                    className="h-8 w-24 text-sm"
                                    placeholder="价格"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
