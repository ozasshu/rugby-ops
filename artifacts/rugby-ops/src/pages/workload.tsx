import React from 'react';
import { useAppState } from '@/lib/app-state';
import { Card, CardHeader, CardTitle, CardContent, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/core';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

export default function Workload() {
  const { tasks, users } = useAppState();

  // Calculate workload per user (count of active tasks)
  const userWorkload = users.map(user => {
    const userTasks = tasks.filter(t => t.assignee === user.id && t.status !== '完了');
    const delayed = userTasks.filter(t => t.status === '遅延' || t.risk).length;
    return {
      name: user.name,
      tasks: userTasks.length,
      delayed,
      normal: userTasks.length - delayed
    };
  }).filter(u => u.tasks > 0);

  // Calculate task distribution by category
  const categories = [...new Set(tasks.map(t => t.category))];
  const categoryData = categories.map(cat => ({
    name: cat,
    value: tasks.filter(t => t.category === cat && t.status !== '完了').length
  })).filter(c => c.value > 0);

  const COLORS = ['#D32F2F', '#1976D2', '#388E3C', '#F57C00', '#7B1FA2', '#0097A7', '#C2185B'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">業務負荷・リソース分析</h1>
        <p className="text-muted-foreground mt-1">現在の未完了タスクに基づく担当者別の負荷状況</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>担当者別 抱えタスク数（進行中・遅延）</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userWorkload} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Legend />
                  <Bar dataKey="normal" name="通常タスク" stackId="a" fill="hsl(var(--primary))" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="delayed" name="遅延・リスク" stackId="a" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>カテゴリ別 タスク分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({name, value}) => `${name} (${value})`}
                    labelLine={false}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>詳細データ</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>担当者</TableHead>
                <TableHead className="text-center">総タスク数</TableHead>
                <TableHead className="text-center">通常進行</TableHead>
                <TableHead className="text-center text-destructive">遅延・リスク</TableHead>
                <TableHead>負荷判定</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userWorkload.map(user => (
                <TableRow key={user.name}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-center font-mono">{user.tasks}</TableCell>
                  <TableCell className="text-center font-mono">{user.normal}</TableCell>
                  <TableCell className="text-center font-mono text-destructive font-bold">{user.delayed}</TableCell>
                  <TableCell>
                    {user.tasks > 5 ? (
                      <span className="text-destructive font-bold text-xs">過負荷注意</span>
                    ) : (
                      <span className="text-success font-bold text-xs">適正</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
