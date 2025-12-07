import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Order, ShippingStatus } from '../../data';
import { ArrowLeft, MapPin, Phone, User } from 'lucide-react';

interface OrderDetailViewProps {
  orderId: string;
  orders: Order[];
  onUpdateOrders: React.Dispatch<React.SetStateAction<Order[]>>;
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

const Editable = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => (
  <label className="flex flex-col gap-1">
    <span className="text-xs text-muted-foreground">{label}</span>
    <Input value={value} onChange={(e) => onChange(e.target.value)} />
  </label>
);

export const OrderDetailView: React.FC<OrderDetailViewProps> = ({ orderId, orders, onUpdateOrders, onNavigate }) => {
  const order = useMemo(() => orders.find((o) => o.id === orderId), [orders, orderId]);
  const [form, setForm] = useState<Order | null>(order || null);
  const [editingOrder, setEditingOrder] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(false);
  const [shippingModalOpen, setShippingModalOpen] = useState(false);
  const [shippingCompany, setShippingCompany] = useState('');
  const [shippingTracking, setShippingTracking] = useState('');
  const [smsStatus, setSmsStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const mapUrl = order?.shipping.address ? `https://www.google.com/maps/search/${encodeURIComponent(order.shipping.address)}` : '';
  const ipLookupUrl = order?.ip ? `https://ipinfo.io/${order.ip}` : '';

  useEffect(() => {
    setForm(order || null);
    setEditingOrder(false);
    setEditingCustomer(false);
    setShippingCompany(order?.shipping.company || '');
    setShippingTracking(order?.shipping.trackingNo || '');
    setSmsStatus('idle');
  }, [order]);

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
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            onClick={() => {
              setShippingCompany(order.shipping.company || '');
              setShippingTracking(order.shipping.trackingNo || '');
              setShippingModalOpen(true);
            }}
            disabled={order.shippingStatus === '已发货' || order.shippingStatus === '已交付'}
          >
            发货
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (!form) return;
              const next = { ...form, shippingStatus: '待发货' as ShippingStatus };
              setForm(next);
              onUpdateOrders((prev) => prev.map((o) => (o.id === next.id ? next : o)));
            }}
            disabled={order.shippingStatus !== '已发货'}
          >
            取消发货
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>订单信息</CardTitle>
          </div>
          <div className="flex gap-2">
            {editingOrder ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setForm(order);
                    setEditingOrder(false);
                  }}
                >
                  取消
                </Button>
                <Button
                  onClick={() => {
                    if (!form) return;
                    onUpdateOrders((prev) => prev.map((o) => (o.id === form.id ? form : o)));
                    setEditingOrder(false);
                  }}
                >
                  保存
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setEditingOrder(true)}>
                编辑订单信息
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <KeyValue label="订单编号" value={order.id} />
          <KeyValue label="订单状态" value={order.shippingStatus} />
          {editingOrder ? (
            <>
              <Editable label="数量" value={String(form?.quantity ?? '')} onChange={(v) => setForm((p) => (p ? { ...p, quantity: Number(v) || 0 } : p))} />
              <Editable label="金额" value={form?.amount || ''} onChange={(v) => setForm((p) => (p ? { ...p, amount: v } : p))} />
              <Editable label="货币" value={form?.currency || ''} onChange={(v) => setForm((p) => (p ? { ...p, currency: v } : p))} />
              <KeyValue label="支付状态" value={order.status} />
              <KeyValue label="支付方式" value={order.paymentMethod} />
              <KeyValue label="产品名称" value={order.product} />
              <KeyValue label="品牌/分类" value={`${order.brand} / ${order.category}`} />
              <KeyValue label="支付流水号" value={order.transactionId || '—'} />
              <KeyValue label="下单时间" value={order.orderTime} />
              <KeyValue label="支付时间" value={order.payTime} />
            </>
          ) : (
            <>
              <KeyValue label="支付状态" value={order.status} />
              <KeyValue label="支付方式" value={order.paymentMethod} />
              <KeyValue label="产品名称" value={order.product} />
              <KeyValue label="品牌/分类" value={`${order.brand} / ${order.category}`} />
              <KeyValue label="数量" value={`x${order.quantity}`} />
              <KeyValue label="金额" value={`${order.currency} ${order.amount}`} />
              <KeyValue label="支付流水号" value={order.transactionId || '—'} />
              <KeyValue label="下单时间" value={order.orderTime} />
              <KeyValue label="支付时间" value={order.payTime} />
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>客户与收货信息</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex gap-2">
            {editingCustomer ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setForm(order);
                    setEditingCustomer(false);
                  }}
                >
                  取消
                </Button>
                <Button
                  onClick={() => {
                    if (!form) return;
                    onUpdateOrders((prev) => prev.map((o) => (o.id === form.id ? form : o)));
                    setEditingCustomer(false);
                  }}
                >
                  保存
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setEditingCustomer(true)}>
                编辑客户信息
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            {editingCustomer ? (
              <>
                <Editable label="姓名" value={form?.customer.name || ''} onChange={(v) => setForm((p) => (p ? { ...p, customer: { ...p.customer, name: v } } : p))} />
                <Editable label="手机" value={form?.customer.phone || ''} onChange={(v) => setForm((p) => (p ? { ...p, customer: { ...p.customer, phone: v } } : p))} />
                <Editable label="座机" value={form?.customer.landline || ''} onChange={(v) => setForm((p) => (p ? { ...p, customer: { ...p.customer, landline: v } } : p))} />
                <Editable label="QQ" value={form?.customer.qq || ''} onChange={(v) => setForm((p) => (p ? { ...p, customer: { ...p.customer, qq: v } } : p))} />
                <Editable label="微信" value={form?.customer.wechat || ''} onChange={(v) => setForm((p) => (p ? { ...p, customer: { ...p.customer, wechat: v } } : p))} />
                <Editable label="邮箱" value={form?.customer.email || ''} onChange={(v) => setForm((p) => (p ? { ...p, customer: { ...p.customer, email: v } } : p))} />
              </>
            ) : (
              <>
                <KeyValue label="姓名" value={order.customer.name} />
                <KeyValue label="手机" value={order.customer.phone} icon={<Phone className="h-4 w-4 text-muted-foreground" />} />
                <KeyValue label="座机" value={order.customer.landline} />
                <KeyValue label="QQ" value={order.customer.qq} />
                <KeyValue label="微信" value={order.customer.wechat} />
                <KeyValue label="邮箱" value={order.customer.email} />
              </>
            )}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {editingCustomer ? (
              <>
                <Editable label="发货方式" value={form?.shipping.method || ''} onChange={(v) => setForm((p) => (p ? { ...p, shipping: { ...p.shipping, method: v } } : p))} />
                <Editable label="承运/物流公司" value={form?.shipping.company || ''} onChange={(v) => setForm((p) => (p ? { ...p, shipping: { ...p.shipping, company: v } } : p))} />
                <Editable label="运单号" value={form?.shipping.trackingNo || ''} onChange={(v) => setForm((p) => (p ? { ...p, shipping: { ...p.shipping, trackingNo: v } } : p))} />
                <Editable
                  label="收货地址"
                  value={form?.shipping.address || ''}
                  onChange={(v) => setForm((p) => (p ? { ...p, shipping: { ...p.shipping, address: v } } : p))}
                />
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {shippingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>发货信息</CardTitle>
                <p className="text-sm text-muted-foreground">选择快递公司并输入快递单号</p>
              </div>
              <Button variant="ghost" onClick={() => setShippingModalOpen(false)}>
                关闭
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">快递公司</span>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-ring"
                  value={shippingCompany}
                  onChange={(e) => setShippingCompany(e.target.value)}
                >
                  <option value="">请选择</option>
                  <option value="顺丰">顺丰</option>
                  <option value="圆通">圆通</option>
                  <option value="中通">中通</option>
                  <option value="申通">申通</option>
                  <option value="韵达">韵达</option>
                  <option value="黑猫宅急便">黑猫宅急便</option>
                  <option value="711">711</option>
                  <option value="全家">全家</option>
                  <option value="其他">其他</option>
                </select>
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">快递单号</span>
                <Input value={shippingTracking} onChange={(e) => setShippingTracking(e.target.value)} placeholder="请输入快递单号" />
              </label>
            </div>

            <div className="space-y-3 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <div className="text-muted-foreground">收货地址</div>
                  <div className="text-foreground">{order.shipping.address}</div>
                </div>
                {mapUrl ? (
                  <a
                    className="text-sm text-primary hover:underline"
                    href={mapUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    地图打开
                  </a>
                ) : null}
              </div>

              <div className="flex items-center justify-between text-sm">
                <div>
                  <div className="text-muted-foreground">IP 地址</div>
                  <div className="text-foreground">{order.ip || '—'}</div>
                </div>
                {ipLookupUrl ? (
                  <a className="text-primary hover:underline" href={ipLookupUrl} target="_blank" rel="noreferrer">
                    查看归属地
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground">无 IP 信息</span>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <div>
                  <div className="text-muted-foreground">手机号</div>
                  <div className="text-foreground">{order.customer.phone}</div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={smsStatus === 'sending'}
                  onClick={() => {
                    setSmsStatus('sending');
                    setTimeout(() => setSmsStatus('sent'), 800);
                  }}
                >
                  {smsStatus === 'sent' ? '短信已发送' : smsStatus === 'sending' ? '发送中...' : '发送短信验证'}
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShippingModalOpen(false)}>
                取消
              </Button>
              <Button
                onClick={() => {
                  if (!form) return;
                  const next = {
                    ...form,
                    shipping: { ...form.shipping, company: shippingCompany, trackingNo: shippingTracking },
                    shippingStatus: '已发货' as ShippingStatus
                  };
                  setForm(next);
                  onUpdateOrders((prev) => prev.map((o) => (o.id === next.id ? next : o)));
                  setShippingModalOpen(false);
                }}
                disabled={!shippingTracking}
              >
                确认发货
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

