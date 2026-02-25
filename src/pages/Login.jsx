import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Login Page
 * ----------
 * Simple credentials form with client-side validation against
 * hardcoded values. In a real app this would hit an auth API.
 */
export default function Login() {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [shake, setShake] = useState(false);

    // If already logged in, bounce straight to the dashboard.
    // Using useEffect instead of a render-time navigate to avoid
    // "Cannot update a component while rendering" warnings.
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    function handleSubmit(e) {
        e.preventDefault();
        setError('');

        // Basic presence validation before hitting the auth layer
        if (!username.trim() || !password.trim()) {
            triggerError('Please fill in both fields.');
            return;
        }

        const result = login(username.trim(), password);

        if (result.success) {
            navigate('/dashboard', { replace: true });
        } else {
            triggerError(result.message);
        }
    }

    /** Show error with a brief shake animation for tactile feedback. */
    function triggerError(msg) {
        setError(msg);
        setShake(true);
        setTimeout(() => setShake(false), 500);
    }

    // Don't render the form if already authenticated (redirect is pending)
    if (isAuthenticated) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-100 px-4">
            <div
                className={`card w-full max-w-md p-8 transition-transform ${shake ? 'animate-[shake_0.4s_ease-in-out]' : ''
                    }`}
            >
                {/* Brand header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-indigo-600">EmployeeHub</h1>
                    <p className="text-sm text-slate-500 mt-1">Sign in to your dashboard</p>
                </div>

                {/* Error banner — only visible when there's an error */}
                {error && (
                    <div className="mb-5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Username */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1.5">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            autoComplete="username"
                            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm
                         placeholder:text-slate-400 focus:outline-none focus:ring-2
                         focus:ring-indigo-500/40 focus:border-indigo-500 transition-shadow"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm
                         placeholder:text-slate-400 focus:outline-none focus:ring-2
                         focus:ring-indigo-500/40 focus:border-indigo-500 transition-shadow"
                        />
                    </div>

                    <button type="submit" className="btn-primary w-full py-3">
                        Sign In
                    </button>
                </form>

                <p className="mt-6 text-center text-xs text-slate-400">
                    Demo credentials — <span className="font-medium">testuser</span> / <span className="font-medium">Test123</span>
                </p>
            </div>

            {/* Keyframe for the shake animation */}
            <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%      { transform: translateX(-8px); }
          40%      { transform: translateX(8px); }
          60%      { transform: translateX(-4px); }
          80%      { transform: translateX(4px); }
        }
      `}</style>
        </div>
    );
}
