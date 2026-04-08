import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components/layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { MyGoals } from './pages/MyGoals';
import { GoalRoadmap } from './pages/GoalRoadmap';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { useAppSelector } from '../app/hooks/reduxHooks';
import type { RootState } from '../app/store';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { useAppDispatch } from '../app/hooks/reduxHooks';
import { checkAuth } from '../app/features/authSlice';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Toaster } from 'sonner';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);
    return !isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

const AppContent = () => {
    return (
        <Routes>
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

            <Route path="/*" element={
                <ProtectedRoute>
                    <DashboardLayout>
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/goals" element={<MyGoals />} />
                            <Route path="/goals/:id" element={<GoalRoadmap />} />
                            <Route path="/history" element={<History />} />
                            <Route path="/settings" element={<Settings />} />
                        </Routes>
                    </DashboardLayout>
                </ProtectedRoute>
            } />
        </Routes>
    );
}

function App() {
    const dispatch = useAppDispatch();
    const { loading, isAuthenticated } = useAppSelector((state: RootState) => state.auth);

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    if (loading && !isAuthenticated) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <Router>
            <Toaster position="top-right" richColors />
            <AppContent />
        </Router>
    );
}

export default App;