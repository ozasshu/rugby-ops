import React from 'react';
import { useAppState } from '@/lib/app-state';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui/core';

export default function Progress() {
  const { tasks, users } = useAppState();

  const statuses = ['未着手', '進行中', '保留', '完了'];
  
  // Categorize tasks for Kanban
  const getTasksByStatus = (status: string) => tasks.filter(t => t.status === status);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">組織全体進捗 (カンバン)</h1>
        <p className="text-muted-foreground mt-1">全タスクの状況を俯瞰します。</p>
      </div>

      <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
        {statuses.map(status => {
          const columnTasks = getTasksByStatus(status);
          return (
            <div key={status} className="flex-shrink-0 w-80 flex flex-col bg-muted/40 rounded-lg border border-border/50">
              <div className="p-3 border-b flex items-center justify-between bg-muted/20 rounded-t-lg">
                <h3 className="font-bold text-sm text-foreground">{status}</h3>
                <Badge variant="secondary" className="bg-background">{columnTasks.length}</Badge>
              </div>
              <div className="p-3 flex-1 overflow-y-auto space-y-3">
                {columnTasks.map(task => (
                  <Card key={task.id} className={`shadow-sm border-l-4 ${task.risk || task.status === '遅延' ? 'border-l-destructive' : task.status === '完了' ? 'border-l-muted' : 'border-l-primary'} hover:shadow-md transition-shadow cursor-pointer`}>
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <p className={`text-sm font-bold leading-tight ${task.status === '完了' ? 'text-muted-foreground line-through' : ''}`}>{task.title}</p>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-muted-foreground/30 text-muted-foreground">{task.category}</Badge>
                        {task.priority === '高' && <span className="text-[10px] font-bold text-destructive">高優先</span>}
                      </div>
                      
                      {task.status !== '完了' && (
                        <div className="mb-3">
                          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                            <span>進捗</span>
                            <span>{task.progress}%</span>
                          </div>
                          <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                            <div className={`h-full ${task.risk ? 'bg-destructive' : 'bg-primary'}`} style={{ width: `${task.progress}%` }} />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-sidebar-accent flex items-center justify-center text-white text-[10px] font-medium" title={users.find(u => u.id === task.assignee)?.name}>
                            {users.find(u => u.id === task.assignee)?.name.charAt(0)}
                          </div>
                          <span className="text-xs text-muted-foreground truncate w-16">{users.find(u => u.id === task.assignee)?.name}</span>
                        </div>
                        <span className={`text-[10px] font-medium ${new Date(task.dueDate) < new Date() && task.status !== '完了' ? 'text-destructive' : 'text-muted-foreground'}`}>
                          {task.dueDate.substring(5)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
