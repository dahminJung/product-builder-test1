const themeToggleBtn = document.getElementById('theme-toggle');
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');

// --- Theme toggle logic ---
function setTheme(isDark) {
    if (isDark) {
        document.body.classList.add('dark-mode');
        themeToggleBtn.textContent = '☀️ 라이트 모드';
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        themeToggleBtn.textContent = '🌙 다크 모드';
        localStorage.setItem('theme', 'light');
    }
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    setTheme(true);
} else if (savedTheme === 'light') {
    setTheme(false);
} else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark);
}

themeToggleBtn.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark-mode');
    setTheme(isDark);
});

// --- Study Planner logic ---
let tasks = JSON.parse(localStorage.getItem('study_tasks')) || [];

function saveTasks() {
    localStorage.setItem('study_tasks', JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'task-content';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(index));
        
        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;
        
        contentDiv.appendChild(checkbox);
        contentDiv.appendChild(span);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '삭제';
        deleteBtn.addEventListener('click', () => deleteTask(index));
        
        li.appendChild(contentDiv);
        li.appendChild(deleteBtn);
        
        taskList.appendChild(li);
    });
}

function addTask() {
    const text = taskInput.value.trim();
    if (text) {
        tasks.push({ text: text, completed: false });
        taskInput.value = '';
        saveTasks();
        renderTasks();
    }
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Initial render
renderTasks();
