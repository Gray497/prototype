import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Avatar } from '../ui/Avatar';
import { FileText, Eye, Edit } from 'lucide-react';

interface ArticlesViewProps {
  onNavigate?: (path: string) => void;
}

const articles = [
    { 
      id: "ART001", 
      title: "Web 开发的未来趋势", 
      author: "张伟", 
      status: "已发布", 
      views: "12.5k", 
      createdAt: "2023-10-25",
      lastViewedAt: "2023-10-27 14:30",
      category: "技术",
      tags: ["前端", "趋势", "AI"]
    },
    { 
      id: "ART002", 
      title: "提升 UX 设计的 10 个实用技巧", 
      author: "李娜", 
      status: "草稿", 
      views: "-", 
      createdAt: "2023-10-26",
      lastViewedAt: "-",
      category: "设计",
      tags: ["UI/UX", "设计原则"]
    },
    { 
      id: "ART003", 
      title: "深入理解 React 服务端组件", 
      author: "王强", 
      status: "已发布", 
      views: "8.2k", 
      createdAt: "2023-10-20",
      lastViewedAt: "2023-10-26 09:15",
      category: "技术",
      tags: ["React", "Next.js", "性能优化"]
    },
    { 
      id: "ART004", 
      title: "2024 年市场营销核心策略", 
      author: "赵敏", 
      status: "定时发布", 
      views: "-", 
      createdAt: "2023-11-01",
      lastViewedAt: "-",
      category: "市场营销",
      tags: ["营销", "SEO", "增长"]
    },
    { 
      id: "ART005", 
      title: "CSS Grid 布局完全指南", 
      author: "刘洋", 
      status: "已归档", 
      views: "45.1k", 
      createdAt: "2022-05-15",
      lastViewedAt: "2023-10-25 18:20",
      category: "技术",
      tags: ["CSS", "布局", "教程"]
    },
];

export const ArticlesView: React.FC<ArticlesViewProps> = ({ onNavigate }) => {
    const handleEditClick = (articleId: string) => {
        if (onNavigate) {
            onNavigate(`articles/${articleId}`);
        }
    };

    const handleCreateClick = () => {
        if (onNavigate) {
            onNavigate('articles/new');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">文章管理</h2>
                    <p className="text-muted-foreground">管理您的博客文章和内容。</p>
                </div>
                 <Button onClick={handleCreateClick}>
                    <FileText className="mr-2 h-4 w-4" />
                    创建文章
                 </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                         <CardTitle>所有文章</CardTitle>
                         <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Input placeholder="搜索文章..." className="w-full sm:w-[250px]" />
                            <Button variant="outline">筛选</Button>
                         </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        标题
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        作者
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        状态
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        分类
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        标签
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        浏览量
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        创建日期
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        最后浏览
                                    </th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                                        操作
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {articles.map((article) => (
                                    <tr key={article.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle font-medium">
                                            {article.title}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-2">
                                                <Avatar fallback={article.author.charAt(0)} className="h-6 w-6 text-xs" />
                                                <span className="text-sm">{article.author}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                                                article.status === '已发布' ? 'border-transparent bg-emerald-500/10 text-emerald-500' : 
                                                article.status === '草稿' ? 'border-transparent bg-yellow-500/10 text-yellow-500' :
                                                article.status === '定时发布' ? 'border-transparent bg-blue-500/10 text-blue-500' :
                                                'border-transparent bg-muted text-muted-foreground'
                                            }`}>
                                                {article.status}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <span className="inline-flex items-center rounded-md border border-input bg-background px-2 py-1 text-xs font-medium text-muted-foreground">
                                                {article.category}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex flex-wrap gap-1">
                                                {article.tags.map((tag, i) => (
                                                    <span key={i} className="inline-flex items-center rounded-sm bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Eye className="h-3 w-3" />
                                                {article.views}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle text-muted-foreground">
                                            {article.createdAt}
                                        </td>
                                        <td className="p-4 align-middle text-muted-foreground">
                                            {article.lastViewedAt}
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <Button 
                                                variant="ghost" 
                                                size="icon"
                                                onClick={() => handleEditClick(article.id)}
                                                title="编辑文章"
                                            >
                                                <Edit className="h-4 w-4" />
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