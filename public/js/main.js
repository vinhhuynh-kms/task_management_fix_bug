document.addEventListener('DOMContentLoaded', function() {
    var dashboardIconLink = document.getElementById('dashboardIconLink');
    if (dashboardIconLink) {
        dashboardIconLink.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default anchor behavior
            console.log("Redirecting to dashboard...");
            try {
                window.location.href = '/dashboard'; // Redirect to the dashboard page
            } catch (error) {
                console.error("Error redirecting to dashboard:", error.message, error.stack);
            }
        });
    } else {
        console.log("Dashboard icon link not found.");
    }
});