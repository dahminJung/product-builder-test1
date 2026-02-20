const display = document.getElementById('number-display');
const btn = document.getElementById('generate-btn');

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
