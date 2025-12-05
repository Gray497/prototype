import { Site, Currency, PaymentMethod, ShippingMethod, TaxRule, CodStore } from './types';

// 预定义的货币
export const currencies: Record<string, Currency> = {
  USD: { code: 'USD', symbol: '$', name: '美元' },
  EUR: { code: 'EUR', symbol: '€', name: '欧元' },
  TWD: { code: 'TWD', symbol: 'NT$', name: '新台币' },
  CNY: { code: 'CNY', symbol: '¥', name: '人民币' },
  JPY: { code: 'JPY', symbol: '¥', name: '日元' },
};

// 货到付款门店选项
export const codStores: CodStore[] = [
  { id: '711', name: '7-11', description: '7-ELEVEN 超商取货付款' },
  { id: 'family', name: '全家', description: 'FamilyMart 超商取货付款' },
];

// 预定义的支付方式 - 线上支付
export const onlinePaymentMethods: PaymentMethod[] = [
  { id: 'line_pay', name: 'LINE Pay', category: 'online', enabled: true },
  { id: 'apple_pay', name: 'Apple Pay', category: 'online', enabled: true, comingSoon: true },
];

// 预定义的支付方式 - 货到付款
export const codPaymentMethods: PaymentMethod[] = [
  { id: 'cod_711', name: '7-11 取货付款', category: 'cod', enabled: true, stores: ['711'] },
  { id: 'cod_family', name: '全家取货付款', category: 'cod', enabled: true, stores: ['family'] },
];

// 所有可用支付方式
export const availablePaymentMethods: PaymentMethod[] = [
  ...onlinePaymentMethods,
  ...codPaymentMethods,
];

// 预定义的配送方式
export const availableShippingMethods: ShippingMethod[] = [
  { id: 'standard', name: '标准配送', description: '一般快递', baseCost: 60, estimatedDays: '3-5', enabled: true },
  { id: 'express', name: '快速配送', description: '隔日达', baseCost: 120, estimatedDays: '1-2', enabled: true },
  { id: 'pickup', name: '门店自取', description: '到店取货', baseCost: 0, estimatedDays: '1', enabled: true },
  { id: 'sf_express', name: '顺丰速运', description: '顺丰快递', baseCost: 80, estimatedDays: '2-3', enabled: true },
  { id: 'fedex', name: 'FedEx', description: '国际快递', baseCost: 200, estimatedDays: '5-7', enabled: true },
  { id: 'dhl', name: 'DHL', description: '国际快递', baseCost: 250, estimatedDays: '3-5', enabled: true },
  { id: 'ups', name: 'UPS', description: '国际快递', baseCost: 220, estimatedDays: '4-6', enabled: true },
  { id: '711_pickup', name: '7-11 取货', description: '超商取货', baseCost: 45, estimatedDays: '2-3', enabled: true },
  { id: 'family_pickup', name: '全家取货', description: '超商取货', baseCost: 45, estimatedDays: '2-3', enabled: true },
];

// 站点数据
export const mockSites: Site[] = [
  {
    id: 'site-tw',
    name: '台湾站',
    region: 'TW',
    language: 'zh-TW',
    currency: currencies.TWD,
    paymentMethods: [
      { id: 'line_pay', name: 'LINE Pay', category: 'online', enabled: true },
      { id: 'cod_711', name: '7-11 取货付款', category: 'cod', enabled: true, stores: ['711'] },
      { id: 'cod_family', name: '全家取货付款', category: 'cod', enabled: true, stores: ['family'] },
    ],
    shippingMethods: [
      { id: 'standard', name: '宅配', description: '黑猫/新竹物流', baseCost: 60, estimatedDays: '1-2', enabled: true },
      { id: '711_pickup', name: '7-11 取货', description: '超商取货付款', baseCost: 45, estimatedDays: '2-3', enabled: true },
      { id: 'family_pickup', name: '全家取货', description: '超商取货付款', baseCost: 45, estimatedDays: '2-3', enabled: true },
    ],
    taxRules: [
      { id: 'tax-tw-1', name: '营业税', rate: 5, type: 'inclusive', applyTo: 'all' },
    ],
    availableSkuIds: [
      'SKU-001-1', 'SKU-001-2', 'SKU-001-3',
      'SKU-002-1', 'SKU-002-2',
      'SKU-004-1', 'SKU-004-2'
    ],
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: 'site-us',
    name: '美国站',
    region: 'US',
    language: 'en',
    currency: currencies.USD,
    paymentMethods: [
      { id: 'line_pay', name: 'LINE Pay', category: 'online', enabled: true },
    ],
    shippingMethods: [
      { id: 'standard', name: 'Standard Shipping', description: 'USPS/UPS Ground', baseCost: 5.99, estimatedDays: '5-7', enabled: true },
      { id: 'express', name: 'Express Shipping', description: 'UPS 2-Day', baseCost: 15.99, estimatedDays: '2-3', enabled: true },
      { id: 'fedex', name: 'FedEx Overnight', description: 'Next day delivery', baseCost: 29.99, estimatedDays: '1', enabled: true },
    ],
    taxRules: [
      { id: 'tax-us-1', name: 'Sales Tax (CA)', rate: 7.25, type: 'exclusive', applyTo: 'physical' },
      { id: 'tax-us-2', name: 'Sales Tax (NY)', rate: 8, type: 'exclusive', applyTo: 'physical' },
    ],
    availableSkuIds: [
      'SKU-001-1', 'SKU-001-2',
      'SKU-002-1', 'SKU-002-2',
    ],
    status: 'active',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-11-15T00:00:00Z',
  },
  {
    id: 'site-eu',
    name: '欧洲站',
    region: 'EU',
    language: 'en',
    currency: currencies.EUR,
    paymentMethods: [
      { id: 'line_pay', name: 'LINE Pay', category: 'online', enabled: true },
    ],
    shippingMethods: [
      { id: 'standard', name: 'Standard Delivery', description: 'DPD/Hermes', baseCost: 4.99, estimatedDays: '3-5', enabled: true },
      { id: 'express', name: 'Express Delivery', description: 'DHL Express', baseCost: 12.99, estimatedDays: '1-2', enabled: true },
      { id: 'dhl', name: 'DHL Premium', description: 'Priority handling', baseCost: 19.99, estimatedDays: '1', enabled: true },
    ],
    taxRules: [
      { id: 'tax-eu-1', name: 'VAT (Standard)', rate: 19, type: 'inclusive', applyTo: 'all' },
      { id: 'tax-eu-2', name: 'VAT (Reduced)', rate: 7, type: 'inclusive', applyTo: 'digital' },
    ],
    availableSkuIds: [
      'SKU-002-1', 'SKU-002-2',
    ],
    status: 'active',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-10-20T00:00:00Z',
  },
  {
    id: 'site-cn',
    name: '中国站',
    region: 'CN',
    language: 'zh-CN',
    currency: currencies.CNY,
    paymentMethods: [
      { id: 'line_pay', name: 'LINE Pay', category: 'online', enabled: true },
    ],
    shippingMethods: [
      { id: 'sf_express', name: '顺丰速运', description: '次日达', baseCost: 12, estimatedDays: '1-2', enabled: true },
      { id: 'standard', name: '普通快递', description: '圆通/中通/韵达', baseCost: 6, estimatedDays: '2-4', enabled: true },
    ],
    taxRules: [
      { id: 'tax-cn-1', name: '增值税', rate: 13, type: 'inclusive', applyTo: 'physical' },
      { id: 'tax-cn-2', name: '数字服务税', rate: 6, type: 'inclusive', applyTo: 'digital' },
    ],
    availableSkuIds: [
      'SKU-003-1', 'SKU-003-2',
    ],
    status: 'active',
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
];

// 语言选项
export const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'zh-TW', label: '繁體中文' },
  { value: 'zh-CN', label: '简体中文' },
  { value: 'ja', label: '日本語' },
  { value: 'de', label: 'Deutsch' },
  { value: 'fr', label: 'Français' },
];

// 地区选项
export const regionOptions = [
  { value: 'US', label: '🇺🇸 美国', name: 'United States' },
  { value: 'EU', label: '🇪🇺 欧洲', name: 'Europe' },
  { value: 'TW', label: '🇹🇼 台湾', name: 'Taiwan' },
  { value: 'CN', label: '🇨🇳 中国', name: 'China' },
  { value: 'JP', label: '🇯🇵 日本', name: 'Japan' },
];

