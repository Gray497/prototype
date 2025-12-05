import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  DollarSign,
  Search,
  Filter,
  Save,
  Globe,
  Package,
  X,
  Edit
} from 'lucide-react';
import { 
  mockSites, 
  mockProducts,
  regionOptions
} from '../../data';

// 价格数据类型
interface PriceEntry {
  id: string;
  siteId: string;
  siteName: string;
  siteRegion: string;
  productId: string;
  productName: string;
  skuId: string;
  skuCode: string;
  skuSpecs: string;
  price: number;
  currency: {
    code: string;
    symbol: string;
  };
}

// 生成模拟价格数据
const generatePriceData = (): PriceEntry[] => {
  const entries: PriceEntry[] = [];
  
  mockSites.forEach(site => {
    site.availableSkuIds.forEach(skuId => {
      const product = mockProducts.find(p => p.skus.some(s => s.id === skuId));
      const sku = product?.skus.find(s => s.id === skuId);
      
      if (product && sku) {
        entries.push({
          id: `${site.id}-${skuId}`,
          siteId: site.id,
          siteName: site.name,
          siteRegion: site.region,
          productId: product.id,
          productName: product.name,
          skuId: sku.id,
          skuCode: sku.code,
          skuSpecs: sku.specs,
          price: sku.price,
          currency: site.currency
        });
      }
    });
  });
  
  return entries;
};

// --- 价格编辑弹框 ---
interface PriceEditModalProps {
  entry: PriceEntry;
  onSave: (entryId: string, newPrice: number) => void;
  onClose: () => void;
}

const PriceEditModal: React.FC<PriceEditModalProps> = ({ entry, onSave, onClose }) => {
  const [price, setPrice] = useState(entry.price);
  const region = regionOptions.find(r => r.value === entry.siteRegion);

  const handleSave = () => {
    onSave(entry.id, price);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        className="bg-background rounded-lg shadow-xl w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Edit className="h-5 w-5" />
            编辑价格
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4 space-y-4">
          {/* 信息展示 */}
          <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-lg">{region?.label.split(' ')[0]}</span>
              <span className="font-medium">{entry.siteName}</span>
            </div>
            <div className="text-sm">
              <div className="text-muted-foreground">产品</div>
              <div className="font-medium">{entry.productName}</div>
            </div>
            <div className="text-sm">
              <div className="text-muted-foreground">SKU</div>
              <div className="font-medium">{entry.skuSpecs}</div>
              <div className="text-xs text-muted-foreground font-mono">{entry.skuCode}</div>
            </div>
          </div>

          {/* 价格输入 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">销售价格</label>
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium text-muted-foreground w-12">{entry.currency.symbol}</span>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="text-lg"
                autoFocus
              />
              <span className="text-muted-foreground">{entry.currency.code}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 p-4 border-t">
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
export const PricesView: React.FC = () => {
  const [priceData, setPriceData] = useState<PriceEntry[]>(generatePriceData);
  const [searchTerm, setSearchTerm] = useState('');
  const [siteFilter, setSiteFilter] = useState<string>('all');
  const [productFilter, setProductFilter] = useState<string>('all');
  const [editingEntry, setEditingEntry] = useState<PriceEntry | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // 获取唯一的站点和产品列表
  const sites = mockSites;
  const products = mockProducts;

  // 过滤数据
  const filteredData = useMemo(() => {
    return priceData.filter(entry => {
      // 搜索过滤
      const matchesSearch = !searchTerm || 
        entry.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.skuCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.skuSpecs.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 站点过滤
      const matchesSite = siteFilter === 'all' || entry.siteId === siteFilter;
      
      // 产品过滤
      const matchesProduct = productFilter === 'all' || entry.productId === productFilter;
      
      return matchesSearch && matchesSite && matchesProduct;
    });
  }, [priceData, searchTerm, siteFilter, productFilter]);

  // 更新价格
  const updatePrice = (entryId: string, newPrice: number) => {
    setPriceData(prev => 
      prev.map(entry => 
        entry.id === entryId ? { ...entry, price: newPrice } : entry
      )
    );
    setHasChanges(true);
  };

  // 保存
  const handleSave = () => {
    setHasChanges(false);
    alert('价格保存成功！');
  };

  // 统计
  const totalEntries = priceData.length;
  const filteredCount = filteredData.length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <DollarSign className="h-8 w-8" />
            价格管理
          </h2>
          <p className="text-muted-foreground">管理所有站点的 SKU 销售价格。</p>
        </div>
        {hasChanges && (
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            保存更改
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <CardTitle>价格列表</CardTitle>
              <CardDescription>
                共 {filteredCount} 条记录 {filteredCount !== totalEntries && `(已过滤，总共 ${totalEntries} 条)`}
              </CardDescription>
            </div>
            
            {/* 过滤器 */}
            <div className="flex flex-wrap items-center gap-3">
              {/* 搜索 */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索..."
                  className="pl-8 w-48"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* 站点过滤 */}
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <select
                  value={siteFilter}
                  onChange={(e) => setSiteFilter(e.target.value)}
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="all">全部站点</option>
                  {sites.map(site => {
                    const region = regionOptions.find(r => r.value === site.region);
                    return (
                      <option key={site.id} value={site.id}>
                        {region?.label.split(' ')[0]} {site.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              
              {/* 产品过滤 */}
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <select
                  value={productFilter}
                  onChange={(e) => setProductFilter(e.target.value)}
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="all">全部产品</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredData.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
              <Filter className="h-8 w-8 mx-auto mb-3 opacity-50" />
              <p>暂无数据</p>
              <p className="text-xs mt-1">尝试调整过滤条件</p>
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr className="border-b">
                      <th className="h-11 px-4 text-left font-medium text-muted-foreground">站点</th>
                      <th className="h-11 px-4 text-left font-medium text-muted-foreground">产品</th>
                      <th className="h-11 px-4 text-left font-medium text-muted-foreground">SKU</th>
                      <th className="h-11 px-4 text-left font-medium text-muted-foreground w-32">币种</th>
                      <th className="h-11 px-4 text-left font-medium text-muted-foreground w-32">价格</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((entry) => {
                      const region = regionOptions.find(r => r.value === entry.siteRegion);
                      return (
                        <tr
                          key={entry.id}
                          className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                          onClick={() => setEditingEntry(entry)}
                        >
                          {/* 站点 */}
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{region?.label.split(' ')[0]}</span>
                              <span className="font-medium">{entry.siteName}</span>
                            </div>
                          </td>
                          
                          {/* 产品 */}
                          <td className="p-4">
                            <span className="font-medium">{entry.productName}</span>
                          </td>
                          
                          {/* SKU */}
                          <td className="p-4">
                            <div>
                              <div className="font-medium">{entry.skuSpecs}</div>
                              <div className="text-xs text-muted-foreground font-mono">{entry.skuCode}</div>
                            </div>
                          </td>
                          
                          {/* 币种 */}
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1 text-muted-foreground">
                              <span className="font-medium">{entry.currency.symbol}</span>
                              <span>{entry.currency.code}</span>
                            </span>
                          </td>
                          
                          {/* 价格 - 点击编辑 */}
                          <td className="p-4">
                            <button
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors group"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingEntry(entry);
                              }}
                            >
                              <span className="font-medium text-primary">
                                {entry.currency.symbol} {entry.price.toLocaleString()}
                              </span>
                              <Edit className="h-3 w-3 text-primary/50 group-hover:text-primary transition-colors" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 价格编辑弹框 */}
      {editingEntry && (
        <PriceEditModal
          entry={editingEntry}
          onSave={updatePrice}
          onClose={() => setEditingEntry(null)}
        />
      )}
    </div>
  );
};

