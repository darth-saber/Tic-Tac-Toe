const board = document.getElementById("board");
const status = document.getElementById("status");
const resetButton = document.getElementById("reset");
const modeButton = document.getElementById("mode-select");
const themeButton = document.getElementById("theme-toggle");
const undoButton = document.getElementById("undo");
let currentPlayer = "X";
let gameBoard = Array(9).fill("");
let gameActive = true;
let vsAI = false;
let history = [];
let scores = { X: 0, O: 0 };

function createBoard() {
    board.innerHTML = "";
    gameBoard.forEach((value, index) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = index;
        cell.textContent = value;
        if (value) cell.classList.add("disabled");
        cell.addEventListener("click", handleClick);
        board.appendChild(cell);
    });
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]
    ];
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            gameActive = false;
            status.textContent = `${gameBoard[a]} Wins! 🎉`;
            pattern.forEach(index => document.querySelector(`[data-index='${index}']`).classList.add('highlight'));
            scores[gameBoard[a]]++;
            updateScores();
            return;
        }
    }
    if (!gameBoard.includes("")) {
        status.textContent = "It's a Draw! 🤝";
        gameActive = false;
    }
}

function handleClick(e) {
    const index = e.target.dataset.index;
    if (gameBoard[index] || !gameActive) return;
    gameBoard[index] = currentPlayer;
    history.push([...gameBoard]);
    createBoard();
    checkWinner();
    if (gameActive) {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        status.textContent = `Turn: ${currentPlayer}`;
    }
    if (vsAI && gameActive && currentPlayer === "O") setTimeout(aiMove, 500);
}

function aiMove() {
    let emptyCells = gameBoard.map((val, i) => val === "" ? i : null).filter(v => v !== null);
    if (emptyCells.length === 0 || !gameActive) return;
    let move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    gameBoard[move] = "O";
    history.push([...gameBoard]);
    createBoard();
    checkWinner();
    currentPlayer = "X";
}

function resetGame() {
    gameBoard.fill("");
    history = [];
    gameActive = true;
    currentPlayer = "X";
    status.textContent = "";
    createBoard();
}

function updateScores() {
    document.getElementById("scoreX").textContent = scores.X;
    document.getElementById("scoreO").textContent = scores.O;
}

createBoard();
resetButton.addEventListener("click", resetGame);
modeButton.addEventListener("click", () => { vsAI = !vsAI; modeButton.textContent = vsAI ? "Switch to Player vs Player" : "Switch to Player vs AI"; resetGame(); });
themeButton.addEventListener("click", () => document.body.classList.toggle("light-mode"));
