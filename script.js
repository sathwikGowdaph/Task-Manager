// DOM elements
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('task');
const deadlineInput = document.getElementById('deadline');
const urgencyInput = document.getElementById('urgencyTask');
const importanceInput = document.getElementById('importanceTask');
const taskList = document.getElementById('taskList');

// Load tasks from localStorage
const loadTasks = () => {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  taskList.innerHTML = '';  // Clear current task list

  tasks.forEach((task, index) => {
    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item');
    taskItem.innerHTML = `
      <div class="task-details">
        <strong>${task.task}</strong><br>
        <em>Deadline: ${task.deadline}</em><br>
        <small>Urgency: ${task.urgency} | Importance: ${task.importance}</small>
      </div>
      <div class="task-actions">
        <button class="edit-btn" data-index="${index}">Edit</button>
        <button class="delete-btn" data-index="${index}">Delete</button>
      </div>
    `;
    taskList.appendChild(taskItem);
  });

  // Attach event listeners for edit and delete buttons
  const editButtons = document.querySelectorAll('.edit-btn');
  const deleteButtons = document.querySelectorAll('.delete-btn');

  editButtons.forEach((btn) => {
    btn.addEventListener('click', editTask);
  });

  deleteButtons.forEach((btn) => {
    btn.addEventListener('click', deleteTask);
  });
};

// Save tasks to localStorage
const saveTasks = (tasks) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Add Task Event
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const task = taskInput.value;
  const deadline = deadlineInput.value;
  const urgency = urgencyInput.value;
  const importance = importanceInput.value;

  // Validate input fields
  if (!task || !deadline) {
    alert("Please fill in all fields.");
    return;
  }

  // Get tasks from localStorage or initialize as empty array
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Add the new task
  tasks.push({ task, deadline, urgency, importance });

  // Save updated tasks
  saveTasks(tasks);

  // Clear input fields
  taskInput.value = '';
  deadlineInput.value = '';
  urgencyInput.value = 'Low';
  importanceInput.value = 'Low';

  // Refresh task list
  loadTasks();
});

// Edit Task
const editTask = (e) => {
  const index = e.target.getAttribute('data-index');
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Fill form with task data for editing
  const taskToEdit = tasks[index];
  taskInput.value = taskToEdit.task;
  deadlineInput.value = taskToEdit.deadline;
  urgencyInput.value = taskToEdit.urgency;
  importanceInput.value = taskToEdit.importance;

  // Remove task from the list (it will be added again after editing)
  tasks.splice(index, 1);
  saveTasks(tasks);

  // Refresh task list after editing
  loadTasks();
};

// Delete Task
const deleteTask = (e) => {
  const index = e.target.getAttribute('data-index');
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Remove task from array
  tasks.splice(index, 1);

  // Save updated tasks
  saveTasks(tasks);

  // Refresh task list
  loadTasks();
};

// Initial load of tasks
loadTasks();
let tasks = [];
let timers = {};
let timeCounters = {};
let points = 0;
let streak = 0;
let level = 1;

// === Update UI Stats ===
const updateUI = () => {
  document.getElementById('points').innerText = points;
  document.getElementById('streak').innerText = streak;
  document.getElementById('level').innerText = level;
};

// === Add Points and Update Level ===
const addPoints = (value) => {
  points += value;
  if (points % 50 === 0) level++;
  updateUI();
};

// === Update Streak ===
const updateStreak = () => {
  streak++;
  updateUI();
};

// === Start Timer for a Task ===
const startTimer = (index) => {
  timeCounters[index] = 0;
  timers[index] = setInterval(() => {
    timeCounters[index]++;
    document.getElementById(`timer-${index}`).innerText = formatTime(timeCounters[index]);
  }, 1000);
};

// === Format Time HH:MM:SS ===
const formatTime = (seconds) => {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
};

// === Complete Task ===
// === User Stats ===
let userStats = JSON.parse(localStorage.getItem('userStats')) || {
  points: 0,
  level: 1,
  streak: 0,
  lastCompletedDate: null
};

// === Save Stats ===
const saveUserStats = () => {
  localStorage.setItem('userStats', JSON.stringify(userStats));
  updateUI();
};

// === Update Navigation Bar ===
const UI = () => {
  document.getElementById('points').innerText = userStats.points;
  document.getElementById('level').innerText = userStats.level;
  document.getElementById('streak').innerText = userStats.streak;
};

// === Add Points & Level ===
const addPoint = (amount) => {
  userStats.points += amount;
  userStats.level = Math.floor(userStats.points / 100) + 1;
  saveUserStats();
};

// === Update Streak ===
const updateStrea = () => {
  const today = new Date().toLocaleDateString();
  const lastDate = userStats.lastCompletedDate;
  if (lastDate === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString();

  if (lastDate === yesterdayStr) {
    userStats.streak += 1;
  } else {
    userStats.streak = 1;
  }
  userStats.lastCompletedDate = today;
  saveUserStats();
};

// === Timer Logic ===
const startTime = (timerElement) => {
  let seconds = 0;
  const interval = setInterval(() => {
    seconds++;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    timerElement.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, 1000);
  return interval;
};

// === Complete Task ===
const completeTask = (btn, timerElement, interval) => {
  clearInterval(interval);
  timerElement.classList.add('completed');
  addPoints(50);
  updateStreak();
  btn.textContent = 'Completed!';
  btn.disabled = true;
};

// === Render Tasks Dynamically ===
const task = [
  { name: 'Project Work', points: 50 },
  { name: 'Write Report', points: 50 },
  { name: 'Upload Files', points: 50 }
];

const renderTasks = () => {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';
  tasks.forEach((task) => {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task';

    const taskName = document.createElement('p');
    taskName.textContent = task.name;

    const timer = document.createElement('span');
    timer.className = 'timer';
    timer.textContent = '0:00';

    const completeBtn = document.createElement('button');
    completeBtn.className = 'complete-btn';
    completeBtn.textContent = 'Complete';

    // Start timer for this task
    const interval = startTimer(timer);

    completeBtn.addEventListener('click', () => completeTask(completeBtn, timer, interval));

    taskDiv.appendChild(taskName);
    taskDiv.appendChild(timer);
    taskDiv.appendChild(completeBtn);
    taskList.appendChild(taskDiv);
  });
};

// Initialize
renderTasks();
updateUI();
