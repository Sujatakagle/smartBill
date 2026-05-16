import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import History from './pages/History';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { token, loading } = React.useContext(AuthContext);
  if (loading) return <div className="min-h-[70vh] flex items-center justify-center">Loading...</div>;
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app min-h-screen bg-slate-50 text-slate-900">
          <Navbar />
          <main className="container mx-auto px-4 pb-16 pt-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/upload" element={<PrivateRoute><Upload /></PrivateRoute>} />
              <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
