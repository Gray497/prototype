import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  MoreHorizontal, 
  TagIcon, 
  Plus,
  Calendar,
  Search,
  Hash,
  FileText,
  Palette
} from 'lucide-react';

// 标签类型
type TagCategory = 'article' | 'product' | 'general';

// 标签数据接口
interface Tag {
  id: string;
  name: string;
  slug: string;
  category: TagCategory;
  color: string;
  articleCount: number;
  productCount: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// 标签分类配置
const categoryConfig: { key: TagCategory | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'article', label: '文章标签' },
  { key: 'product', label: '产品标签' },
  { key: 'general', label: '通用标签' },
];

// 模拟标签数据
const tagsData: Tag[] = [
  {
    id: 'tag-001',
    name: '热门推荐',
    slug: 'hot',
    category: 'general',
    color: '#ef4444',
    articleCount: 12,
    productCount: 8,
    description: '热门推荐内容',
    createdAt: '2024-01-15 10:00:00',
    updatedAt: '2024-12-01 14:00:00',
  },
  {
    id: 'tag-002',
    name: '玄学入门',
    slug: 'metaphysics-intro',
    category: 'article',
    color: '#8b5cf6',
    articleCount: 25,
    productCount: 0,
    description: '玄学入门文章',
    createdAt: '2024-02-10 09:00:00',
    updatedAt: '2024-11-20 16:00:00',
  },
  {
    id: 'tag-003',
    name: '手相解读',
    slug: 'palmistry',
    category: 'article',
    color: '#f59e0b',
    articleCount: 18,
    productCount: 0,
    description: '手相相关文章',
    createdAt: '2024-02-20 11:00:00',
    updatedAt: '2024-11-15 10:00:00',
  },
  {
    id: 'tag-004',
    name: '面相分析',
    slug: 'face-reading',
    category: 'article',
    color: '#10b981',
    articleCount: 15,
    productCount: 0,
    description: '面相相关文章',
    createdAt: '2024-03-01 14:00:00',
    updatedAt: '2024-10-25 09:00:00',
  },
  {
    id: 'tag-005',
    name: '新品上架',
    slug: 'new-arrival',
    category: 'product',
    color: '#3b82f6',
    articleCount: 0,
    productCount: 15,
    description: '新上架产品',
    createdAt: '2024-03-15 10:00:00',
    updatedAt: '2024-12-01 08:00:00',
  },
  {
    id: 'tag-006',
    name: '限时优惠',
    slug: 'sale',
    category: 'product',
    color: '#ec4899',
    articleCount: 0,
    productCount: 6,
    description: '限时优惠产品',
    createdAt: '2024-04-01 09:00:00',
    updatedAt: '2024-11-30 18:00:00',
  },
  {
    id: 'tag-007',
    name: '精选服务',
    slug: 'premium',
    category: 'general',
    color: '#f97316',
    articleCount: 5,
    productCount: 10,
    description: '精选优质服务',
    createdAt: '2024-04-20 11:00:00',
    updatedAt: '2024-11-10 15:00:00',
  },
  {
    id: 'tag-008',
    name: '八字命理',
    slug: 'bazi',
    category: 'article',
    color: '#06b6d4',
    articleCount: 20,
    productCount: 0,
    description: '八字命理相关内容',
    createdAt: '2024-05-10 10:00:00',
    updatedAt: '2024-10-05 14:00:00',
  },
];

// 获取分类标签样式
const getCategoryBadge = (category: TagCategory) => {
  switch (category) {
    case 'article':
      return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    case 'product':
      return 'bg-green-500/10 text-green-600 border-green-500/20';
    case 'general':
      return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
    default:
      return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  }
};

const getCategoryLabel = (category: TagCategory) => {
  switch (category) {
    case 'article':
      return '文章';
    case 'product':
      return '产品';
    case 'general':
      return '通用';
    default:
      return '未知';
  }
};

export const TagsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentCategory, setCurrentCategory] = useState<TagCategory | 'all'>('all');

  // 先按分类过滤
  const categoryFilteredTags = currentCategory === 'all' 
    ? tagsData 
    : tagsData.filter(tag => tag.category === currentCategory);

  // 再按搜索词过滤
  const filteredTags = categoryFilteredTags.filter(tag => 
    tag.name.includes(searchTerm) || 
    tag.slug.includes(searchTerm) || 
    tag.description?.includes(searchTerm)
  );

  const totalArticles = categoryFilteredTags.reduce((sum, t) => sum + t.articleCount, 0);
  const totalProducts = categoryFilteredTags.reduce((sum, t) => sum + t.productCount, 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">标签管理</h2>
          <p className="text-muted-foreground">管理文章和产品的分类标签。</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">导出标签</Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新增标签
          </Button>
        </div>
      </div>

      {/* 分类 Tab 切换 */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        {categoryConfig.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setCurrentCategory(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              currentCategory === tab.key
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
            <span className="ml-2 text-xs bg-muted-foreground/20 px-1.5 py-0.5 rounded">
              {tab.key === 'all' 
                ? tagsData.length 
                : tagsData.filter(t => t.category === tab.key).length}
            </span>
          </button>
        ))}
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">标签总数</p>
                <p className="text-2xl font-bold">{categoryFilteredTags.length}</p>
              </div>
              <TagIcon className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">关联文章</p>
                <p className="text-2xl font-bold text-blue-600">{totalArticles}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">关联产品</p>
                <p className="text-2xl font-bold text-green-600">{totalProducts}</p>
              </div>
              <Hash className="h-8 w-8 text-green-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>所有标签</CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-[300px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="搜索标签名称、slug..." 
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
                    标签名称
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Slug
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    分类
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    颜色
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    关联数量
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    描述
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    更新时间
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {filteredTags.map((tag) => (
                  <tr key={tag.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-6 w-6 rounded flex items-center justify-center"
                          style={{ backgroundColor: tag.color + '20' }}
                        >
                          <TagIcon className="h-3 w-3" style={{ color: tag.color }} />
                        </div>
                        <span className="font-medium">{tag.name}</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <span className="font-mono text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                        {tag.slug}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getCategoryBadge(tag.category)}`}>
                        {getCategoryLabel(tag.category)}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-5 w-5 rounded-full border"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span className="font-mono text-xs text-muted-foreground">{tag.color}</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex flex-col gap-1">
                        {tag.articleCount > 0 && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {tag.articleCount} 篇文章
                          </span>
                        )}
                        {tag.productCount > 0 && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Hash className="h-3 w-3" />
                            {tag.productCount} 个产品
                          </span>
                        )}
                        {tag.articleCount === 0 && tag.productCount === 0 && (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <span className="text-sm text-muted-foreground max-w-[150px] truncate block" title={tag.description}>
                        {tag.description || '-'}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex flex-col">
                        <span className="text-sm flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {tag.updatedAt.split(' ')[0]}
                        </span>
                        <span className="text-xs text-muted-foreground">{tag.updatedAt.split(' ')[1]}</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
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
