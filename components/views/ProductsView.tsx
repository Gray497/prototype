import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  Plus, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Edit, 
  Trash2, 
  Package, 
  Layers,
  ArrowLeft,
  Save,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { SimpleProduct, SimpleSKU, simpleProducts } from '../../data';

// 使用简化版类型（不含属性详情）
type Product = SimpleProduct;
type SKU = SimpleSKU;

// 使用从 data 文件夹导入的数据
const initialProducts: Product[] = simpleProducts;

// --- 表单组件 ---

interface ProductFormProps {
  initialData?: Product;
  onSave: (data: Product) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSave, onCancel }) => {
  // 表单状态初始化
  const [formData, setFormData] = useState<Product>(initialData || {
    id: `SPU-${Date.now()}`,
    name: "",
    image: "",
    brand: "",
    category: "",
    status: "下架",
    description: "",
    totalStock: 0,
    priceRange: "-",
    sales: 0,
    skus: []
  });

  // 处理基本字段变更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 处理 SKU 变更
  const handleSkuChange = (id: string, field: keyof SKU, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      skus: prev.skus.map(sku => sku.id === id ? { ...sku, [field]: value } : sku)
    }));
  };

  // 添加 SKU
  const addSku = () => {
    const newSku: SKU = {
      id: `SKU-${Date.now()}`,
      code: "",
      specs: "",
      price: 0,
      stock: 0,
      sales: 0
    };
    setFormData(prev => ({ ...prev, skus: [...prev.skus, newSku] }));
  };

  // 删除 SKU
  const removeSku = (id: string) => {
    setFormData(prev => ({ ...prev, skus: prev.skus.filter(s => s.id !== id) }));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {initialData ? "编辑商品 SPU" : "发布新商品"}
            </h2>
            <p className="text-muted-foreground text-sm">
              配置商品基本信息及 SKU 库存。
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onCancel}>取消</Button>
          <Button onClick={() => onSave(formData)}>
            <Save className="mr-2 h-4 w-4" />
            保存商品
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* 左侧：基本信息 */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
              <CardDescription>商品的主要描述信息。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">商品名称</label>
                <Input name="name" value={formData.name} onChange={handleChange} placeholder="请输入商品名称" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="grid gap-2">
                  <label className="text-sm font-medium">品牌</label>
                  <Input name="brand" value={formData.brand} onChange={handleChange} placeholder="品牌名称" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">分类</label>
                  <Input name="category" value={formData.category} onChange={handleChange} placeholder="如：电子烟、手办" />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">商品描述</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="详细的商品介绍..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>SKU 规格与库存</CardTitle>
                <CardDescription>管理商品的多规格变体。</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={addSku}>
                <Plus className="mr-2 h-4 w-4" />
                添加规格
              </Button>
            </CardHeader>
            <CardContent>
              {formData.skus.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  暂无规格，请点击右上角添加。
                </div>
              ) : (
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground">
                      <tr>
                        <th className="p-3 font-medium">规格 / 属性</th>
                        <th className="p-3 font-medium">SKU 编码</th>
                        <th className="p-3 font-medium w-24">价格</th>
                        <th className="p-3 font-medium w-24">库存</th>
                        <th className="p-3 font-medium w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {formData.skus.map((sku, index) => (
                        <tr key={sku.id}>
                          <td className="p-2">
                            <Input 
                              value={sku.specs} 
                              onChange={(e) => handleSkuChange(sku.id, 'specs', e.target.value)}
                              placeholder="如：红色 / XL" 
                              className="h-8"
                            />
                          </td>
                          <td className="p-2">
                            <Input 
                              value={sku.code} 
                              onChange={(e) => handleSkuChange(sku.id, 'code', e.target.value)}
                              placeholder="SKU-CODE" 
                              className="h-8 font-mono"
                            />
                          </td>
                          <td className="p-2">
                            <Input 
                              type="number"
                              value={sku.price} 
                              onChange={(e) => handleSkuChange(sku.id, 'price', Number(e.target.value))}
                              className="h-8"
                            />
                          </td>
                          <td className="p-2">
                             <Input 
                              type="number"
                              value={sku.stock} 
                              onChange={(e) => handleSkuChange(sku.id, 'stock', Number(e.target.value))}
                              className="h-8"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => removeSku(sku.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 右侧：状态与媒体 */}
        <div className="space-y-6">
           <Card>
            <CardHeader>
              <CardTitle>发布状态</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium leading-none">当前状态</span>
                    <span className={`text-xs ${formData.status === '上架' ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                      {formData.status}
                    </span>
                  </div>
                  <select 
                    className="h-8 w-[100px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="上架">上架</option>
                    <option value="下架">下架</option>
                    <option value="缺货">缺货</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>商品图片</CardTitle>
              <CardDescription>建议尺寸 800x800。</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="grid gap-4">
                 {formData.image ? (
                   <div className="relative aspect-square w-full rounded-md border overflow-hidden group">
                      <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <Button variant="secondary" size="sm" onClick={() => setFormData(p => ({...p, image: ''}))}>
                            移除图片
                         </Button>
                      </div>
                   </div>
                 ) : (
                   <div className="aspect-square w-full rounded-md border border-dashed flex flex-col items-center justify-center text-muted-foreground bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors">
                      <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                      <span className="text-xs">点击上传图片</span>
                      {/* 模拟输入URL */}
                      <Input 
                        placeholder="或输入图片 URL" 
                        className="mt-4 w-3/4 h-8 text-xs" 
                        onChange={(e) => setFormData(p => ({...p, image: e.target.value}))}
                        onClick={(e) => e.stopPropagation()}
                      />
                   </div>
                 )}
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// --- 主视图组件 ---

interface ProductsViewProps {
    onNavigate?: (path: string) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({ onNavigate }) => {
    // 视图状态：'list' | 'create' (移除 'edit'，改用路由跳转)
    const [viewMode, setViewMode] = useState<'list' | 'create'>('list');
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
    
    // 列表状态
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState<Product[]>(initialProducts);

    // 切换展开/折叠
    const toggleExpand = (id: string) => {
        const newExpanded = new Set(expandedIds);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedIds(newExpanded);
    };

    const toggleAll = () => {
        if (expandedIds.size === products.length) {
            setExpandedIds(new Set());
        } else {
            setExpandedIds(new Set(products.map(p => p.id)));
        }
    };

    // 进入编辑模式 - 使用路由跳转到详情页
    const handleEditClick = (product: Product) => {
      if (onNavigate) {
        onNavigate(`products/${product.id}`);
      }
    };

    // 进入创建模式
    const handleCreateClick = () => {
      setEditingProduct(undefined);
      setViewMode('create');
    };

    // 保存处理（模拟）- 仅用于创建新商品
    const handleSave = (savedProduct: Product) => {
      setProducts([savedProduct, ...products]);
      setViewMode('list');
    };

    // 如果处于创建模式，渲染表单
    if (viewMode === 'create') {
      return (
        <ProductForm 
          initialData={editingProduct} 
          onSave={handleSave} 
          onCancel={() => setViewMode('list')} 
        />
      );
    }

    // 默认渲染列表
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">产品管理</h2>
                    <p className="text-muted-foreground">管理 SPU 及 SKU 商品信息。</p>
                </div>
                 <Button onClick={handleCreateClick}>
                    <Plus className="mr-2 h-4 w-4" />
                    发布商品
                 </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                         <CardTitle>商品列表</CardTitle>
                         <div className="flex items-center gap-2 w-full sm:w-auto">
                            <div className="relative w-full sm:w-[300px]">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="搜索商品名称、SKU编码..." 
                                    className="pl-8" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button variant="outline">筛选</Button>
                         </div>
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
                                {products.map((product) => {
                                    const isExpanded = expandedIds.has(product.id);
                                    return (
                                        <React.Fragment key={product.id}>
                                            {/* SPU Row */}
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
                                                                <span className="text-xs text-muted-foreground">
                                                                    {product.category}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle font-medium">
                                                    {product.priceRange}
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <div className="flex items-center gap-1.5">
                                                        <Package className="h-4 w-4 text-muted-foreground" />
                                                        <span>{product.totalStock}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle text-muted-foreground">
                                                    {product.sales}
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                                                        product.status === '上架' ? 'border-transparent bg-emerald-500/10 text-emerald-500' : 
                                                        product.status === '缺货' ? 'border-transparent bg-destructive/10 text-destructive' :
                                                        'border-transparent bg-muted text-muted-foreground'
                                                    }`}>
                                                        {product.status}
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle text-right">
                                                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                        <Button 
                                                          variant="ghost" 
                                                          size="icon" 
                                                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                          onClick={() => handleEditClick(product)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* SKU Rows (Expanded) */}
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
                                                                            <tr key={sku.id} className={index !== product.skus.length - 1 ? "border-b" : ""}>
                                                                                <td className="p-3 px-4 font-mono text-xs text-muted-foreground">
                                                                                    {sku.code}
                                                                                </td>
                                                                                <td className="p-3 px-4 font-medium">
                                                                                    {sku.specs}
                                                                                </td>
                                                                                <td className="p-3 px-4">
                                                                                    {product.priceRange.includes("CNY") ? "CNY" : "NT$"} {sku.price.toLocaleString()}
                                                                                </td>
                                                                                <td className="p-3 px-4">
                                                                                    <span className={sku.stock < 10 ? "text-destructive font-medium" : ""}>
                                                                                        {sku.stock}
                                                                                    </span>
                                                                                </td>
                                                                                 <td className="p-3 px-4 text-muted-foreground">
                                                                                    {sku.sales}
                                                                                </td>
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
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};