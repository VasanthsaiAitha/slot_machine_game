const SYMBOLS_COUNT = { "A": 2, "B": 4, "C": 3, "D": 8 };
const SYMBOLS_Value = { "A": 5, "B": 2, "C": 7, "D": 4 };

let balance = 0;

const depositButton = document.getElementById("depositButton");
const depositAmountInput = document.getElementById("depositAmount");
const balanceDisplay = document.getElementById("balance");
const spinButton = document.getElementById("spinButton");
const linesInput = document.getElementById("lines");
const betAmountInput = document.getElementById("betAmount");
const resultDisplay = document.getElementById("result");
const playAgainDisplay = document.getElementById("playAgain");
const rows = [document.getElementById("row1"), document.getElementById("row2"), document.getElementById("row3")];

const deposit = () => {
    const depositAmount = parseFloat(depositAmountInput.value);
    if (isNaN(depositAmount) || depositAmount <= 0) {
        alert("Invalid deposit amount");
    } else {
        balance = depositAmount;
        balanceDisplay.textContent = "$" + balance;
        depositAmountInput.value = "";
        depositAmountInput.disabled = true;
        depositButton.disabled = true;
    }
};

const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0; i < 3; i++) {
        const reelSymbols = [...symbols];
        reels.push([]);
        for (let j = 0; j < 3; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
};

const transpose = (reels) => {
    const transposed = [];
    for (let i = 0; i < 3; i++) {
        transposed.push(reels.map(reel => reel[i]));
    }
    return transposed;
};

const printRows = (rowsData) => {
    rowsData.forEach((rowData, index) => {
        rows[index].textContent = rowData.join(" | ");
    });
};

const getWinnings = (rowsData, bet, lines) => {
    let winnings = 0;
    for (let row = 0; row < lines; row++) {
        const symbols = rowsData[row];
        let allSame = true;
        for (const symbol of symbols) {
            if (symbol !== symbols[0]) {
                allSame = false;
                break;
            }
        }
        if (allSame) {
            winnings += bet * SYMBOLS_Value[symbols[0]];
        }
    }
    return winnings;
};

spinButton.addEventListener("click", () => {
    const lines = parseInt(linesInput.value);
    const bet = parseFloat(betAmountInput.value);
    if (isNaN(bet) || bet <= 0 || bet * lines > balance) {
        alert("Invalid bet amount");
        return;
    }

    balance -= bet * lines;
    balanceDisplay.textContent = "$" + balance;

    const reels = spin();
    const rowsData = transpose(reels);
    printRows(rowsData);

    const winnings = getWinnings(rowsData, bet, lines);
    balance += winnings;
    balanceDisplay.textContent = "$" + balance;

    resultDisplay.textContent = "You won: $" + winnings;

    if (balance <= 0) {
        playAgainDisplay.textContent = "You ran out of money!";
        spinButton.disabled = true;
    } else {
        playAgainDisplay.textContent = "Do you want to play again?";
    }
});

depositButton.addEventListener("click", deposit);
