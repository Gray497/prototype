import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Order, ShippingStatus } from '../../data';
import { ArrowLeft, MapPin, Phone, Tag, Truck, User } from 'lucide-react';

interface OrderDetailViewProps {
  orderId: string;
  orders: Order[];
  onNavigate: (path: string) => void;
}

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

const KeyValue = ({ label, value, icon }: { label: string; value?: string; icon?: React.ReactNode }) => (
  <div className="flex items-start gap-2 text-sm">
    {icon}
    <div className="w-28 shrink-0 text-muted-foreground">{label}</div>
    <div className="flex-1 text-foreground">{value || '—'}</div>
  </div>
);

export const OrderDetailView: React.FC<OrderDetailViewProps> = ({ orderId, orders, onNavigate }) => {
  const order = useMemo(() => orders.find((o) => o.id === orderId), [orders, orderId]);

  if (!order) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4 text-center">
        <div className="text-4xl font-bold text-muted-foreground/30">404</div>
        <p className="text-muted-foreground">找不到该订单 (ID: {orderId})</p>
        <Button onClick={() => onNavigate('orders')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回列表
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => onNavigate('orders')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle>订单详情 · {order.id}</CardTitle>
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getShippingBadge(order.shippingStatus)}`}>
                {order.shippingStatus}
              </span>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                  order.status === '已支付'
                    ? 'border-transparent bg-emerald-500/10 text-emerald-500'
                    : 'border-transparent bg-destructive/10 text-destructive'
                }`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">下单时间：{order.orderTime}</p>
            {order.payTime && <p className="text-xs text-muted-foreground">支付时间：{order.payTime}</p>}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>订单信息</CardTitle>
          <p className="text-sm text-muted-foreground">按需求图字段只读展示</p>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <KeyValue label="订单编号" value={order.id} />
          <KeyValue label="订单状态" value={order.shippingStatus} />
          <KeyValue label="支付状态" value={order.status} />
          <KeyValue label="支付方式" value={order.paymentMethod} />
          <KeyValue label="产品名称" value={order.product} />
          <KeyValue label="品牌/分类" value={`${order.brand} / ${order.category}`} />
          <KeyValue label="数量" value={`x${order.quantity}`} />
          <KeyValue label="金额" value={`${order.currency} ${order.amount}`} />
          <KeyValue label="支付流水号" value={order.transactionId || '—'} />
          <KeyValue label="下单时间" value={order.orderTime} />
          <KeyValue label="支付时间" value={order.payTime} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>客户与收货信息</CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <User className="h-4 w-4" />
            联系方式
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <KeyValue label="姓名" value={order.customer.name} />
            <KeyValue label="手机" value={order.customer.phone} icon={<Phone className="h-4 w-4 text-muted-foreground" />} />
            <KeyValue label="座机" value={order.customer.landline} />
            <KeyValue label="QQ" value={order.customer.qq} />
            <KeyValue label="微信" value={order.customer.wechat} />
            <KeyValue label="邮箱" value={order.customer.email} />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <KeyValue label="发货方式" value={order.shipping.method} />
            <KeyValue label="承运/物流公司" value={order.shipping.company} />
            <KeyValue label="运单号" value={order.shipping.trackingNo} />
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">收货地址</span>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <span className="leading-tight">{order.shipping.address}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>备注与系统信息</CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Tag className="h-4 w-4" />
            只读
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">操作备注</span>
            <div className="min-h-[80px] rounded-md border border-dashed border-muted px-3 py-2 text-sm whitespace-pre-line bg-muted/20">
              {order.note || '—'}
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <KeyValue label="下单 IP" value={order.ip} />
            <KeyValue label="下单设备" value={order.device} />
            <KeyValue label="下单链接" value={order.sourceUrl} />
            <KeyValue label="来源地址" value={order.referer} />
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <Truck className="h-4 w-4" />
            如需修改请回列表，后续再补编辑能力；当前为纯展示。
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

