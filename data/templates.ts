import { SiteTemplate, TemplateType } from './types';

// 模板类型选项
export const templateTypeOptions: { value: TemplateType; label: string }[] = [
  { value: 'single', label: '单品模板' },
  { value: 'multi', label: '多品模板' },
];

// 模拟站点模板数据
export const mockTemplates: SiteTemplate[] = [
  {
    id: 'tpl-001',
    name: '简约单品落地页',
    type: 'single',
    description: '适用于单一产品推广的简洁落地页模板，突出产品特点和购买转化。',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
    boundSiteIds: ['site-tw'],
    config: {
      theme: 'light',
      layout: 'single-column',
      features: ['hero-banner', 'product-showcase', 'testimonials', 'cta-section']
    },
    status: 'active',
    createdAt: '2023-09-15',
    updatedAt: '2023-10-20'
  },
  {
    id: 'tpl-002',
    name: '电商多品商城',
    type: 'multi',
    description: '完整的电商商城模板，支持多品类商品展示、购物车、订单等功能。',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
    boundSiteIds: ['site-us', 'site-tw'],
    config: {
      theme: 'modern',
      layout: 'grid',
      features: ['product-grid', 'category-nav', 'search', 'cart', 'checkout']
    },
    status: 'active',
    createdAt: '2023-08-01',
    updatedAt: '2023-10-25'
  },
  {
    id: 'tpl-003',
    name: '品牌故事单品页',
    type: 'single',
    description: '以品牌故事为核心的单品展示页，适合高端品牌产品推广。',
    thumbnail: 'https://images.unsplash.com/photo-1493723843671-1d655e66ac1c?w=400',
    boundSiteIds: [],
    config: {
      theme: 'dark',
      layout: 'storytelling',
      features: ['brand-story', 'product-detail', 'gallery', 'reviews']
    },
    status: 'draft',
    createdAt: '2023-10-01',
    updatedAt: '2023-10-28'
  },
  {
    id: 'tpl-004',
    name: '促销活动专题页',
    type: 'multi',
    description: '适用于大促活动的专题页模板，支持倒计时、优惠券、商品推荐等。',
    thumbnail: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400',
    boundSiteIds: ['site-us'],
    config: {
      theme: 'vibrant',
      layout: 'campaign',
      features: ['countdown', 'coupon', 'flash-sale', 'product-recommendations']
    },
    status: 'active',
    createdAt: '2023-10-10',
    updatedAt: '2023-10-30'
  },
];
