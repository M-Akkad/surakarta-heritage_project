const LOGIN_PAGE = 'login.html';
const APP_PAGE = 'index.html';
const STATS_PAGE = 'statistics.html';

document.addEventListener('DOMContentLoaded', () => {
    const token = getToken();
    const user = getUser();
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === LOGIN_PAGE) {
        if (token) {
            window.location.href = APP_PAGE;
            return;
        }
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }
    } else {
        // Protected pages
        if (!token) {
            window.location.href = LOGIN_PAGE;
            return;
        }

        // Role-based access for statistics page
        if (currentPage === STATS_PAGE && user && user.role !== 'admin') {
            alert('Access Denied: You do not have permission to view this page.');
            window.location.href = APP_PAGE;
            return;
        }
        
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', handleLogout);
        }

        // Hide stats link for non-admins if it exists
        const statsNavLink = document.querySelector(`a[href="${STATS_PAGE}"]`);
        if (statsNavLink && user && user.role !== 'admin') {
            statsNavLink.style.display = 'none';
        }
    }
});

async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginErrorElement = document.getElementById('loginError');

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                username: username,
                password: password,
            })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('accessToken', data.access_token);
            
            // Fetch user details to get role (simplified - ideally token contains role or separate /me endpoint)
            // For now, let's assume we can decode the token or fetch user info
            // This is a placeholder, actual role fetching might differ
            const decodedToken = parseJwt(data.access_token); // You'll need a JWT parsing function
            if (decodedToken && decodedToken.sub) { // Assuming 'sub' contains username
                 // In a real app, you'd fetch /api/users/me or similar with the token
                 // For now, we'll simulate a user object. The README implies staff/admin roles.
                 // We don't have a direct way to get role from login, so this is an approximation.
                 let role = 'staff'; // Default to staff
                 if (decodedToken.sub.toLowerCase().includes('admin')) { // Simple check
                    role = 'admin';
                 }
                 localStorage.setItem('user', JSON.stringify({ username: decodedToken.sub, role: role }));
            } else {
                // Fallback if token doesn't have expected structure or no direct user info
                // The backend specifies Staff and Admin. Let's assume a way to differentiate or default.
                localStorage.setItem('user', JSON.stringify({ username: username, role: (username.toLowerCase().includes('admin') ? 'admin' : 'staff') }));
            }

            window.location.href = APP_PAGE;
        } else {
            const errorData = await response.json().catch(() => null);
            loginErrorElement.textContent = errorData?.detail || 'Login failed. Please check your credentials.';
            loginErrorElement.style.display = 'block';
        }
    } catch (error) {
        console.error('Login error:', error);
        loginErrorElement.textContent = 'An error occurred during login. Please try again.';
        loginErrorElement.style.display = 'block';
    }
}

function handleLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('pendingTickets'); // Clear any pending tickets on logout
    window.location.href = LOGIN_PAGE;
}

function getToken() {
    return localStorage.getItem('accessToken');
}

function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Basic JWT parser (not for verification, just for payload extraction)
function parseJwt (token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

// Function to make authenticated API calls
async function fetchWithAuth(url, options = {}) {
    const token = getToken();
    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
    };

    if (!(options.body instanceof FormData) && typeof options.body === 'object' && options.body !== null) {
        headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(options.body);
    }
    
    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) { // Unauthorized
        handleLogout(); // Token might be expired or invalid
        throw new Error('Unauthorized');
    }
    return response;
} 