import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import { logout } from './api';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        logout();
        setUser(null);
    };

    return (
        <Router>
            <div>
                <nav className="navbar">
                    <h2>HostelOps</h2>
                    <ul>
                        {user ? (
                            <>
                                <li>Welcome, {user.name} ({user.role})</li>
                                <li>
                                    <button onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/login">Login</Link>
                                </li>
                                <li>
                                    <Link to="/register">Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>

                <div className="container">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                user ? (
                                    user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/student" />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                        <Route
                            path="/login"
                            element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />}
                        />
                        <Route
                            path="/register"
                            element={!user ? <Register onLogin={handleLogin} /> : <Navigate to="/" />}
                        />
                        <Route
                            path="/student"
                            element={user && user.role === 'student' ? <StudentDashboard /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/admin"
                            element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />}
                        />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
