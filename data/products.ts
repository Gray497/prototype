import { Product, SimpleProduct } from './types';

// 完整产品数据（包含属性）
export const mockProducts: Product[] = [
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

// 简化版产品数据（用于列表页）
export const simpleProducts: SimpleProduct[] = mockProducts.map(p => ({
  id: p.id,
  name: p.name,
  image: p.image,
  brand: p.brand,
  category: p.category,
  status: p.status,
  description: p.description,
  totalStock: p.totalStock,
  priceRange: p.priceRange,
  sales: p.sales,
  skus: p.skus.map(s => ({
    id: s.id,
    code: s.code,
    specs: s.specs,
    price: s.price,
    stock: s.stock,
    sales: s.sales
  }))
}));

// 获取所有 SKU 列表（扁平化）
export const getAllSkus = () => {
  return mockProducts.flatMap(p => 
    p.skus.map(s => ({
      ...s,
      productId: p.id,
      productName: p.name,
      productImage: p.image
    }))
  );
};
