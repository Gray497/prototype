import { Article } from './types';

// 文章分类选项
export const articleCategories = ['技术', '设计', '市场营销', '产品', '运营'];

// 文章状态选项
export const articleStatusOptions: Article['status'][] = ['草稿', '已发布', '定时发布', '已归档'];

// 模拟文章数据
export const mockArticles: Article[] = [
  { 
    id: "ART001", 
    title: "Web 开发的未来趋势", 
    content: `# Web 开发的未来趋势

随着技术的不断发展，Web 开发领域也在经历着深刻的变革。本文将探讨几个重要的发展趋势。

## 1. AI 驱动的开发工具

人工智能正在改变开发者的工作方式。从代码补全到自动化测试，AI 工具正在提高开发效率。

## 2. 边缘计算与 CDN

更快的内容分发和边缘计算正在成为标配，用户体验得到显著提升。

## 3. WebAssembly 的崛起

WebAssembly 让高性能应用成为可能，游戏、图像处理等领域正在广泛采用。

## 总结

把握这些趋势，将帮助开发者在未来保持竞争力。`,
    author: "张伟", 
    status: "已发布", 
    views: "12.5k", 
    createdAt: "2023-10-25",
    lastViewedAt: "2023-10-27 14:30",
    category: "技术",
    tags: ["前端", "趋势", "AI"],
    excerpt: "探讨 Web 开发领域的几个重要发展趋势，包括 AI 工具、边缘计算和 WebAssembly。",
    coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800",
    siteId: "site-tw",
    url: "https://shop.example.com/tw/blog/web-development-trends"
  },
  { 
    id: "ART002", 
    title: "提升 UX 设计的 10 个实用技巧", 
    content: `# 提升 UX 设计的 10 个实用技巧

优秀的用户体验设计是产品成功的关键。以下是 10 个实用技巧。

## 1. 保持一致性
设计语言在整个产品中保持统一。

## 2. 减少认知负担
简化界面，让用户专注于核心任务。

## 3. 提供即时反馈
用户的每个操作都应该有明确的反馈。`,
    author: "李娜", 
    status: "草稿", 
    views: "-", 
    createdAt: "2023-10-26",
    lastViewedAt: "-",
    category: "设计",
    tags: ["UI/UX", "设计原则"],
    siteId: "site-us"
  },
  { 
    id: "ART003", 
    title: "深入理解 React 服务端组件", 
    content: `# 深入理解 React 服务端组件

React Server Components (RSC) 是 React 生态系统中的重大创新。`,
    author: "王强", 
    status: "已发布", 
    views: "8.2k", 
    createdAt: "2023-10-20",
    lastViewedAt: "2023-10-26 09:15",
    category: "技术",
    tags: ["React", "Next.js", "性能优化"],
    siteId: "site-tw",
    url: "https://shop.example.com/tw/blog/react-server-components"
  },
  { 
    id: "ART004", 
    title: "2024 年市场营销核心策略", 
    content: `# 2024 年市场营销核心策略

新的一年，营销策略需要与时俱进。`,
    author: "赵敏", 
    status: "定时发布", 
    views: "-", 
    createdAt: "2023-11-01",
    lastViewedAt: "-",
    category: "市场营销",
    tags: ["营销", "SEO", "增长"],
    siteId: "site-us",
    scheduledAt: "2024-01-01T00:00"
  },
  { 
    id: "ART005", 
    title: "CSS Grid 布局完全指南", 
    content: `# CSS Grid 布局完全指南

CSS Grid 是现代网页布局的强大工具。`,
    author: "刘洋", 
    status: "已归档", 
    views: "45.1k", 
    createdAt: "2022-05-15",
    lastViewedAt: "2023-10-25 18:20",
    category: "技术",
    tags: ["CSS", "布局", "教程"],
    siteId: "site-tw",
    url: "https://shop.example.com/tw/blog/css-grid-guide"
  },
];
