import { type ReactNode } from 'react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AppStateProvider, useAppState } from '@/lib/app-state';

// Layout & Pages
import { Layout } from '@/components/layout';
import Login from '@/pages/login';
import Home from '@/pages/home';
import Tasks from '@/pages/tasks';
import TaskDetail from '@/pages/task-detail';
import Reports from '@/pages/reports';
import Progress from '@/pages/progress';
import Approvals from '@/pages/approvals';
import Knowledge from '@/pages/knowledge';
import Workload from '@/pages/workload';
import Registrations from '@/pages/registrations';
import Heatmap from '@/pages/heatmap';
import Imports from '@/pages/imports';
import Users from '@/pages/users';
const NotFound = () => <div className="p-8 text-center text-xl">ページが見つかりません。</div>;

const queryClient = new QueryClient();

function Router() {
  const [location] = useLocation();
  const { currentUser } = useAppState();
  const isLogin = location === '/login';

  if (!currentUser) {
    return (
      <RoutedErrorBoundary>
        <Login />
      </RoutedErrorBoundary>
    );
  }

  const content = (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={Home} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/tasks/:id" component={TaskDetail} />
      <Route path="/reports" component={Reports} />
      <Route path="/progress" component={Progress} />
      <Route path="/approvals" component={Approvals} />
      <Route path="/knowledge" component={Knowledge} />
      <Route path="/workload" component={Workload} />
      <Route path="/registrations" component={Registrations} />
      <Route path="/heatmap" component={Heatmap} />
      <Route path="/imports" component={Imports} />
      <Route path="/users" component={Users} />
      <Route component={NotFound} />
    </Switch>
  );

  return (
    <RoutedErrorBoundary>
      {isLogin ? content : <Layout>{content}</Layout>}
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppStateProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
        </AppStateProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
