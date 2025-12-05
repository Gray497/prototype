import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const SettingsView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">系统设置</h2>
        <p className="text-muted-foreground">管理您的账户设置和偏好。</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>个人信息</CardTitle>
          <CardDescription>在此更新您的个人资料。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="name">
              显示名称
            </label>
            <Input id="name" placeholder="您的姓名" defaultValue="John Doe" />
          </div>
          <div className="grid gap-2">
             <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
              邮箱地址
            </label>
            <Input id="email" type="email" placeholder="邮箱" defaultValue="john.doe@example.com" />
          </div>
          <div className="grid gap-2">
             <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="bio">
              个人简介
            </label>
            <textarea 
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="bio" 
                placeholder="简单介绍一下自己..." 
            />
          </div>
          <div className="flex justify-end">
            <Button>保存更改</Button>
          </div>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>通知设置</CardTitle>
          <CardDescription>配置您的接收通知方式。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
             <div className="flex items-center space-x-2">
                <input type="checkbox" id="email_notifs" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" defaultChecked />
                <label htmlFor="email_notifs" className="text-sm font-medium leading-none">邮件通知</label>
             </div>
             <div className="flex items-center space-x-2">
                <input type="checkbox" id="marketing_emails" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <label htmlFor="marketing_emails" className="text-sm font-medium leading-none">营销邮件</label>
             </div>
             <div className="flex justify-end mt-4">
                 <Button variant="secondary">更新偏好</Button>
             </div>
        </CardContent>
      </Card>
    </div>
  );
};