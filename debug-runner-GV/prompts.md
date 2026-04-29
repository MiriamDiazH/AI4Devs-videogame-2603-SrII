## Prompt 1: Initial game generation

Create a complete browser game called "Debug Runner".

Concept:
It is an endless runner game where the player controls a cursor moving through a line of code.

Gameplay:

- The character moves automatically from left to right.
- The player can press SPACE to jump.
- Obstacles appear (bugs like "null", "undefined", "ERROR").
- Collectable items increase score.
- Speed increases over time.
- The game ends when the player hits an obstacle.

Technical requirements:

- Use only HTML, CSS and vanilla JavaScript.
- use the files that exist in debug-runner-GV folder.
- Use simple shapes or text instead of images.
- Include collision detection.
- Include score system.
- Include restart button.
- Responsive layout.
- Clean and modular code.

Visual style:

- Dark theme (developer terminal style)
- Neon colors (green, blue, purple)
- Monospace font

## Prompt 2: Lane runner refinement

Improve the current Debug Runner game and transform it into a simplified Subway Surfers-style lane runner.

Keep the same concept and files, but update the gameplay:

- The game must have 3 lanes: left, center and right.
- The player should run forward automatically.
- The player can move between lanes using left and right arrow keys.
- The player can jump using SPACE or the up arrow key.
- Obstacles should appear randomly in any of the 3 lanes.
- Collectable items should also appear randomly in lanes.
- Collision should happen only when the player is in the same lane as the obstacle and is not jumping.
- Score should increase over time and with collectables.
- Speed should increase gradually.
- Add a clear Game Over state and a restart button.

Visual improvements:

- Make the game look like a futuristic developer terminal.
- Add perspective to the lanes to make it feel like the player is running forward.
- Use neon colors, glowing effects and monospace typography.
- Add small animated code fragments in the background.
- Keep it responsive and playable in desktop browsers.

Use only HTML, CSS and vanilla JavaScript.
Keep the code clean, readable and modular.

## Prompt 3: Local ranking system

Improve the current Debug Runner game by adding a local ranking system.

Requirements:

- Save the player's score when the game ends.
- Ask the player to enter their name after Game Over.
- Store the best scores using localStorage.
- Show a ranking table with the top 5 scores.
- Sort scores from highest to lowest.
- Keep the ranking after refreshing the page.
- Add a "Clear ranking" button.
- If the player does not enter a name, use "Anonymous".
- Keep the existing gameplay working exactly as it is.
- Use only HTML, CSS and vanilla JavaScript.
- Keep the code clean, readable and modular.
