document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form');

  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    // Get the user input from the form
    const username = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;
    const email = document.querySelector('input[name="email"]').value; // Assuming the HTML form has an email input field

    // Simple client-side validation example
    if (!username || !password || !email) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      // Send a POST request to the server with the user input
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        // If the server responds with a bad status, parse and show the error
        const errorData = await response.json();
        alert(`Registration failed: ${errorData.message}`);
      } else {
        // If registration is successful, redirect the user to the login page
        console.log('Registration successful, redirecting to login page.');
        window.location.href = '/auth/login';
      }
    } catch (error) {
      // Catch and show any error that occurred during the fetch operation
      console.error('Registration error:', error.message, error.stack);
      alert('An error occurred during registration. Please try again.');
    }
  });
});