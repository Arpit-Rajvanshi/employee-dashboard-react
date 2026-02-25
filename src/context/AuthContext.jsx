import { createContext, useContext, useState, useMemo, useCallback } from 'react';

/*
 * Auth Context
 * ------------
 * Lightweight auth layer using Context API + sessionStorage.
 * In production you'd swap the hardcoded check for a real API call,
 * but the pattern (context → provider → hook) stays the same.
 */

// Hardcoded credentials per assignment spec
const VALID_USERNAME = 'testuser';
const VALID_PASSWORD = 'Test123';
const SESSION_KEY = 'dashboard_authenticated';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    // Hydrate from sessionStorage so a page refresh doesn't log the user out
    const [authenticated, setAuthenticated] = useState(
        () => sessionStorage.getItem(SESSION_KEY) === 'true'
    );

    /**
     * Attempt login. Returns `{ success, message }` so the Login page
     * can show an appropriate error without try/catch ceremony.
     */
    const login = useCallback((username, password) => {
        if (username === VALID_USERNAME && password === VALID_PASSWORD) {
            sessionStorage.setItem(SESSION_KEY, 'true');
            setAuthenticated(true);
            return { success: true };
        }

        return {
            success: false,
            message: 'Invalid username or password. Please try again.',
        };
    }, []);

    const logout = useCallback(() => {
        sessionStorage.removeItem(SESSION_KEY);
        setAuthenticated(false);
    }, []);

    // Memoise value to avoid unnecessary re-renders in consumers
    const value = useMemo(
        () => ({ isAuthenticated: authenticated, login, logout }),
        [authenticated, login, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook — gives any component access to `{ isAuthenticated, login, logout }`.
 * Throws if used outside the provider so bugs surface immediately.
 */
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
    return ctx;
}
