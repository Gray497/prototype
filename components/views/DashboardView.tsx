import React from 'react';
import { 
  DollarSign, 
  Users, 
  CreditCard, 
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  LineChart,
  Line
} from 'recharts';

const data = [
  { name: '1月', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: '2月', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: '3月', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: '4月', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: '5月', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: '6月', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: '7月', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: '8月', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: '9月', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: '10月', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: '11月', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: '12月', total: Math.floor(Math.random() * 5000) + 1000 },
];

const recentSales = [
  { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+$1,999.00", initial: "OM" },
  { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+$39.00", initial: "JL" },
  { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+$299.00", initial: "IN" },
  { name: "William Kim", email: "will.kim@email.com", amount: "+$99.00", initial: "WK" },
  { name: "Sofia Davis", email: "sofia.davis@email.com", amount: "+$39.00", initial: "SD" },
];

export const DashboardView: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">仪表盘</h2>
          <p className="text-muted-foreground">店铺经营概览。</p>
        </div>
        <div className="flex items-center gap-2">
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4">
              下载报表
            </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总收入</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-emerald-500 flex items-center mr-1"><ArrowUpRight className="h-3 w-3 mr-0.5" /> +20.1%</span> 较上月
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">订阅数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-emerald-500 flex items-center mr-1"><ArrowUpRight className="h-3 w-3 mr-0.5" /> +180.1%</span> 较上月
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">销量</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-rose-500 flex items-center mr-1"><ArrowDownRight className="h-3 w-3 mr-0.5" /> -4.5%</span> 较上月
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">当前活跃</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
               <span className="text-emerald-500 flex items-center mr-1"><ArrowUpRight className="h-3 w-3 mr-0.5" /> +201</span> 较上小时
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>概览</CardTitle>
            <CardDescription>本年度月收入明细。</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                   <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '6px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
                  />
                  <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>近期销售</CardTitle>
            <CardDescription>本月共完成 265 笔交易。</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentSales.map((sale, i) => (
                <div key={i} className="flex items-center">
                  <Avatar fallback={sale.initial} className="h-9 w-9" />
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{sale.name}</p>
                    <p className="text-xs text-muted-foreground">{sale.email}</p>
                  </div>
                  <div className="ml-auto font-medium">{sale.amount}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};