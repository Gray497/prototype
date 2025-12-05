import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  X,
  Image as ImageIcon,
  Package,
  Edit,
  Tag,
  Layers,
  Settings,
  ShoppingCart,
  Palette,
  ChevronRight
} from 'lucide-react';

// --- 类型定义 ---

// SPU 级别的属性定义（属性类型及其可选值）
interface SPUAttributeDefinition {
  id: string;
  name: string;           // 属性名，如 "颜色"、"尺寸"
  values: string[];       // 可选值列表，如 ["红色", "蓝色", "黑色"]
}

// SKU 的具体属性值
interface SKUAttribute {
  id: string;
  name: string;  // 属性名，如 "颜色"、"尺寸"
  value: string; // 属性值，如 "红色"、"XL"
}

interface SKU {
  id: string;
  code: string;
  specs: string;
  price: number;
  stock: number;
  sales: number;
  attributes: SKUAttribute[];
}

interface Product {
  id: string;
  name: string;
  image: string;
  brand: string;
  category: string;
  status: '上架' | '下架' | '缺货';
  description?: string;
  totalStock: number;
  priceRange: string;
  sales: number;
  skus: SKU[];
  attributeDefinitions?: SPUAttributeDefinition[]; // SPU 级别的属性定义
}

// --- 模拟数据 ---
const mockProducts: Product[] = [
  {
    id: "SPU-001",
    name: "Relx 悦刻五代 幻影机身",
    image: "https://picsum.photos/id/1/200/200",
    brand: "Relx 悦刻",
    category: "电子烟",
    status: "上架",
    description: "第五代悦刻幻影，潮汐电量灯设计。",
    totalStock: 150,
    priceRange: "NT$ 950 - NT$ 1,050",
    sales: 342,
    attributeDefinitions: [
      { id: "def-1", name: "颜色", values: ["幻影黑", "零度白", "晨霜绿"] },
      { id: "def-2", name: "套装", values: ["单杆", "限量版"] }
    ],
    skus: [
      { 
        id: "SKU-001-1", 
        code: "RX-5-BLK", 
        specs: "幻影黑 / 单杆", 
        price: 950, 
        stock: 50, 
        sales: 120,
        attributes: [
          { id: "attr-1", name: "颜色", value: "幻影黑" },
          { id: "attr-2", name: "套装", value: "单杆" }
        ]
      },
      { 
        id: "SKU-001-2", 
        code: "RX-5-WHT", 
        specs: "零度白 / 单杆", 
        price: 950, 
        stock: 30, 
        sales: 80,
        attributes: [
          { id: "attr-3", name: "颜色", value: "零度白" },
          { id: "attr-4", name: "套装", value: "单杆" }
        ]
      },
      { 
        id: "SKU-001-3", 
        code: "RX-5-GLD", 
        specs: "晨霜绿 / 限量版", 
        price: 1050, 
        stock: 70, 
        sales: 142,
        attributes: [
          { id: "attr-5", name: "颜色", value: "晨霜绿" },
          { id: "attr-6", name: "套装", value: "限量版" }
        ]
      },
    ]
  },
  {
    id: "SPU-002",
    name: "初音未来 2024 韶华手办",
    image: "https://picsum.photos/id/20/200/200",
    brand: "Good Smile",
    category: "手办",
    status: "上架",
    description: "2024年春节限定造型，韶华初音。",
    totalStock: 45,
    priceRange: "NT$ 4,580 - NT$ 5,200",
    sales: 89,
    attributeDefinitions: [
      { id: "def-3", name: "版本", values: ["标准版", "豪华版"] },
      { id: "def-4", name: "比例", values: ["1/7", "1/8"] },
      { id: "def-5", name: "特典", values: ["含特典", "无特典"] }
    ],
    skus: [
      { 
        id: "SKU-002-1", 
        code: "MIKU-2024-STD", 
        specs: "标准版 / 1/7比例", 
        price: 4580, 
        stock: 40, 
        sales: 80,
        attributes: [
          { id: "attr-7", name: "版本", value: "标准版" },
          { id: "attr-8", name: "比例", value: "1/7" }
        ]
      },
      { 
        id: "SKU-002-2", 
        code: "MIKU-2024-DX", 
        specs: "豪华版 (含特典) / 1/7比例", 
        price: 5200, 
        stock: 5, 
        sales: 9,
        attributes: [
          { id: "attr-9", name: "版本", value: "豪华版" },
          { id: "attr-10", name: "比例", value: "1/7" },
          { id: "attr-11", name: "特典", value: "含特典" }
        ]
      },
    ]
  },
  {
    id: "SPU-003",
    name: "线上手相 - 事业财运精批",
    image: "https://picsum.photos/id/30/200/200",
    brand: "玄学工作室",
    category: "线上服务",
    status: "上架",
    description: "在线看手相，不准不要钱。",
    totalStock: 999,
    priceRange: "CNY 666 - CNY 1,888",
    sales: 156,
    attributeDefinitions: [
      { id: "def-6", name: "套餐", values: ["基础版", "高阶版"] },
      { id: "def-7", name: "内容", values: ["事业+财运", "全盘解析"] },
      { id: "def-8", name: "附加", values: ["视频讲解", "无附加"] }
    ],
    skus: [
      { 
        id: "SKU-003-1", 
        code: "SRV-PALM-BSC", 
        specs: "基础版 (事业+财运)", 
        price: 666, 
        stock: 999, 
        sales: 100,
        attributes: [
          { id: "attr-12", name: "套餐", value: "基础版" },
          { id: "attr-13", name: "内容", value: "事业+财运" }
        ]
      },
      { 
        id: "SKU-003-2", 
        code: "SRV-PALM-ADV", 
        specs: "高阶版 (全盘解析+视频)", 
        price: 1888, 
        stock: 999, 
        sales: 56,
        attributes: [
          { id: "attr-14", name: "套餐", value: "高阶版" },
          { id: "attr-15", name: "内容", value: "全盘解析" },
          { id: "attr-16", name: "附加", value: "视频讲解" }
        ]
      },
    ]
  },
  {
    id: "SPU-004",
    name: "SP2S 思博瑞 烟弹 (3颗装)",
    image: "https://picsum.photos/id/40/200/200",
    brand: "SP2S 思博瑞",
    category: "电子烟",
    status: "缺货",
    description: "通用一代烟弹。",
    totalStock: 0,
    priceRange: "NT$ 350",
    sales: 1205,
    attributeDefinitions: [
      { id: "def-9", name: "口味", values: ["葡萄冰", "劲爽薄荷", "西瓜冰", "可乐冰"] },
      { id: "def-10", name: "数量", values: ["3颗装", "5颗装"] }
    ],
    skus: [
      { 
        id: "SKU-004-1", 
        code: "SP2-POD-GRP", 
        specs: "葡萄冰 / 3颗装", 
        price: 350, 
        stock: 0, 
        sales: 500,
        attributes: [
          { id: "attr-17", name: "口味", value: "葡萄冰" },
          { id: "attr-18", name: "数量", value: "3颗装" }
        ]
      },
      { 
        id: "SKU-004-2", 
        code: "SP2-POD-MNT", 
        specs: "劲爽薄荷 / 3颗装", 
        price: 350, 
        stock: 0, 
        sales: 705,
        attributes: [
          { id: "attr-19", name: "口味", value: "劲爽薄荷" },
          { id: "attr-20", name: "数量", value: "3颗装" }
        ]
      },
    ]
  },
];

// --- Tab 组件 ---
type TabValue = 'skus' | 'attributes' | 'settings';

interface TabsProps {
  value: TabValue;
  onChange: (value: TabValue) => void;
  children: React.ReactNode;
}

const Tabs: React.FC<TabsProps> = ({ value, onChange, children }) => {
  return <div className="space-y-4">{children}</div>;
};

interface TabsListProps {
  children: React.ReactNode;
}

const TabsList: React.FC<TabsListProps> = ({ children }) => {
  return (
    <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: TabValue;
  activeValue: TabValue;
  onClick: () => void;
  children: React.ReactNode;
}

const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, activeValue, onClick, children }) => {
  const isActive = value === activeValue;
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        isActive 
          ? 'bg-background text-foreground shadow-sm' 
          : 'hover:bg-background/50 hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );
};

// --- SKU 属性编辑组件 ---
interface SKUAttributeEditorProps {
  attributes: SKUAttribute[];
  onChange: (attributes: SKUAttribute[]) => void;
  compact?: boolean;
}

const SKUAttributeEditor: React.FC<SKUAttributeEditorProps> = ({ attributes, onChange, compact = false }) => {
  const addAttribute = () => {
    const newAttr: SKUAttribute = {
      id: `attr-${Date.now()}`,
      name: '',
      value: ''
    };
    onChange([...attributes, newAttr]);
  };

  const updateAttribute = (id: string, field: 'name' | 'value', value: string) => {
    onChange(attributes.map(attr => 
      attr.id === id ? { ...attr, [field]: value } : attr
    ));
  };

  const removeAttribute = (id: string) => {
    onChange(attributes.filter(attr => attr.id !== id));
  };

  return (
    <div className="space-y-2">
      {attributes.map((attr) => (
        <div key={attr.id} className="flex items-center gap-2">
          <Input
            placeholder="属性名"
            value={attr.name}
            onChange={(e) => updateAttribute(attr.id, 'name', e.target.value)}
            className={compact ? "h-7 w-20 text-xs" : "h-8 w-28 text-sm"}
          />
          <span className="text-muted-foreground">=</span>
          <Input
            placeholder="属性值"
            value={attr.value}
            onChange={(e) => updateAttribute(attr.id, 'value', e.target.value)}
            className={compact ? "h-7 flex-1 text-xs" : "h-8 flex-1 text-sm"}
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0"
            onClick={() => removeAttribute(attr.id)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        className={compact ? "h-6 text-xs w-full" : "h-8 text-sm w-full"}
        onClick={addAttribute}
      >
        <Plus className="h-3 w-3 mr-1" />
        添加属性
      </Button>
    </div>
  );
};

// --- SKU 编辑弹窗组件 ---
interface SKUEditModalProps {
  sku: SKU;
  currencySymbol: string;
  onSave: (sku: SKU) => void;
  onClose: () => void;
}

const SKUEditModal: React.FC<SKUEditModalProps> = ({ sku, currencySymbol, onSave, onClose }) => {
  const [editingSku, setEditingSku] = useState<SKU>({ ...sku, attributes: [...sku.attributes] });

  const handleChange = (field: keyof SKU, value: string | number) => {
    setEditingSku(prev => ({ ...prev, [field]: value }));
  };

  const handleAttributeChange = (attributes: SKUAttribute[]) => {
    setEditingSku(prev => ({ ...prev, attributes }));
  };

  const handleSave = () => {
    // 自动更新 specs 基于 attributes
    const specs = editingSku.attributes
      .filter(a => a.name && a.value)
      .map(a => a.value)
      .join(' / ');
    onSave({ ...editingSku, specs: specs || editingSku.specs });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        className="bg-background rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-background">
          <h3 className="text-lg font-semibold">编辑 SKU</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4 space-y-5">
          {/* 基本信息 */}
          <div className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">SKU 编码</label>
              <Input
                value={editingSku.code}
                onChange={(e) => handleChange('code', e.target.value)}
                placeholder="SKU-CODE"
                className="font-mono"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">价格 ({currencySymbol})</label>
                <Input
                  type="number"
                  value={editingSku.price}
                  onChange={(e) => handleChange('price', Number(e.target.value))}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">库存</label>
                <Input
                  type="number"
                  value={editingSku.stock}
                  onChange={(e) => handleChange('stock', Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* SKU 属性 - 重点部分 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              <label className="text-sm font-semibold">SKU 属性</label>
            </div>
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <SKUAttributeEditor
                  attributes={editingSku.attributes}
                  onChange={handleAttributeChange}
                />
              </CardContent>
            </Card>
            <p className="text-xs text-muted-foreground">
              💡 属性会自动组合为规格描述
            </p>
          </div>

          {/* 规格预览 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">规格预览</label>
            <div className="p-3 bg-muted rounded-lg text-sm font-medium">
              {editingSku.attributes.filter(a => a.value).map(a => a.value).join(' / ') || '暂无规格'}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 p-4 border-t sticky bottom-0 bg-background">
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            保存 SKU
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- 主组件 ---
interface ProductDetailViewProps {
  productId: string;
  onNavigate: (path: string) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ productId, onNavigate }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<TabValue>('skus');
  const [editingSkuId, setEditingSkuId] = useState<string | null>(null);
  const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false);
  const [formData, setFormData] = useState<Product | null>(null);

  // 加载产品数据
  useEffect(() => {
    const found = mockProducts.find(p => p.id === productId);
    if (found) {
      const productWithAttributes = {
        ...found,
        skus: found.skus.map(sku => ({
          ...sku,
          attributes: sku.attributes || []
        }))
      };
      setProduct(productWithAttributes);
      setFormData(productWithAttributes);
    }
  }, [productId]);

  const handleBack = () => {
    onNavigate('products');
  };

  // 产品基本信息编辑
  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const saveBasicInfo = () => {
    if (formData) {
      setProduct(formData);
      setIsEditingBasicInfo(false);
    }
  };

  // SKU 操作
  const handleSkuSave = (updatedSku: SKU) => {
    setProduct(prev => {
      if (!prev) return null;
      return {
        ...prev,
        skus: prev.skus.map(s => s.id === updatedSku.id ? updatedSku : s)
      };
    });
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        skus: prev.skus.map(s => s.id === updatedSku.id ? updatedSku : s)
      };
    });
    setEditingSkuId(null);
  };

  const addNewSku = () => {
    const newSku: SKU = {
      id: `SKU-${Date.now()}`,
      code: '',
      specs: '',
      price: 0,
      stock: 0,
      sales: 0,
      attributes: []
    };
    setProduct(prev => prev ? { ...prev, skus: [...prev.skus, newSku] } : null);
    setFormData(prev => prev ? { ...prev, skus: [...prev.skus, newSku] } : null);
    setEditingSkuId(newSku.id);
  };

  const removeSku = (skuId: string) => {
    if (!confirm('确定删除该 SKU 吗？')) return;
    setProduct(prev => prev ? { 
      ...prev, 
      skus: prev.skus.filter(s => s.id !== skuId) 
    } : null);
    setFormData(prev => prev ? { 
      ...prev, 
      skus: prev.skus.filter(s => s.id !== skuId) 
    } : null);
  };

  if (!product || !formData) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4 text-center">
        <div className="text-4xl font-bold text-muted-foreground/30">404</div>
        <p className="text-muted-foreground">找不到该产品 (ID: {productId})</p>
        <Button onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回列表
        </Button>
      </div>
    );
  }

  const currencySymbol = product.priceRange.includes("CNY") ? "¥" : "NT$";
  const editingSku = editingSkuId ? product.skus.find(s => s.id === editingSkuId) : null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 顶部导航栏 */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">{product.name}</h2>
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
              product.status === '上架' ? 'border-transparent bg-emerald-500/10 text-emerald-500' : 
              product.status === '缺货' ? 'border-transparent bg-destructive/10 text-destructive' :
              'border-transparent bg-muted text-muted-foreground'
            }`}>
              {product.status}
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            ID: {product.id} · {product.brand} · {product.category}
          </p>
        </div>
      </div>

      {/* 产品基本信息卡片 */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="flex items-start gap-4">
            <img
              src={product.image}
              alt={product.name}
              className="h-20 w-20 rounded-lg object-cover border shrink-0"
            />
            <div className="space-y-1">
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>{product.description || '暂无描述'}</CardDescription>
              <div className="flex items-center gap-4 text-sm pt-2">
                <div className="flex items-center gap-1.5">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span>库存: <strong>{product.totalStock}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  <span>销量: <strong>{product.sales}</strong></span>
                </div>
                <div className="text-primary font-semibold">
                  {product.priceRange}
                </div>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsEditingBasicInfo(true)}>
            <Edit className="h-3.5 w-3.5 mr-1.5" />
            编辑信息
          </Button>
        </CardHeader>
      </Card>

      {/* Tabs 区域 */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="skus" activeValue={activeTab} onClick={() => setActiveTab('skus')}>
              <Layers className="h-4 w-4 mr-2" />
              SKU 列表 ({product.skus.length})
            </TabsTrigger>
            <TabsTrigger value="attributes" activeValue={activeTab} onClick={() => setActiveTab('attributes')}>
              <Palette className="h-4 w-4 mr-2" />
              SKU 属性管理
            </TabsTrigger>
            <TabsTrigger value="settings" activeValue={activeTab} onClick={() => setActiveTab('settings')}>
              <Settings className="h-4 w-4 mr-2" />
              设置
            </TabsTrigger>
          </TabsList>
          
          {activeTab === 'skus' && (
            <Button onClick={addNewSku}>
              <Plus className="h-4 w-4 mr-2" />
              添加 SKU
            </Button>
          )}
        </div>

        {/* SKU 列表 Tab */}
        {activeTab === 'skus' && (
          <Card>
            <CardHeader>
              <CardTitle>SKU 规格管理</CardTitle>
              <CardDescription>
                共 {product.skus.length} 个 SKU · 点击编辑按钮修改 SKU 属性
              </CardDescription>
            </CardHeader>
            <CardContent>
              {product.skus.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                  <Layers className="h-8 w-8 mx-auto mb-3 opacity-50" />
                  <p>暂无 SKU</p>
                  <p className="text-xs mt-1">点击右上角「添加 SKU」创建</p>
                </div>
              ) : (
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr className="border-b">
                        <th className="h-11 px-4 text-left font-medium text-muted-foreground">SKU 编码</th>
                        <th className="h-11 px-4 text-left font-medium text-muted-foreground">规格</th>
                        <th className="h-11 px-4 text-left font-medium text-muted-foreground min-w-[200px]">属性</th>
                        <th className="h-11 px-4 text-left font-medium text-muted-foreground w-24">价格</th>
                        <th className="h-11 px-4 text-left font-medium text-muted-foreground w-20">库存</th>
                        <th className="h-11 px-4 text-center font-medium text-muted-foreground w-24">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.skus.map((sku) => (
                        <tr
                          key={sku.id}
                          className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                        >
                          <td className="p-4 font-mono text-xs text-muted-foreground">
                            {sku.code || <span className="text-destructive">未设置</span>}
                          </td>
                          <td className="p-4 font-medium">
                            {sku.specs || '-'}
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1.5">
                              {sku.attributes?.length > 0 ? (
                                sku.attributes.map(attr => (
                                  <span
                                    key={attr.id}
                                    className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                                  >
                                    <Tag className="h-3 w-3 mr-1 opacity-70" />
                                    {attr.name}: {attr.value}
                                  </span>
                                ))
                              ) : (
                                <span className="text-muted-foreground text-xs italic">暂无属性</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 font-medium">
                            {currencySymbol} {sku.price.toLocaleString()}
                          </td>
                          <td className="p-4">
                            <span className={sku.stock < 10 ? 'text-destructive font-semibold' : ''}>
                              {sku.stock}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setEditingSkuId(sku.id)}
                                title="编辑 SKU"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => removeSku(sku.id)}
                                title="删除 SKU"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* SKU 属性管理 Tab */}
        {activeTab === 'attributes' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    SKU 属性管理
                  </CardTitle>
                  <CardDescription>
                    定义此产品的 SKU 属性类型及可选值，当前共 {product.skus.length} 个 SKU
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => {
                    const newDef: SPUAttributeDefinition = {
                      id: `def-${Date.now()}`,
                      name: '',
                      values: []
                    };
                    setProduct(prev => prev ? {
                      ...prev,
                      attributeDefinitions: [...(prev.attributeDefinitions || []), newDef]
                    } : null);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  添加属性类型
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {(!product.attributeDefinitions || product.attributeDefinitions.length === 0) ? (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                  <Palette className="h-8 w-8 mx-auto mb-3 opacity-50" />
                  <p>暂无属性定义</p>
                  <p className="text-xs mt-1">点击「添加属性类型」开始配置</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {product.attributeDefinitions.map((def, index) => (
                    <Card key={def.id} className="border-l-4 border-l-primary/50">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          {/* 属性名称 */}
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 min-w-[120px]">
                                <Tag className="h-4 w-4 text-primary" />
                                <Input
                                  value={def.name}
                                  onChange={(e) => {
                                    setProduct(prev => {
                                      if (!prev) return null;
                                      const newDefs = [...(prev.attributeDefinitions || [])];
                                      newDefs[index] = { ...def, name: e.target.value };
                                      return { ...prev, attributeDefinitions: newDefs };
                                    });
                                  }}
                                  placeholder="属性名称（如：颜色）"
                                  className="h-9 font-medium"
                                />
                              </div>
                              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                              <div className="flex-1 text-sm text-muted-foreground">
                                {def.values.length} 个可选值
                              </div>
                            </div>
                            
                            {/* 属性值列表 */}
                            <div className="pl-6 space-y-2">
                              <div className="flex flex-wrap gap-2">
                                {def.values.map((val, valIndex) => (
                                  <div 
                                    key={valIndex}
                                    className="inline-flex items-center gap-1 bg-primary/10 rounded-md pl-3 pr-1 py-1"
                                  >
                                    <span className="text-sm font-medium text-primary">{val}</span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-5 w-5 text-primary/50 hover:text-destructive hover:bg-transparent"
                                      onClick={() => {
                                        setProduct(prev => {
                                          if (!prev) return null;
                                          const newDefs = [...(prev.attributeDefinitions || [])];
                                          const newValues = [...def.values];
                                          newValues.splice(valIndex, 1);
                                          newDefs[index] = { ...def, values: newValues };
                                          return { ...prev, attributeDefinitions: newDefs };
                                        });
                                      }}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                                
                                {/* 添加新值 */}
                                <div className="inline-flex items-center">
                                  <Input
                                    placeholder="添加值..."
                                    className="h-7 w-24 text-xs"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        const input = e.target as HTMLInputElement;
                                        const newValue = input.value.trim();
                                        if (newValue && !def.values.includes(newValue)) {
                                          setProduct(prev => {
                                            if (!prev) return null;
                                            const newDefs = [...(prev.attributeDefinitions || [])];
                                            newDefs[index] = { ...def, values: [...def.values, newValue] };
                                            return { ...prev, attributeDefinitions: newDefs };
                                          });
                                          input.value = '';
                                        }
                                      }
                                    }}
                                  />
                                  <span className="text-xs text-muted-foreground ml-2">按 Enter 添加</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* 删除按钮 */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                            onClick={() => {
                              if (!confirm(`确定删除属性「${def.name || '未命名'}」吗？`)) return;
                              setProduct(prev => {
                                if (!prev) return null;
                                return {
                                  ...prev,
                                  attributeDefinitions: (prev.attributeDefinitions || []).filter(d => d.id !== def.id)
                                };
                              });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* SKU 数量统计 */}
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="text-sm font-medium">SKU 统计</div>
                          <div className="text-xs text-muted-foreground">
                            基于属性组合理论上可生成的 SKU 数量
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {product.attributeDefinitions.reduce((acc, def) => acc * (def.values.length || 1), 1)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            理论 SKU 数 | 实际 {product.skus.length} 个
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* 设置 Tab */}
        {activeTab === 'settings' && (
          <Card>
            <CardHeader>
              <CardTitle>产品设置</CardTitle>
              <CardDescription>配置产品的其他选项</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">发布状态</label>
                <select
                  name="status"
                  value={product.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as Product['status'];
                    setProduct(prev => prev ? { ...prev, status: newStatus } : null);
                  }}
                  className="h-10 w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="上架">上架</option>
                  <option value="下架">下架</option>
                  <option value="缺货">缺货</option>
                </select>
              </div>
              
              <div className="grid gap-2">
                <label className="text-sm font-medium">商品图片 URL</label>
                <Input
                  value={product.image}
                  onChange={(e) => setProduct(prev => prev ? { ...prev, image: e.target.value } : null)}
                  placeholder="https://..."
                  className="max-w-md"
                />
                {product.image && (
                  <img src={product.image} alt="预览" className="h-24 w-24 rounded-lg object-cover border mt-2" />
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </Tabs>

      {/* SKU 编辑弹窗 */}
      {editingSku && (
        <SKUEditModal
          sku={editingSku}
          currencySymbol={currencySymbol}
          onSave={handleSkuSave}
          onClose={() => setEditingSkuId(null)}
        />
      )}

      {/* 基本信息编辑弹窗 */}
      {isEditingBasicInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setIsEditingBasicInfo(false)}>
          <div 
            className="bg-background rounded-lg shadow-xl w-full max-w-lg mx-4 animate-in fade-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">编辑产品信息</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsEditingBasicInfo(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">商品名称</label>
                <Input name="name" value={formData.name} onChange={handleBasicInfoChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">品牌</label>
                  <Input name="brand" value={formData.brand} onChange={handleBasicInfoChange} />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">分类</label>
                  <Input name="category" value={formData.category} onChange={handleBasicInfoChange} />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">商品描述</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleBasicInfoChange}
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => {
                setFormData(product);
                setIsEditingBasicInfo(false);
              }}>取消</Button>
              <Button onClick={saveBasicInfo}>
                <Save className="h-4 w-4 mr-2" />
                保存
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
