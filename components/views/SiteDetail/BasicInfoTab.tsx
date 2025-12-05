import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { 
  Site, 
  currencies, 
  languageOptions, 
  regionOptions 
} from '../../../data';

interface BasicInfoTabProps {
  site: Site;
  onSiteChange: (site: Site) => void;
  onMarkChanged: () => void;
}

export const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ 
  site, 
  onSiteChange, 
  onMarkChanged 
}) => {
  const handleChange = (field: keyof Site, value: any) => {
    onSiteChange({ ...site, [field]: value });
    onMarkChanged();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>基本信息</CardTitle>
        <CardDescription>站点的基本配置信息</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium">站点名称</label>
          <Input
            value={site.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="如：台湾站"
            className="max-w-md"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <div className="grid gap-2">
            <label className="text-sm font-medium">地区</label>
            <select
              value={site.region}
              onChange={(e) => handleChange('region', e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {regionOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">语言</label>
            <select
              value={site.language}
              onChange={(e) => handleChange('language', e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {languageOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-md">
          <div className="grid gap-2">
            <label className="text-sm font-medium">货币</label>
            <select
              value={site.currency.code}
              onChange={(e) => handleChange('currency', currencies[e.target.value])}
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {Object.values(currencies).map(c => (
                <option key={c.code} value={c.code}>{c.symbol} {c.name} ({c.code})</option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">状态</label>
            <select
              value={site.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="active">启用</option>
              <option value="inactive">停用</option>
            </select>
          </div>
        </div>

        {/* 税规则提示 */}
        <div className="rounded-lg border border-dashed p-4 bg-muted/30 max-w-md">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-sm">💡 税规则功能</span>
            <span className="text-xs px-2 py-0.5 rounded bg-muted">暂不做</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

