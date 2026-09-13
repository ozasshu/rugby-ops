import React, { useState } from 'react';
import { useAppState } from '@/lib/app-state';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/core';

export default function Registrations() {
  const [area, setArea] = useState('全国');
  const [year, setYear] = useState('2024');

  // Mock data for registration stats
  const stats = {
    total: 74982,
    prevTotal: 76356,
    new: 8274,
    prevNew: 8322,
  };

  const categories = [
    { name: 'スクール（幼児・小学生）', count: 24500, prev: 25100 },
    { name: '中学生', count: 12300, prev: 12500 },
    { name: '高校生', count: 18400, prev: 19000 },
    { name: '大学生', count: 8200, prev: 8100 },
    { name: '社会人・クラブ', count: 11582, prev: 11656 },
  ];

  const calcYoY = (current: number, prev: number) => {
    const diff = current - prev;
    const percent = ((diff / prev) * 100).toFixed(1);
    const isPositive = diff > 0;
    return {
      text: `${isPositive ? '+' : ''}${diff.toLocaleString()} (${isPositive ? '+' : ''}${percent}%)`,
      className: isPositive ? 'text-success' : 'text-destructive'
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">登録状況ダッシュボード</h1>
          <p className="text-muted-foreground mt-1">競技者・チームの登録推移（月次更新）</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>印刷・PDF出力</Button>
        </div>
      </div>

      <Card className="no-print bg-muted/30 border-none shadow-none">
        <CardContent className="p-4 flex flex-wrap gap-4 items-center">
          <div className="space-y-1">
            <span className="text-xs font-bold text-muted-foreground">年度</span>
            <select className="flex h-9 w-32 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm" value={year} onChange={e => setYear(e.target.value)}>
              <option value="2024">2024年度</option>
              <option value="2023">2023年度</option>
            </select>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold text-muted-foreground">地域・支部</span>
            <select className="flex h-9 w-40 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm" value={area} onChange={e => setArea(e.target.value)}>
              <option value="全国">全国</option>
              <option value="関東">関東協会</option>
              <option value="関西">関西協会</option>
              <option value="九州">九州協会</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-muted-foreground font-medium">総登録者数 ({area})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold font-mono tracking-tight">{stats.total.toLocaleString()}</span>
              <span className="text-sm font-medium text-muted-foreground">人</span>
            </div>
            <div className="mt-2 text-sm font-medium">
              前年同期比: <span className={calcYoY(stats.total, stats.prevTotal).className}>{calcYoY(stats.total, stats.prevTotal).text}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-muted-foreground font-medium">新規登録者数 ({area})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold font-mono tracking-tight text-primary">{stats.new.toLocaleString()}</span>
              <span className="text-sm font-medium text-muted-foreground">人</span>
            </div>
            <div className="mt-2 text-sm font-medium">
              前年同期比: <span className={calcYoY(stats.new, stats.prevNew).className}>{calcYoY(stats.new, stats.prevNew).text}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>カテゴリー別 登録者数</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>カテゴリー</TableHead>
                <TableHead className="text-right">登録者数</TableHead>
                <TableHead className="text-right">前年同期</TableHead>
                <TableHead className="text-right">増減</TableHead>
                <TableHead className="w-[30%]">割合</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map(cat => (
                <TableRow key={cat.name}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="text-right font-mono">{cat.count.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">{cat.prev.toLocaleString()}</TableCell>
                  <TableCell className={`text-right font-mono font-medium ${calcYoY(cat.count, cat.prev).className}`}>
                    {calcYoY(cat.count, cat.prev).text.split(' ')[0]}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary opacity-80" style={{ width: `${(cat.count / stats.total) * 100}%` }} />
                      </div>
                      <span className="text-xs w-8 text-right font-mono text-muted-foreground">{((cat.count / stats.total) * 100).toFixed(1)}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="text-right text-xs text-muted-foreground mt-8">
        データ最終更新日: 2024年4月1日
      </div>
    </div>
  );
}
