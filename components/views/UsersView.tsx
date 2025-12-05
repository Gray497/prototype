import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  MoreHorizontal, 
  UserPlus, 
  Mail, 
  Phone, 
  Shield,
  Calendar,
  Clock,
  Search,
  Users,
  UserCheck,
  UserX
} from 'lucide-react';
import { SystemUser } from '../../data/types';

// 平台类型
type Platform = 'all' | 'admin' | 'B' | 'O';

// 平台 Tab 配置
const platformTabs: { key: Platform; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'admin', label: 'Admin（管理端）' },
  { key: 'B', label: 'B（商户端）' },
];

// 扩展用户数据类型，增加 platform 字段
interface UserWithPlatform extends SystemUser {
  platform: 'admin' | 'B' | 'O';
}

// 模拟用户数据
const usersData: UserWithPlatform[] = [
  {
    id: 'user-001',
    username: 'admin',
    name: '系统管理员',
    email: 'admin@example.com',
    phone: '138****0000',
    avatar: '/avatars/admin.jpg',
    roleIds: ['role-001'],
    roleName: '超级管理员',
    status: 'active',
    lastLoginAt: '2024-12-05 10:30:00',
    createdAt: '2024-01-01 00:00:00',
    updatedAt: '2024-12-05 10:30:00',
    platform: 'admin',
  },
  {
    id: 'user-002',
    username: 'lishifu',
    name: '李师傅',
    email: 'li@example.com',
    phone: '139****1111',
    avatar: '/avatars/li.jpg',
    roleIds: ['role-002'],
    roleName: '玄学顾问',
    status: 'active',
    lastLoginAt: '2024-12-05 09:00:00',
    createdAt: '2024-03-15 10:00:00',
    updatedAt: '2024-12-05 09:00:00',
    platform: 'O',
  },
  {
    id: 'user-003',
    username: 'wangshifu',
    name: '王师傅',
    email: 'wang@example.com',
    phone: '137****2222',
    avatar: '/avatars/wang.jpg',
    roleIds: ['role-002'],
    roleName: '玄学顾问',
    status: 'active',
    lastLoginAt: '2024-12-04 18:30:00',
    createdAt: '2024-04-20 14:00:00',
    updatedAt: '2024-12-04 18:30:00',
    platform: 'O',
  },
  {
    id: 'user-004',
    username: 'chenshifu',
    name: '陈师傅',
    email: 'chen@example.com',
    phone: '136****3333',
    avatar: '/avatars/chen.jpg',
    roleIds: ['role-002'],
    roleName: '玄学顾问',
    status: 'inactive',
    lastLoginAt: '2024-11-20 12:00:00',
    createdAt: '2024-05-10 09:00:00',
    updatedAt: '2024-11-20 12:00:00',
    platform: 'O',
  },
  {
    id: 'user-005',
    username: 'merchant01',
    name: '商户张三',
    email: 'zhang@merchant.com',
    phone: '135****4444',
    avatar: '/avatars/zhang.jpg',
    roleIds: ['role-004'],
    roleName: '商户管理员',
    status: 'active',
    lastLoginAt: '2024-12-05 08:00:00',
    createdAt: '2024-06-01 10:00:00',
    updatedAt: '2024-12-05 08:00:00',
    platform: 'B',
  },
  {
    id: 'user-006',
    username: 'merchant02',
    name: '商户李四',
    email: 'lisi@merchant.com',
    phone: '134****5555',
    avatar: '/avatars/lisi.jpg',
    roleIds: ['role-004'],
    roleName: '商户管理员',
    status: 'active',
    lastLoginAt: '2024-12-01 10:00:00',
    createdAt: '2024-07-15 11:00:00',
    updatedAt: '2024-12-01 10:00:00',
    platform: 'B',
  },
  {
    id: 'user-007',
    username: 'operator01',
    name: '运营小王',
    email: 'xiaowang@example.com',
    phone: '133****6666',
    avatar: '/avatars/xiaowang.jpg',
    roleIds: ['role-005'],
    roleName: '运营专员',
    status: 'active',
    lastLoginAt: '2024-12-05 09:30:00',
    createdAt: '2024-08-01 10:00:00',
    updatedAt: '2024-12-05 09:30:00',
    platform: 'admin',
  },
  {
    id: 'user-008',
    username: 'kefu01',
    name: '客服小李',
    email: 'xiaoli@example.com',
    phone: '132****7777',
    avatar: '/avatars/xiaoli.jpg',
    roleIds: ['role-003'],
    roleName: '客服',
    status: 'locked',
    lastLoginAt: '2024-12-01 10:00:00',
    createdAt: '2024-09-01 11:00:00',
    updatedAt: '2024-12-01 10:00:00',
    platform: 'admin',
  },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'active':
      return { 
        label: '正常', 
        color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
        icon: UserCheck
      };
    case 'inactive':
      return { 
        label: '禁用', 
        color: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
        icon: UserX
      };
    case 'locked':
      return { 
        label: '锁定', 
        color: 'bg-red-500/10 text-red-600 border-red-500/20',
        icon: UserX
      };
    default:
      return { 
        label: '未知', 
        color: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
        icon: UserX
      };
  }
};

export const UsersView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPlatform, setCurrentPlatform] = useState<Platform>('all');

  // 先按平台过滤
  const platformFilteredUsers = currentPlatform === 'all' 
    ? usersData 
    : usersData.filter(user => user.platform === currentPlatform);

  // 再按搜索词过滤
  const filteredUsers = platformFilteredUsers.filter(user => 
    user.name.includes(searchTerm) || 
    user.username.includes(searchTerm) || 
    user.email.includes(searchTerm) ||
    user.phone?.includes(searchTerm)
  );

  const activeCount = platformFilteredUsers.filter(u => u.status === 'active').length;
  const inactiveCount = platformFilteredUsers.filter(u => u.status === 'inactive').length;
  const lockedCount = platformFilteredUsers.filter(u => u.status === 'locked').length;

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
          <h2 className="text-3xl font-bold tracking-tight">用户管理</h2>
          <p className="text-muted-foreground">管理系统用户账号及权限。</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">导出用户</Button>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            新增用户
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
                ? usersData.length 
                : usersData.filter(u => u.platform === tab.key).length}
            </span>
          </button>
        ))}
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">总用户数</p>
                <p className="text-2xl font-bold">{usersData.length}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">正常</p>
                <p className="text-2xl font-bold text-emerald-600">{activeCount}</p>
              </div>
              <UserCheck className="h-8 w-8 text-emerald-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">禁用</p>
                <p className="text-2xl font-bold text-gray-600">{inactiveCount}</p>
              </div>
              <UserX className="h-8 w-8 text-gray-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">锁定</p>
                <p className="text-2xl font-bold text-red-600">{lockedCount}</p>
              </div>
              <UserX className="h-8 w-8 text-red-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>所有用户</CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-[300px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="搜索用户名、姓名、邮箱..." 
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
                    用户
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    用户名
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    联系方式
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    角色
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    平台
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    状态
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    最后登录
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    创建时间
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {filteredUsers.map((user) => {
                  const statusConfig = getStatusConfig(user.status);
                  return (
                    <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary font-semibold">
                            {user.name.charAt(0)}
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <span className="font-mono text-sm text-muted-foreground">{user.username}</span>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm flex items-center gap-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            {user.email}
                          </span>
                          {user.phone && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {user.phone}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <span className="inline-flex items-center gap-1 text-sm">
                          <Shield className="h-3 w-3 text-muted-foreground" />
                          {user.roleName}
                        </span>
                      </td>
                      <td className="p-4 align-middle">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getPlatformBadge(user.platform)}`}>
                          {user.platform}
                        </span>
                      </td>
                      <td className="p-4 align-middle">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusConfig.color}`}>
                          <statusConfig.icon className="h-3 w-3 mr-1" />
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="p-4 align-middle">
                        {user.lastLoginAt ? (
                          <div className="flex flex-col">
                            <span className="text-sm flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              {user.lastLoginAt.split(' ')[0]}
                            </span>
                            <span className="text-xs text-muted-foreground">{user.lastLoginAt.split(' ')[1]}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex flex-col">
                          <span className="text-sm flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {user.createdAt.split(' ')[0]}
                          </span>
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
