import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { 
  Package,
  Search,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Site, mockProducts } from '../../../data';

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
      stock: sku.stock,
      price: sku.price
    }))
  }));
};

interface SkusTabProps {
  site: Site;
  onSiteChange: (site: Site) => void;
  skuPrices: Record<string, number>;
  onSkuPricesChange: (prices: Record<string, number>) => void;
  onMarkChanged: () => void;
}

export const SkusTab: React.FC<SkusTabProps> = ({ 
  site, 
  onSiteChange,
  skuPrices,
  onSkuPricesChange,
  onMarkChanged 
}) => {
  const [skuSearch, setSkuSearch] = useState('');
  const [expandedSpus, setExpandedSpus] = useState<Set<string>>(new Set());

  const spuGroups = getSkusGroupedBySpu();
  const totalSkus = spuGroups.reduce((acc, spu) => acc + spu.skus.length, 0);

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

  const toggleSkuAvailability = (skuId: string) => {
    const exists = site.availableSkuIds.includes(skuId);
    if (exists) {
      onSiteChange({
        ...site,
        availableSkuIds: site.availableSkuIds.filter(id => id !== skuId)
      });
      // 移除价格
      const newPrices = { ...skuPrices };
      delete newPrices[skuId];
      onSkuPricesChange(newPrices);
    } else {
      onSiteChange({
        ...site,
        availableSkuIds: [...site.availableSkuIds, skuId]
      });
      // 设置默认价格
      const product = mockProducts.find(p => p.skus.some(s => s.id === skuId));
      const sku = product?.skus.find(s => s.id === skuId);
      if (sku) {
        onSkuPricesChange({ ...skuPrices, [skuId]: sku.price });
      }
    }
    onMarkChanged();
  };

  const updateSkuPrice = (skuId: string, price: number) => {
    onSkuPricesChange({ ...skuPrices, [skuId]: price });
    onMarkChanged();
  };

  // 切换整个 SPU 的所有 SKU
  const toggleAllSkusInSpu = (spu: typeof spuGroups[0]) => {
    const allSkuIds = spu.skus.map(s => s.id);
    const allSelected = allSkuIds.every(id => site.availableSkuIds.includes(id));
    
    if (allSelected) {
      onSiteChange({
        ...site,
        availableSkuIds: site.availableSkuIds.filter(id => !allSkuIds.includes(id))
      });
      // 移除价格
      const newPrices = { ...skuPrices };
      allSkuIds.forEach(id => delete newPrices[id]);
      onSkuPricesChange(newPrices);
    } else {
      onSiteChange({
        ...site,
        availableSkuIds: [...new Set([...site.availableSkuIds, ...allSkuIds])]
      });
      // 设置默认价格
      const product = mockProducts.find(p => p.id === spu.id);
      if (product) {
        const newPrices: Record<string, number> = { ...skuPrices };
        product.skus.forEach(sku => {
          if (!newPrices[sku.id]) {
            newPrices[sku.id] = sku.price;
          }
        });
        onSkuPricesChange(newPrices);
      }
    }
    onMarkChanged();
  };

  return (
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
                
                {/* SKU List - 优化布局：价格库存紧贴名称 */}
                {isExpanded && (
                  <div className="border-t bg-muted/20">
                    {spu.skus.map(sku => {
                      const isSelected = site.availableSkuIds.includes(sku.id);
                      const currentPrice = skuPrices[sku.id] || 0;
                      return (
                        <div
                          key={sku.id}
                          className={`flex items-center gap-3 px-4 py-2.5 pl-14 border-b last:border-0 transition-colors ${
                            isSelected ? 'bg-primary/5' : 'hover:bg-muted/30'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSkuAvailability(sku.id)}
                            className="rounded shrink-0"
                          />
                          {/* SKU 信息区域 - 紧凑布局 */}
                          <div className="flex-1 min-w-0 flex items-center gap-4">
                            <div className="min-w-0">
                              <div className="font-medium text-sm truncate">{sku.specs}</div>
                              <div className="text-xs text-muted-foreground font-mono">{sku.code}</div>
                            </div>
                            {/* 库存 - 紧贴名称 */}
                            <div className="text-xs text-muted-foreground whitespace-nowrap">
                              库存 <span className={sku.stock < 10 ? 'text-destructive font-medium' : 'font-medium'}>{sku.stock}</span>
                            </div>
                            {/* 价格输入 - 紧贴库存 */}
                            {isSelected && (
                              <div className="flex items-center gap-1 whitespace-nowrap">
                                <span className="text-xs text-muted-foreground">{site.currency.symbol}</span>
                                <Input
                                  type="number"
                                  value={currentPrice}
                                  onChange={(e) => updateSkuPrice(sku.id, Number(e.target.value))}
                                  onClick={(e) => e.stopPropagation()}
                                  className="h-7 w-20 text-xs"
                                  placeholder="价格"
                                />
                              </div>
                            )}
                          </div>
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
  );
};

