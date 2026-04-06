import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './components/layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { MyGoals } from './pages/MyGoals';
import { GoalRoadmap } from './pages/GoalRoadmap';

function App() {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/goals" element={<MyGoals />} />
          <Route path="/goals/:id" element={<GoalRoadmap />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App;