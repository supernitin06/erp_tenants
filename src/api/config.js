/**
 * Where the backend lives.
 *  - Production (Vercel): the deployed backend on Render.
 *  - Local development: set VITE_API_BASE_URL in .env (e.g. http://localhost:5000/api/v1).
 * A deployed site never uses a localhost URL, even if one was baked into the build.
 */
export const PRODUCTION_API_BASE_URL = 'https://multitenant-uv76.onrender.com/api/v1';

const isLocalUrl = (url) => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/.test(url || '');
const runningLocally = ['localhost', '127.0.0.1'].includes(window.location.hostname);

const configured = import.meta.env.VITE_API_BASE_URL;

export const API_BASE_URL =
    configured && (runningLocally || !isLocalUrl(configured))
        ? configured
        : PRODUCTION_API_BASE_URL;

// Session token (also set as an httpOnly cookie). Sent as a Bearer header because
// browsers like Safari block the cross-site cookie between vercel.app and onrender.com.
const TOKEN_KEY = 'auth_token';
export const getAuthToken = () => {
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
};
export const setAuthToken = (token) => {
    try {
        if (token) localStorage.setItem(TOKEN_KEY, token);
        else localStorage.removeItem(TOKEN_KEY);
    } catch { /* storage unavailable */ }
};
