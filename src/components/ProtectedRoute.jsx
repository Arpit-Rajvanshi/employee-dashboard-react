import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — wraps any route that requires authentication.
 * If the user isn't logged in, they're sent back to /login.
 * Uses <Navigate replace> so the login page replaces the protected
 * URL in history, preventing a back-button loop.
 */
export default function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
