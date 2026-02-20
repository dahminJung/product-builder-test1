const display = document.getElementById('number-display');
const btn = document.getElementById('generate-btn');
const themeToggleBtn = document.getElementById('theme-toggle');

// Theme toggle logic
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

// Check saved theme or system preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    setTheme(true);
} else if (savedTheme === 'light') {
    setTheme(false);
} else {
    // Check system preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark);
}

themeToggleBtn.addEventListener('click', () => {
    const isDark = !document.body.classList.contains('dark-mode');
    setTheme(isDark);
});

function generateNumbers() {
    const numbers = [];
    while (numbers.length < 6) {
        const n = Math.floor(Math.random() * 45) + 1;
        if (!numbers.includes(n)) {
            numbers.push(n);
        }
    }
    return numbers.sort((a, b) => a - b);
}

btn.addEventListener('click', () => {
    const luckyNumbers = generateNumbers();
    display.innerHTML = '';
    luckyNumbers.forEach(num => {
        const ball = document.createElement('div');
        ball.className = 'ball';
        ball.textContent = num;
        display.appendChild(ball);
    });
});
