# My Calculator

A responsive four-function calculator made with HTML, CSS, and vanilla JavaScript. It supports mouse and keyboard input, decimals, sign changes, backspace, chained calculations, and friendly handling of division by zero.

## Run locally

1. Download or clone this project.
2. Open `index.html` in a modern web browser.

No build tools or package installation are required. An internet connection is needed to load the Font Awesome icon stylesheet from its CDN.

## Features

- Addition, subtraction, multiplication, and division
- Decimal input, clear, backspace, and positive/negative toggle
- Chained operations and using a result in the next calculation
- Keyboard: digits, `.`, `+`, `-`, `*`, `/`, Enter or `=`, Backspace, Escape, and Delete
- Responsive keypad, visible keyboard focus, and reduced-motion support
- Safe arithmetic without `eval()`, with rounded display values for common floating-point precision artifacts
- Font Awesome icons loaded from the cdnjs CDN

## Project files

- `index.html` — accessible calculator structure and keys
- `style.css` — layout, colors, states, and responsive styling
- `script.js` — calculator state, arithmetic, button events, and keyboard events
