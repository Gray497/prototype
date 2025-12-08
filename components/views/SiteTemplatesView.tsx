import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import {
  Layout,
  Search,
  Globe,
  RefreshCw,
  Edit,
  Trash2,
  X,
  Package,
  Layers,
} from "lucide-react";
import {
  SiteTemplate,
  mockTemplates,
  templateTypeOptions,
  mockSites,
  regionOptions,
} from "../../data";

// --- 同步确认弹框 ---
interface SyncConfirmModalProps {
  template: SiteTemplate;
  onConfirm: () => void;
  onClose: () => void;
}

const SyncConfirmModal: React.FC<SyncConfirmModalProps> = ({
  template,
  onConfirm,
  onClose,
}) => {
  const boundSites = mockSites.filter((s) =>
    template.boundSiteIds.includes(s.id)
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-lg shadow-xl w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
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
              boundSites.map((site) => {
                const region = regionOptions.find(
                  (r) => r.value === site.region
                );
                return (
                  <div
                    key={site.id}
                    className="flex items-center gap-2 p-2 rounded-md bg-muted/50"
                  >
                    <span>{region?.label.split(" ")[0]}</span>
                    <span className="font-medium">{site.name}</span>
                    <span
                      className={`ml-auto text-xs px-2 py-0.5 rounded ${
                        site.status === "active"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {site.status === "active" ? "启用" : "停用"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 p-4 border-t">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
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
interface SiteTemplatesViewProps {
  onNavigate?: (path: string) => void;
}

export const SiteTemplatesView: React.FC<SiteTemplatesViewProps> = ({
  onNavigate,
}) => {
  const [templates, setTemplates] = useState<SiteTemplate[]>(mockTemplates);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [syncingTemplate, setSyncingTemplate] = useState<SiteTemplate | null>(
    null
  );

  const filteredTemplates = templates.filter((tpl) => {
    const matchesSearch =
      !searchTerm ||
      tpl.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tpl.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || tpl.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleEditTemplate = (templateId: string) => {
    if (onNavigate) {
      onNavigate(`templates/${templateId}`);
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (!confirm("确定删除该模板吗？")) return;
    setTemplates((prev) => prev.filter((t) => t.id !== templateId));
  };

  const handleSync = (template: SiteTemplate) => {
    // 模拟同步操作
    alert(
      `模板「${template.name}」已同步到 ${template.boundSiteIds.length} 个站点！`
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Layout className="h-8 w-8" />
            站点模板管理
          </h2>
          <p className="text-muted-foreground">
            管理站点模板，支持一键同步到绑定站点。
          </p>
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
                {templateTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => {
              const boundSites = mockSites.filter((s) =>
                template.boundSiteIds.includes(s.id)
              );
              const typeOption = templateTypeOptions.find(
                (t) => t.value === template.type
              );

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
                        <CardTitle className="text-base">
                          {template.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-xs mt-1">
                          {template.description || "暂无描述"}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* 类型和状态 */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
                          template.type === "single"
                            ? "bg-blue-500/10 text-blue-500"
                            : "bg-purple-500/10 text-purple-500"
                        }`}
                      >
                        {template.type === "single" ? (
                          <Package className="h-3 w-3" />
                        ) : (
                          <Layers className="h-3 w-3" />
                        )}
                        {typeOption?.label}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                          template.status === "active"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {template.status === "active" ? "启用" : "草稿"}
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
                          {boundSites.map((site) => {
                            const region = regionOptions.find(
                              (r) => r.value === site.region
                            );
                            return (
                              <span
                                key={site.id}
                                className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-xs"
                              >
                                {region?.label.split(" ")[0]} {site.name}
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground italic">
                          未绑定站点
                        </div>
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
                        onClick={() => handleEditTemplate(template.id)}
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
