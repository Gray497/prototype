import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  MoreHorizontal, 
  ShieldPlus, 
  Shield,
  Users,
  Calendar,
  Check,
  Search,
  Key
} from 'lucide-react';
import { Role } from '../../data/types';

// 平台类型
type Platform = 'all' | 'admin' | 'B' | 'O';

// 平台 Tab 配置
const platformTabs: { key: Platform; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'admin', label: 'Admin（管理端）' },
  { key: 'B', label: 'B（商户端）' },
];

// 权限定义
const permissionsData = [
  { id: 'perm-001', name: '文章管理', code: 'article:manage' },
  { id: 'perm-002', name: '产品管理', code: 'product:manage' },
  { id: 'perm-003', name: '订单管理', code: 'order:manage' },
  { id: 'perm-004', name: '站点管理', code: 'site:manage' },
  { id: 'perm-005', name: '线索管理', code: 'lead:manage' },
  { id: 'perm-006', name: '用户管理', code: 'user:manage' },
  { id: 'perm-007', name: '角色管理', code: 'role:manage' },
  { id: 'perm-008', name: '系统设置', code: 'system:settings' },
];

// 扩展角色数据类型
interface RoleWithPlatform extends Role {
  platform: 'admin' | 'B' | 'O';
}

// 模拟角色数据
const rolesData: RoleWithPlatform[] = [
  {
    id: 'role-001',
    name: '超级管理员',
    code: 'super_admin',
    description: '拥有系统全部权限，可管理所有功能模块',
    permissions: ['perm-001', 'perm-002', 'perm-003', 'perm-004', 'perm-005', 'perm-006', 'perm-007', 'perm-008'],
    userCount: 1,
    status: 'active',
    createdAt: '2024-01-01 00:00:00',
    updatedAt: '2024-12-01 10:00:00',
    platform: 'admin',
  },
  {
    id: 'role-002',
    name: '玄学顾问',
    code: 'consultant',
    description: '可查看和处理线索，管理玄学服务相关内容',
    permissions: ['perm-001', 'perm-005'],
    userCount: 3,
    status: 'active',
    createdAt: '2024-03-01 10:00:00',
    updatedAt: '2024-11-15 14:00:00',
    platform: 'O',
  },
  {
    id: 'role-003',
    name: '客服',
    code: 'customer_service',
    description: '可查看订单和处理客户咨询',
    permissions: ['perm-003', 'perm-005'],
    userCount: 2,
    status: 'active',
    createdAt: '2024-04-01 09:00:00',
    updatedAt: '2024-10-20 16:00:00',
    platform: 'admin',
  },
  {
    id: 'role-004',
    name: '商户管理员',
    code: 'merchant_admin',
    description: '商户端管理员，可管理商户信息和商品',
    permissions: ['perm-002', 'perm-003'],
    userCount: 5,
    status: 'active',
    createdAt: '2024-05-01 11:00:00',
    updatedAt: '2024-11-01 09:00:00',
    platform: 'B',
  },
  {
    id: 'role-005',
    name: '商户员工',
    code: 'merchant_staff',
    description: '商户端普通员工，可查看订单',
    permissions: ['perm-003'],
    userCount: 8,
    status: 'active',
    createdAt: '2024-06-01 14:00:00',
    updatedAt: '2024-09-15 10:00:00',
    platform: 'B',
  },
  {
    id: 'role-006',
    name: '运营专员',
    code: 'operator',
    description: '运营端专员，可管理文章、产品和站点内容',
    permissions: ['perm-001', 'perm-002', 'perm-004'],
    userCount: 2,
    status: 'active',
    createdAt: '2024-07-01 11:00:00',
    updatedAt: '2024-11-01 09:00:00',
    platform: 'O',
  },
  {
    id: 'role-007',
    name: '财务',
    code: 'finance',
    description: '可查看和管理订单、财务相关数据',
    permissions: ['perm-003'],
    userCount: 1,
    status: 'inactive',
    createdAt: '2024-08-01 14:00:00',
    updatedAt: '2024-09-15 10:00:00',
    platform: 'admin',
  },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'active':
      return { 
        label: '启用', 
        color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
      };
    case 'inactive':
      return { 
        label: '禁用', 
        color: 'bg-gray-500/10 text-gray-600 border-gray-500/20'
      };
    default:
      return { 
        label: '未知', 
        color: 'bg-gray-500/10 text-gray-600 border-gray-500/20'
      };
  }
};

export const RolesView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPlatform, setCurrentPlatform] = useState<Platform>('all');

  // 先按平台过滤
  const platformFilteredRoles = currentPlatform === 'all' 
    ? rolesData 
    : rolesData.filter(role => role.platform === currentPlatform);

  // 再按搜索词过滤
  const filteredRoles = platformFilteredRoles.filter(role => 
    role.name.includes(searchTerm) || 
    role.code.includes(searchTerm) || 
    role.description?.includes(searchTerm)
  );

  const activeCount = platformFilteredRoles.filter(r => r.status === 'active').length;
  const totalUsers = platformFilteredRoles.reduce((sum, r) => sum + (r.userCount || 0), 0);

  // 获取权限名称
  const getPermissionNames = (permissionIds: string[]) => {
    return permissionIds.map(id => {
      const perm = permissionsData.find(p => p.id === id);
      return perm?.name || id;
    });
  };

  // 获取平台标签样式
  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case 'admin':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'B':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'O':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">角色管理</h2>
          <p className="text-muted-foreground">管理系统角色及权限配置。</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Key className="mr-2 h-4 w-4" />
            权限配置
          </Button>
          <Button>
            <ShieldPlus className="mr-2 h-4 w-4" />
            新增角色
          </Button>
        </div>
      </div>

      {/* 平台 Tab 切换 */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        {platformTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setCurrentPlatform(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              currentPlatform === tab.key
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
            <span className="ml-2 text-xs bg-muted-foreground/20 px-1.5 py-0.5 rounded">
              {tab.key === 'all' 
                ? rolesData.length 
                : rolesData.filter(r => r.platform === tab.key).length}
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
                <p className="text-sm text-muted-foreground">总角色数</p>
                <p className="text-2xl font-bold">{rolesData.length}</p>
              </div>
              <Shield className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">启用角色</p>
                <p className="text-2xl font-bold text-emerald-600">{activeCount}</p>
              </div>
              <Check className="h-8 w-8 text-emerald-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">关联用户</p>
                <p className="text-2xl font-bold text-blue-600">{totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>所有角色</CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-[300px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="搜索角色名称、编码..." 
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
                    角色名称
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    角色编码
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    平台
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    描述
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    权限
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    关联用户
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    状态
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
                {filteredRoles.map((role) => {
                  const statusConfig = getStatusConfig(role.status);
                  const permissionNames = getPermissionNames(role.permissions);
                  
                  return (
                    <tr key={role.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                            <Shield className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium">{role.name}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <span className="font-mono text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                          {role.code}
                        </span>
                      </td>
                      <td className="p-4 align-middle">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getPlatformBadge(role.platform)}`}>
                          {role.platform}
                        </span>
                      </td>
                      <td className="p-4 align-middle">
                        <span className="text-sm text-muted-foreground max-w-[200px] truncate block" title={role.description}>
                          {role.description || '-'}
                        </span>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex flex-wrap gap-1 max-w-[250px]">
                          {permissionNames.slice(0, 3).map((name, index) => (
                            <span 
                              key={index}
                              className="inline-flex items-center rounded-sm border px-1.5 py-0.5 text-[10px] font-medium bg-accent/50"
                            >
                              {name}
                            </span>
                          ))}
                          {permissionNames.length > 3 && (
                            <span className="inline-flex items-center rounded-sm border px-1.5 py-0.5 text-[10px] font-medium bg-primary/10 text-primary">
                              +{permissionNames.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <span className="inline-flex items-center gap-1 text-sm">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          {role.userCount || 0}人
                        </span>
                      </td>
                      <td className="p-4 align-middle">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex flex-col">
                          <span className="text-sm flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {role.updatedAt.split(' ')[0]}
                          </span>
                          <span className="text-xs text-muted-foreground">{role.updatedAt.split(' ')[1]}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-right">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
