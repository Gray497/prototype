import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Avatar } from '../ui/Avatar';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';

const customers = [
    { id: "INV001", name: "Alice Smith", email: "alice@example.com", status: "活跃", spent: "$1,200.00", lastOrder: "2023-10-01" },
    { id: "INV002", name: "Bob Johnson", email: "bob@example.com", status: "非活跃", spent: "$50.00", lastOrder: "2023-09-12" },
    { id: "INV003", name: "Charlie Brown", email: "charlie@example.com", status: "活跃", spent: "$850.00", lastOrder: "2023-10-05" },
    { id: "INV004", name: "Diana Prince", email: "diana@example.com", status: "活跃", spent: "$2,300.00", lastOrder: "2023-10-08" },
    { id: "INV005", name: "Evan Wright", email: "evan@example.com", status: "已封禁", spent: "$0.00", lastOrder: "N/A" },
    { id: "INV006", name: "Frank Miller", email: "frank@example.com", status: "活跃", spent: "$120.00", lastOrder: "2023-10-02" },
];

export const CustomersView: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">客户管理</h2>
                    <p className="text-muted-foreground">管理您的客户群。</p>
                </div>
                 <Button>添加客户</Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                         <CardTitle>所有客户</CardTitle>
                         <div className="flex items-center gap-2">
                            <Input placeholder="筛选客户..." className="w-[250px]" />
                            <Button variant="outline">筛选</Button>
                         </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                        客户
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                        状态
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                        <div className="flex items-center cursor-pointer hover:text-foreground">
                                            总消费 <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </div>
                                    </th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                        最后下单
                                    </th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                        操作
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {customers.map((c) => (
                                    <tr key={c.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                            <div className="flex items-center gap-3">
                                                 <Avatar fallback={c.name.charAt(0)} className="h-8 w-8" />
                                                 <div className="flex flex-col">
                                                     <span className="font-medium">{c.name}</span>
                                                     <span className="text-xs text-muted-foreground">{c.email}</span>
                                                 </div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                            <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                                                c.status === '活跃' ? 'border-transparent bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 
                                                c.status === '非活跃' ? 'border-transparent bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20' :
                                                'border-transparent bg-destructive/10 text-destructive hover:bg-destructive/20'
                                            }`}>
                                                {c.status}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                            {c.spent}
                                        </td>
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                            {c.lastOrder}
                                        </td>
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-right">
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