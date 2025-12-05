import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  Plus, 
  Trash2, 
  Globe,
  Search,
  Settings
} from 'lucide-react';
import { 
  Site,
  mockSites, 
  currencies, 
  languageOptions, 
  regionOptions
} from '../../data';

// --- 主组件 ---
interface SitesViewProps {
  onNavigate?: (path: string) => void;
}

export const SitesView: React.FC<SitesViewProps> = ({ onNavigate }) => {
  const [sites, setSites] = useState<Site[]>(mockSites);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSites = sites.filter(site =>
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (site: Site) => {
    if (onNavigate) {
      onNavigate(`sites/${site.id}`);
    }
  };

  const addNewSite = () => {
    const newSite: Site = {
      id: `site-${Date.now()}`,
      name: '新站点',
      region: 'US',
      language: 'en',
      currency: currencies.USD,
      paymentMethods: [],
      shippingMethods: [],
      taxRules: [],
      availableSkuIds: [],
      status: 'inactive',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSites(prev => [...prev, newSite]);
    // 跳转到新站点详情页
    if (onNavigate) {
      onNavigate(`sites/${newSite.id}`);
    }
  };

  const deleteSite = (siteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('确定删除该站点吗？')) return;
    setSites(prev => prev.filter(s => s.id !== siteId));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">站点管理</h2>
          <p className="text-muted-foreground">管理多地区站点配置、支付和配送方式。</p>
        </div>
        <Button onClick={addNewSite}>
          <Plus className="mr-2 h-4 w-4" />
          新建站点
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>站点列表</CardTitle>
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索站点..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSites.map(site => {
              const region = regionOptions.find(r => r.value === site.region);
              return (
                <Card 
                  key={site.id} 
                  className="overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => handleEditClick(site)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{region?.label.split(' ')[0]}</div>
                        <div>
                          <CardTitle className="text-lg">{site.name}</CardTitle>
                          <CardDescription>{region?.name}</CardDescription>
                        </div>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        site.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {site.status === 'active' ? '启用' : '停用'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Globe className="h-4 w-4" />
                        <span>{languageOptions.find(l => l.value === site.language)?.label}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="font-medium">{site.currency.symbol}</span>
                        <span>{site.currency.code}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                      <div className="text-center">
                        <div className="text-lg font-bold">{site.paymentMethods.length}</div>
                        <div className="text-xs text-muted-foreground">支付</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">{site.shippingMethods.length}</div>
                        <div className="text-xs text-muted-foreground">配送</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">{site.availableSkuIds.length}</div>
                        <div className="text-xs text-muted-foreground">SKU</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(site);
                        }}
                      >
                        <Settings className="h-3.5 w-3.5 mr-1.5" />
                        配置
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={(e) => deleteSite(site.id, e)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

