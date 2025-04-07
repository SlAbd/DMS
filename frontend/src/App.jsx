import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Navbar from './components/projet/navbar';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={
            <>
              <Navbar />
              <Dashboard />
            </>
          }
 />
      </Routes>
    </Router>
  );
}
