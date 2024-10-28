document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname; // Get the current page path

    document.addEventListener('DOMContentLoaded', () => {
        fetch('/api/user') // API endpoint to fetch user session data
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('User not logged in');
            })
            .then(data => {
                document.getElementById('username-display').textContent = data.username;
                document.getElementById('created-at-display').textContent = new Date(data.created_at).toLocaleDateString();
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    });

    // specific to dashboard.html
    if (currentPage.includes('dashboard.html')) {
        
        // add new button (on dashboard)
        document.getElementById('add-list-btn').addEventListener('click', function() {
        window.location.href = 'listDetail.html'; // Navigate to listDetail.html
        });
    }

    // specific to listDetail.html
    if (currentPage.includes('listDetail.html')) {

        // cancel button for create list
        document.getElementById('cancel').addEventListener('click', function() {
        window.location.href = 'dashboard.html'; // Navigate to listDetail.html
        });

        // display task input vars
        const addTaskInput = document.getElementById('add-task');
        const taskList = document.getElementById('task-list');
        const tasksInput = document.getElementById('tasks');

        // listen for task inputs + enter
        addTaskInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                const taskText = addTaskInput.value.trim(); // Get the current value of the input
                if (taskText) {
                    // Create a new list item and append it to the task list
                    const listItem = document.createElement('li');
                    listItem.textContent = taskText;
                    taskList.appendChild(listItem);
                    
                    addTaskInput.value = ''; // Clear the input field after adding
                }
                event.preventDefault(); // Prevent default form submission
            }
        });
    }

    // specific to profile.html

    if (currentPage.includes('profile.html')) {
        // get user data to display
        fetch('/api/user') // API endpoint to fetch user session data
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('User not logged in');
            })
            .then(data => {
                document.getElementById('username-display').textContent = data.username;
                document.getElementById('created-at-display').textContent = new Date(data.created_at).toLocaleDateString();
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                // Optionally redirect to the home page if user not logged in
                window.location.href = '/'; 
            });

        // Handle password update form submission
        document.getElementById('update-PW').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        const newPassword = document.getElementById('new-PW').value;
        const confirmPassword = document.getElementById('confirm-PW').value;

        // Validate that the new password is provided
        if (!newPassword) {
            alert('New password is required');
            return;
        }

        // Validate that the passwords match
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // Send a request to update the password
        fetch('/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newPassword })
        })
        .then(response => {
            if (response.ok) {
                alert('Password updated successfully');
                
                // Reset the form fields
                document.getElementById('new-PW').value = '';
                document.getElementById('confirm-PW').value = '';
            } else {
                alert('Error updating password');
            }
        })
        .catch(error => {
            console.error('Error during password update:', error);
        });
    });

        // Delete account functionality
        document.getElementById('delete-account-btn').addEventListener('click', function() {
            if (confirm('Are you sure you want to permanently delete your account?')) {
                // If user confirms, send delete request
                fetch('/delete-account', { method: 'DELETE' })
                    .then(response => {
                        if (response.ok) {
                            alert('Success, account deleted.');
                            window.location.href = 'index.html'; // Redirect to index.html
                        } else {
                            alert('Failed to delete account.');
                        }
                    })
                    .catch(error => {
                        console.error('Error deleting account:', error);
                        alert('Failed to delete account.');
                    });
            }
        });
    }

    // code specific to index.html        
    
        //for toggling forms
    if (currentPage.includes('index.html')) {
        // for logging in
        document.getElementById('login').addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent the default form submission
        
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
        
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' // Set content type to JSON
                    },
                    body: JSON.stringify({ username, password }) // Send the username and password as JSON
                });
        
                const data = await response.text(); // Read the response
        
                if (response.ok) {
                    alert(data); // Display success message
                    // Optionally, redirect to a dashboard or another page
                } else {
                    alert(data); // Display error message
                }
            } catch (error) {
                console.error('Error during login:', error);
            }
        });

    }

    // Common code for all pages 
    
});