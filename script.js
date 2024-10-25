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

    // Common code for all pages 
    
});