import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth';

// Admin
import AdminDashboard from './pages/admin/Dashboard';
// Livreur
import LivreurDashboard from './pages/livreur/Dashboard';
// Client
import ClientDashboard from './pages/client/Dashboard';

import Navbar from './components/projet/navbar';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Auth />} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={
                    <>
                        <Navbar />
                        <AdminDashboard />
                    </>
                } />

                {/* Livreur Routes */}
                <Route path="/livreur/dashboard" element={
                    <>
                        <Navbar />
                        <LivreurDashboard />
                    </>
                } />

                {/* Client Routes */}
                <Route path="/client/dashboard" element={
                    <>
                        <Navbar />
                        <ClientDashboard />
                    </>
                } />
            </Routes>
        </Router>
    );
}
