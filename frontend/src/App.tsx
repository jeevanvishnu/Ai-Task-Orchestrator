import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
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
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;