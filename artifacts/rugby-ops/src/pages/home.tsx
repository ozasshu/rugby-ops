import React from 'react';
import { Link, useLocation } from 'wouter';
import { useAppState, Task, Approval } from '@/lib/app-state';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/ui/core';
import { AlertCircle, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Home() {
  const { currentUser, tasks, approvals, reports } = useAppState();
  const [, setLocation] = useLocation();

  if (!currentUser) return null;

  // Derived data
  const myTasks = tasks.filter(t => t.assignee === currentUser.id && t.status !== '完了');
  const delayedTasks = myTasks.filter(t => t.status === '遅延' || t.risk);
  
  const pendingApprovals = approvals.filter(a => a.approver === currentUser.id && a.status === '申請中');
  const myPendingApprovals = approvals.filter(a => a.requester === currentUser.id && a.status === '申請中');

  // Check if we need to submit a report for this week (simplistic mock logic)
  const currentWeek = '2024-W16'; // Mock current week
  const myTasksNeedingReport = myTasks.filter(t => 
    !reports.find(r => r.taskId === t.id && r.week === currentWeek)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ダッシュボード</h1>
          <p className="text-muted-foreground mt-1">お疲れ様です、{currentUser.name}さん。</p>
        </div>
      </div>

      {/* Urgent Alerts */}
      {(delayedTasks.length > 0 || pendingApprovals.length > 0 || myTasksNeedingReport.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {delayedTasks.length > 0 && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="p-4 flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                <div>
                  <h3 className="font-semibold text-destructive">遅延・リスクタスク</h3>
                  <p className="text-sm mt-1">{delayedTasks.length}件のタスクが注意を要します。</p>
                  <Button variant="link" className="p-0 h-auto text-destructive mt-2" onClick={() => setLocation('/tasks')}>
                    確認する <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {pendingApprovals.length > 0 && (
            <Card className="border-warning/50 bg-amber-50 dark:bg-amber-950/20">
              <CardContent className="p-4 flex items-start gap-4">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-800 dark:text-amber-400">未処理の承認依頼</h3>
                  <p className="text-sm mt-1">{pendingApprovals.length}件の承認依頼が届いています。</p>
                  <Button variant="link" className="p-0 h-auto text-amber-800 dark:text-amber-400 mt-2" onClick={() => setLocation('/approvals')}>
                    確認する <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {myTasksNeedingReport.length > 0 && (
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-4 flex items-start gap-4">
                <FileTextIcon className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold text-primary">週報未提出</h3>
                  <p className="text-sm mt-1">今週の報告が未提出のタスクが{myTasksNeedingReport.length}件あります。</p>
                  <Button variant="link" className="p-0 h-auto text-primary mt-2" onClick={() => setLocation('/reports')}>
                    提出する <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Tasks */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">担当タスク（未完了）</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setLocation('/tasks')}>すべて見る</Button>
          </CardHeader>
          <CardContent className="flex-1">
            {myTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                <p>現在担当している未完了のタスクはありません。</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myTasks.slice(0, 5).map(task => (
                  <div key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setLocation(`/tasks/${task.id}`)}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{task.title}</span>
                        {task.risk && <Badge variant="destructive" className="text-[10px] px-1 py-0 h-4">要確認</Badge>}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>期限: {task.dueDate}</span>
                        <span>{task.category}</span>
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0 flex items-center gap-2">
                      <Badge variant={task.status === '遅延' ? 'destructive' : task.status === '進行中' ? 'default' : 'secondary'}>
                        {task.status}
                      </Badge>
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${task.progress}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity / Approvals */}
        <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">申請・決裁状況</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">あなたが申請中</h4>
                {myPendingApprovals.length === 0 ? (
                  <p className="text-sm text-muted-foreground">申請中の案件はありません。</p>
                ) : (
                  <div className="space-y-3">
                    {myPendingApprovals.map(a => (
                      <div key={a.id} className="text-sm border-l-2 border-warning pl-3 py-1">
                        <p className="font-medium truncate">{a.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">申請日: {new Date(a.requestedAt).toLocaleDateString('ja-JP')}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">最近完了したタスク</h4>
                {tasks.filter(t => t.status === '完了' && t.assignee === currentUser.id).length === 0 ? (
                  <p className="text-sm text-muted-foreground">最近完了したタスクはありません。</p>
                ) : (
                  <div className="space-y-3">
                    {tasks.filter(t => t.status === '完了' && t.assignee === currentUser.id).slice(0, 3).map(task => (
                      <div key={task.id} className="text-sm border-l-2 border-success pl-3 py-1">
                        <p className="font-medium text-muted-foreground line-through">{task.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">完了報告済み</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FileTextIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  )
}
