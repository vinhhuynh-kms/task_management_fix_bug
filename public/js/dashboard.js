document.addEventListener('DOMContentLoaded', function() {
    const tasksList = document.getElementById('tasksList');
    const taskForm = document.getElementById('taskForm');
    const taskNameInput = document.getElementById('taskName');
    const taskDescriptionInput = document.getElementById('taskDescription');
    const taskDueDateInput = document.getElementById('taskDueDate');

    // Function to get the JWT token from local storage
    const getToken = () => localStorage.getItem('token');

    // Fetch tasks and render them
    const fetchTasks = async () => {
        try {
            const token = getToken();
            const response = await fetch('/tasks', { // Updated endpoint
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch tasks');
            const tasks = await response.json();
            tasksList.innerHTML = tasks.map(task => `
                <li class="task-item">
                    <strong>Name:</strong> ${task.name} <br>
                    <strong>Description:</strong> ${task.description} <br>
                    <strong>Due Date:</strong> ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'} <br>
                    <strong>Status:</strong> ${task.status} <br>
                    <button onclick="deleteTask('${task._id}')">Delete</button>
                    <button onclick="openUpdateTaskModal('${task._id}')">Update</button>
                    <button onclick="toggleTaskStatus('${task._id}', '${task.status}')">
                        ${task.status === 'complete' ? 'Mark Incomplete' : 'Mark Complete'}
                    </button>
                </li>
            `).join('');
        } catch (error) {
            console.error('Error fetching tasks:', error);
            alert('Error fetching tasks. Please check the console for more details.');
        }
    };

    // Add new task
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        // Client-side validation
        if (!taskNameInput.value.trim() || !taskDescriptionInput.value.trim()) {
            alert('Task name and description are required.');
            return; // Stop the form submission
        }
        try {
            const token = getToken();
            const response = await fetch('/tasks', { // Updated endpoint for consistency
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: taskNameInput.value,
                    description: taskDescriptionInput.value,
                    dueDate: taskDueDateInput.value
                })
            });
            if (!response.ok) throw new Error('Failed to add task');
            taskNameInput.value = '';
            taskDescriptionInput.value = '';
            taskDueDateInput.value = '';
            fetchTasks(); // Refresh the list
            console.log('Task successfully added.');
        } catch (error) {
            console.error('Error adding task:', error);
            alert('Error adding task. Please check the console for more details.');
        }
    });

    // Delete task with confirmation
    window.deleteTask = async (taskId) => {
        const confirmDelete = confirm("Are you sure you want to delete this task?");
        if (confirmDelete) {
            try {
                const token = getToken();
                const response = await fetch(`/tasks/${taskId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) throw new Error('Failed to delete task');
                fetchTasks(); // Refresh the list
                console.log(`Task with ID ${taskId} successfully deleted.`);
            } catch (error) {
                console.error('Error deleting task:', error);
                alert('Error deleting task. Please check the console for more details.');
            }
        }
    };

    // Function to open a modal or prompt to update task
    window.openUpdateTaskModal = async (taskId) => {
        const taskName = prompt("Enter new task name:");
        const taskDescription = prompt("Enter new task description:");
        const taskDueDate = prompt("Enter new due date (YYYY-MM-DD):");
        if (taskName && taskDescription && taskDueDate) {
            updateTask(taskId, { name: taskName, description: taskDescription, dueDate: taskDueDate });
        }
    };

    // Function to handle task updates
    const updateTask = async (taskId, updatedData) => {
        try {
            const token = getToken();
            const response = await fetch(`/tasks/${taskId}`, {
                method: 'PUT', // Switch to PATCH request
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            });
            if (!response.ok) throw new Error('Failed to update task');
            fetchTasks(); // Refresh the list
            console.log(`Task with ID ${taskId} successfully updated.`);
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Error updating task. Please check the console for more details.');
        }
    };

    // Toggle task status
    window.toggleTaskStatus = async (taskId, status) => {
        try {
            const token = getToken();
            const response = await fetch(`/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: status === 'complete' ? 'incomplete' : 'complete' })
            });
            if (!response.ok) throw new Error('Failed to update task status');
            fetchTasks(); // Refresh the list
            console.log(`Task status for ID ${taskId} successfully updated.`);
        } catch (error) {
            console.error('Error updating task status:', error);
            alert('Error updating task status. Please check the console for more details.');
        }
    };

    // Initial fetch of tasks
    fetchTasks();
});