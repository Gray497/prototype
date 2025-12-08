import React, { useState, useEffect } from "react";
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
  ArrowLeft,
  Save,
  RefreshCw,
  X,
  Layout,
  Globe,
  Check,
} from "lucide-react";
import {
  SiteTemplate,
  mockTemplates,
  templateTypeOptions,
  mockSites,
  regionOptions,
} from "../../data";

interface SiteTemplateDetailViewProps {
  templateId: string;
  onNavigate: (path: string) => void;
}

export const SiteTemplateDetailView: React.FC<SiteTemplateDetailViewProps> = ({
  templateId,
  onNavigate,
}) => {
  const [template, setTemplate] = useState<SiteTemplate | null>(null);
  const [formData, setFormData] = useState<SiteTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // 加载模板数据
  useEffect(() => {
    const found = mockTemplates.find((t) => t.id === templateId);
    if (found) {
      setTemplate(found);
      setFormData({
        ...found,
        boundSiteIds: [...found.boundSiteIds],
      });
    }
  }, [templateId]);

  const handleBack = () => {
    onNavigate("templates");
  };

  const handleChange = (field: keyof SiteTemplate, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const toggleSiteBinding = (siteId: string) => {
    if (!formData) return;
    const exists = formData.boundSiteIds.includes(siteId);
    if (exists) {
      handleChange(
        "boundSiteIds",
        formData.boundSiteIds.filter((id) => id !== siteId)
      );
    } else {
      handleChange("boundSiteIds", [...formData.boundSiteIds, siteId]);
    }
  };

  const handleSave = () => {
    if (formData) {
      setTemplate({
        ...formData,
        updatedAt: new Date().toISOString().split("T")[0],
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (template) {
      setFormData({
        ...template,
        boundSiteIds: [...template.boundSiteIds],
      });
    }
    setIsEditing(false);
  };

  const handleSync = () => {
    const currentBoundSites = mockSites.filter((s) =>
      formData.boundSiteIds.includes(s.id)
    );
    if (currentBoundSites.length === 0) {
      alert("请先绑定站点");
      return;
    }
    alert(
      `模板「${formData.name}」已同步到 ${currentBoundSites.length} 个站点！`
    );
  };

  if (!template || !formData) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4 text-center">
        <div className="text-4xl font-bold text-muted-foreground/30">404</div>
        <p className="text-muted-foreground">找不到该模板 (ID: {templateId})</p>
        <Button onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回列表
        </Button>
      </div>
    );
  }

  const boundSites = mockSites.filter((s) =>
    formData.boundSiteIds.includes(s.id)
  );
  const typeOption = templateTypeOptions.find((t) => t.value === formData.type);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 顶部导航栏 */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">
              {template.name}
            </h2>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                template.status === "active"
                  ? "border-transparent bg-emerald-500/10 text-emerald-500"
                  : "border-transparent bg-muted text-muted-foreground"
              }`}
            >
              {template.status === "active" ? "启用" : "草稿"}
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            ID: {template.id} · {typeOption?.label} · 更新于{" "}
            {template.updatedAt}
          </p>
        </div>
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Layout className="h-3.5 w-3.5 mr-1.5" />
            编辑模板
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              取消
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-3.5 w-3.5 mr-1.5" />
              保存
            </Button>
          </div>
        )}
      </div>

      {/* 模板基本信息卡片 */}
      <Card>
        <CardHeader>
          <CardTitle>模板基本信息</CardTitle>
          <CardDescription>配置模板的基本信息和属性</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 缩略图 */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">缩略图</label>
            {formData.thumbnail ? (
              <div className="space-y-2">
                <img
                  src={formData.thumbnail}
                  alt="缩略图预览"
                  className="h-48 w-full object-cover rounded-lg border"
                />
                {isEditing && (
                  <Input
                    value={formData.thumbnail}
                    onChange={(e) => handleChange("thumbnail", e.target.value)}
                    placeholder="https://..."
                  />
                )}
              </div>
            ) : isEditing ? (
              <Input
                value={formData.thumbnail || ""}
                onChange={(e) => handleChange("thumbnail", e.target.value)}
                placeholder="https://..."
              />
            ) : (
              <div className="h-48 w-full bg-muted flex items-center justify-center rounded-lg border-2 border-dashed">
                <Layout className="h-12 w-12 text-muted-foreground/30" />
              </div>
            )}
          </div>

          {/* 模板名称 */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">模板名称</label>
            {isEditing ? (
              <Input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="输入模板名称"
              />
            ) : (
              <p className="text-sm py-2">{formData.name}</p>
            )}
          </div>

          {/* 模板类型和状态 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">模板类型</label>
              {isEditing ? (
                <select
                  value={formData.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {templateTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm py-2">{typeOption?.label}</p>
              )}
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">状态</label>
              {isEditing ? (
                <select
                  value={formData.status}
                  onChange={(e) =>
                    handleChange("status", e.target.value as "active" | "draft")
                  }
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="draft">草稿</option>
                  <option value="active">启用</option>
                </select>
              ) : (
                <p className="text-sm py-2">
                  {formData.status === "active" ? "启用" : "草稿"}
                </p>
              )}
            </div>
          </div>

          {/* 描述 */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">描述</label>
            {isEditing ? (
              <textarea
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="模板描述..."
                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
              />
            ) : (
              <p className="text-sm py-2 text-muted-foreground">
                {formData.description || "暂无描述"}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 绑定站点卡片 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                绑定站点
              </CardTitle>
              <CardDescription>
                选择使用此模板的站点，共 {boundSites.length} 个站点
              </CardDescription>
            </div>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSync()}
                disabled={boundSites.length === 0}
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                同步到站点
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-2">
              {mockSites.map((site) => {
                const region = regionOptions.find(
                  (r) => r.value === site.region
                );
                const isSelected = formData.boundSiteIds.includes(site.id);
                return (
                  <div
                    key={site.id}
                    onClick={() => toggleSiteBinding(site.id)}
                    className={`flex items-center justify-between p-3 rounded-md border cursor-pointer transition-colors ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">
                        {region?.label.split(" ")[0]}
                      </span>
                      <span className="font-medium">{site.name}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          site.status === "active"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {site.status === "active" ? "启用" : "停用"}
                      </span>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-primary" />}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {boundSites.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  <Globe className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">暂无绑定站点</p>
                </div>
              ) : (
                boundSites.map((site) => {
                  const region = regionOptions.find(
                    (r) => r.value === site.region
                  );
                  return (
                    <div
                      key={site.id}
                      className="flex items-center gap-3 p-3 rounded-md bg-muted/50"
                    >
                      <span className="text-sm font-medium">
                        {region?.label.split(" ")[0]}
                      </span>
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
          )}
        </CardContent>
      </Card>

      {/* 模板配置卡片 */}
      <Card>
        <CardHeader>
          <CardTitle>模板配置</CardTitle>
          <CardDescription>模板的主题、布局和功能配置</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">主题</label>
              {isEditing ? (
                <Input
                  value={formData.config.theme || ""}
                  onChange={(e) =>
                    handleChange("config", {
                      ...formData.config,
                      theme: e.target.value,
                    })
                  }
                  placeholder="主题名称"
                />
              ) : (
                <p className="text-sm py-2">
                  {formData.config.theme || "未设置"}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">布局</label>
              {isEditing ? (
                <Input
                  value={formData.config.layout || ""}
                  onChange={(e) =>
                    handleChange("config", {
                      ...formData.config,
                      layout: e.target.value,
                    })
                  }
                  placeholder="布局类型"
                />
              ) : (
                <p className="text-sm py-2">
                  {formData.config.layout || "未设置"}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">功能特性</label>
            {isEditing ? (
              <div className="space-y-2">
                {(formData.config.features || []).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [
                          ...(formData.config.features || []),
                        ];
                        newFeatures[index] = e.target.value;
                        handleChange("config", {
                          ...formData.config,
                          features: newFeatures,
                        });
                      }}
                      placeholder="功能名称"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => {
                        const newFeatures = [
                          ...(formData.config.features || []),
                        ];
                        newFeatures.splice(index, 1);
                        handleChange("config", {
                          ...formData.config,
                          features: newFeatures,
                        });
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newFeatures = [
                      ...(formData.config.features || []),
                      "",
                    ];
                    handleChange("config", {
                      ...formData.config,
                      features: newFeatures,
                    });
                  }}
                >
                  添加功能
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {(formData.config.features || []).length > 0 ? (
                  (formData.config.features || []).map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                    >
                      {feature}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">暂无功能特性</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
