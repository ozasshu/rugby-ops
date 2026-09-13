import React from 'react';
import { Link, useLocation } from 'wouter';
import { useAppState } from '@/lib/app-state';
import { cn, Button } from '@/components/ui/core';
import { 
  LayoutDashboard, 
  CheckSquare, 
  FileText, 
  TrendingUp, 
  Stamp, 
  BookOpen, 
  Users, 
  BarChart, 
  Map, 
  Upload, 
  Settings,
  LogOut,
  Bell
} from 'lucide-react';

const navigation = [
  { name: 'ホーム', href: '/', icon: LayoutDashboard },
  { name: '業務タスク', href: '/tasks', icon: CheckSquare },
  { name: '週報提出', href: '/reports', icon: FileText },
  { name: '進捗確認', href: '/progress', icon: TrendingUp },
  { name: '承認・決裁', href: '/approvals', icon: Stamp },
  { name: 'ナレッジ', href: '/knowledge', icon: BookOpen },
  { name: '業務負荷', href: '/workload', icon: BarChart },
  { name: '登録状況', href: '/registrations', icon: Users },
  { name: '分布マップ', href: '/heatmap', icon: Map },
  { name: 'データ取込', href: '/imports', icon: Upload },
  { name: 'ユーザー管理', href: '/users', icon: Settings },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { currentUser, logout, approvals } = useAppState();

  const pendingApprovalsCount = approvals.filter(a => a.approver === currentUser?.id && a.status === '申請中').length;

  if (!currentUser) return <>{children}</>;

  return (
    <div className="flex h-screen bg-muted/30 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar text-sidebar-foreground flex flex-col shadow-xl z-10 hidden md:flex no-print">
        <div className="p-4 border-b border-sidebar-border/30 flex items-center gap-3">
          <div className="w-8 h-8 bg-sidebar-primary rounded-md flex items-center justify-center text-white font-bold text-lg">
            J
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight text-white">JRFU 普及育成</h1>
            <p className="text-xs text-sidebar-foreground/70">業務管理システム</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {navigation.map((item) => {
              const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href));
              const isApprovals = item.href === '/approvals';
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive 
                      ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon 
                    className={cn(
                      "mr-3 flex-shrink-0 h-5 w-5",
                      isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/70 group-hover:text-sidebar-accent-foreground"
                    )} 
                  />
                  {item.name}
                  {isApprovals && pendingApprovalsCount > 0 && (
                    <span className={cn(
                      "ml-auto inline-block py-0.5 px-2 text-xs rounded-full",
                      isActive ? "bg-white text-sidebar-primary" : "bg-destructive text-white"
                    )}>
                      {pendingApprovalsCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-sidebar-border/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sm font-medium">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
              <p className="text-xs text-sidebar-foreground/70 truncate">{currentUser.role}</p>
            </div>
            <button onClick={logout} className="p-1.5 text-sidebar-foreground/70 hover:text-white rounded-md hover:bg-sidebar-accent" title="ログアウト">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header (mobile + desktop) */}
        <header className="h-14 bg-card border-b flex items-center justify-between px-4 sm:px-6 shadow-sm z-10 no-print">
          <div className="flex items-center md:hidden">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">
              J
            </div>
            <span className="ml-2 font-bold text-sm">JRFU 業務管理</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <span>{new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-muted-foreground hover:text-foreground">
              <Bell className="w-5 h-5" />
              {pendingApprovalsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-white"></span>
              )}
            </button>
            <div className="md:hidden flex items-center gap-2">
               <button onClick={logout} className="text-muted-foreground">
                 <LogOut className="w-5 h-5" />
               </button>
            </div>
          </div>
        </header>

        {/* Main scrollable area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
