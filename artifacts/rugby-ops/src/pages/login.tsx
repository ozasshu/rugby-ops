import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useAppState } from '@/lib/app-state';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/core';

export default function Login() {
  const [, setLocation] = useLocation();
  const { users, login } = useAppState();
  const [selectedUser, setSelectedUser] = useState(users[0].id);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.id === selectedUser);
    if (user) {
      login(user);
      setLocation('/');
    }
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-xl mx-auto flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-4">
            J
          </div>
          <h1 className="text-2xl font-bold text-foreground">JRFU 普及育成</h1>
          <p className="text-muted-foreground mt-2">業務管理システム・プロトタイプ</p>
        </div>

        <Card className="border-t-4 border-t-primary shadow-xl">
          <CardHeader>
            <CardTitle>ログイン</CardTitle>
            <CardDescription>デモ用のアカウントを選択してログインしてください。</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="user-select">アカウント選択</Label>
                <select
                  id="user-select"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role}{user.area ? ` / ${user.area}` : ''})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">パスワード（ダミー）</Label>
                <Input id="password" type="password" value="password" readOnly className="bg-muted text-muted-foreground" />
                <p className="text-xs text-muted-foreground">※デモ版のためパスワード入力は不要です。</p>
              </div>

              <Button type="submit" className="w-full h-11 text-base font-semibold">
                システムを利用開始する
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Japan Rugby Football Union. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
