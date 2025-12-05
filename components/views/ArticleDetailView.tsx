import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  ArrowLeft,
  Save,
  Eye,
  Calendar,
  Tag,
  FolderOpen,
  User,
  Clock,
  X,
  Plus,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Quote,
  Heading1,
  Heading2,
  Globe,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { 
  mockSites, 
  regionOptions, 
  mockArticles, 
  articleCategories, 
  articleStatusOptions,
  Article 
} from '../../data';

// --- 简易富文本工具栏 ---
interface ToolbarProps {
  onAction: (action: string) => void;
}

const EditorToolbar: React.FC<ToolbarProps> = ({ onAction }) => {
  const tools = [
    { icon: Heading1, action: 'h1', title: '标题1' },
    { icon: Heading2, action: 'h2', title: '标题2' },
    { icon: Bold, action: 'bold', title: '加粗' },
    { icon: Italic, action: 'italic', title: '斜体' },
    { icon: List, action: 'ul', title: '无序列表' },
    { icon: ListOrdered, action: 'ol', title: '有序列表' },
    { icon: Quote, action: 'quote', title: '引用' },
    { icon: Code, action: 'code', title: '代码' },
    { icon: Link, action: 'link', title: '链接' },
    { icon: Image, action: 'image', title: '图片' },
  ];

  return (
    <div className="flex items-center gap-1 p-2 border-b bg-muted/30">
      {tools.map((tool, index) => (
        <React.Fragment key={tool.action}>
          {index === 2 && <div className="w-px h-6 bg-border mx-1" />}
          {index === 4 && <div className="w-px h-6 bg-border mx-1" />}
          {index === 7 && <div className="w-px h-6 bg-border mx-1" />}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onAction(tool.action)}
            title={tool.title}
          >
            <tool.icon className="h-4 w-4" />
          </Button>
        </React.Fragment>
      ))}
    </div>
  );
};

// --- 主组件 ---
interface ArticleDetailViewProps {
  articleId: string;
  onNavigate: (path: string) => void;
}

export const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({ articleId, onNavigate }) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [newTag, setNewTag] = useState('');
  const isNew = articleId === 'new';

  // 加载文章数据
  useEffect(() => {
    if (isNew) {
      // 新建文章
      setArticle({
        id: `ART-${Date.now()}`,
        title: '',
        content: '',
        author: '当前用户',
        status: '草稿',
        views: '-',
        createdAt: new Date().toISOString().split('T')[0],
        lastViewedAt: '-',
        category: '技术',
        tags: [],
        excerpt: '',
      });
    } else {
      const found = mockArticles.find(a => a.id === articleId);
      if (found) {
        setArticle({ ...found });
      }
    }
  }, [articleId, isNew]);

  const handleBack = () => {
    onNavigate('articles');
  };

  const handleSave = () => {
    setHasChanges(false);
    alert(isNew ? '文章创建成功！' : '文章保存成功！');
  };

  const handleChange = (field: keyof Article, value: any) => {
    setArticle(prev => prev ? { ...prev, [field]: value } : null);
    setHasChanges(true);
  };

  const addTag = () => {
    if (newTag.trim() && article && !article.tags.includes(newTag.trim())) {
      handleChange('tags', [...article.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    if (article) {
      handleChange('tags', article.tags.filter(t => t !== tagToRemove));
    }
  };

  const handleEditorAction = (action: string) => {
    // 简易 Markdown 插入（实际项目中可使用成熟的富文本编辑器）
    const textarea = document.getElementById('article-content') as HTMLTextAreaElement;
    if (!textarea || !article) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = article.content.substring(start, end);
    let newText = '';

    switch (action) {
      case 'h1':
        newText = `# ${selectedText || '标题'}`;
        break;
      case 'h2':
        newText = `## ${selectedText || '标题'}`;
        break;
      case 'bold':
        newText = `**${selectedText || '粗体文本'}**`;
        break;
      case 'italic':
        newText = `*${selectedText || '斜体文本'}*`;
        break;
      case 'ul':
        newText = `\n- ${selectedText || '列表项'}\n`;
        break;
      case 'ol':
        newText = `\n1. ${selectedText || '列表项'}\n`;
        break;
      case 'quote':
        newText = `\n> ${selectedText || '引用内容'}\n`;
        break;
      case 'code':
        newText = selectedText.includes('\n') 
          ? `\n\`\`\`\n${selectedText || '代码'}\n\`\`\`\n`
          : `\`${selectedText || '代码'}\``;
        break;
      case 'link':
        newText = `[${selectedText || '链接文本'}](url)`;
        break;
      case 'image':
        newText = `![${selectedText || '图片描述'}](图片链接)`;
        break;
      default:
        return;
    }

    const newContent = article.content.substring(0, start) + newText + article.content.substring(end);
    handleChange('content', newContent);
    
    // 恢复焦点
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + newText.length, start + newText.length);
    }, 0);
  };

  if (!article) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4 text-center">
        <div className="text-4xl font-bold text-muted-foreground/30">404</div>
        <p className="text-muted-foreground">找不到该文章 (ID: {articleId})</p>
        <Button onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回列表
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 顶部导航栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {isNew ? '创建文章' : '编辑文章'}
            </h2>
            <p className="text-muted-foreground text-sm">
              {isNew ? '撰写新的文章内容' : `ID: ${article.id}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && article.status === '已发布' && (
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              预览
            </Button>
          )}
          <Button onClick={handleSave} disabled={!hasChanges && !isNew}>
            <Save className="h-4 w-4 mr-2" />
            {isNew ? '发布' : '保存'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 主编辑区域 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 标题 */}
          <Card>
            <CardContent className="pt-6">
              <Input
                value={article.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="输入文章标题..."
                className="text-2xl font-bold border-0 px-0 focus-visible:ring-0 placeholder:text-muted-foreground/50"
              />
            </CardContent>
          </Card>

          {/* 内容编辑器 */}
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-base">文章内容</CardTitle>
              <CardDescription>支持 Markdown 格式</CardDescription>
            </CardHeader>
            <div className="border-t mt-4">
              <EditorToolbar onAction={handleEditorAction} />
              <textarea
                id="article-content"
                value={article.content}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder="开始撰写文章内容...

支持 Markdown 语法：
# 标题
**粗体** *斜体*
- 列表项
> 引用
`代码`"
                className="w-full min-h-[500px] p-4 bg-background text-sm font-mono resize-none border-0 focus:outline-none"
              />
            </div>
          </Card>

          {/* 摘要 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">文章摘要</CardTitle>
              <CardDescription>用于列表页和 SEO 描述</CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                value={article.excerpt || ''}
                onChange={(e) => handleChange('excerpt', e.target.value)}
                placeholder="输入文章摘要（可选）..."
                className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </CardContent>
          </Card>
        </div>

        {/* 侧边栏设置 */}
        <div className="space-y-6">
          {/* 发布设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                发布设置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">状态</label>
                <select
                  value={article.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {articleStatusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {article.status === '定时发布' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">发布时间</label>
                  <Input
                    type="datetime-local"
                    value={article.scheduledAt || ''}
                    onChange={(e) => handleChange('scheduledAt', e.target.value)}
                  />
                </div>
              )}

              {!isNew && (
                <div className="pt-2 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>创建于：{article.createdAt}</span>
                  </div>
                  {article.views !== '-' && (
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>浏览量：{article.views}</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 所属站点 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4" />
                所属站点
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <select
                value={article.siteId || ''}
                onChange={(e) => handleChange('siteId', e.target.value || undefined)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">请选择站点</option>
                {mockSites.map(site => {
                  const region = regionOptions.find(r => r.value === site.region);
                  return (
                    <option key={site.id} value={site.id}>
                      {region?.label.split(' ')[0]} {site.name}
                    </option>
                  );
                })}
              </select>
              
              {/* 在线访问链接 */}
              {article.url && (
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <ExternalLink className="h-3.5 w-3.5" />
                    在线访问链接
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={article.url}
                      onChange={(e) => handleChange('url', e.target.value)}
                      placeholder="https://..."
                      className="flex-1 text-xs font-mono"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                      onClick={() => {
                        navigator.clipboard.writeText(article.url || '');
                      }}
                      title="复制链接"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                      onClick={() => window.open(article.url, '_blank')}
                      title="打开链接"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {!article.url && article.siteId && article.status === '已发布' && (
                <div className="text-xs text-muted-foreground">
                  💡 发布后将自动生成访问链接
                </div>
              )}
            </CardContent>
          </Card>

          {/* 分类 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                分类
              </CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={article.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {articleCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </CardContent>
          </Card>

          {/* 标签 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Tag className="h-4 w-4" />
                标签
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {article.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-sm font-medium text-primary"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="添加标签..."
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button variant="outline" size="icon" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 作者 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                作者
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={article.author}
                onChange={(e) => handleChange('author', e.target.value)}
                placeholder="作者名称"
              />
            </CardContent>
          </Card>

          {/* 封面图片 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Image className="h-4 w-4" />
                封面图片
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {article.coverImage && (
                <img
                  src={article.coverImage}
                  alt="封面预览"
                  className="w-full h-32 object-cover rounded-md"
                />
              )}
              <Input
                value={article.coverImage || ''}
                onChange={(e) => handleChange('coverImage', e.target.value)}
                placeholder="输入图片 URL..."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
