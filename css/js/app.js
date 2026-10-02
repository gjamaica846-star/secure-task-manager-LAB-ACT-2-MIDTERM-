const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const loadSamplesBtn = document.getElementById("loadSamplesBtn");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

let taskIdCounter = 1;


// Create one task element
function createTaskElement(taskText, taskId) {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item");

    taskItem.dataset.taskId = taskId;
    taskItem.dataset.state = "pending";

    const taskTextSpan = document.createElement("span");
    taskTextSpan.classList.add("task-text");
    taskTextSpan.textContent = taskText;

    const completeButton = document.createElement("button");
    completeButton.classList.add("complete-btn");
    completeButton.textContent = "Complete";

    const editButton = document.createElement("button");
    editButton.classList.add("edit-btn");
    editButton.textContent = "Edit";

    const removeButton = document.createElement("button");
    removeButton.classList.add("remove-btn");
    removeButton.textContent = "Remove";

    taskItem.appendChild(taskTextSpan);
    taskItem.appendChild(completeButton);
    taskItem.appendChild(editButton);
    taskItem.appendChild(removeButton);

    return taskItem;
}


// Add a new task
function addTask(taskText) {
    const text = taskText.trim();

    if (text === "") {
        taskMessage.textContent = "Task cannot be empty";
        return;
    }

    const taskId = `task-${taskIdCounter}`;
    taskIdCounter++;

    const taskItem = createTaskElement(text, taskId);

    taskList.appendChild(taskItem);

    taskInput.value = "";
    taskMessage.textContent = "";

    updateTaskCounts();
}


// Toggle task completion
function toggleTaskComplete(taskItem) {
    taskItem.classList.toggle("completed");

    if (taskItem.classList.contains("completed")) {
        taskItem.dataset.state = "completed";
    } else {
        taskItem.dataset.state = "pending";
    }

    updateTaskCounts();
}


// Begin editing a task
function beginTaskEdit(taskItem) {
    const taskTextSpan = taskItem.querySelector(".task-text");
    const editButton = taskItem.querySelector(".edit-btn");

    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.classList.add("edit-input");
    editInput.value = taskTextSpan.textContent;

    taskTextSpan.replaceWith(editInput);
    editButton.textContent = "Save";

    editInput.focus();
}


// Save edited task
function saveTaskEdit(taskItem) {
    const editInput = taskItem.querySelector(".edit-input");
    const editText = editInput.value.trim();

    if (editText === "") {
        taskMessage.textContent = "Task cannot be empty";
        editInput.focus();
        return;
    }

    const newTaskText = document.createElement("span");
    newTaskText.classList.add("task-text");
    newTaskText.textContent = editText;

    editInput.replaceWith(newTaskText);

    const editButton = taskItem.querySelector(".edit-btn");
    editButton.textContent = "Edit";

    taskMessage.textContent = "";
}


// Remove a task
function removeTask(taskItem) {
    taskItem.remove();
    updateTaskCounts();
}


// Update task counts
function updateTaskCounts() {
    const tasks = taskList.querySelectorAll(".task-item");

    let pending = 0;
    let completed = 0;

    tasks.forEach((task) => {
        if (task.dataset.state === "completed") {
            completed++;
        } else {
            pending++;
        }
    });

    totalCount.textContent = tasks.length;
    pendingCount.textContent = pending;
    completedCount.textContent = completed;
}


// Handle all task button clicks using event delegation
function handleTaskListClick(event) {
    const clickedButton = event.target;

    const taskItem = clickedButton.closest(".task-item");

    if (!taskItem) {
        return;
    }

    if (clickedButton.classList.contains("complete-btn")) {
        toggleTaskComplete(taskItem);
    }

    if (clickedButton.classList.contains("edit-btn")) {
        if (clickedButton.textContent === "Edit") {
            beginTaskEdit(taskItem);
        } else {
            saveTaskEdit(taskItem);
        }
    }

    if (clickedButton.classList.contains("remove-btn")) {
        removeTask(taskItem);
    }
}


// Load the three required sample tasks
function loadSampleTasks() {
    const fragment = document.createDocumentFragment();

    const sampleTasks = [
        "Review DOM selectors",
        "Practice createElement",
        "Study event delegation"
    ];

    sampleTasks.forEach((taskText) => {
        const taskId = `task-${taskIdCounter}`;
        taskIdCounter++;

        const taskItem = createTaskElement(taskText, taskId);
        fragment.appendChild(taskItem);
    });

    taskList.appendChild(fragment);

    updateTaskCounts();
}


// Button events
addTaskBtn.addEventListener("click", () => {
    addTask(taskInput.value);
});

loadSamplesBtn.addEventListener("click", loadSampleTasks);


// Allow Enter key to add a task
taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTask(taskInput.value);
    }
});


// Exactly one delegated click listener for task actions
taskList.addEventListener("click", handleTaskListClick);


// Make sure the initial counts are correct
updateTaskCounts();
