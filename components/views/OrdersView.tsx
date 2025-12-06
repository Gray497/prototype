import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import {
  MoreHorizontal,
  ShoppingBag,
  Phone,
  MapPin,
  Box,
  Zap,
  Tag,
  User,
  CreditCard,
  ArrowLeft,
  Edit,
  CheckCircle2
} from 'lucide-react';

type ShippingStatus = '待发货' | '已发货' | '已交付';
type OrderStatus = '已支付' | '未支付';

interface Order {
  id: string;
  product: string;
  brand: string;
  category: string;
  quantity: number;
  amount: string;
  currency: string;
  customer: { name: string; phone: string };
  shipping: { method: string; address: string };
  orderTime: string;
  status: OrderStatus;
  paymentMethod: string;
  note: string;
  shippingStatus: ShippingStatus;
}

const initialOrders: Order[] = [
  {
    id: 'ORD-8801',
    product: 'Relx 悦刻五代 幻影黑',
    brand: 'Relx 悦刻',
    category: '电子烟',
    quantity: 2,
    amount: '2,600',
    currency: 'TWD',
    customer: { name: '王小明', phone: '0912-345-678' },
    shipping: { method: '711', address: '台北市信义区信义路五段7号 (7-11 信义店)' },
    orderTime: '2023-10-27 14:30',
    status: '已支付',
    paymentMethod: 'LINE Pay',
    note: '要最新日期的，谢谢',
    shippingStatus: '待发货'
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
    customer: { name: '林志豪', phone: '0933-111-222' },
    shipping: { method: '线上交付', address: '微信号: lin_888 (无需邮寄)' },
    orderTime: '2023-10-26 18:45',
    status: '已支付',
    paymentMethod: '微信支付',
    note: '最近工作比较迷茫，急需指点',
    shippingStatus: '已交付'
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
    customer: { name: '孙七', phone: '0988-999-000' },
    shipping: { method: '全家', address: '高雄市左营区博爱二路 (全家 巨蛋店)' },
    orderTime: '2023-10-25 16:10',
    status: '已支付',
    paymentMethod: '信用卡',
    note: '-',
    shippingStatus: '待发货'
  }
];

const getShippingBadge = (shippingStatus: ShippingStatus) => {
  switch (shippingStatus) {
    case '已发货':
      return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    case '已交付':
      return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    default:
      return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
  }
};

export const OrdersView: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [detailForm, setDetailForm] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    const keyword = searchTerm.toLowerCase();
    if (!keyword) return orders;
    return orders.filter((order) =>
      order.id.toLowerCase().includes(keyword) ||
      order.product.toLowerCase().includes(keyword) ||
      order.customer.name.toLowerCase().includes(keyword) ||
      order.customer.phone.toLowerCase().includes(keyword)
    );
  }, [orders, searchTerm]);

  const handleSelectOrder = (order: Order) => {
    setSelectedOrderId(order.id);
    setDetailForm(order);
  };

  const handleDetailChange = (field: keyof Order, value: string | number) => {
    setDetailForm((prev) => (prev ? { ...prev, [field]: value as never } : prev));
  };

  const handleShippingChange = (field: 'method' | 'address', value: string) => {
    setDetailForm((prev) => (prev ? { ...prev, shipping: { ...prev.shipping, [field]: value } } : prev));
  };

  const saveDetail = () => {
    if (!detailForm) return;
    setOrders((prev) => prev.map((o) => (o.id === detailForm.id ? detailForm : o)));
    alert('订单已保存');
  };

  const markShipped = () => {
    if (!detailForm) return;
    if (detailForm.shippingStatus === '已发货' || detailForm.shippingStatus === '已交付') return;
    const next = { ...detailForm, shippingStatus: '已发货' as ShippingStatus };
    setDetailForm(next);
    setOrders((prev) => prev.map((o) => (o.id === next.id ? next : o)));
  };

  const resetDetail = () => {
    setSelectedOrderId(null);
    setDetailForm(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">订单管理</h2>
          <p className="text-muted-foreground">查看和处理店铺订单。</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">导出订单</Button>
          <Button>
            <ShoppingBag className="mr-2 h-4 w-4" />
            新建订单
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>所有订单</CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Input
                placeholder="搜索订单号、客户或产品..."
                className="w-full sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline">查询</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">订单编号</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">产品详情</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">数量</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">金额</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">客户信息</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">发货信息</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">支付状态</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">发货状态</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">备注</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">操作</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${selectedOrderId === order.id ? 'bg-muted/30' : ''}`}
                    onClick={() => handleSelectOrder(order)}
                  >
                    <td className="p-4 align-middle font-medium">
                      {order.id}
                      <div className="text-xs text-muted-foreground mt-1">{order.orderTime}</div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex flex-col">
                        <span className="font-medium">{order.product}</span>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="inline-flex items-center rounded-sm border px-1.5 py-0.5 text-[10px] font-semibold text-foreground/80 bg-accent/50">
                            <Tag className="mr-1 h-3 w-3" />
                            {order.brand}
                          </span>
                          <span className="text-xs text-muted-foreground">{order.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">x{order.quantity}</td>
                    <td className="p-4 align-middle">
                      <div className="flex flex-col">
                        <span className="font-semibold">{order.currency} {order.amount}</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex flex-col">
                        <span className="font-medium flex items-center gap-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          {order.customer.name}
                        </span>
                        <span className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {order.customer.phone}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex flex-col max-w-[200px]">
                        <span className="text-xs font-semibold inline-flex items-center gap-1 mb-1">
                          {order.shipping.method === '线上交付' ? <Zap className="h-3 w-3 text-yellow-500" /> : <Box className="h-3 w-3 text-blue-500" />}
                          {order.shipping.method}
                        </span>
                        <span className="text-xs text-muted-foreground leading-tight flex items-start gap-1">
                          <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                          {order.shipping.address}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex flex-col items-start gap-1">
                        <div
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                            order.status === '已支付'
                              ? 'border-transparent bg-emerald-500/10 text-emerald-500'
                              : 'border-transparent bg-destructive/10 text-destructive'
                          }`}
                        >
                          {order.status}
                        </div>
                        {order.status === '已支付' && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1 ml-1">
                            <CreditCard className="h-3 w-3" />
                            {order.paymentMethod}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getShippingBadge(order.shippingStatus)}`}>
                        {order.shippingStatus}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      <span className="text-xs text-muted-foreground italic max-w-[150px] truncate block" title={order.note}>
                        {order.note !== '-' ? order.note : ''}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selectedOrderId && detailForm && (
        <Card className="border-primary/30">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Button variant="outline" size="icon" onClick={resetDetail}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <CardTitle>订单详情 · {detailForm.id}</CardTitle>
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getShippingBadge(detailForm.shippingStatus)}`}>
                  {detailForm.shippingStatus}
                </span>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                    detailForm.status === '已支付'
                      ? 'border-transparent bg-emerald-500/10 text-emerald-500'
                      : 'border-transparent bg-destructive/10 text-destructive'
                  }`}
                >
                  {detailForm.status}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">下单时间：{detailForm.orderTime}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={markShipped}
                disabled={detailForm.shippingStatus === '已发货' || detailForm.shippingStatus === '已交付'}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                标记发货
              </Button>
              <Button onClick={saveDetail}>
                <Edit className="h-4 w-4 mr-2" />
                保存修改
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <label className="text-sm font-medium">产品名称</label>
                <Input value={detailForm.product} onChange={(e) => handleDetailChange('product', e.target.value)} />
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">品牌</label>
                    <Input value={detailForm.brand} onChange={(e) => handleDetailChange('brand', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">分类</label>
                    <Input value={detailForm.category} onChange={(e) => handleDetailChange('category', e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">数量</label>
                    <Input
                      type="number"
                      value={detailForm.quantity}
                      onChange={(e) => handleDetailChange('quantity', Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">金额</label>
                    <Input value={detailForm.amount} onChange={(e) => handleDetailChange('amount', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">货币</label>
                    <Input value={detailForm.currency} onChange={(e) => handleDetailChange('currency', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">客户信息</label>
                <Input
                  value={detailForm.customer.name}
                  onChange={(e) =>
                    setDetailForm((prev) => (prev ? { ...prev, customer: { ...prev.customer, name: e.target.value } } : prev))
                  }
                  placeholder="客户姓名"
                />
                <Input
                  value={detailForm.customer.phone}
                  onChange={(e) =>
                    setDetailForm((prev) => (prev ? { ...prev, customer: { ...prev.customer, phone: e.target.value } } : prev))
                  }
                  placeholder="联系电话"
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium">支付状态</label>
                  <select
                    value={detailForm.status}
                    onChange={(e) => handleDetailChange('status', e.target.value as OrderStatus)}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="已支付">已支付</option>
                    <option value="未支付">未支付</option>
                  </select>
                </div>
                <Input
                  value={detailForm.paymentMethod}
                  onChange={(e) => handleDetailChange('paymentMethod', e.target.value)}
                  placeholder="支付方式"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">发货方式</label>
                <Input value={detailForm.shipping.method} onChange={(e) => handleShippingChange('method', e.target.value)} />
                <label className="text-sm font-medium">发货地址/交付信息</label>
                <Input value={detailForm.shipping.address} onChange={(e) => handleShippingChange('address', e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">备注</label>
                <textarea
                  value={detailForm.note}
                  onChange={(e) => handleDetailChange('note', e.target.value)}
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="记录客户要求、发货提醒等"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

