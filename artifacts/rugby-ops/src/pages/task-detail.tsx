import React, { useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { useAppState, TaskStatus, TaskPriority } from '@/lib/app-state';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle, Textarea, Badge } from '@/components/ui/core';
import { ArrowLeft, Save, MessageSquare, Clock, AlertTriangle, FileText, BookOpen, History } from 'lucide-react';

export default function TaskDetail() {
  const params = useParams();
  const id = params.id;
  const isNew = !id || id === 'new';
  
  const [, setLocation] = useLocation();
  const { tasks, reports, knowledge, users, addTask, updateTask, addComment, currentUser } = useAppState();

  const existingTask = tasks.find(t => t.id === id);

  const [title, setTitle] = useState(existingTask?.title || '');
  const [category, setCategory] = useState(existingTask?.category || '普及');
  const [assignee, setAssignee] = useState(existingTask?.assignee || currentUser?.id || '');
  const [dueDate, setDueDate] = useState(existingTask?.dueDate || '');
  const [status, setStatus] = useState<TaskStatus>(existingTask?.status || '未着手');
  const [priority, setPriority] = useState<TaskPriority>(existingTask?.priority || '中');
  const [description, setDescription] = useState(existingTask?.description || '');
  const [progress, setProgress] = useState(existingTask?.progress || 0);
  const [risk, setRisk] = useState(existingTask?.risk || false);

  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState<'comments' | 'reports' | 'knowledge' | 'history'>('comments');

  const handleSave = () => {
    if (!title || !assignee || !dueDate) {
      alert('必須項目を入力してください。');
      return;
    }

    if (isNew) {
      addTask({ title, category, assignee, dueDate, status, priority, description, progress, risk });
      setLocation('/tasks');
    } else {
      updateTask(id as string, { title, category, assignee, dueDate, status, priority, description, progress, risk });
      alert('保存しました。');
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isNew) return;
    addComment(id as string, newComment.trim());
    setNewComment('');
  };

  if (!isNew && !existingTask) {
    return <div className="p-8 text-center text-muted-foreground">タスクが見つかりません。</div>;
  }

  // Derived data
  const taskReports = reports.filter(r => r.taskId === id).sort((a, b) => b.week.localeCompare(a.week));
  const relatedKnowledge = knowledge.filter(k => k.tags.includes(category) || k.body.includes(title));
  
  // Mock history for prototype
  const mockHistory = [
    { date: '2024-04-12 10:00', action: 'ステータスを進行中に変更', user: existingTask?.assignee || 'u1' },
    { date: '2024-04-05 14:30', action: '進捗率を40%に更新', user: existingTask?.assignee || 'u1' },
    { date: '2024-04-01 09:00', action: 'タスクを作成', user: 'u1' }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="-ml-4 text-muted-foreground" onClick={() => setLocation('/tasks')}>
          <ArrowLeft className="w-4 h-4 mr-2" />一覧に戻る
        </Button>
        <div className="flex items-center gap-3">
          {!isNew && existingTask?.risk && (
            <Badge variant="destructive" className="h-8 px-3">
              <AlertTriangle className="w-4 h-4 mr-1.5" />
              リスクフラグあり
            </Badge>
          )}
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            {isNew ? '登録する' : '保存する'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-bold">タスク名 <span className="text-destructive">*</span></Label>
                <Input id="title" value={title} onChange={e => setTitle(e.target.value)} className="text-lg font-medium" placeholder="例：〇〇大会の運営マニュアル作成" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="desc" className="text-sm font-bold">詳細・背景</Label>
                <Textarea 
                  id="desc" 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  className="min-h-[150px] resize-y" 
                  placeholder="タスクの目的、具体的な作業内容などを記入"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold">進捗率 ({progress}%)</Label>
                  <input 
                    type="range" 
                    min="0" max="100" step="5"
                    value={progress}
                    onChange={e => setProgress(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input 
                    type="checkbox" 
                    id="risk" 
                    checked={risk}
                    onChange={e => setRisk(e.target.checked)}
                    className="w-4 h-4 text-primary rounded border-input focus:ring-primary"
                  />
                  <Label htmlFor="risk" className="text-sm cursor-pointer text-destructive font-medium">リスクあり（遅延の恐れ、課題発生など）</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {!isNew && existingTask && (
            <Card>
              <div className="flex border-b bg-muted/20">
                <button
                  className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center gap-2 ${activeTab === 'comments' ? 'border-primary text-primary bg-background' : 'border-transparent text-muted-foreground hover:bg-muted/30'}`}
                  onClick={() => setActiveTab('comments')}
                >
                  <MessageSquare className="w-4 h-4" /> コメント
                </button>
                <button
                  className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center gap-2 ${activeTab === 'reports' ? 'border-primary text-primary bg-background' : 'border-transparent text-muted-foreground hover:bg-muted/30'}`}
                  onClick={() => setActiveTab('reports')}
                >
                  <FileText className="w-4 h-4" /> 週報 ({taskReports.length})
                </button>
                <button
                  className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center gap-2 ${activeTab === 'knowledge' ? 'border-primary text-primary bg-background' : 'border-transparent text-muted-foreground hover:bg-muted/30'}`}
                  onClick={() => setActiveTab('knowledge')}
                >
                  <BookOpen className="w-4 h-4" /> 関連ナレッジ
                </button>
                <button
                  className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center gap-2 ${activeTab === 'history' ? 'border-primary text-primary bg-background' : 'border-transparent text-muted-foreground hover:bg-muted/30'}`}
                  onClick={() => setActiveTab('history')}
                >
                  <History className="w-4 h-4" /> 履歴
                </button>
              </div>

              <CardContent className="p-0">
                {activeTab === 'comments' && (
                  <>
                    <div className="divide-y max-h-[400px] overflow-y-auto">
                      {existingTask.comments.length === 0 ? (
                        <p className="p-6 text-center text-muted-foreground text-sm">コメントはまだありません。</p>
                      ) : (
                        existingTask.comments.map(comment => (
                          <div key={comment.id} className="p-4 flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                              {users.find(u => u.id === comment.author)?.name.charAt(0)}
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">{users.find(u => u.id === comment.author)?.name}</span>
                                <span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleString('ja-JP')}</span>
                              </div>
                              <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-4 border-t bg-muted/10">
                      <form onSubmit={handleCommentSubmit} className="flex gap-2">
                        <Input 
                          placeholder="コメントを入力..." 
                          value={newComment}
                          onChange={e => setNewComment(e.target.value)}
                        />
                        <Button type="submit" disabled={!newComment.trim()}>送信</Button>
                      </form>
                    </div>
                  </>
                )}

                {activeTab === 'reports' && (
                  <div className="divide-y max-h-[400px] overflow-y-auto">
                    {taskReports.length === 0 ? (
                      <p className="p-6 text-center text-muted-foreground text-sm">このタスクに紐づく週報はありません。</p>
                    ) : (
                      taskReports.map(report => (
                        <div key={report.id} className="p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <Badge variant="outline">{report.week}</Badge>
                            <Badge variant={report.status.includes('遅れ') ? 'destructive' : report.status === '完了' ? 'secondary' : 'default'}>{report.status}</Badge>
                          </div>
                          <div className="text-sm">
                            <span className="font-bold block text-muted-foreground text-xs mb-1">実施内容・成果</span>
                            <p className="whitespace-pre-wrap">{report.achievement}</p>
                          </div>
                          <div className="text-sm">
                            <span className="font-bold block text-muted-foreground text-xs mb-1">次週の予定</span>
                            <p className="whitespace-pre-wrap">{report.nextPlan}</p>
                          </div>
                          <p className="text-xs text-muted-foreground text-right">提出者: {users.find(u => u.id === report.submittedBy)?.name}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'knowledge' && (
                  <div className="divide-y max-h-[400px] overflow-y-auto">
                    {relatedKnowledge.length === 0 ? (
                      <p className="p-6 text-center text-muted-foreground text-sm">関連するナレッジは見つかりませんでした。</p>
                    ) : (
                      relatedKnowledge.map(k => (
                        <div key={k.id} className="p-4 hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => setLocation('/knowledge')}>
                          <h4 className="font-bold text-sm text-primary mb-1">{k.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">{k.body}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="p-6 max-h-[400px] overflow-y-auto">
                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:ml-[13px] md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted-foreground/20 before:to-transparent">
                      {mockHistory.map((h, i) => (
                        <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-muted-foreground/20 group-[.is-active]:bg-primary group-[.is-active]:text-white text-xs font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                          </div>
                          <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded border bg-card shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-sm">{users.find(u => u.id === h.user)?.name}</span>
                              <span className="text-xs text-muted-foreground">{h.date}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{h.action}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base">プロパティ</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label>ステータス</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                >
                  <option value="未着手">未着手</option>
                  <option value="進行中">進行中</option>
                  <option value="遅延">遅延</option>
                  <option value="完了">完了</option>
                  <option value="保留">保留</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>優先度</Label>
                <div className="flex gap-2">
                  {['高', '中', '低'].map(p => (
                    <button
                      key={p}
                      type="button"
                      className={`flex-1 py-2 text-sm rounded-md border transition-colors ${priority === p ? 'bg-primary text-primary-foreground border-primary font-bold' : 'bg-background hover:bg-muted'}`}
                      onClick={() => setPriority(p as TaskPriority)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>担当者 <span className="text-destructive">*</span></Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                >
                  <option value="">選択してください</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>カテゴリ</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="大会運営">大会運営</option>
                  <option value="育成・発掘">育成・発掘</option>
                  <option value="指導者育成">指導者育成</option>
                  <option value="普及">普及</option>
                  <option value="広報・プロモーション">広報・プロモーション</option>
                  <option value="システム・管理">システム・管理</option>
                  <option value="その他">その他</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>期限 <span className="text-destructive">*</span></Label>
                <Input 
                  type="date" 
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {!isNew && (
            <Card>
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  情報
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>タスクID</span>
                  <span className="font-mono text-foreground">{existingTask?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>作成日</span>
                  <span>2024-04-01</span>
                </div>
                <div className="flex justify-between">
                  <span>最終更新</span>
                  <span>今日</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
