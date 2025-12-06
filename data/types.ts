// ============================================
// 通用类型定义
// ============================================

import { LucideIcon } from 'lucide-react';

// --- 导航相关 ---
export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  variant: "default" | "ghost";
}

// --- 用户相关 ---
export interface User {
  name: string;
  email: string;
  avatar: string;
}

// --- 产品相关 ---

// SPU 级别的属性定义
export interface SPUAttributeDefinition {
  id: string;
  name: string;
  values: string[];
}

// SKU 的具体属性值
export interface SKUAttribute {
  id: string;
  name: string;
  value: string;
}

// SKU（最小库存单位）
export interface SKU {
  id: string;
  code: string;
  specs: string;
  price: number;
  stock: number;
  sales: number;
  attributes: SKUAttribute[];
}

// 简化版 SKU（用于列表展示）
export interface SimpleSKU {
  id: string;
  code: string;
  specs: string;
  price: number;
  stock: number;
  sales: number;
}

// 产品（SPU）
export interface Product {
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
  attributeDefinitions?: SPUAttributeDefinition[];
}

// 简化版产品（用于列表展示）
export interface SimpleProduct {
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
  skus: SimpleSKU[];
}

// --- 站点相关 ---

// 地区
export type Region = 'US' | 'EU' | 'TW' | 'CN' | 'JP';

// 语言
export type Language = 'en' | 'zh-TW' | 'zh-CN' | 'ja' | 'de' | 'fr';

// 货币
export interface Currency {
  code: string;      // USD, EUR, TWD, CNY, JPY
  symbol: string;    // $, €, NT$, ¥
  name: string;      // 美元, 欧元, 新台币
}

// 支付方式类型
export type PaymentCategory = 'online' | 'cod';  // 线上支付 / 货到付款

// 支付方式
export interface PaymentMethod {
  id: string;
  name: string;
  category: PaymentCategory;
  icon?: string;
  enabled: boolean;
  comingSoon?: boolean;  // 即将推出
  stores?: string[];     // 货到付款适用的门店（711/全家等）
  config?: Record<string, unknown>;
}

// 货到付款门店选项
export interface CodStore {
  id: string;
  name: string;
  description?: string;
}

// 配送方式
export interface ShippingMethod {
  id: string;
  name: string;
  description?: string;
  baseCost: number;
  estimatedDays: string;  // "3-5", "1-2"
  enabled: boolean;
}

// 税规则
export interface TaxRule {
  id: string;
  name: string;
  rate: number;       // 税率百分比，如 5 表示 5%
  type: 'inclusive' | 'exclusive';  // 含税/不含税
  applyTo: 'all' | 'physical' | 'digital';  // 适用商品类型
}

// 站点
export interface Site {
  id: string;
  name: string;
  region: Region;
  language: Language;
  currency: Currency;
  paymentMethods: PaymentMethod[];
  shippingMethods: ShippingMethod[];
  taxRules: TaxRule[];
  availableSkuIds: string[];  // 可售 SKU ID 列表
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// --- 文章相关 ---
export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  status: '已发布' | '草稿' | '定时发布' | '已归档';
  views: string;
  createdAt: string;
  lastViewedAt: string;
  category: string;
  tags: string[];
  excerpt?: string;
  coverImage?: string;
  scheduledAt?: string;
  siteId?: string;
  url?: string;
}

// --- 站点模板相关 ---
export type TemplateType = 'single' | 'multi';  // 单品/多品

export interface SiteTemplate {
  id: string;
  name: string;
  type: TemplateType;
  description?: string;
  thumbnail?: string;
  boundSiteIds: string[];  // 绑定的站点 ID 列表
  config: {
    theme?: string;
    layout?: string;
    features?: string[];
  };
  status: 'active' | 'draft';
  createdAt: string;
  updatedAt: string;
}

// --- Dashboard 相关 ---
export interface Metric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
}

export interface RecentSale {
  name: string;
  email: string;
  amount: string;
  avatar: string;
}

// --- 玄学模块-线索相关 ---
export type LeadType = '手相' | '面相';

export interface Lead {
  id: string;
  sessionId: string;           // X-session-id
  name: string;                // 姓名
  phone: string;               // 手机号
  siteId: string;              // 站点
  siteName?: string;           // 站点名称（用于展示）
  orderId?: string;            // 关联订单
  productId?: string;          // 关联产品
  skuId?: string;              // 关联 SKU
  type: LeadType;              // 类型（手相、面相）
  images: string[];            // 图片列表
  createdAt: string;           // 创建时间
  receptionist: string;        // 接待人
  status?: '待处理' | '处理中' | '已完成';
  remark?: string;             // 备注
}

// --- 系统管理-用户相关 ---
export type SystemUserStatus = 'active' | 'inactive' | 'locked';

export interface SystemUser {
  id: string;
  username: string;            // 用户名
  name: string;                // 姓名
  email: string;               // 邮箱
  phone?: string;              // 手机号
  avatar?: string;             // 头像
  roleIds: string[];           // 关联角色ID列表
  roleName?: string;           // 角色名称（用于展示）
  status: SystemUserStatus;    // 状态
  lastLoginAt?: string;        // 最后登录时间
  createdAt: string;           // 创建时间
  updatedAt: string;           // 更新时间
}

// --- 系统管理-角色相关 ---
export interface Permission {
  id: string;
  name: string;                // 权限名称
  code: string;                // 权限编码
  description?: string;        // 权限描述
}

export interface Role {
  id: string;
  name: string;                // 角色名称
  code: string;                // 角色编码
  description?: string;        // 角色描述
  permissions: string[];       // 权限ID列表
  userCount?: number;          // 关联用户数
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

