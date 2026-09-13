import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useAppState, TaskStatus } from '@/lib/app-state';
import { Card, CardContent, Button, Input, Badge, Table, TableHeader, TableRow, TableHead, TableBody, TableCell, Label } from '@/components/ui/core';
import { Search, Plus, Filter } from 'lucide-react';

export default function Tasks() {
  const { tasks, users } = useAppState();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState('ALL');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.includes(searchTerm) || task.category.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
    const matchesAssignee = assigneeFilter === 'ALL' || task.assignee === assigneeFilter;
    return matchesSearch && matchesStatus && matchesAssignee;
  });

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case '未着手': return <Badge variant="secondary">未着手</Badge>;
      case '進行中': return <Badge variant="default">進行中</Badge>;
      case '遅延': return <Badge variant="destructive">遅延</Badge>;
      case '完了': return <Badge variant="outline" className="text-muted-foreground border-muted">完了</Badge>;
      case '保留': return <Badge variant="warning">保留</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    if (priority === '高') return 'text-destructive font-bold';
    if (priority === '中') return 'text-amber-600';
    return 'text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">業務タスク一覧</h1>
          <p className="text-muted-foreground mt-1">部門・プロジェクトのタスクを一元管理します。</p>
        </div>
        <Button onClick={() => setLocation('/tasks/new')}>
          <Plus className="w-4 h-4 mr-2" />
          新規タスク登録
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1 w-full space-y-1">
              <Label>キーワード検索</Label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="タスク名、カテゴリ..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full lg:w-48 space-y-1">
              <Label>ステータス</Label>
              <select 
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="ALL">すべて</option>
                <option value="未着手">未着手</option>
                <option value="進行中">進行中</option>
                <option value="遅延">遅延</option>
                <option value="完了">完了</option>
                <option value="保留">保留</option>
              </select>
            </div>

            <div className="w-full lg:w-48 space-y-1">
              <Label>担当者</Label>
              <select 
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
              >
                <option value="ALL">すべての担当者</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">状態</TableHead>
              <TableHead className="w-[60px]">優先度</TableHead>
              <TableHead>タスク名</TableHead>
              <TableHead className="w-[120px]">カテゴリ</TableHead>
              <TableHead className="w-[120px]">担当者</TableHead>
              <TableHead className="w-[120px]">期限</TableHead>
              <TableHead className="w-[100px]">進捗</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  条件に一致するタスクが見つかりませんでした。
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task) => (
                <TableRow 
                  key={task.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setLocation(`/tasks/${task.id}`)}
                >
                  <TableCell>{getStatusBadge(task.status)}</TableCell>
                  <TableCell className={getPriorityColor(task.priority)}>{task.priority}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {task.title}
                      {task.risk && <AlertCircle className="w-4 h-4 text-destructive" />}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">{task.category}</TableCell>
                  <TableCell>{users.find(u => u.id === task.assignee)?.name}</TableCell>
                  <TableCell className={task.status !== '完了' && new Date(task.dueDate) < new Date() ? 'text-destructive font-medium' : ''}>
                    {task.dueDate}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-xs w-8 text-right">{task.progress}%</span>
                      <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${task.progress}%` }} />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function AlertCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  )
}
