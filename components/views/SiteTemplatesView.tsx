import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  Layout,
  Search,
  Globe,
  RefreshCw,
  Edit,
  Trash2,
  Check,
  X,
  Save,
  Package,
  Layers
} from 'lucide-react';
import { 
  SiteTemplate,
  mockTemplates, 
  templateTypeOptions,
  mockSites,
  regionOptions
} from '../../data';

// --- 模板编辑弹框 ---
interface TemplateEditModalProps {
  template: SiteTemplate;
  onSave: (template: SiteTemplate) => void;
  onClose: () => void;
}

const TemplateEditModal: React.FC<TemplateEditModalProps> = ({ template, onSave, onClose }) => {
  const [formData, setFormData] = useState<SiteTemplate>({
    ...template,
    boundSiteIds: [...template.boundSiteIds]
  });

  const handleChange = (field: keyof SiteTemplate, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSiteBinding = (siteId: string) => {
    const exists = formData.boundSiteIds.includes(siteId);
    if (exists) {
      handleChange('boundSiteIds', formData.boundSiteIds.filter(id => id !== siteId));
    } else {
      handleChange('boundSiteIds', [...formData.boundSiteIds, siteId]);
    }
  };

  const handleSave = () => {
    onSave({
      ...formData,
      updatedAt: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        className="bg-background rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-background">
          <h3 className="text-lg font-semibold">编辑模板</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">模板名称</label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="输入模板名称"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">模板类型</label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {templateTypeOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">状态</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value as 'active' | 'draft')}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="draft">草稿</option>
                <option value="active">启用</option>
              </select>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">描述</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="模板描述..."
              className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">缩略图 URL</label>
            <Input
              value={formData.thumbnail || ''}
              onChange={(e) => handleChange('thumbnail', e.target.value)}
              placeholder="https://..."
            />
            {formData.thumbnail && (
              <img 
                src={formData.thumbnail} 
                alt="缩略图预览" 
                className="h-24 w-full object-cover rounded-md"
              />
            )}
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              绑定站点
            </label>
            <div className="space-y-2">
              {mockSites.map(site => {
                const region = regionOptions.find(r => r.value === site.region);
                const isSelected = formData.boundSiteIds.includes(site.id);
                return (
                  <div
                    key={site.id}
                    onClick={() => toggleSiteBinding(site.id)}
                    className={`flex items-center justify-between p-2 rounded-md border cursor-pointer transition-colors ${
                      isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{region?.label.split(' ')[0]}</span>
                      <span className="font-medium">{site.name}</span>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-primary" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 p-4 border-t sticky bottom-0 bg-background">
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            保存
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- 同步确认弹框 ---
interface SyncConfirmModalProps {
  template: SiteTemplate;
  onConfirm: () => void;
  onClose: () => void;
}

const SyncConfirmModal: React.FC<SyncConfirmModalProps> = ({ template, onConfirm, onClose }) => {
  const boundSites = mockSites.filter(s => template.boundSiteIds.includes(s.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        className="bg-background rounded-lg shadow-xl w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            同步模板到站点
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            确定将模板「{template.name}」同步到以下站点吗？
          </p>
          
          <div className="space-y-2">
            {boundSites.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground border-2 border-dashed rounded-lg">
                <Globe className="h-6 w-6 mx-auto mb-2 opacity-50" />
                <p className="text-sm">暂无绑定站点</p>
                <p className="text-xs">请先编辑模板并绑定站点</p>
              </div>
            ) : (
              boundSites.map(site => {
                const region = regionOptions.find(r => r.value === site.region);
                return (
                  <div
                    key={site.id}
                    className="flex items-center gap-2 p-2 rounded-md bg-muted/50"
                  >
                    <span>{region?.label.split(' ')[0]}</span>
                    <span className="font-medium">{site.name}</span>
                    <span className={`ml-auto text-xs px-2 py-0.5 rounded ${
                      site.status === 'active' 
                        ? 'bg-emerald-500/10 text-emerald-500' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {site.status === 'active' ? '启用' : '停用'}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 p-4 border-t">
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            disabled={boundSites.length === 0}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            确认同步
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- 主组件 ---
export const SiteTemplatesView: React.FC = () => {
  const [templates, setTemplates] = useState<SiteTemplate[]>(mockTemplates);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [editingTemplate, setEditingTemplate] = useState<SiteTemplate | null>(null);
  const [syncingTemplate, setSyncingTemplate] = useState<SiteTemplate | null>(null);

  const filteredTemplates = templates.filter(tpl => {
    const matchesSearch = !searchTerm || 
      tpl.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tpl.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || tpl.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleSaveTemplate = (template: SiteTemplate) => {
    setTemplates(prev => prev.map(t => t.id === template.id ? template : t));
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (!confirm('确定删除该模板吗？')) return;
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const handleSync = (template: SiteTemplate) => {
    // 模拟同步操作
    alert(`模板「${template.name}」已同步到 ${template.boundSiteIds.length} 个站点！`);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Layout className="h-8 w-8" />
            站点模板管理
          </h2>
          <p className="text-muted-foreground">管理站点模板，支持一键同步到绑定站点。</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>模板列表</CardTitle>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索模板..."
                  className="pl-8 w-48"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">全部类型</option>
                {templateTypeOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map(template => {
              const boundSites = mockSites.filter(s => template.boundSiteIds.includes(s.id));
              const typeOption = templateTypeOptions.find(t => t.value === template.type);
              
              return (
                <Card key={template.id} className="overflow-hidden">
                  {/* 缩略图 */}
                  {template.thumbnail ? (
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-36 object-cover"
                    />
                  ) : (
                    <div className="w-full h-36 bg-muted flex items-center justify-center">
                      <Layout className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                  )}
                  
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <CardDescription className="line-clamp-2 text-xs mt-1">
                          {template.description || '暂无描述'}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {/* 类型和状态 */}
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
                        template.type === 'single' 
                          ? 'bg-blue-500/10 text-blue-500' 
                          : 'bg-purple-500/10 text-purple-500'
                      }`}>
                        {template.type === 'single' ? <Package className="h-3 w-3" /> : <Layers className="h-3 w-3" />}
                        {typeOption?.label}
                      </span>
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                        template.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {template.status === 'active' ? '启用' : '草稿'}
                      </span>
                    </div>

                    {/* 绑定站点 */}
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        绑定站点 ({boundSites.length})
                      </div>
                      {boundSites.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {boundSites.map(site => {
                            const region = regionOptions.find(r => r.value === site.region);
                            return (
                              <span
                                key={site.id}
                                className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-xs"
                              >
                                {region?.label.split(' ')[0]} {site.name}
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground italic">未绑定站点</div>
                      )}
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setSyncingTemplate(template)}
                        disabled={boundSites.length === 0}
                      >
                        <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                        同步
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setEditingTemplate(template)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteTemplate(template.id)}
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

      {/* 编辑弹框 */}
      {editingTemplate && (
        <TemplateEditModal
          template={editingTemplate}
          onSave={handleSaveTemplate}
          onClose={() => {
            setEditingTemplate(null);
          }}
        />
      )}

      {/* 同步确认弹框 */}
      {syncingTemplate && (
        <SyncConfirmModal
          template={syncingTemplate}
          onConfirm={() => handleSync(syncingTemplate)}
          onClose={() => setSyncingTemplate(null)}
        />
      )}
    </div>
  );
};

