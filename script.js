document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname; // Get the current page path

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

        
        

        // Save List button functionality
        // document.getElementById('save').addEventListener('click', function() {
        //     const tasks = Array.from(taskList.children).map(li => li.textContent); // Get all tasks
        //     tasksInput.value = JSON.stringify(tasks); // Convert tasks to JSON string and set it to hidden input
        //     document.getElementById('edit-list').submit(); // Submit the form
        // });

    }


    // code specific to index.html for toggling forms
    if (currentPage.includes('index.html')) {
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');
        const signupButton = document.getElementById('sign-up');

        // hide signup form initially
        signupForm.style.display = 'none';

        // show signup form when "sign up" is clicked
        signupButton.addEventListener('click', function() {
            loginForm.style.display = 'none'; // hide login form
            signupForm.style.display = 'block'; // show signup form
        });

        // create and show cancel btn
        const cancelButton = document.createElement('button'); // create cancel button
        cancelButton.textContent = 'Cancel'; // set button text
        cancelButton.id = 'cancel-signup'; // give it an id
        signupForm.appendChild(cancelButton); // add button to signup form

        // go back to login when cancel is clicked
        cancelButton.addEventListener('click', function() {
            signupForm.style.display = 'none'; // hide signup form
            loginForm.style.display = 'block'; // show login form
        });
    }

    // Common code for all pages 
    
});