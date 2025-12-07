import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import {
  MoreHorizontal,
  Phone,
  MapPin,
  Box,
  Zap,
  Tag,
  User,
  CreditCard
} from 'lucide-react';
import { Order, ShippingStatus } from '../../data';

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

interface OrdersViewProps {
  orders: Order[];
  onNavigate: (path: string) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ orders, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');

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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">订单管理</h2>
          <p className="text-muted-foreground">查看和处理店铺订单。</p>
        </div>
        <span className="text-sm text-muted-foreground">当前仅支持查看，暂不开放新建或导出</span>
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
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer"
                    onClick={() => onNavigate(`products/${order.id}`)}
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

      {/* 详情在单独路由 OrderDetailView 中展示 */}
    </div>
  );
};


