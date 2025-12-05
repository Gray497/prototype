import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Globe,
  CreditCard,
  Truck,
  Receipt,
  Package,
  X,
  Save,
  Check,
  ChevronRight,
  Search,
  Settings
} from 'lucide-react';
import { 
  Site, 
  PaymentMethod, 
  ShippingMethod, 
  TaxRule,
  mockSites, 
  currencies, 
  languageOptions, 
  regionOptions,
  availablePaymentMethods,
  availableShippingMethods,
  getAllSkus
} from '../../data';

// Tab 类型
type TabValue = 'basic' | 'payment' | 'shipping' | 'tax' | 'skus';

// --- 站点编辑弹窗 ---
interface SiteEditModalProps {
  site: Site;
  onSave: (site: Site) => void;
  onClose: () => void;
}

const SiteEditModal: React.FC<SiteEditModalProps> = ({ site, onSave, onClose }) => {
  const [editingSite, setEditingSite] = useState<Site>({ ...site });
  const [activeTab, setActiveTab] = useState<TabValue>('basic');
  const [skuSearch, setSkuSearch] = useState('');

  const allSkus = getAllSkus();
  const filteredSkus = allSkus.filter(sku => 
    sku.code.toLowerCase().includes(skuSearch.toLowerCase()) ||
    sku.productName.toLowerCase().includes(skuSearch.toLowerCase()) ||
    sku.specs.toLowerCase().includes(skuSearch.toLowerCase())
  );

  const handleSave = () => {
    onSave({ ...editingSite, updatedAt: new Date().toISOString() });
  };

  const togglePaymentMethod = (method: PaymentMethod) => {
    const exists = editingSite.paymentMethods.find(m => m.id === method.id);
    if (exists) {
      setEditingSite(prev => ({
        ...prev,
        paymentMethods: prev.paymentMethods.filter(m => m.id !== method.id)
      }));
    } else {
      setEditingSite(prev => ({
        ...prev,
        paymentMethods: [...prev.paymentMethods, { ...method, enabled: true }]
      }));
    }
  };

  const toggleShippingMethod = (method: ShippingMethod) => {
    const exists = editingSite.shippingMethods.find(m => m.id === method.id);
    if (exists) {
      setEditingSite(prev => ({
        ...prev,
        shippingMethods: prev.shippingMethods.filter(m => m.id !== method.id)
      }));
    } else {
      setEditingSite(prev => ({
        ...prev,
        shippingMethods: [...prev.shippingMethods, { ...method }]
      }));
    }
  };

  const toggleSkuAvailability = (skuId: string) => {
    const exists = editingSite.availableSkuIds.includes(skuId);
    if (exists) {
      setEditingSite(prev => ({
        ...prev,
        availableSkuIds: prev.availableSkuIds.filter(id => id !== skuId)
      }));
    } else {
      setEditingSite(prev => ({
        ...prev,
        availableSkuIds: [...prev.availableSkuIds, skuId]
      }));
    }
  };

  const addTaxRule = () => {
    const newRule: TaxRule = {
      id: `tax-${Date.now()}`,
      name: '',
      rate: 0,
      type: 'inclusive',
      applyTo: 'all'
    };
    setEditingSite(prev => ({
      ...prev,
      taxRules: [...prev.taxRules, newRule]
    }));
  };

  const updateTaxRule = (id: string, field: keyof TaxRule, value: string | number) => {
    setEditingSite(prev => ({
      ...prev,
      taxRules: prev.taxRules.map(r => r.id === id ? { ...r, [field]: value } : r)
    }));
  };

  const removeTaxRule = (id: string) => {
    setEditingSite(prev => ({
      ...prev,
      taxRules: prev.taxRules.filter(r => r.id !== id)
    }));
  };

  const tabs: { value: TabValue; label: string; icon: React.ReactNode }[] = [
    { value: 'basic', label: '基本信息', icon: <Globe className="h-4 w-4" /> },
    { value: 'payment', label: '支付方式', icon: <CreditCard className="h-4 w-4" /> },
    { value: 'shipping', label: '配送方式', icon: <Truck className="h-4 w-4" /> },
    { value: 'tax', label: '税规则', icon: <Receipt className="h-4 w-4" /> },
    { value: 'skus', label: '可售 SKU', icon: <Package className="h-4 w-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        className="bg-background rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <div>
            <h3 className="text-lg font-semibold">编辑站点</h3>
            <p className="text-sm text-muted-foreground">{editingSite.name}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b px-4 shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.value
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* 基本信息 */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">站点名称</label>
                <Input
                  value={editingSite.name}
                  onChange={(e) => setEditingSite(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="如：台湾站"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">地区</label>
                  <select
                    value={editingSite.region}
                    onChange={(e) => setEditingSite(prev => ({ ...prev, region: e.target.value as Site['region'] }))}
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
                    value={editingSite.language}
                    onChange={(e) => setEditingSite(prev => ({ ...prev, language: e.target.value as Site['language'] }))}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {languageOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">货币</label>
                  <select
                    value={editingSite.currency.code}
                    onChange={(e) => setEditingSite(prev => ({ 
                      ...prev, 
                      currency: currencies[e.target.value] 
                    }))}
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
                    value={editingSite.status}
                    onChange={(e) => setEditingSite(prev => ({ ...prev, status: e.target.value as Site['status'] }))}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="active">启用</option>
                    <option value="inactive">停用</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 支付方式 */}
          {activeTab === 'payment' && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">选择此站点支持的支付方式</p>
              <div className="grid gap-2">
                {availablePaymentMethods.map(method => {
                  const isSelected = editingSite.paymentMethods.some(m => m.id === method.id);
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
            </div>
          )}

          {/* 配送方式 */}
          {activeTab === 'shipping' && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">选择此站点支持的配送方式</p>
              <div className="grid gap-2">
                {availableShippingMethods.map(method => {
                  const isSelected = editingSite.shippingMethods.some(m => m.id === method.id);
                  const selectedMethod = editingSite.shippingMethods.find(m => m.id === method.id);
                  return (
                    <div
                      key={method.id}
                      className={`p-3 rounded-lg border transition-colors ${
                        isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                      }`}
                    >
                      <div 
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleShippingMethod(method)}
                      >
                        <div className="flex items-center gap-3">
                          <Truck className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                          <div>
                            <span className="font-medium">{method.name}</span>
                            <p className="text-xs text-muted-foreground">{method.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right text-sm">
                            <div className="font-medium">{editingSite.currency.symbol} {selectedMethod?.baseCost ?? method.baseCost}</div>
                            <div className="text-xs text-muted-foreground">{method.estimatedDays} 天</div>
                          </div>
                          {isSelected && <Check className="h-5 w-5 text-primary" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 税规则 */}
          {activeTab === 'tax' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">配置此站点的税收规则</p>
                <Button size="sm" onClick={addTaxRule}>
                  <Plus className="h-4 w-4 mr-1" />
                  添加规则
                </Button>
              </div>
              
              {editingSite.taxRules.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  暂无税规则
                </div>
              ) : (
                <div className="space-y-3">
                  {editingSite.taxRules.map(rule => (
                    <Card key={rule.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-1 grid grid-cols-4 gap-3">
                            <div className="grid gap-1">
                              <label className="text-xs text-muted-foreground">名称</label>
                              <Input
                                value={rule.name}
                                onChange={(e) => updateTaxRule(rule.id, 'name', e.target.value)}
                                placeholder="如：增值税"
                                className="h-8"
                              />
                            </div>
                            <div className="grid gap-1">
                              <label className="text-xs text-muted-foreground">税率 (%)</label>
                              <Input
                                type="number"
                                value={rule.rate}
                                onChange={(e) => updateTaxRule(rule.id, 'rate', Number(e.target.value))}
                                className="h-8"
                              />
                            </div>
                            <div className="grid gap-1">
                              <label className="text-xs text-muted-foreground">类型</label>
                              <select
                                value={rule.type}
                                onChange={(e) => updateTaxRule(rule.id, 'type', e.target.value)}
                                className="h-8 rounded-md border border-input bg-background px-2 text-sm"
                              >
                                <option value="inclusive">含税价</option>
                                <option value="exclusive">不含税</option>
                              </select>
                            </div>
                            <div className="grid gap-1">
                              <label className="text-xs text-muted-foreground">适用范围</label>
                              <select
                                value={rule.applyTo}
                                onChange={(e) => updateTaxRule(rule.id, 'applyTo', e.target.value)}
                                className="h-8 rounded-md border border-input bg-background px-2 text-sm"
                              >
                                <option value="all">全部商品</option>
                                <option value="physical">实物商品</option>
                                <option value="digital">数字商品</option>
                              </select>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => removeTaxRule(rule.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 可售 SKU */}
          {activeTab === 'skus' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  已选 {editingSite.availableSkuIds.length} / {allSkus.length} 个 SKU
                </p>
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索 SKU..."
                    value={skuSearch}
                    onChange={(e) => setSkuSearch(e.target.value)}
                    className="pl-8 h-9"
                  />
                </div>
              </div>
              
              <div className="rounded-lg border overflow-hidden max-h-[400px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 sticky top-0">
                    <tr className="border-b">
                      <th className="h-10 px-4 text-left font-medium text-muted-foreground w-10">
                        <input
                          type="checkbox"
                          checked={editingSite.availableSkuIds.length === allSkus.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditingSite(prev => ({
                                ...prev,
                                availableSkuIds: allSkus.map(s => s.id)
                              }));
                            } else {
                              setEditingSite(prev => ({
                                ...prev,
                                availableSkuIds: []
                              }));
                            }
                          }}
                          className="rounded"
                        />
                      </th>
                      <th className="h-10 px-4 text-left font-medium text-muted-foreground">产品</th>
                      <th className="h-10 px-4 text-left font-medium text-muted-foreground">SKU 编码</th>
                      <th className="h-10 px-4 text-left font-medium text-muted-foreground">规格</th>
                      <th className="h-10 px-4 text-left font-medium text-muted-foreground">库存</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSkus.map(sku => {
                      const isSelected = editingSite.availableSkuIds.includes(sku.id);
                      return (
                        <tr
                          key={sku.id}
                          className={`border-b last:border-0 cursor-pointer transition-colors ${
                            isSelected ? 'bg-primary/5' : 'hover:bg-muted/30'
                          }`}
                          onClick={() => toggleSkuAvailability(sku.id)}
                        >
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="rounded"
                            />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <img
                                src={sku.productImage}
                                alt={sku.productName}
                                className="h-8 w-8 rounded object-cover"
                              />
                              <span className="font-medium truncate max-w-[150px]">{sku.productName}</span>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-xs text-muted-foreground">{sku.code}</td>
                          <td className="p-4">{sku.specs}</td>
                          <td className="p-4">
                            <span className={sku.stock < 10 ? 'text-destructive font-medium' : ''}>
                              {sku.stock}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t shrink-0">
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            保存
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- 主组件 ---
export const SitesView: React.FC = () => {
  const [sites, setSites] = useState<Site[]>(mockSites);
  const [editingSiteId, setEditingSiteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSites = sites.filter(site =>
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveSite = (updatedSite: Site) => {
    setSites(prev => prev.map(s => s.id === updatedSite.id ? updatedSite : s));
    setEditingSiteId(null);
  };

  const addNewSite = () => {
    const newSite: Site = {
      id: `site-${Date.now()}`,
      name: '新站点',
      region: 'US',
      language: 'en',
      currency: currencies.USD,
      paymentMethods: [],
      shippingMethods: [],
      taxRules: [],
      availableSkuIds: [],
      status: 'inactive',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSites(prev => [...prev, newSite]);
    setEditingSiteId(newSite.id);
  };

  const deleteSite = (siteId: string) => {
    if (!confirm('确定删除该站点吗？')) return;
    setSites(prev => prev.filter(s => s.id !== siteId));
  };

  const editingSite = editingSiteId ? sites.find(s => s.id === editingSiteId) : null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">站点管理</h2>
          <p className="text-muted-foreground">管理多地区站点配置、支付、配送和税务规则。</p>
        </div>
        <Button onClick={addNewSite}>
          <Plus className="mr-2 h-4 w-4" />
          新建站点
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>站点列表</CardTitle>
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索站点..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSites.map(site => {
              const region = regionOptions.find(r => r.value === site.region);
              return (
                <Card key={site.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{region?.label.split(' ')[0]}</div>
                        <div>
                          <CardTitle className="text-lg">{site.name}</CardTitle>
                          <CardDescription>{region?.name}</CardDescription>
                        </div>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        site.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {site.status === 'active' ? '启用' : '停用'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Globe className="h-4 w-4" />
                        <span>{languageOptions.find(l => l.value === site.language)?.label}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="font-medium">{site.currency.symbol}</span>
                        <span>{site.currency.code}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 pt-2 border-t">
                      <div className="text-center">
                        <div className="text-lg font-bold">{site.paymentMethods.length}</div>
                        <div className="text-xs text-muted-foreground">支付</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">{site.shippingMethods.length}</div>
                        <div className="text-xs text-muted-foreground">配送</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">{site.taxRules.length}</div>
                        <div className="text-xs text-muted-foreground">税规则</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">{site.availableSkuIds.length}</div>
                        <div className="text-xs text-muted-foreground">SKU</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setEditingSiteId(site.id)}
                      >
                        <Settings className="h-3.5 w-3.5 mr-1.5" />
                        配置
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => deleteSite(site.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 编辑弹窗 */}
      {editingSite && (
        <SiteEditModal
          site={editingSite}
          onSave={handleSaveSite}
          onClose={() => setEditingSiteId(null)}
        />
      )}
    </div>
  );
};
