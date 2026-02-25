import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Navbar — persistent top bar on authenticated pages.
 * Shows the app name and a logout button. Kept intentionally simple
 * so it doesn't compete with the page content for attention.
 */
export default function Navbar() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate('/login', { replace: true });
    }

    return (
        <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
                <h1
                    className="text-lg font-bold text-indigo-600 cursor-pointer select-none"
                    onClick={() => navigate('/dashboard')}
                >
                    EmployeeHub
                </h1>

                <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}
