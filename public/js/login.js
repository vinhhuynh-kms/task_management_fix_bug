document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || 'Login failed');
            }

            const data = await response.json();
            if (!data.token) {
                throw new Error('No token found, redirecting to login.');
            }
            localStorage.setItem('token', data.token);
            console.log('Login successful, token stored in local storage');

            window.location.href = '/dashboard';
        } catch (error) {
            console.error('Login error:', error.message, error.stack);
            alert(error.message || 'Login failed. Please check your credentials and try again.');
        }
    });
});