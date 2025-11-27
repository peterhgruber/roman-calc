// --- Core Conversion Logic ---

// Function to convert Roman numeral string to an integer
function romanToInt(s) {
    const romanMap = {
        'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000
    };
    let total = 0;

    for (let i = 0; i < s.length; i++) {
        const current = romanMap[s[i]];
        const next = romanMap[s[i + 1]];

        // Handle the subtractive principle (e.g., IV = 4, IX = 9)
        if (next > current) {
            total += next - current;
            i++; // Skip the next character
        } else {
            total += current;
        }
    }
    return total;
}

// Function to convert an integer to a Roman numeral string
function intToRoman(num) {
    if (num < 1 || num > 3999) return "ERROR"; // Standard Roman limit is 3999

    const valueMap = [
        [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'],
        [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'],
        [5, 'V'], [4, 'IV'], [1, 'I']
    ];

    let roman = '';
    for (const [value, symbol] of valueMap) {
        while (num >= value) {
            roman += symbol;
            num -= value;
        }
    }
    return roman;
}


// --- Calculator Interaction Logic ---

const display = document.getElementById('display');
const buttons = document.querySelector('.buttons');

let currentInput = '';
let previousValue = 0;
let operator = null;
let awaitingNewInput = false;

// Update the display, enforcing Roman numerals
function updateDisplay(value) {
    display.textContent = value || '0';
}

buttons.addEventListener('click', (event) => {
    if (!event.target.closest('button')) return;

    const button = event.target;
    const value = button.getAttribute('data-value');
    const action = button.getAttribute('data-action');

    // 1. Numeral Input (I, V, X, L, C, D, M)
    if (button.classList.contains('numeral')) {
        if (awaitingNewInput) {
            currentInput = value;
            awaitingNewInput = false;
        } else {
            currentInput += value;
        }
        updateDisplay(currentInput);
    }

    // 2. Clear (AC)
    else if (action === 'clear') {
        currentInput = '';
        previousValue = 0;
        operator = null;
        awaitingNewInput = false;
        updateDisplay('0');
    }

    // 3. Operator (+, -)
    else if (button.classList.contains('operator')) {
        if (currentInput) {
            if (previousValue !== 0 && operator) {
                // If there's a previous calculation pending, execute it first
                calculate();
            } else {
                previousValue = romanToInt(currentInput);
            }
            operator = action;
            awaitingNewInput = true;
        }
    }

    // 4. Calculate (=)
    else if (action === 'calculate') {
        calculate();
        operator = null; // Clear the operator after calculation
    }
});

// Function to perform the calculation
function calculate() {
    if (!operator || !currentInput) return;

    const currentValue = romanToInt(currentInput);
    let result = 0;

    switch (operator) {
        case 'add':
            result = previousValue + currentValue;
            break;
        case 'subtract':
            result = previousValue - currentValue;
            break;
        default:
            return;
    }

    // Convert the integer result back to Roman numerals for the display
    currentInput = intToRoman(result);

    // If the result is 'ERROR' (e.g., negative or too large), reset state
    if (currentInput === "ERROR") {
        updateDisplay("Error/Too Big");
        currentInput = '';
        previousValue = 0;
        operator = null;
    } else {
        previousValue = result; // Store the integer value for the next operation
        updateDisplay(currentInput);
    }
    awaitingNewInput = true;
}