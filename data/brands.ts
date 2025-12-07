export interface BrandOwner {
  id: string;
  name: string;
  createdAt: string;
  orderPrefix: string;
  note?: string;
  adminDomain: string;
  customerDomain: string;
}

export const brandOwners: BrandOwner[] = [
  {
    id: 'BR-1001',
    name: '星河品牌',
    createdAt: '2023-08-12',
    orderPrefix: 'ORD-XH',
    note: '主力电子烟品牌方',
    adminDomain: 'https://admin.xh-brand.com',
    customerDomain: 'https://shop.xh-brand.com'
  },
  {
    id: 'BR-1002',
    name: '手办宇宙',
    createdAt: '2023-09-05',
    orderPrefix: 'ORD-HB',
    note: 'ACG 手办品牌方',
    adminDomain: 'https://admin.figureverse.com',
    customerDomain: 'https://figureverse.com'
  },
  {
    id: 'BR-1003',
    name: '玄学工作室',
    createdAt: '2023-10-01',
    orderPrefix: 'ORD-META',
    note: '线上玄学服务品牌方',
    adminDomain: 'https://admin.meta-lab.com',
    customerDomain: 'https://meta-lab.com'
  }
];

