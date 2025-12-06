import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import {
  Search,
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  Package,
  Layers
} from 'lucide-react';
import { SimpleProduct, simpleProducts } from '../../data';

type Product = SimpleProduct;

const initialProducts: Product[] = simpleProducts;

interface ProductsViewProps {
  onNavigate?: (path: string) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({ onNavigate }) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const filteredProducts = products.filter((product) => {
    const keyword = searchTerm.toLowerCase();
    if (!keyword) return true;
    return (
      product.name.toLowerCase().includes(keyword) ||
      product.brand.toLowerCase().includes(keyword) ||
      product.category.toLowerCase().includes(keyword) ||
      product.skus.some((sku) => sku.code.toLowerCase().includes(keyword))
    );
  });

  const toggleExpand = (id: string) => {
    const next = new Set(expandedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setExpandedIds(next);
  };

  const toggleAll = () => {
    if (expandedIds.size === filteredProducts.length) {
      setExpandedIds(new Set());
    } else {
      setExpandedIds(new Set(filteredProducts.map((p) => p.id)));
    }
  };

  const handleEditClick = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onNavigate) {
      onNavigate(`products/${product.id}`);
    }
  };

  const handleDeleteProduct = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('确定删除该商品吗？')) return;
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.delete(productId);
      return next;
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">产品管理</h2>
          <p className="text-muted-foreground">管理 SPU 及 SKU 商品信息。</p>
        </div>
        <div className="relative w-full sm:w-[320px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索商品名称、品牌或 SKU 编码..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>商品列表</CardTitle>
            <span className="text-sm text-muted-foreground">共 {filteredProducts.length} 个</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 w-[50px] px-4 text-center align-middle">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={toggleAll}>
                      <Layers className="h-4 w-4" />
                    </Button>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">商品信息 (SPU)</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">价格区间</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">总库存</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">总销量</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">状态</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">操作</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {filteredProducts.map((product) => {
                  const isExpanded = expandedIds.has(product.id);
                  return (
                    <React.Fragment key={product.id}>
                      <tr
                        className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer ${isExpanded ? 'bg-muted/30' : ''}`}
                        onClick={() => toggleExpand(product.id)}
                      >
                        <td className="p-4 align-middle text-center">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </Button>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-12 w-12 rounded-md object-cover border bg-background"
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">{product.name}</span>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="inline-flex items-center rounded-sm border px-1.5 py-0.5 text-[10px] text-muted-foreground bg-secondary">
                                  {product.brand}
                                </span>
                                <span className="text-xs text-muted-foreground">{product.category}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle font-medium">{product.priceRange}</td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-1.5">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span>{product.totalStock}</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle text-muted-foreground">{product.sales}</td>
                        <td className="p-4 align-middle">
                          <div
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                              product.status === '上架'
                                ? 'border-transparent bg-emerald-500/10 text-emerald-500'
                                : product.status === '缺货'
                                  ? 'border-transparent bg-destructive/10 text-destructive'
                                  : 'border-transparent bg-muted text-muted-foreground'
                            }`}
                          >
                            {product.status}
                          </div>
                        </td>
                        <td className="p-4 align-middle text-right">
                          <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={(e) => handleEditClick(product, e)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={(e) => handleDeleteProduct(product.id, e)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-muted/30">
                          <td colSpan={7} className="p-0">
                            <div className="px-4 pb-4 pt-1">
                              <div className="rounded-md border bg-background overflow-hidden">
                                <table className="w-full text-sm">
                                  <thead className="bg-muted/50">
                                    <tr className="border-b">
                                      <th className="h-9 px-4 text-left font-medium text-muted-foreground">SKU 编码</th>
                                      <th className="h-9 px-4 text-left font-medium text-muted-foreground">规格 / 属性</th>
                                      <th className="h-9 px-4 text-left font-medium text-muted-foreground">价格</th>
                                      <th className="h-9 px-4 text-left font-medium text-muted-foreground">库存</th>
                                      <th className="h-9 px-4 text-left font-medium text-muted-foreground">销量</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {product.skus.map((sku, index) => (
                                      <tr key={sku.id} className={index !== product.skus.length - 1 ? 'border-b' : ''}>
                                        <td className="p-3 px-4 font-mono text-xs text-muted-foreground">{sku.code}</td>
                                        <td className="p-3 px-4 font-medium">{sku.specs}</td>
                                        <td className="p-3 px-4">
                                          {product.priceRange.includes('CNY') ? 'CNY' : 'NT$'} {sku.price.toLocaleString()}
                                        </td>
                                        <td className="p-3 px-4">
                                          <span className={sku.stock < 10 ? 'text-destructive font-medium' : ''}>{sku.stock}</span>
                                        </td>
                                        <td className="p-3 px-4 text-muted-foreground">{sku.sales}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-muted-foreground">
                      未找到匹配的商品。
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

