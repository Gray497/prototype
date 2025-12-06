import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  MoreHorizontal, 
  Sparkles, 
  Phone, 
  User, 
  Globe,
  ShoppingBag,
  Image as ImageIcon,
  Calendar,
  UserCheck,
  Eye,
  Search
} from 'lucide-react';
import { Lead } from '../../data/types';
import { simpleProducts, getAllSkus } from '../../data';

// 模拟线索数据
const leadsData: Lead[] = [
  {
    id: 'LEAD-001',
    sessionId: 'sess_abc123def456',
    name: '张三',
    phone: '138****8888',
    siteId: 'site-1',
    siteName: '玄学工作室-大陆站',
    orderId: 'ORD-8803',
    productId: 'SPU-003',
    skuId: 'SKU-003-1',
    type: '手相',
    images: ['/placeholder-palm-1.jpg', '/placeholder-palm-2.jpg'],
    createdAt: '2024-12-05 10:30:00',
    receptionist: '李师傅',
    status: '处理中',
    remark: '客户咨询事业运势'
  },
  {
    id: 'LEAD-002',
    sessionId: 'sess_xyz789ghi012',
    name: '李四',
    phone: '139****9999',
    siteId: 'site-2',
    siteName: '玄学工作室-台湾站',
    orderId: undefined,
    productId: undefined,
    skuId: undefined,
    type: '面相',
    images: ['/placeholder-face-1.jpg'],
    createdAt: '2024-12-05 09:15:00',
    receptionist: '王师傅',
    status: '待处理',
    remark: '首次咨询'
  },
  {
    id: 'LEAD-003',
    sessionId: 'sess_mno345pqr678',
    name: '王五',
    phone: '137****7777',
    siteId: 'site-1',
    siteName: '玄学工作室-大陆站',
    orderId: 'ORD-8810',
    productId: 'SPU-001',
    skuId: 'SKU-001-3',
    type: '手相',
    images: ['/placeholder-palm-3.jpg', '/placeholder-palm-4.jpg', '/placeholder-palm-5.jpg'],
    createdAt: '2024-12-04 16:45:00',
    receptionist: '李师傅',
    status: '已完成',
    remark: '老客户，复购'
  },
  {
    id: 'LEAD-004',
    sessionId: 'sess_stu901vwx234',
    name: '赵六',
    phone: '136****6666',
    siteId: 'site-3',
    siteName: '玄学工作室-日本站',
    orderId: undefined,
    productId: undefined,
    skuId: undefined,
    type: '面相',
    images: ['/placeholder-face-2.jpg', '/placeholder-face-3.jpg'],
    createdAt: '2024-12-04 14:20:00',
    receptionist: '陈师傅',
    status: '待处理',
    remark: '客户比较急切'
  },
  {
    id: 'LEAD-005',
    sessionId: 'sess_yza567bcd890',
    name: '钱七',
    phone: '135****5555',
    siteId: 'site-2',
    siteName: '玄学工作室-台湾站',
    orderId: 'ORD-8815',
    productId: 'SPU-002',
    skuId: 'SKU-002-2',
    type: '手相',
    images: ['/placeholder-palm-6.jpg'],
    createdAt: '2024-12-03 11:00:00',
    receptionist: '王师傅',
    status: '已完成',
    remark: '感情咨询'
  },
];

const getStatusColor = (status?: string) => {
  switch (status) {
    case '待处理':
      return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
    case '处理中':
      return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    case '已完成':
      return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    default:
      return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case '手相':
      return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
    case '面相':
      return 'bg-pink-500/10 text-pink-600 border-pink-500/20';
    default:
      return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  }
};

export const LeadsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const skuOptions = getAllSkus();
  const productOptions = simpleProducts;
  const [leadProductMap, setLeadProductMap] = useState<Record<string, { productId?: string; skuId?: string }>>(() => {
    const initial: Record<string, { productId?: string; skuId?: string }> = {};
    leadsData.forEach((lead) => {
      initial[lead.id] = { productId: lead.productId, skuId: lead.skuId };
    });
    return initial;
  });

  const filteredLeads = leadsData.filter(lead => 
    lead.name.includes(searchTerm) || 
    lead.phone.includes(searchTerm) || 
    lead.sessionId.includes(searchTerm) ||
    lead.id.includes(searchTerm)
  );

  const handleProductChange = (leadId: string, productId: string) => {
    setLeadProductMap(prev => ({
      ...prev,
      [leadId]: { productId: productId || undefined, skuId: undefined }
    }));
  };

  const handleSkuChange = (leadId: string, skuId: string) => {
    setLeadProductMap(prev => ({
      ...prev,
      [leadId]: { ...(prev[leadId] || {}), skuId: skuId || undefined }
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">线索管理</h2>
          <p className="text-muted-foreground">管理玄学服务的客户线索信息。</p>
        </div>
        <Button variant="outline">导出线索</Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">今日线索</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Sparkles className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">待处理</p>
                <p className="text-2xl font-bold text-yellow-600">5</p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">处理中</p>
                <p className="text-2xl font-bold text-blue-600">3</p>
              </div>
              <UserCheck className="h-8 w-8 text-blue-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">本月完成</p>
                <p className="text-2xl font-bold text-emerald-600">48</p>
              </div>
              <Eye className="h-8 w-8 text-emerald-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>所有线索</CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-[300px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="搜索姓名、手机号、Session ID..." 
                  className="pl-9"
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
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Session ID
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    客户信息
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    站点
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    关联订单
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    产品/SKU 管理
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    类型
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    图片
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    创建时间
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    接待人
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    状态
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {filteredLeads.map((lead) => {
                  const selection = leadProductMap[lead.id] || {};
                  const product = productOptions.find(p => p.id === selection.productId);
                  const sku = skuOptions.find(s => s.id === selection.skuId);
                  const skuList = selection.productId ? skuOptions.filter(s => s.productId === selection.productId) : [];
                  return (
                  <tr key={lead.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs text-muted-foreground truncate max-w-[150px]" title={lead.sessionId}>
                          {lead.sessionId}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">{lead.id}</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex flex-col">
                        <span className="font-medium flex items-center gap-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          {lead.name}
                        </span>
                        <span className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {lead.phone}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <span className="flex items-center gap-1 text-sm">
                        <Globe className="h-3 w-3 text-muted-foreground" />
                        {lead.siteName}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      {lead.orderId ? (
                        <span className="flex items-center gap-1 text-sm text-blue-600 hover:underline cursor-pointer">
                          <ShoppingBag className="h-3 w-3" />
                          {lead.orderId}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="space-y-2 min-w-[220px]">
                        <select
                          className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                          value={selection.productId || ''}
                          onChange={(e) => handleProductChange(lead.id, e.target.value)}
                        >
                          <option value="">未关联产品</option>
                          {productOptions.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                        <select
                          className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                          value={selection.skuId || ''}
                          onChange={(e) => handleSkuChange(lead.id, e.target.value)}
                          disabled={!selection.productId}
                        >
                          <option value="">{selection.productId ? '请选择 SKU' : '请先选择产品'}</option>
                          {skuList.map((s) => (
                            <option key={s.id} value={s.id}>{s.specs || s.code}</option>
                          ))}
                        </select>
                        <div className="text-xs text-muted-foreground">
                          {product ? `${product.name}` : '未选择产品'}
                          {sku ? ` / ${sku.specs || sku.code}` : selection.productId ? ' / 未选择 SKU' : ''}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getTypeColor(lead.type)}`}>
                        {lead.type}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-1">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{lead.images.length}张</span>
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          查看
                        </Button>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex flex-col">
                        <span className="text-sm">{lead.createdAt.split(' ')[0]}</span>
                        <span className="text-xs text-muted-foreground">{lead.createdAt.split(' ')[1]}</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <span className="flex items-center gap-1 text-sm">
                        <UserCheck className="h-3 w-3 text-muted-foreground" />
                        {lead.receptionist}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
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
