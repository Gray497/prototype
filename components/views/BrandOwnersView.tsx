import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { brandOwners } from '../../data';

export const BrandOwnersView: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">品牌方管理</h2>
          <p className="text-muted-foreground">维护品牌方的基础信息与域名配置。</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>品牌方列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">品牌方ID</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">品牌方名称</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">创建时间</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">订单编号前缀</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Admin Domain</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Customer Domain</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">备注</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {brandOwners.map((b) => (
                  <tr key={b.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-medium">{b.id}</td>
                    <td className="p-4 align-middle">{b.name}</td>
                    <td className="p-4 align-middle">{b.createdAt}</td>
                    <td className="p-4 align-middle">{b.orderPrefix}</td>
                    <td className="p-4 align-middle text-xs text-blue-600 underline break-all">{b.adminDomain}</td>
                    <td className="p-4 align-middle text-xs text-blue-600 underline break-all">{b.customerDomain}</td>
                    <td className="p-4 align-middle text-xs text-muted-foreground">{b.note || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

