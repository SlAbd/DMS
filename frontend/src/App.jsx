import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Shield, User, Truck, Home } from "lucide-react"

// Admin
import AdminDashboard from './pages/admin/dashbored';
// Livreur
import LivreurDashboard from './pages/livreur/dashboard';
// Client
import ClientDashboard from './pages/client/dashboard';

import Navbar from './components/projet/navbar';
import LoginForm from './pages/Login';
import RegisterForm from './pages/Register';
import OrdersPage from './pages/admin/orders';
import DriversPage from './pages/admin/drivers';
import NavbarLivreur from './components/projet/navbarLivreur';

// Nouvelles pages
import LivreurPage from './pages/livreur/LivreurPage';
import HomePage from './pages/HomePage';
import LivreurHome from './pages/livreur/LivreurHome';
import Sidebar from './components/projet/sidebar';

export default function App() {
    return (
        <Router>
            <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<LoginForm />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterForm />} />

                {/* Page d'accueil livreur */}
                <Route path="/livreur" element={<LivreurHome />} />

                <Route path="/admin/orders" element={
                    <> 
                       
                        <OrdersPage />
                    </> 
                } />

                <Route path="/admin/drivers" element={
                    <> 
                        
                        <DriversPage  />
                    </> 
                } />  

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={
                    <>
                        
                        <AdminDashboard />
                    </>
                } />

                {/* Livreur Routes avec authentification normale */}
                <Route path="/livreur/dashboard" element={
                    <>
                        <NavbarLivreur />
                        <LivreurDashboard />
                    </>
                } />

                {/* Nouvelle route pour livreur sans auth - accès par ID */}
                <Route path="/livreur/:livreurId" element={
                    <>
                        <NavbarLivreur />
                        <LivreurPage />
                    </>
                } />

                {/* Client Routes */}
                <Route path="/client/dashboard" element={
                    <>
                        <ClientDashboard />
                    </>
                } />
                
            </Routes>
            
        </Router>
        
    );
}