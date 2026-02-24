# Color Pour - Viral Sort Game

A highly polished, satisfying, and viral hyper-casual color sorting game built entirely with vanilla web technologies (HTML, CSS, JavaScript). 

Play it directly in your browser: [RaviDandaiya.github.io/Color-Sort-Game](https://RaviDandaiya.github.io/Color-Sort-Game/) *(Note: GitHub pages must be enabled in repo settings to view this link)*

## ✨ Features (Production Ready)

1. **Premium Glassmorphism Aesthetics**: Modern dark mode with semi-transparent, glossy glass tubes and vibrant gradient liquids.
2. **Infinite Procedural Levels**: The game dynamically generates and scales the difficulty of levels infinitely.
3. **Advanced Haptics & Audio (Web Audio API)**: 
   - Satisfying synthetic sound effects natively generated in the browser without external assets (Pouring, Tapping, Win Chimes, Error Buzzes).
   - `navigator.vibrate` integration for mobile devices to literally *feel* the satisfying liquid splashes.
4. **Viral "Micro-interactions"**:
   - Liquid splashes particles on successful pours.
   - Satisfying bright-white "Merge Glows".
   - Bouncy CSS pop-in animations.
5. **Monetization Hooks**: Built-in logic for hyper-casual staples like Rewarded Ads for "Hints" and "Extra Tubes". The hint system logically calculates the next best move and highlights the target tubes!
6. **Mobile First & Responsive**: Scales perfectly to any screen size, complete with landscape-mode optimizations resulting in a fully scrollable, native-feeling app.

## 🛠️ Technology Stack
- **HTML5**: Semantic game structure.
- **CSS3**: 
  - Flexbox layouts.
  - Complex keyframe animations (`@keyframes`).
  - Glassmorphism via `backdrop-filter: blur()`.
  - Media queries for absolute mobile dominance.
- **Vanilla JavaScript (ES6)**: State management, mathematical tube generation, DOM manipulation, and Web Audio API synthesis. Zero external libraries.

## 🚀 How to Play
1. Tap any tube to select the top layer of colored water.
2. Tap another tube with available space to pour the water.
3. Water can only be poured if it matches the color of the receiving tube's top layer.
4. Sort all tubes so each contains exactly one solid color!
5. Tip: Use the **Hint** and **Undo** buttons if you get stuck.

## 📝 Legal
Project includes basic static `Privacy Policy` and `Terms & Conditions` templates linked in the footer.

---
*Created as a prototype for modern viral, hyper-casual game mechanics on the web.*
