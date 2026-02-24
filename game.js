const COLOR_PALETTE = {
    'red': '#ef4444',
    'blue': '#3b82f6',
    'green': '#10b981',
    'yellow': '#f59e0b',
    'purple': '#8b5cf6',
    'pink': '#ec4899',
    'orange': '#f97316',
    'cyan': '#06b6d4',
};

const TUBE_CAPACITY = 4;

class Game {
    constructor() {
        this.level = 1;
        this.tubes = [];
        this.selectedTubeIndex = null;
        this.moveHistory = [];
        this.isAnimating = false;

        this.audioEnabled = true;
        this.audioCtx = null;

        this.boardElement = document.getElementById('gameBoard');
        this.levelDisplay = document.getElementById('levelDisplay');
        this.winModal = document.getElementById('winModal');
        this.playerNameDisplay = document.getElementById('playerName');
        this.tutorialTip = document.getElementById('tutorialTip');

        this.initPlayer();
        this.initLevel();
    }

    initPlayer() {
        let playerName = localStorage.getItem('colorSortPlayerName');
        if (!playerName) {
            const prefixes = ['Pro', 'Master', 'Lord', 'Dr', 'Captain', 'Ninja'];
            const names = ['Sorter', 'Pourer', 'Mixer', 'Brain', 'Liquid', 'Genius'];
            playerName = `${prefixes[Math.floor(Math.random() * prefixes.length)]}${names[Math.floor(Math.random() * names.length)]}${Math.floor(Math.random() * 999)}`;
            localStorage.setItem('colorSortPlayerName', playerName);
        }
        this.playerNameDisplay.textContent = playerName;

        this.playerNameDisplay.onclick = () => {
            const newName = prompt("Enter your player name:", playerName);
            if (newName && newName.trim().length > 0) {
                playerName = newName.trim().substring(0, 15);
                localStorage.setItem('colorSortPlayerName', playerName);
                this.playerNameDisplay.textContent = playerName;
            }
        };
    }

    initAudio() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    toggleAudio() {
        this.audioEnabled = !this.audioEnabled;
        const btn = document.getElementById('audioToggle');
        btn.textContent = this.audioEnabled ? '🔊' : '🔇';
    }

    playSound(type) {
        if (!this.audioEnabled) return;
        this.initAudio();

        const osc = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();

        osc.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);

        const now = this.audioCtx.currentTime;

        if (type === 'tap') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } else if (type === 'pour') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.linearRampToValueAtTime(450, now + 0.3);
            gainNode.gain.setValueAtTime(0.05, now);
            gainNode.gain.linearRampToValueAtTime(0.1, now + 0.15);
            gainNode.gain.linearRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (type === 'error') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
        } else if (type === 'win') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(440, now); // A4
            osc.frequency.setValueAtTime(554.37, now + 0.1); // C#5
            osc.frequency.setValueAtTime(659.25, now + 0.2); // E5
            osc.frequency.setValueAtTime(880, now + 0.3); // A5

            gainNode.gain.setValueAtTime(0.05, now);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.6);

            osc.start(now);
            osc.stop(now + 0.6);
        }
    }

    // Haptic Feedback for mobile
    vibrate(type) {
        // Check if navigator.vibrate is supported
        if (!navigator.vibrate) return;

        if (type === 'tap') {
            navigator.vibrate(10); // tiny bump
        } else if (type === 'pour') {
            navigator.vibrate([20, 30, 20]); // satisfying ripple
        } else if (type === 'error') {
            navigator.vibrate(100); // long buzz
        } else if (type === 'win') {
            navigator.vibrate([50, 50, 50, 50, 100]); // ta-da
        }
    }

    // Splash Particle Effect
    createSplash(tubeIndex, color) {
        const containers = this.boardElement.children;
        const targetTube = containers[tubeIndex];

        // Ensure color exists
        if (!COLOR_PALETTE[color]) return;

        // Spawn 8 tiny particles
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'splash-particle';
            particle.style.backgroundColor = COLOR_PALETTE[color];

            // Random direction
            const angle = Math.random() * Math.PI * 2;
            const velocity = 20 + Math.random() * 30; // 20-50px spread
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity - 20; // bias slightly upwards

            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);

            // Start near the top center of the tube
            particle.style.left = '45%';
            particle.style.top = '10px';

            particle.style.animation = `flySplash 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;

            targetTube.querySelector('.tube').appendChild(particle);

            // Cleanup
            setTimeout(() => {
                particle.remove();
            }, 500);
        }
    }

    initLevel() {
        this.selectedTubeIndex = null;
        this.moveHistory = [];
        this.isAnimating = false;
        this.levelDisplay.textContent = this.level;
        this.winModal.classList.add('hidden');

        if (this.level === 1) {
            this.tutorialTip.classList.remove('hidden');
        } else {
            this.tutorialTip.classList.add('hidden');
        }

        // Difficulty scaling
        const numColors = Math.min(3 + Math.floor(this.level / 2), 8); // Max 8 colors
        const numEmptyTubes = 2;
        const totalTubes = numColors + numEmptyTubes;

        this.generateTubes(numColors, totalTubes);
        this.renderBoard();
    }

    generateTubes(numColors, totalTubes) {
        // 1. Get available colors
        const colorKeys = Object.keys(COLOR_PALETTE).slice(0, numColors);

        // 2. Create a flat array of all water segments needed
        const unmixedColors = [];
        for (let i = 0; i < numColors; i++) {
            for (let j = 0; j < TUBE_CAPACITY; j++) {
                unmixedColors.push(colorKeys[i]);
            }
        }

        // 3. Shuffle colors
        for (let i = unmixedColors.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [unmixedColors[i], unmixedColors[j]] = [unmixedColors[j], unmixedColors[i]];
        }

        // 4. Fill tubes
        this.tubes = [];
        for (let i = 0; i < totalTubes; i++) {
            const tube = [];
            if (i < numColors) {
                for (let j = 0; j < TUBE_CAPACITY; j++) {
                    tube.push(unmixedColors.pop());
                }
            }
            this.tubes.push(tube);
        }
    }

    renderBoard(newTubeIndex = null, mergeGlowTubeIndex = null) {
        // Initialize DOM only if the number of tubes changes (or first run)
        if (this.boardElement.children.length !== this.tubes.length) {
            this.boardElement.innerHTML = '';
            this.tubes.forEach((tube, index) => {
                const tubeContainer = document.createElement('div');
                tubeContainer.className = 'tube-container';
                tubeContainer.onclick = () => this.handleTubeClick(index);

                const tubeDiv = document.createElement('div');
                tubeDiv.className = 'tube';

                const waterDiv = document.createElement('div');
                waterDiv.className = 'water';

                tubeDiv.appendChild(waterDiv);
                tubeContainer.appendChild(tubeDiv);
                this.boardElement.appendChild(tubeContainer);
            });
        }

        // Update state and visually animate existing correct DOM elements
        const containers = this.boardElement.children;
        this.tubes.forEach((tube, index) => {
            const tubeContainer = containers[index];

            let className = `tube-container ${this.selectedTubeIndex === index ? 'selected' : ''}`;
            if (index === newTubeIndex) className += ' pop-in';
            tubeContainer.className = className;

            const waterDiv = tubeContainer.querySelector('.water');

            // This triggers the smooth CSS transition
            waterDiv.style.height = `${(tube.length / TUBE_CAPACITY) * 100}%`;

            // Re-render internal segments mathematically proportioned to the parent container
            // This ensures they don't shrink away when the parent tube container shrinks.
            waterDiv.innerHTML = '';
            for (let i = tube.length - 1; i >= 0; i--) {
                const segment = document.createElement('div');
                segment.className = 'water-segment';
                // Add merge glow to the top newly dropped segment
                if (index === mergeGlowTubeIndex && i === tube.length - 1) {
                    segment.classList.add('merge-glow');
                }
                segment.style.background = COLOR_PALETTE[tube[i]];
                segment.style.height = `${100 / tube.length}%`; // Dynamically size to perfectly fit parent
                waterDiv.appendChild(segment);
            }
        });
    }

    handleTubeClick(index) {
        if (this.isAnimating) return;
        this.initAudio(); // Initialize audio on first physical interaction

        this.clearHints();

        // Deselect if clicking same tube
        if (this.selectedTubeIndex === index) {
            this.playSound('tap');
            this.vibrate('tap');
            this.selectedTubeIndex = null;
            this.renderBoard();
            return;
        }

        // Select logic
        if (this.selectedTubeIndex === null) {
            // Can't select empty tube
            if (this.tubes[index].length === 0) {
                this.playSound('error');
                this.vibrate('error');
                this.shakeTube(index);
                return;
            }
            this.playSound('tap');
            this.vibrate('tap');
            this.selectedTubeIndex = index;
            this.renderBoard();
        } else {
            // Try to pour
            if (this.canPour(this.selectedTubeIndex, index)) {
                this.playSound('pour');
                this.vibrate('pour');
                this.pour(this.selectedTubeIndex, index);
            } else {
                this.playSound('error');
                this.vibrate('error');
                this.shakeTube(index); // Invalid move feedback
                this.selectedTubeIndex = null;
                this.renderBoard();
            }
        }
    }

    shakeTube(index) {
        const tubeElements = this.boardElement.querySelectorAll('.tube-container');
        tubeElements[index].classList.add('shake');
        setTimeout(() => {
            tubeElements[index]?.classList.remove('shake');
        }, 400);
    }

    canPour(fromIdx, toIdx) {
        const fromTube = this.tubes[fromIdx];
        const toTube = this.tubes[toIdx];

        if (fromTube.length === 0) return false;
        if (toTube.length >= TUBE_CAPACITY) return false;

        if (toTube.length === 0) return true; // Can pour into empty

        // Top color must match
        const fromColor = fromTube[fromTube.length - 1];
        const toColor = toTube[toTube.length - 1];

        return fromColor === toColor;
    }

    pour(fromIdx, toIdx) {
        this.isAnimating = true;

        const fromTube = this.tubes[fromIdx];
        const toTube = this.tubes[toIdx];

        // Find how many blocks of the same color we can move
        const colorToMove = fromTube[fromTube.length - 1];
        let amountToMove = 0;

        for (let i = fromTube.length - 1; i >= 0; i--) {
            if (fromTube[i] === colorToMove) amountToMove++;
            else break;
        }

        // Limit by available space in target tube
        const availableSpace = TUBE_CAPACITY - toTube.length;
        const actualMoveAmount = Math.min(amountToMove, availableSpace);

        // Save history for undo
        this.moveHistory.push({ from: fromIdx, to: toIdx, amount: actualMoveAmount, color: colorToMove });

        // Execute move
        for (let i = 0; i < actualMoveAmount; i++) {
            toTube.push(fromTube.pop());
        }

        this.selectedTubeIndex = null;

        // Render immediately, but block interaction during "animation" time
        // Inject splash animation
        this.createSplash(toIdx, colorToMove);
        this.renderBoard(null, toIdx);

        setTimeout(() => {
            this.isAnimating = false;
            this.checkWin();
        }, 300); // 300ms matches CSS transition
    }

    undoMove() {
        if (this.isAnimating || this.moveHistory.length === 0) {
            this.playSound('error');
            this.vibrate('error');
            return;
        }

        this.playSound('pour');
        this.vibrate('pour');
        const lastMove = this.moveHistory.pop();
        const fromTube = this.tubes[lastMove.from];
        const toTube = this.tubes[lastMove.to];

        for (let i = 0; i < lastMove.amount; i++) {
            fromTube.push(toTube.pop());
        }

        this.selectedTubeIndex = null;
        this.renderBoard();
    }

    addExtraTube() {
        // Monetization Hook simulation
        if (this.tubes.length >= 12) {
            this.playSound('error');
            this.vibrate('error');
            alert("Maximum tubes reached!");
            return;
        }

        // Watch ad simulated
        console.log("Showing rewarded video ad for extra tube...");
        this.playSound('win');
        this.vibrate('win');
        this.tubes.push([]);
        this.selectedTubeIndex = null;
        const newIndex = this.tubes.length - 1;
        this.renderBoard(newIndex);
    }

    showHint() {
        if (this.isAnimating) return;

        // Monetization hook simulated
        console.log("Showing rewarded video ad for a hint...");
        this.playSound('win');

        this.clearHints();

        // Find a valid move
        let foundHint = false;
        for (let i = 0; i < this.tubes.length; i++) {
            for (let j = 0; j < this.tubes.length; j++) {
                if (i !== j && this.canPour(i, j)) {
                    // Don't suggest pouring into an empty tube if the source tube's bottom color is already on the bottom
                    // (prevents pointless shuffling)
                    const fromTube = this.tubes[i];
                    const isSolidBlock = fromTube.every(c => c === fromTube[0]);
                    const toTube = this.tubes[j];

                    if (toTube.length === 0 && isSolidBlock) continue;

                    // Valid hint found
                    const containers = this.boardElement.children;
                    containers[i].classList.add('hint-highlight');
                    containers[j].classList.add('hint-highlight');
                    foundHint = true;
                    this.selectedTubeIndex = null;
                    this.renderBoard(); // reset selection but keep hint classes via script

                    // Re-apply classes because renderBoard sometimes overwrites
                    setTimeout(() => {
                        containers[i].classList.add('hint-highlight');
                        containers[j].classList.add('hint-highlight');
                    }, 50);
                    break;
                }
            }
            if (foundHint) break;
        }

        if (!foundHint) {
            this.playSound('error');
            alert("No more valid moves! Try undoing or adding a tube.");
        }
    }

    clearHints() {
        const containers = this.boardElement.children;
        for (let i = 0; i < containers.length; i++) {
            containers[i].classList.remove('hint-highlight');
        }
    }

    checkWin() {
        // Win if every tube is either empty or full with the same color
        const isWin = this.tubes.every(tube => {
            if (tube.length === 0) return true;
            if (tube.length !== TUBE_CAPACITY) return false;

            const firstColor = tube[0];
            return tube.every(color => color === firstColor);
        });

        if (isWin) {
            this.isAnimating = true; // Prevent clicks
            this.playSound('win');
            this.vibrate('win');
            setTimeout(() => {
                this.winModal.classList.remove('hidden');
            }, 500);
        }
    }

    nextLevel() {
        this.level++;
        this.initLevel();
    }
}

// Initialize game
const game = new Game();
