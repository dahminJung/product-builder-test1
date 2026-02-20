// Theme toggle logic
const themeToggleBtn = document.getElementById('theme-toggle');

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

// Planner Data Management
const DATA_KEY = 'planner_data_v2';

let plannerData = JSON.parse(localStorage.getItem(DATA_KEY)) || {
    month: '',
    day: '',
    dDay: '',
    plannedH: '',
    plannedM: '',
    actualH: '',
    actualM: '',
    tasks: [
        { id: 1, text: '', completed: false },
        { id: 2, text: '', completed: false },
        { id: 3, text: '', completed: false },
        { id: 4, text: '', completed: false },
        { id: 5, text: '', completed: false }
    ],
    timeGrid: {}, // format: "hour-index": true/false
    review: ''
};

function saveData() {
    localStorage.setItem(DATA_KEY, JSON.stringify(plannerData));
}

// Bind header inputs
const bindInput = (id, key) => {
    const el = document.getElementById(id);
    if(el) {
        el.value = plannerData[key];
        el.addEventListener('input', (e) => {
            plannerData[key] = e.target.value;
            saveData();
        });
    }
};

bindInput('month-input', 'month');
bindInput('day-input', 'day');
bindInput('d-day-input', 'dDay');
bindInput('planned-h', 'plannedH');
bindInput('planned-m', 'plannedM');
bindInput('actual-h', 'actualH');
bindInput('actual-m', 'actualM');
bindInput('review-input', 'review');

// Task List Management
const taskListEl = document.getElementById('task-list');
const addTaskBtn = document.getElementById('add-task-btn');

function renderTasks() {
    taskListEl.innerHTML = '';
    plannerData.tasks.forEach((task, index) => {
        const row = document.createElement('div');
        row.className = `task-row ${task.completed ? 'completed' : ''}`;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', (e) => {
            plannerData.tasks[index].completed = e.target.checked;
            saveData();
            renderTasks(); // re-render to apply line-through
        });

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'task-input';
        input.value = task.text;
        input.placeholder = '할 일을 입력하세요';
        input.addEventListener('input', (e) => {
            plannerData.tasks[index].text = e.target.value;
            saveData();
        });

        const delBtn = document.createElement('button');
        delBtn.className = 'delete-task-btn';
        delBtn.innerHTML = '×';
        delBtn.addEventListener('click', () => {
            plannerData.tasks.splice(index, 1);
            saveData();
            renderTasks();
        });

        row.appendChild(checkbox);
        row.appendChild(input);
        row.appendChild(delBtn);
        taskListEl.appendChild(row);
    });
}

addTaskBtn.addEventListener('click', () => {
    plannerData.tasks.push({ id: Date.now(), text: '', completed: false });
    saveData();
    renderTasks();
});

// Time Grid Management
const timeGridBody = document.getElementById('time-grid-body');
const hours = Array.from({length: 24}, (_, i) => (i + 5) % 24); // 05 to 04

let isDragging = false;
let dragValue = true; // true if turning on, false if turning off

function renderTimeGrid() {
    timeGridBody.innerHTML = '';
    
    // Prevent default drag behavior to allow custom drag selection
    timeGridBody.addEventListener('dragstart', (e) => e.preventDefault());

    hours.forEach((hour) => {
        const row = document.createElement('div');
        row.className = 'time-grid-row';

        const hourCell = document.createElement('div');
        hourCell.className = 'time-hour';
        hourCell.textContent = hour.toString().padStart(2, '0');
        row.appendChild(hourCell);

        for (let min = 0; min < 6; min++) {
            const cell = document.createElement('div');
            cell.className = 'time-cell';
            const cellKey = `${hour}-${min}`;
            
            // Set cell data attribute to easily identify it during touchmove
            cell.dataset.key = cellKey;

            if (plannerData.timeGrid[cellKey]) {
                cell.classList.add('active');
            }

            // Mouse events for drag to paint (Desktop)
            cell.addEventListener('mousedown', (e) => {
                isDragging = true;
                dragValue = !plannerData.timeGrid[cellKey];
                updateCell(cell, cellKey, dragValue);
            });

            cell.addEventListener('mouseenter', (e) => {
                if (isDragging) {
                    updateCell(cell, cellKey, dragValue);
                }
            });

            // Touch events (Mobile)
            cell.addEventListener('touchstart', (e) => {
                // Prevent scrolling while painting
                if (e.cancelable) e.preventDefault();
                isDragging = true;
                dragValue = !plannerData.timeGrid[cellKey];
                updateCell(cell, cellKey, dragValue);
            }, { passive: false });

            row.appendChild(cell);
        }
        timeGridBody.appendChild(row);
    });
}

function updateCell(cell, cellKey, value) {
    if (plannerData.timeGrid[cellKey] !== value) {
        plannerData.timeGrid[cellKey] = value;
        cell.classList.toggle('active', value);
        saveData();
    }
}

// Handle touch dragging across cells (Mobile smooth drag)
timeGridBody.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.cancelable) e.preventDefault(); // Prevent scrolling while dragging
    
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (target && target.classList.contains('time-cell')) {
        const cellKey = target.dataset.key;
        if (cellKey) {
            updateCell(target, cellKey, dragValue);
        }
    }
}, { passive: false });

document.addEventListener('mouseup', () => { isDragging = false; });
document.addEventListener('touchend', () => { isDragging = false; });
document.addEventListener('touchcancel', () => { isDragging = false; });


// Initial Render
renderTasks();
renderTimeGrid();