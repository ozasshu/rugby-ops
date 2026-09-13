import React, { useState } from 'react';
import { useAppState } from '@/lib/app-state';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Textarea, Label, Badge } from '@/components/ui/core';

export default function Reports() {
  const { currentUser, tasks, reports, addReport } = useAppState();
  
  const currentWeek = '2024-W16';
  const myTasks = tasks.filter(t => t.assignee === currentUser?.id && t.status !== '完了');
  const submittedTasksThisWeek = reports.filter(r => r.week === currentWeek && r.submittedBy === currentUser?.id).map(r => r.taskId);
  const tasksNeedingReport = myTasks.filter(t => !submittedTasksThisWeek.includes(t.id));

  const [selectedTask, setSelectedTask] = useState(tasksNeedingReport.length > 0 ? tasksNeedingReport[0].id : '');
  const [status, setStatus] = useState<'予定通り' | 'やや遅れ' | '大幅な遅れ' | '完了'>('予定通り');
  const [achievement, setAchievement] = useState('');
  const [nextPlan, setNextPlan] = useState('');
  const [risk, setRisk] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !achievement || !nextPlan) {
      alert('必須項目を入力してください。');
      return;
    }

    addReport({
      week: currentWeek,
      taskId: selectedTask,
      status,
      achievement,
      nextPlan,
      risk,
      submittedBy: currentUser!.id
    });

    setAchievement('');
    setNextPlan('');
    setRisk('');
    setStatus('予定通り');
    
    // Select next available task
    const nextTask = tasksNeedingReport.find(t => t.id !== selectedTask);
    setSelectedTask(nextTask?.id || '');
    alert('週報を提出しました。');
  };

  if (!currentUser) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">週報提出・管理</h1>
        <p className="text-muted-foreground mt-1">今週（{currentWeek}）の進捗を報告してください。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base">今週の提出状況</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {myTasks.length === 0 ? (
                  <p className="p-4 text-sm text-muted-foreground">報告対象のタスクはありません。</p>
                ) : (
                  myTasks.map(task => {
                    const isSubmitted = submittedTasksThisWeek.includes(task.id);
                    return (
                      <div key={task.id} className="p-4 flex items-center justify-between">
                        <div className="truncate pr-4 flex-1">
                          <p className="text-sm font-medium truncate" title={task.title}>{task.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{task.category}</p>
                        </div>
                        {isSubmitted ? (
                          <Badge variant="outline" className="text-success border-success bg-success/10 whitespace-nowrap">提出済</Badge>
                        ) : (
                          <Badge variant="destructive" className="whitespace-nowrap">未提出</Badge>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="border-b bg-muted/20">
              <CardTitle>週報入力</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {tasksNeedingReport.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 text-success mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold">今週の報告はすべて完了しています！</h3>
                  <p className="text-muted-foreground mt-2">お疲れ様でした。</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="font-bold">報告対象タスク <span className="text-destructive">*</span></Label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={selectedTask}
                      onChange={(e) => setSelectedTask(e.target.value)}
                      required
                    >
                      <option value="">タスクを選択してください</option>
                      {tasksNeedingReport.map(t => (
                        <option key={t.id} value={t.id}>{t.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold">進捗ステータス <span className="text-destructive">*</span></Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(['予定通り', 'やや遅れ', '大幅な遅れ', '完了'] as const).map(s => (
                        <button
                          key={s}
                          type="button"
                          className={`py-2 px-3 text-sm rounded-md border transition-colors ${
                            status === s 
                              ? s === '完了' ? 'bg-success text-white border-success' 
                              : s.includes('遅れ') ? 'bg-destructive text-white border-destructive'
                              : 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background hover:bg-muted'
                          }`}
                          onClick={() => setStatus(s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold">今週の実施内容・成果 <span className="text-destructive">*</span></Label>
                    <Textarea 
                      value={achievement}
                      onChange={e => setAchievement(e.target.value)}
                      placeholder="箇条書きで具体的に記入してください"
                      className="min-h-[100px]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold">次週の予定 <span className="text-destructive">*</span></Label>
                    <Textarea 
                      value={nextPlan}
                      onChange={e => setNextPlan(e.target.value)}
                      placeholder="来週予定している作業内容"
                      className="min-h-[80px]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold">課題・リスク（あれば）</Label>
                    <Textarea 
                      value={risk}
                      onChange={e => setRisk(e.target.value)}
                      placeholder="遅延要因、他部署への協力要請など"
                      className="min-h-[80px]"
                    />
                  </div>

                  <Button type="submit" className="w-full sm:w-auto px-8" size="lg">
                    週報を提出する
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
