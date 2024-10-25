document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname; // Get the current page path

    // Code specific to dashboard.html
    if (currentPage.includes('dashboard.html')) {
        
        // add new button (on dashboard)
    document.getElementById('add-list-btn').addEventListener('click', function() {
        window.location.href = 'listDetail.html'; // Navigate to listDetail.html
    });

    // Code specific to listDetail.html
    } else if (currentPage.includes('listDetail.html')) {
        // cancel button for create list
        document.getElementById('cancel').addEventListener('click', function() {
        window.location.href = 'dashboard.html'; // Navigate to listDetail.html
    });
    }

    // Common code for all pages 
    
});