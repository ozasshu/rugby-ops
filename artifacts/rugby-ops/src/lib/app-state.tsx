import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type TaskStatus = '未着手' | '進行中' | '遅延' | '完了' | '保留';
export type TaskPriority = '高' | '中' | '低';

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  category: string;
  assignee: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  description: string;
  progress: number;
  risk?: boolean;
  comments: Comment[];
}

export interface WeeklyReport {
  id: string;
  week: string; // e.g. "2024-W12"
  taskId: string;
  status: '予定通り' | 'やや遅れ' | '大幅な遅れ' | '完了';
  achievement: string;
  nextPlan: string;
  risk: string;
  submittedBy: string;
  submittedAt: string;
}

export type ApprovalStatus = '申請中' | '承認' | '差し戻し';
export interface Approval {
  id: string;
  taskId: string;
  requester: string;
  approver: string;
  content: string;
  status: ApprovalStatus;
  requestedAt: string;
  comments: Comment[];
}

export interface Knowledge {
  id: string;
  title: string;
  body: string;
  tags: string[];
  updatedAt: string;
  author: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: '管理者' | '一般利用者' | '閲覧者';
  area?: string;
}

interface AppState {
  currentUser: User | null;
  tasks: Task[];
  reports: WeeklyReport[];
  approvals: Approval[];
  knowledge: Knowledge[];
  users: User[];
  login: (user: User) => void;
  logout: () => void;
  addTask: (task: Omit<Task, 'id' | 'comments'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  addComment: (taskId: string, content: string) => void;
  addReport: (report: Omit<WeeklyReport, 'id' | 'submittedAt'>) => void;
  updateApproval: (id: string, status: ApprovalStatus, comment?: string) => void;
  addKnowledge: (doc: Omit<Knowledge, 'id' | 'updatedAt' | 'author'>) => void;
}

const mockUsers: User[] = [
  { id: 'u1', name: '田中 健太', email: 'tanaka@jrfu.example.com', role: '管理者' },
  { id: 'u2', name: '佐藤 美咲', email: 'sato@jrfu.example.com', role: '一般利用者', area: '関東' },
  { id: 'u3', name: '鈴木 一郎', email: 'suzuki@jrfu.example.com', role: '一般利用者', area: '関西' },
];

const mockTasks: Task[] = [
  {
    id: 't1',
    title: '全国中学生大会 運営マニュアルの改訂',
    category: '大会運営',
    assignee: 'u1',
    dueDate: '2024-05-15',
    status: '進行中',
    priority: '高',
    description: '安全基準の改定に伴う、メディカルフローの更新を中心としたマニュアル改訂作業。',
    progress: 40,
    risk: false,
    comments: [
      { id: 'c1', author: 'u2', content: 'メディカル部会からのフィードバックを反映済みです。', createdAt: '2024-04-10T10:00:00Z' }
    ]
  },
  {
    id: 't2',
    title: 'U18タレントIDキャンプ 会場手配',
    category: '育成・発掘',
    assignee: 'u2',
    dueDate: '2024-04-30',
    status: '遅延',
    priority: '高',
    description: '菅平のグラウンドおよび宿泊施設の手配。参加見込み：選手80名、スタッフ20名。',
    progress: 80,
    risk: true,
    comments: []
  },
  {
    id: 't3',
    title: '初心者向けタグラグビー普及キット発送',
    category: '普及',
    assignee: 'u3',
    dueDate: '2024-04-20',
    status: '未着手',
    priority: '中',
    description: '全国の小学校・クラブチームへの申請分キット発送業務。',
    progress: 0,
    risk: false,
    comments: []
  },
  {
    id: 't4',
    title: '指導者資格C級講習会（関西エリア）準備',
    category: '指導者育成',
    assignee: 'u3',
    dueDate: '2024-05-10',
    status: '進行中',
    priority: '中',
    description: '関西エリアでの講習会に向けた資料印刷、講師手配、参加者への案内メール送信。',
    progress: 60,
    risk: false,
    comments: []
  },
  {
    id: 't5',
    title: '2025年度 協会登録システムの要件定義',
    category: 'システム・管理',
    assignee: 'u1',
    dueDate: '2024-06-30',
    status: '進行中',
    priority: '高',
    description: 'ベンダーとの定例打ち合わせ、要件定義書のレビューおよび社内部局の要望とりまとめ。',
    progress: 25,
    risk: false,
    comments: []
  }
];

const mockReports: WeeklyReport[] = [
  {
    id: 'r1',
    week: '2024-W15',
    taskId: 't1',
    status: '予定通り',
    achievement: '第1章、第2章のドラフト作成完了。',
    nextPlan: '第3章（メディカル）のドラフト作成と関係部署へのレビュー依頼。',
    risk: '特になし',
    submittedBy: 'u1',
    submittedAt: '2024-04-12T09:00:00Z'
  }
];

const mockApprovals: Approval[] = [
  {
    id: 'a1',
    taskId: 't2',
    requester: 'u2',
    approver: 'u1',
    content: 'U18キャンプ 宿泊施設変更に伴う予算超過（+150,000円）の承認申請',
    status: '申請中',
    requestedAt: '2024-04-14T14:30:00Z',
    comments: []
  },
  {
    id: 'a2',
    taskId: 't3',
    requester: 'u3',
    approver: 'u1',
    content: 'タグラグビーキット追加発注の決裁',
    status: '承認',
    requestedAt: '2024-04-05T10:00:00Z',
    comments: [{ id: 'ac1', author: 'u1', content: '承認しました。速やかに発注を進めてください。', createdAt: '2024-04-05T11:00:00Z' }]
  }
];

const mockKnowledge: Knowledge[] = [
  {
    id: 'k1',
    title: '大会協賛スポンサー向けレポート作成ガイド',
    body: 'スポンサー向けの大会報告書を作成する際のフォーマット、必須項目（観客動員数、メディア露出量など）、および注意事項をまとめています。',
    tags: ['マニュアル', '広報・スポンサー'],
    updatedAt: '2024-03-10T10:00:00Z',
    author: 'u1'
  },
  {
    id: 'k2',
    title: '重大事故発生時の緊急連絡フロー',
    body: '大会や合宿において重傷事故等が発生した際の、現場から協会本部、メディカル委員会、および関係機関への連絡フロー。',
    tags: ['安全対策', '緊急', 'マニュアル'],
    updatedAt: '2024-01-15T09:00:00Z',
    author: 'u1'
  }
];

const AppStateContext = createContext<AppState | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [reports, setReports] = useState<WeeklyReport[]>(mockReports);
  const [approvals, setApprovals] = useState<Approval[]>(mockApprovals);
  const [knowledge, setKnowledge] = useState<Knowledge[]>(mockKnowledge);
  const [users] = useState<User[]>(mockUsers);

  useEffect(() => {
    const savedUser = localStorage.getItem('jrfu_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (users.find(x => x.id === u.id)) {
          setCurrentUser(u);
        }
      } catch (e) {}
    }
  }, [users]);

  const login = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('jrfu_user', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('jrfu_user');
  };

  const addTask = (task: Omit<Task, 'id' | 'comments'>) => {
    const newTask: Task = { ...task, id: `t${Date.now()}`, comments: [] };
    setTasks([newTask, ...tasks]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const addComment = (taskId: string, content: string) => {
    if (!currentUser) return;
    const newComment: Comment = {
      id: `c${Date.now()}`,
      author: currentUser.id,
      content,
      createdAt: new Date().toISOString()
    };
    setTasks(tasks.map(t => t.id === taskId ? { ...t, comments: [...t.comments, newComment] } : t));
  };

  const addReport = (report: Omit<WeeklyReport, 'id' | 'submittedAt'>) => {
    if (!currentUser) return;
    const newReport: WeeklyReport = {
      ...report,
      id: `r${Date.now()}`,
      submittedAt: new Date().toISOString()
    };
    setReports([newReport, ...reports]);
  };

  const updateApproval = (id: string, status: ApprovalStatus, comment?: string) => {
    if (!currentUser) return;
    setApprovals(approvals.map(a => {
      if (a.id === id) {
        const newComments = comment ? [...a.comments, { id: `ac${Date.now()}`, author: currentUser.id, content: comment, createdAt: new Date().toISOString() }] : a.comments;
        return { ...a, status, comments: newComments };
      }
      return a;
    }));
  };

  const addKnowledge = (doc: Omit<Knowledge, 'id' | 'updatedAt' | 'author'>) => {
    if (!currentUser) return;
    const newDoc: Knowledge = {
      ...doc,
      id: `k${Date.now()}`,
      updatedAt: new Date().toISOString(),
      author: currentUser.id
    };
    setKnowledge([newDoc, ...knowledge]);
  };

  return (
    <AppStateContext.Provider value={{
      currentUser, tasks, reports, approvals, knowledge, users,
      login, logout, addTask, updateTask, addComment, addReport, updateApproval, addKnowledge
    }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useAppState must be used within AppStateProvider');
  return context;
}
