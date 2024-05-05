document.addEventListener('DOMContentLoaded', function() {
  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
    logoutButton.addEventListener('click', function(e) {
      e.preventDefault();
      fetch('/auth/logout', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin' // Ensures cookies are sent with the request
      })
      .then(response => {
        if (response.ok) {
          console.log('Logout successful.');
          window.location.href = '/auth/login?logout=true';
        } else {
          throw new Error('Failed to logout');
        }
      })
      .catch(error => {
        console.error('Logout Error:', error.message, error.stack);
        alert('An error occurred while trying to logout. Please try again.');
      });
    });
  }
});