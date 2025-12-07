export type ShippingStatus = '待发货' | '已发货' | '已交付';
export type OrderStatus = '已支付' | '未支付';

export interface Order {
  id: string;
  product: string;
  brand: string;
  category: string;
  quantity: number;
  amount: string;
  currency: string;
  customer: {
    name: string;
    phone: string;
    qq?: string;
    wechat?: string;
    email?: string;
    landline?: string;
  };
  shipping: {
    method: string;
    address: string;
    company?: string;
    trackingNo?: string;
  };
  orderTime: string;
  status: OrderStatus;
  paymentMethod: string;
  transactionId?: string;
  payTime?: string;
  note: string;
  shippingStatus: ShippingStatus;
  ip?: string;
  sourceUrl?: string;
  referer?: string;
  device?: string;
}

export const initialOrders: Order[] = [
  {
    id: 'ORD-8801',
    product: 'Relx 悦刻五代 幻影黑',
    brand: 'Relx 悦刻',
    category: '电子烟',
    quantity: 2,
    amount: '2,600',
    currency: 'TWD',
    customer: { name: '王小明', phone: '0912-345-678', wechat: 'wx_xiaoming', email: 'xm@example.com' },
    shipping: {
      method: '711',
      address: '台北市信义区信义路五段7号 (7-11 信义店)',
      company: '711',
      trackingNo: '711-556677'
    },
    orderTime: '2023-10-27 14:30',
    status: '已支付',
    paymentMethod: 'LINE Pay',
    transactionId: 'TXN-20231027-8801',
    payTime: '2023-10-27 14:31',
    note: '要最新日期的，谢谢',
    shippingStatus: '待发货',
    ip: '116.21.134.194',
    sourceUrl: 'https://wxai.com/?order=ORD-8801',
    referer: 'https://wxai.com/',
    device: 'PC'
  },
  {
    id: 'ORD-8802',
    product: '初音未来 2024 韶华手办',
    brand: 'Good Smile',
    category: '手办',
    quantity: 1,
    amount: '4,580',
    currency: 'TWD',
    customer: { name: '陈雅婷', phone: '0922-444-555' },
    shipping: { method: '全家', address: '新北市板桥区文化路一段 (全家 板桥店)' },
    orderTime: '2023-10-27 10:15',
    status: '未支付',
    paymentMethod: '-',
    note: '包装请加固，我是盒控',
    shippingStatus: '待发货'
  },
  {
    id: 'ORD-8803',
    product: '线上手相 - 事业财运精批',
    brand: '玄学工作室',
    category: '线上手相服务',
    quantity: 1,
    amount: '666',
    currency: 'CNY',
    customer: { name: '林志豪', phone: '0933-111-222', wechat: 'lin_888' },
    shipping: { method: '线上交付', address: '微信号: lin_888 (无需邮寄)' },
    orderTime: '2023-10-26 18:45',
    status: '已支付',
    paymentMethod: '微信支付',
    transactionId: 'TXN-20231026-8803',
    payTime: '2023-10-26 18:46',
    note: '最近工作比较迷茫，急需指点',
    shippingStatus: '已交付',
    ip: '223.5.5.5',
    sourceUrl: 'https://wxai.com/online',
    referer: 'https://wxai.com/',
    device: 'Mobile'
  },
  {
    id: 'ORD-8804',
    product: 'SP2S 思博瑞 烟弹 (葡萄冰)',
    brand: 'SP2S 思博瑞',
    category: '电子烟',
    quantity: 5,
    amount: '1,250',
    currency: 'TWD',
    customer: { name: '赵六', phone: '0955-666-777' },
    shipping: { method: '货到付款', address: '台中市西屯区台湾大道三段 (黑猫宅急便)' },
    orderTime: '2023-10-26 09:20',
    status: '未支付',
    paymentMethod: '货到付款',
    note: '客户重复下单',
    shippingStatus: '待发货'
  },
  {
    id: 'ORD-8805',
    product: '鬼灭之刃 灶门炭治郎',
    brand: 'Aniplex',
    category: '手办',
    quantity: 1,
    amount: '3,200',
    currency: 'TWD',
    customer: { name: '孙七', phone: '0988-999-000', qq: '2759001', email: 'sun7@example.com' },
    shipping: { method: '全家', address: '高雄市左营区博爱二路 (全家 巨蛋店)', company: '全家', trackingNo: 'FAMI-999111' },
    orderTime: '2023-10-25 16:10',
    status: '已支付',
    paymentMethod: '信用卡',
    transactionId: 'TXN-20231025-8805',
    payTime: '2023-10-25 16:11',
    note: '-',
    shippingStatus: '待发货',
    ip: '8.8.8.8',
    sourceUrl: 'https://wxai.com/product/kimetsu',
    referer: 'https://google.com',
    device: 'PC'
  }
];

