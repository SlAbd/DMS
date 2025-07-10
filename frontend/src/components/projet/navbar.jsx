import { BarChart2, LogOut, Package, Truck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar(){
    const navigate = useNavigate();
      const navItems = [
        { path: '/', label: 'Dashboard', icon: BarChart2 },
        { path: '/orders', label: 'Orders', icon: Package },
        { path: '/drivers', label: 'Drivers', icon: Truck },
      ];

      const handleSignOut = () => {
        // Clear token and user info from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Navigate to login page
        navigate('/');
      };
    return (
       <nav className="bg-white shadow-lg">
         <div className="container mx-auto px-4">
           <div className="flex items-center justify-between h-16">
             <div className="flex items-center">
               <Link to="/" className="flex items-center space-x-2">
                 <Package className="h-8 w-8 text-blue-600" />
                 <span className="text-xl font-bold text-gray-900">DeliveryMS</span>
               </Link>
             </div>

             <div className="flex items-center space-x-4">
               <div className="flex space-x-4">
                 {navItems.map(({ path, label, icon: Icon }) => (
                   <Link
                     key={path}
                     to={path}
                     className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                       location.pathname === path
                         ? 'bg-blue-100 text-blue-700'
                         : 'text-gray-600 hover:bg-gray-100'
                     }`}
                   >
                     <Icon className="h-5 w-5" />
                     <span>{label}</span>
                   </Link>
                 ))}
               </div>

               <div className="flex items-center space-x-4">
                 <span className="text-sm text-gray-600"></span>
                 <button
                   onClick={handleSignOut}
                   className="flex items-center space-x-1 text-gray-600 hover:text-red-600"
                 >
                   <LogOut className="h-5 w-5" />
                   <span className="text-sm">Sign Out</span>
                 </button>
               </div>
             </div>
           </div>
         </div>
       </nav>
     );
}
