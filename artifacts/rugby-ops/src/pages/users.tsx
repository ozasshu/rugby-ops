import React from 'react';
import { useAppState } from '@/lib/app-state';
import { Card, CardHeader, CardTitle, CardContent, Table, TableHeader, TableRow, TableHead, TableBody, TableCell, Badge, Button } from '@/components/ui/core';
import { Settings, Shield, User as UserIcon } from 'lucide-react';

export default function Users() {
  const { users } = useAppState();

  const getRoleBadge = (role: string) => {
    if (role === '管理者') return <Badge variant="destructive" className="bg-primary hover:bg-primary"><Shield className="w-3 h-3 mr-1"/>{role}</Badge>;
    if (role === '一般利用者') return <Badge variant="secondary"><UserIcon className="w-3 h-3 mr-1"/>{role}</Badge>;
    return <Badge variant="outline">{role}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ユーザー管理</h1>
          <p className="text-muted-foreground mt-1">システム利用者の権限・所属設定</p>
        </div>
        <Button disabled>
          新規ユーザー追加
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>名前</TableHead>
                <TableHead>メールアドレス</TableHead>
                <TableHead>権限</TableHead>
                <TableHead>担当エリア</TableHead>
                <TableHead className="w-[100px] text-center">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{user.area || '-'}</TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="icon" className="text-muted-foreground" title="設定">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <p className="text-sm text-muted-foreground">※プロトタイプのため、設定の変更は保存されません。</p>
    </div>
  );
}
