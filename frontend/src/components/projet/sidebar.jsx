import { BarChart2, LogOut, Package, Truck } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const navItems = [
        { path: '/admin/dashboard', label: 'Gestion des Livraisons', icon: BarChart2 },
        { path: '/admin/orders', label: 'Gestion des Colis', icon: Package },
        { path: '/admin/drivers', label: 'Gestion des Livreurs', icon: Truck },
    ];

    const handleSignOut = () => {
        // Clear token and user info from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Navigate to login page
        navigate('/');
    };

    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
            {/* Logo Section */}
            <div className="p-6 border-b border-gray-200">
                <Link to="/" className="flex items-center space-x-3">
                    <Package className="h-8 w-8 text-blue-600" />
                    <span className="text-xl font-bold text-gray-900">TrDeL</span>
                </Link>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 p-4">
                <div className="space-y-2">
                    {navItems.map(({ path, label, icon: Icon }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                location.pathname === path 
                                    ? "bg-blue-100 text-blue-700" 
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            <Icon className="h-5 w-5" />
                            <span>{label}</span>
                        </Link>
                    ))}
                </div>
            </nav>

            {/* Sign Out Button */}
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    <span className="text-sm">Déconnecté</span>
                </button>
            </div>
        </aside>
    );
}