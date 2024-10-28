document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname; // Get the current page path

         
    // code specific to INDEX.HTML  / root   

    if (currentPage.includes('index.html') || currentPage === '/') {
    // toggle form display
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const toggleSignupButton = document.getElementById('toggle-signup');
    const toggleLoginButton = document.getElementById('toggle-login');

    // Initially show the login form
    signupForm.classList.add('hidden');

    // Event listener for toggling to the signup form
    toggleSignupButton.addEventListener('click', function () {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    });

    // Event listener for toggling back to the login form
    toggleLoginButton.addEventListener('click', function () {
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });
    
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
        
            // Check if the response is not successful
            if (!response.ok) {
                const errorMessage = await response.text(); // Attempt to read the error message as text
                console.log('Error message from server:', errorMessage); // Log the error message for debugging

                    // Display a specific error message for "Incorrect password"
                    if (errorMessage.includes('Incorrect password')) {
                        alert('Incorrect password');
                    } else {
                        alert(errorMessage || 'Login failed'); // Show the returned error or a default message
                    }
                } else {
                    // If login is successful, redirect to the dashboard
                    window.location.href = '/dashboard.html';
                }
            } catch (error) {
                console.error('Error during login:', error);
                alert('An unexpected error occurred during login.'); // Display an alert for unexpected errors
            }
        });

        // for signing up
        // Get the submit button
        const submitButton = document.getElementById('signup-submit');

        // Add an event listener to the submit button
        submitButton.addEventListener('click', async (event) => {
            event.preventDefault(); // Prevent the default form submission

            console.log('current page', currentPage);

            // Get the input values from the form
            const username = document.getElementById('new-username').value;
            const password = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            console.log('username', username);
            console.log('pw', password);
            console.log('cpw', confirmPassword);

            // Validate that the passwords match
            if (password !== confirmPassword) {
                alert('Passwords must match'); // Show alert if passwords do not match
                return; // Stop the execution if passwords do not match
            }

            // Proceed with signup
            try {
                const response = await fetch('/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' // Set content type to JSON
                    },
                    body: JSON.stringify({ username, password }) // Send the username and password as JSON
                });

                const data = await response.json(); // Parse the JSON response
                if (response.ok && data.success) {
                    // Redirect to the provided URL
                    window.location.href = data.redirectUrl;
                } else {
                    alert(data.message || 'Error during signup'); // Display error message
                }
            } catch (error) {
                console.error('Error during signup:', error);
            }
        });
        
    }
    
    // specific to DASHBOARD.HTML
    if (currentPage.includes('dashboard.html')) {
        
        // add new button (on dashboard)
        document.getElementById('add-list-btn').addEventListener('click', function() {
        window.location.href = 'list-detail.html'; // Navigate to list-detail.html
        });

        // Function to fetch and display the most recent list
        async function fetchRecentList() {
            try {
                const response = await fetch('/api/recent-list');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const list = await response.json();
                displayList(list);
            } catch (error) {
                console.error('Error fetching recent list:', error);
                document.getElementById('list-details').textContent = 'Could not load the recent list.';
            }
        }

        // Function to fetch and display all list titles
        async function fetchAllLists() {
            try {
                const response = await fetch('/api/lists');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const lists = await response.json();
                const titlesList = document.getElementById('list-titles');
                titlesList.innerHTML = ''; // Clear existing titles

                lists.forEach(list => {
                    const listItem = document.createElement('li');
                    listItem.textContent = list.title;
                    listItem.onclick = () => displayList(list); // Add click event to display the selected list
                    titlesList.appendChild(listItem);
                });
            } catch (error) {
                console.error('Error fetching all lists:', error);
                document.getElementById('all-lists').textContent = 'Could not load lists.';
            }
        }

        // Function to display the selected list
        function displayList(list) {
            document.getElementById('list-title').textContent = list.title;
            const taskList = document.getElementById('task-list');
            taskList.innerHTML = ''; // Clear any existing tasks

            list.tasks.forEach((task) => {
                console.log('Task data:', task); // Log task data to see its structure

                const listItem = document.createElement('li');
                listItem.textContent = task; // Directly set text content since task is a string
                listItem.dataset.taskId = task._id; // Store the task ID in a data attribute if available

                // Add styles for completed tasks
                if (task.completed) { // Check if the task is already marked as complete
                    listItem.classList.add('completed');
                    listItem.style.textDecoration = 'line-through';
                    listItem.style.fontStyle = 'italic';
                    listItem.style.opacity = '0.7'; // 70% transparency
                }

                // Add click event to toggle complete status
                listItem.addEventListener('click', async () => {
                    const isComplete = listItem.classList.toggle('completed');
                    const taskId = listItem.dataset.taskId; // Get the task ID from the data attribute
                    await updateTaskStatus(taskId, isComplete);

                    // Update styles based on completion
                    if (isComplete) {
                        listItem.style.textDecoration = 'line-through';
                        listItem.style.fontStyle = 'italic';
                        listItem.style.opacity = '0.7'; // 70% transparency
                    } else {
                        listItem.style.textDecoration = 'none';
                        listItem.style.fontStyle = 'normal';
                        listItem.style.opacity = '1'; // Reset to full opacity
                    }
                });

                taskList.appendChild(listItem);
            });
        }

        // Function to update the task status in the database
        async function updateTaskStatus(taskId, isComplete) {
            try {
                const response = await fetch(`/api/tasks/${taskId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ completed: isComplete })
                });
                if (!response.ok) {
                    throw new Error('Failed to update task status');
                }
                // Optionally, you can handle UI changes based on success
            } catch (error) {
                console.error('Error updating task status:', error);
            }
        }

        // Call the functions to fetch the recent list and all lists when the page loads
        window.onload = () => {
            fetchRecentList();
            fetchAllLists();
        };
    }

    // specific to LIST-DETAIL.HTML
    if (currentPage.includes('list-detail.html')) {

        // save list button functionality
        document.getElementById('save-list').addEventListener('click', async () => {
            const title = document.getElementById('title').value;
            const tasks = Array.from(document.querySelectorAll('#task-list li')).map(li => li.textContent);
          
            // Prepare the data to be sent to the server
            const listData = {
              title: title,
              tasks: tasks
            };
          
            try {
              const response = await fetch('/create-list', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(listData)
              });
          
              const result = await response.json(); // Assuming your server responds with JSON
              if (response.ok) {
                alert('List saved successfully!');
                // Optionally redirect to another page
                window.location.href = '/dashboard.html'; // Redirect to dashboard after saving
              } else {
                alert('Failed to save the list: ' + result.message);
              }
            } catch (error) {
              console.error('Error saving list:', error);
            }
          });

        // cancel button functionality for create list
        document.getElementById('cancel').addEventListener('click', function() {
        window.location.href = 'dashboard.html'; // Navigate to list-detail.html
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

    // specific to PROFILE.HTML

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

    // Common code for all pages 
    
});