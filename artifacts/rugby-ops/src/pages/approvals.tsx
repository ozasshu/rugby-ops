import React, { useState } from 'react';
import { useAppState } from '@/lib/app-state';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui/core';

export default function Approvals() {
  const { currentUser, approvals, tasks, users, updateApproval } = useAppState();
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');

  if (!currentUser) return null;

  const myPending = approvals.filter(a => a.approver === currentUser.id && a.status === '申請中');
  const myHistory = approvals.filter(a => a.approver === currentUser.id && a.status !== '申請中');
  const requestedByMe = approvals.filter(a => a.requester === currentUser.id);

  const handleAction = (id: string, status: '承認' | '差し戻し') => {
    const comment = prompt(`${status}時のコメントを入力してください（任意）`);
    if (comment !== null) {
      updateApproval(id, status, comment);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '申請中': return <Badge variant="warning">申請中</Badge>;
      case '承認': return <Badge variant="success">承認済</Badge>;
      case '差し戻し': return <Badge variant="destructive">差戻し</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">承認・決裁</h1>
        <p className="text-muted-foreground mt-1">予算・計画変更などの決裁ワークフロー</p>
      </div>

      <div className="flex gap-4 border-b">
        <button
          className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'pending' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('pending')}
        >
          あなたへの承認依頼 {myPending.length > 0 && <span className="ml-1 bg-destructive text-white text-xs px-2 py-0.5 rounded-full">{myPending.length}</span>}
        </button>
        <button
          className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'history' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('history')}
        >
          対応履歴・自身の申請
        </button>
      </div>

      {activeTab === 'pending' ? (
        <div className="space-y-4">
          {myPending.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                現在、対応待ちの承認依頼はありません。
              </CardContent>
            </Card>
          ) : (
            myPending.map(approval => {
              const task = tasks.find(t => t.id === approval.taskId);
              const requester = users.find(u => u.id === approval.requester);
              
              return (
                <Card key={approval.id} className="border-l-4 border-l-warning">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="space-y-4 flex-1">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-muted-foreground">申請者: {requester?.name}</span>
                            <span className="text-sm text-muted-foreground">({new Date(approval.requestedAt).toLocaleString('ja-JP')})</span>
                          </div>
                          <h3 className="text-lg font-bold">{approval.content}</h3>
                        </div>
                        
                        {task && (
                          <div className="bg-muted/30 p-3 rounded-md border text-sm">
                            <span className="font-semibold text-muted-foreground text-xs block mb-1">関連タスク</span>
                            <p className="font-medium">{task.title}</p>
                            <p className="text-muted-foreground mt-1 text-xs">ステータス: {task.status} / 進捗: {task.progress}%</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-row md:flex-col gap-3 min-w-[120px]">
                        <Button className="flex-1 bg-success hover:bg-success/90" onClick={() => handleAction(approval.id, '承認')}>
                          承認する
                        </Button>
                        <Button variant="outline" className="flex-1 text-destructive border-destructive hover:bg-destructive/10" onClick={() => handleAction(approval.id, '差し戻し')}>
                          差し戻す
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">あなたの対応履歴</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {myHistory.length === 0 ? (
                  <p className="p-6 text-center text-sm text-muted-foreground">対応履歴はありません。</p>
                ) : (
                  myHistory.map(approval => {
                    const requester = users.find(u => u.id === approval.requester);
                    return (
                      <div key={approval.id} className="p-4 space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <p className="font-medium text-sm flex-1">{approval.content}</p>
                          {getStatusBadge(approval.status)}
                        </div>
                        <p className="text-xs text-muted-foreground">申請者: {requester?.name}</p>
                        {approval.comments.length > 0 && (
                          <div className="mt-2 bg-muted/50 p-2 rounded text-xs">
                            <span className="font-semibold block mb-1">あなたのコメント:</span>
                            {approval.comments[approval.comments.length - 1].content}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>

          {/* Requested by me */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">あなたの申請状況</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {requestedByMe.length === 0 ? (
                  <p className="p-6 text-center text-sm text-muted-foreground">申請はありません。</p>
                ) : (
                  requestedByMe.map(approval => {
                    const approver = users.find(u => u.id === approval.approver);
                    return (
                      <div key={approval.id} className="p-4 space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <p className="font-medium text-sm flex-1">{approval.content}</p>
                          {getStatusBadge(approval.status)}
                        </div>
                        <p className="text-xs text-muted-foreground">承認者: {approver?.name} / 申請日: {new Date(approval.requestedAt).toLocaleDateString('ja-JP')}</p>
                        {approval.comments.length > 0 && (
                          <div className="mt-2 bg-muted/50 p-2 rounded text-xs">
                            <span className="font-semibold block mb-1">返答コメント:</span>
                            {approval.comments[approval.comments.length - 1].content}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
