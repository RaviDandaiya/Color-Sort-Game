const COLOR_PALETTE = {
    'red': '#ff3366',
    'blue': '#00f0ff',
    'green': '#39ff14',
    'yellow': '#ffcc00',
    'purple': '#b510d4',
    'pink': '#ff00ff',
    'orange': '#ff5500',
    'cyan': '#00ffcc',
};

const MIXING_RULES = {
    'red+blue': 'purple',
    'blue+red': 'purple',
    'yellow+blue': 'green',
    'blue+yellow': 'green',
    'red+yellow': 'orange',
    'yellow+red': 'orange',
    'red+white': 'pink',
    'white+red': 'pink',
    'blue+cyan': 'blue', // Deep blue
    'green+yellow': 'cyan'
};

const TUBE_CAPACITY = 4;
const HINT_COST = 100;
const VIAL_COST = 300;

const THEMES = [
    {
        id: "origins",
        range: [1, 10],
        name: "Alchemist Origins",
        bgColor: "#1a120b",
        bgGradient1: "rgba(212, 175, 55, 0.1)",
        bgGradient2: "rgba(139, 69, 19, 0.1)",
        tubeBorder: "rgba(212, 175, 55, 0.4)",
        tubeBase: "linear-gradient(90deg, #3d2b1f, #8b4513, #3d2b1f)",
        tubeShadow: "0 0 10px rgba(212, 175, 55, 0.1)",
        tubeRadius: "10px 10px 35px 35px",
        particle: "'✨'",
        bgPattern: `url("alchemist_background_v2.png")`,
        splashRadius: "50%"
    },
    {
        id: "water",
        range: [11, 20],
        name: "Water Flow Lab",
        bgColor: "#0a192f",
        bgGradient1: "rgba(100, 255, 218, 0.1)",
        bgGradient2: "rgba(23, 42, 69, 0.2)",
        tubeBorder: "rgba(100, 255, 218, 0.3)",
        tubeBase: "linear-gradient(90deg, #172a45, #30475e, #172a45)",
        tubeShadow: "0 0 15px rgba(100, 255, 218, 0.2)",
        tubeRadius: "20px 20px 20px 20px",
        particle: "'💧'",
        bgPattern: `url("water_lab_background.png")`,
        splashRadius: "50%"
    },
    {
        id: "frozen",
        range: [21, 30],
        name: "Frozen Chamber",
        bgColor: "#e0f7fa",
        bgGradient1: "rgba(0, 188, 212, 0.1)",
        bgGradient2: "rgba(255, 255, 255, 0.5)",
        tubeBorder: "rgba(178, 235, 242, 0.8)",
        tubeBase: "linear-gradient(90deg, #b2ebf2, #e0f7fa, #b2ebf2)",
        tubeShadow: "0 0 20px rgba(0, 188, 212, 0.2)",
        tubeRadius: "5px 5px 5px 5px",
        particle: "'❄️'",
        bgPattern: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M25 20v10M20 25h10' stroke='white' stroke-opacity='0.05' stroke-width='1'/%3E%3C/svg%3E")`,
        splashRadius: "0%"
    },
    {
        id: "nature",
        range: [31, 40],
        name: "Nature Growth",
        bgColor: "#1b2e1b",
        bgGradient1: "rgba(76, 175, 80, 0.1)",
        bgGradient2: "rgba(27, 46, 27, 0.2)",
        tubeBorder: "rgba(76, 175, 80, 0.4)",
        tubeBase: "linear-gradient(90deg, #2e7d32, #4caf50, #2e7d32)",
        tubeShadow: "0 0 15px rgba(76, 175, 80, 0.2)",
        tubeRadius: "15px 15px 40px 40px",
        particle: "'🍃'",
        bgPattern: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 15v10M15 20h10' stroke='rgba(76, 175, 80, 0.05)' stroke-width='1'/%3E%3C/svg%3E")`,
        splashRadius: "50% 0 50% 50%"
    },
    {
        id: "heat",
        range: [41, 50],
        name: "Heat & Reaction",
        bgColor: "#2d0a0a",
        bgGradient1: "rgba(255, 87, 34, 0.1)",
        bgGradient2: "rgba(45, 10, 10, 0.2)",
        tubeBorder: "rgba(255, 87, 34, 0.5)",
        tubeBase: "linear-gradient(90deg, #bf360c, #ff5722, #bf360c)",
        tubeShadow: "0 0 20px rgba(255, 87, 34, 0.3)",
        tubeRadius: "10px 10px 10px 10px",
        particle: "'🔥'",
        bgPattern: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 15v10M15 20h10' stroke='rgba(255, 87, 34, 0.05)' stroke-width='1'/%3E%3C/svg%3E")`,
        splashRadius: "50% 50% 0 50%"
    },
    {
        id: "magnetic",
        range: [51, 60],
        name: "Magnetic Lab",
        bgColor: "#1a1a2e",
        bgGradient1: "rgba(22, 33, 62, 0.5)",
        bgGradient2: "rgba(15, 52, 96, 0.2)",
        tubeBorder: "rgba(78, 204, 163, 0.4)",
        tubeBase: "linear-gradient(90deg, #16213e, #0f3460, #16213e)",
        tubeShadow: "0 0 15px rgba(78, 204, 163, 0.2)",
        tubeRadius: "0 0 20px 20px",
        particle: "'⚡'",
        bgPattern: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 15v10M15 20h10' stroke='rgba(78, 204, 163, 0.05)' stroke-width='1'/%3E%3C/svg%3E")`,
        splashRadius: "0%"
    },
    {
        id: "dna",
        range: [61, 70],
        name: "DNA Fusion Lab",
        bgColor: "#0f172a",
        bgGradient1: "rgba(56, 189, 248, 0.1)",
        bgGradient2: "rgba(15, 23, 42, 0.5)",
        tubeBorder: "rgba(56, 189, 248, 0.4)",
        tubeBase: "linear-gradient(90deg, #0369a1, #0ea5e9, #0369a1)",
        tubeShadow: "0 0 20px rgba(56, 189, 248, 0.3)",
        tubeRadius: "30px 30px 30px 30px",
        particle: "'🧬'",
        bgPattern: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 25v10M25 30h10' stroke='white' stroke-opacity='0.03' stroke-width='1'/%3E%3C/svg%3E")`,
        splashRadius: "50%"
    },
    {
        id: "illusion",
        range: [71, 80],
        name: "Hidden Illusions",
        bgColor: "#1e1b4b",
        bgGradient1: "rgba(99, 102, 241, 0.1)",
        bgGradient2: "rgba(30, 27, 75, 0.5)",
        tubeBorder: "rgba(99, 102, 241, 0.3)",
        tubeBase: "linear-gradient(90deg, #312e81, #4338ca, #312e81)",
        tubeShadow: "0 0 15px rgba(99, 102, 241, 0.2)",
        tubeRadius: "15px 15px 35px 35px",
        particle: "'🔮'",
        bgPattern: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 35v10M35 40h10' stroke='white' stroke-opacity='0.03' stroke-width='1'/%3E%3C/svg%3E")`,
        splashRadius: "50%"
    },
    {
        id: "time",
        range: [81, 90],
        name: "Time Distortion",
        bgColor: "#1c1917",
        bgGradient1: "rgba(212, 175, 55, 0.1)",
        bgGradient2: "rgba(28, 25, 23, 0.5)",
        tubeBorder: "rgba(212, 175, 55, 0.4)",
        tubeBase: "linear-gradient(90deg, #44403c, #78716c, #44403c)",
        tubeShadow: "0 0 20px rgba(212, 175, 55, 0.2)",
        tubeRadius: "10px 10px 30px 30px",
        particle: "'⏳'",
        bgPattern: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M25 20v10M20 25h10' stroke='rgba(212, 175, 55, 0.05)' stroke-width='1'/%3E%3C/svg%3E")`,
        splashRadius: "50%"
    },
    {
        id: "chaos",
        range: [91, 100],
        name: "Chaos Master",
        bgColor: "#000000",
        bgGradient1: "rgba(255, 255, 255, 0.05)",
        bgGradient2: "rgba(0, 0, 0, 1)",
        tubeBorder: "rgba(255, 255, 255, 0.5)",
        tubeBase: "linear-gradient(90deg, #111, #333, #111)",
        tubeShadow: "0 0 30px rgba(255, 255, 255, 0.2)",
        tubeRadius: "0 0 0 0",
        particle: "'🧿'",
        bgPattern: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 15v10M15 20h10' stroke='white' stroke-opacity='0.1' stroke-width='1'/%3E%3C/svg%3E")`,
        splashRadius: "0%"
    },
    {
        id: "storm",
        range: [101, 150],
        name: "Abyssal Storm",
        bgColor: "#050510",
        bgGradient1: "rgba(0, 0, 255, 0.1)",
        bgGradient2: "rgba(100, 100, 255, 0.1)",
        tubeBorder: "rgba(100, 100, 255, 0.6)",
        tubeBase: "linear-gradient(90deg, #001, #005, #001)",
        tubeShadow: "0 0 30px rgba(0, 0, 255, 0.3)",
        tubeRadius: "20px 20px 60px 60px",
        particle: "'⚡'",
        bgPattern: `none`,
        splashRadius: "50%"
    }
];

class Game {
    constructor() {
        this.level = 1;
        this.tubes = [];
        this.selectedTubeIndex = null;
        this.moveHistory = [];
        this.isAnimating = false;
        this.isDailyChallenge = false;

        this.audioEnabled = true;
        this.vibrationEnabled = true;
        this.audioCtx = null;

        this.boardElement = document.getElementById('gameBoard');
        this.levelDisplay = document.getElementById('levelDisplay');
        this.winModal = document.getElementById('winModal');
        this.playerNameDisplay = document.getElementById('playerName');
        this.tutorialTip = document.getElementById('tutorialTip');

        this.initPlayer();
        this.initMeta();
        this.initLevel();
        this.initParticles();
        this.handleSplash();
    }

    initParticles() {
        const container = document.getElementById('particlesContainer');
        if (!container) return;

        const particleCount = 25;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'mana-particle';
            
            // Random properties
            const size = Math.random() * 4 + 1;
            const left = Math.random() * 100;
            const duration = Math.random() * 15 + 10;
            const delay = Math.random() * -20;
            const opacity = Math.random() * 0.5 + 0.2;
            const color = Math.random() > 0.5 ? '#b510d4' : '#d4af37'; // Purple or Gold

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${left}%`;
            particle.style.bottom = `-20px`;
            particle.style.setProperty('--d', `${duration}s`);
            particle.style.setProperty('--o', opacity);
            particle.style.animationDelay = `${delay}s`;
            particle.style.backgroundColor = color;
            particle.style.boxShadow = `0 0 10px ${color}`;

            container.appendChild(particle);
        }
    }

    handleSplash() {
        const splash = document.getElementById('splashScreen');
        const progress = document.getElementById('loadingProgress');
        const loadingText = document.querySelector('.loading-text');
        
        if (!splash || !progress) return;

        let width = 0;
        const messages = [
            "Channeling Arcane Energies...",
            "Brewing Mystical Potions...",
            "Calibrating Crystal Vials...",
            "Incanting Sorting Spells...",
            "Finalizing Alchemy Circle..."
        ];

        const interval = setInterval(() => {
            width += Math.random() * 15;
            if (width >= 100) {
                width = 100;
                clearInterval(interval);
                
                setTimeout(() => {
                    splash.classList.add('fade-out');
                    setTimeout(() => {
                        splash.remove();
                    }, 1000);
                }, 500);
            }
            progress.style.width = width + '%';
            
            // Randomly update text
            if (Math.random() > 0.7) {
                loadingText.textContent = messages[Math.floor(Math.random() * messages.length)];
            }
        }, 150);
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

        this.updatePlayerTitle();
    }

    updatePlayerTitle() {
        const titles = [
            { min: 1, title: "Apprentice" },
            { min: 10, title: "Journeyman" },
            { min: 30, title: "Alchemist" },
            { min: 60, title: "Grand Alchemist" },
            { min: 100, title: "Master of Chaos" },
            { min: 150, title: "Arcane Legend" }
        ];

        const titleObj = titles.reverse().find(t => this.level >= t.min);
        document.getElementById('playerTitle').textContent = titleObj ? titleObj.title : "Novice";
    }

    initMeta() {
        this.essence = parseInt(localStorage.getItem('colorSortEssence')) || 0;
        this.purchasedItems = JSON.parse(localStorage.getItem('colorSortPurchased')) || ['skin-default'];
        this.activeSkin = localStorage.getItem('colorSortActiveSkin') || 'skin-default';
        this.activeLab = localStorage.getItem('colorSortActiveLab') || 'lab-default';
        
        this.essenceDisplay = document.getElementById('essenceDisplay');
        this.shopModal = document.getElementById('shopModal');
        this.shopItemsContainer = document.getElementById('shopItems');
        this.settingsModal = document.getElementById('settingsModal');
        this.essenceDisplay.textContent = this.essence;
        
        // Load Settings
        const savedAudio = localStorage.getItem('colorSortAudioEnabled');
        if (savedAudio !== null) this.audioEnabled = savedAudio === 'true';
        
        const savedVib = localStorage.getItem('colorSortVibrationEnabled');
        if (savedVib !== null) this.vibrationEnabled = savedVib === 'true';

        this.shopTab = 'skins';
        
        // Update UI
        this.applyLabBackground();
        this.updateSettingsUI();
    }

    applyLabBackground() {
        // Reset body classes for skins
        document.body.classList.remove('skin-galaxy', 'skin-gold', 'skin-rainbow');
        
        // Apply skin-based background animation classes
        if (this.activeSkin !== 'skin-default') {
            document.body.classList.add(this.activeSkin);
        }

        // Apply lab-based background pattern
        if (this.activeLab === 'lab-premium') {
            document.documentElement.style.setProperty('--bg-pattern', `url("/assets/images/alchemist_lab_bg_1777181053658.png")`);
        } else {
            document.documentElement.style.setProperty('--bg-pattern', 'none');
        }
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
        localStorage.setItem('colorSortAudioEnabled', this.audioEnabled);
        this.updateSettingsUI();
    }

    toggleVibration() {
        this.vibrationEnabled = !this.vibrationEnabled;
        localStorage.setItem('colorSortVibrationEnabled', this.vibrationEnabled);
        this.updateSettingsUI();
        if (this.vibrationEnabled) this.vibrate('tap');
    }

    updateSettingsUI() {
        const audioBtn = document.getElementById('audioToggleSettings');
        if (audioBtn) {
            audioBtn.innerHTML = this.audioEnabled ? '🔊 Sound On' : '🔇 Sound Off';
            audioBtn.classList.toggle('btn-secondary', !this.audioEnabled);
            audioBtn.classList.toggle('btn-premium', this.audioEnabled);
        }

        const vibBtn = document.getElementById('vibrationToggleSettings');
        if (vibBtn) {
            vibBtn.innerHTML = this.vibrationEnabled ? '📳 Haptics On' : '📴 Haptics Off';
            vibBtn.classList.toggle('btn-secondary', !this.vibrationEnabled);
            vibBtn.classList.toggle('btn-premium', this.vibrationEnabled);
        }
    }

    toggleSettings() {
        this.settingsModal.classList.toggle('hidden');
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
        // Check if navigator.vibrate is supported and enabled
        if (!navigator.vibrate || !this.vibrationEnabled) return;

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
        const effectiveLevel = this.isDailyChallenge ? Math.max(this.level + 10, 100) : this.level;
        const displayLevel = this.isDailyChallenge ? "Daily" : this.level;

        this.selectedTubeIndex = null;
        this.moveHistory = [];
        this.isAnimating = false;
        this.levelDisplay.textContent = displayLevel;
        this.winModal.classList.add('hidden');

        if (!this.isDailyChallenge && this.level === 1) {
            this.tutorialTip.classList.remove('hidden');
        } else {
            this.tutorialTip.classList.add('hidden');
        }

        // Apply visual theme based on level progression
        const theme = THEMES.find(t => effectiveLevel >= t.range[0] && effectiveLevel <= t.range[1]) || THEMES[THEMES.length - 1];
        
        // Update Title UI
        const headerH1 = document.querySelector('.level-info h1');
        headerH1.innerHTML = `Level <span id="levelDisplay">${displayLevel}</span>`;
        this.levelDisplay = document.getElementById('levelDisplay');
        
        // Show Theme Banner temporarily
        const themeBanner = document.getElementById('themeBanner');
        themeBanner.textContent = this.isDailyChallenge ? "Daily Spell" : theme.name;
        themeBanner.classList.remove('show');
        void themeBanner.offsetWidth; // trigger reflow
        themeBanner.classList.add('show');

        document.documentElement.style.setProperty('--bg-color', theme.bgColor);
        document.documentElement.style.setProperty('--bg-gradient-1', theme.bgGradient1);
        document.documentElement.style.setProperty('--bg-gradient-2', theme.bgGradient2);
        document.documentElement.style.setProperty('--tube-border-color', theme.tubeBorder);
        document.documentElement.style.setProperty('--tube-base-gradient', theme.tubeBase);
        document.documentElement.style.setProperty('--tube-shadow', theme.tubeShadow);
        document.documentElement.style.setProperty('--tube-radius', theme.tubeRadius);
        document.documentElement.style.setProperty('--particle-icon', theme.particle);
        document.documentElement.style.setProperty('--bg-pattern', theme.bgPattern);
        document.documentElement.style.setProperty('--splash-radius', theme.splashRadius);

        // Difficulty scaling: Easy (1-20), Medium (21-60), Hard (61-100)
        let numColors;
        let numEmptyTubes = 2;

        if (effectiveLevel <= 20) {
            numColors = Math.min(3 + Math.floor((effectiveLevel-1) / 10), 4); // 3 to 4 colors
        } else if (effectiveLevel <= 60) {
            numColors = Math.min(5 + Math.floor((effectiveLevel-21) / 10), 7); // 5 to 7 colors
        } else {
            numColors = 8; // Max chaos
            numEmptyTubes = effectiveLevel > 80 ? 3 : 2;
        }

        const totalTubes = numColors + numEmptyTubes;
        this.generateTubes(numColors, totalTubes);

        // Apply mechanics based on theme/level
        this.applyMechanics(theme.id);
        this.renderBoard();
    }

    applyMechanics(themeId) {
        // Reset mechanic states
        this.tubeStates = this.tubes.map(() => ({
            locked: false,
            hidden: false,
            frozen: false,
            volatile: false,
            stability: 5,
            lockCount: 0
        }));

        if (themeId === 'frozen') {
            // Randomly freeze top segments
            this.tubes.forEach((tube, i) => {
                if (tube.length > 0 && Math.random() > 0.6) {
                    this.tubeStates[i].frozen = true;
                }
            });
        } else if (themeId === 'illusion' || themeId === 'chaos') {
            // Hide non-top colors
            this.tubeStates.forEach(state => state.hidden = true);
        } else if (themeId === 'magnetic') {
            // Tubes "shift" - we'll simulate this by adding a CSS class that jitters them
            this.tubes.forEach((tube, i) => {
                if (Math.random() > 0.5) {
                    this.tubeStates[i].moving = true;
                }
            });
        } else if (themeId === 'chaos') {
            // Lock some tubes
            this.tubes.forEach((tube, i) => {
                if (tube.length > 0 && Math.random() > 0.7) {
                    this.tubeStates[i].locked = true;
                    this.tubeStates[i].lockCount = 2; // Unlock after 2 correct moves
                }
            });
            // Also some hidden
            this.tubeStates.forEach(state => state.hidden = true);
        } else if (themeId === 'storm') {
            // Shake everything
            this.tubeStates.forEach(state => state.moving = true);
            // Some are volatile
            this.tubes.forEach((tube, i) => {
                if (tube.length > 0 && Math.random() > 0.5) {
                    this.tubeStates[i].volatile = true;
                    this.tubeStates[i].stability = 6;
                }
            });
        }
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

        const containers = this.boardElement.children;
        this.tubes.forEach((tube, index) => {
            const tubeContainer = containers[index];
            const state = this.tubeStates[index];

            let className = `tube-container ${this.selectedTubeIndex === index ? 'selected' : ''}`;
            if (index === newTubeIndex) className += ' pop-in';
            if (state.locked) className += ' locked';
            if (state.moving || state.volatile) className += state.volatile ? ' storm volatile' : ' storm'; 
            tubeContainer.className = className;

            const waterDiv = tubeContainer.querySelector('.water');
            waterDiv.style.height = `${(tube.length / TUBE_CAPACITY) * 100}%`;
            waterDiv.innerHTML = '';

            for (let i = tube.length - 1; i >= 0; i--) {
                const segment = document.createElement('div');
                segment.className = 'water-segment';
                
                // Mechanic: Frozen
                if (state.frozen && i === tube.length - 1) {
                    segment.classList.add('frozen-layer');
                }
                
                // Mechanic: Hidden
                if (state.hidden && i < tube.length - 1) {
                    segment.classList.add('hidden-layer');
                }

                if (state.hidden && i < tube.length - 1) {
                    segment.classList.add('hidden-layer');
                }

                if (index === mergeGlowTubeIndex && i === tube.length - 1) {
                    segment.classList.add('merge-glow');
                }
                
                // Apply Skin Texture
                if (this.activeSkin !== 'skin-default') {
                    const skinUrl = this.getSkinUrl(this.activeSkin);
                    segment.style.backgroundImage = `url("${skinUrl}")`;
                    segment.style.backgroundSize = 'cover';
                    segment.style.backgroundBlendMode = 'overlay';
                }

                segment.style.backgroundColor = COLOR_PALETTE[tube[i]];
                segment.style.height = `${100 / tube.length}%`;
                waterDiv.appendChild(segment);
            }
        });
    }

    getSkinUrl(skinId) {
        const skins = {
            'skin-galaxy': 'galaxy_glow_texture_1777181001273.png',
            'skin-gold': 'molten_gold_texture_1777181017498.png',
            'skin-rainbow': 'rainbow_pulse_texture_1777181035863.png'
        };
        return skins[skinId] || '';
    }

    handleTubeClick(index) {
        if (this.isAnimating) return;
        const state = this.tubeStates[index];

        if (state.locked) {
            this.playSound('error');
            this.vibrate('error');
            this.shakeTube(index);
            return;
        }

        if (state.frozen) {
            this.playSound('tap');
            this.vibrate('tap');
            state.frozen = false; // Break ice
            this.renderBoard();
            return;
        }

        this.initAudio();
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

        // Top color must match OR check for mixing
        const fromColor = fromTube[fromTube.length - 1];
        const toColor = toTube[toTube.length - 1];

        if (fromColor === toColor) return true;

        // Mixing Logic: Only if there is space and it's a mixing-capable level (e.g. level > 10)
        if ((this.isDailyChallenge || this.level > 10) && toTube.length > 0 && toTube.length < TUBE_CAPACITY) {
            const mixKey = `${fromColor}+${toColor}`;
            if (MIXING_RULES[mixKey]) return true;
        }

        return false;
    }

    pour(fromIdx, toIdx) {
        this.isAnimating = true;

        const fromTube = this.tubes[fromIdx];
        const toTube = this.tubes[toIdx];

        // Find how many blocks of the same color we can move
        const fromColor = fromTube[fromTube.length - 1];
        const toColor = toTube.length > 0 ? toTube[toTube.length - 1] : null;
        
        let amountToMove = 0;
        for (let i = fromTube.length - 1; i >= 0; i--) {
            if (fromTube[i] === fromColor) amountToMove++;
            else break;
        }

        const mixKey = toColor ? `${fromColor}+${toColor}` : null;
        const resultColor = (toColor && fromColor !== toColor && MIXING_RULES[mixKey]) ? MIXING_RULES[mixKey] : fromColor;

        // If mixing, we only move 1 segment to combine
        const isMixing = toColor && fromColor !== toColor && MIXING_RULES[mixKey];
        const actualMoveAmount = isMixing ? 1 : Math.min(amountToMove, TUBE_CAPACITY - toTube.length);

        // Save history for undo
        this.moveHistory.push({ from: fromIdx, to: toIdx, amount: actualMoveAmount, color: fromColor, wasMixing: isMixing, originalToColor: toColor });

        // Execute move
        if (isMixing) {
            fromTube.pop();
            toTube[toTube.length - 1] = resultColor;
            this.vibrate('pour');
        } else {
            for (let i = 0; i < actualMoveAmount; i++) {
                toTube.push(fromTube.pop());
            }
        }

        // Mechanic: Locked Unlock Progress
        this.tubeStates.forEach((state, i) => {
            if (state.locked && state.lockCount > 0) {
                state.lockCount--;
                if (state.lockCount === 0) state.locked = false;
            }
            // Mechanic: Volatile stability decrease
            if (state.volatile && (i === fromIdx || i === toIdx)) {
                state.stability--;
                if (state.stability <= 0) {
                    this.explodeTube(i);
                }
            }
        });

        this.selectedTubeIndex = null;

        // Render immediately, but block interaction during "animation" time
        // Inject splash animation
        this.createSplash(toIdx, resultColor);
        
        // Add slosh effect
        const containers = this.boardElement.children;
        containers[fromIdx].classList.add('slosh');
        containers[toIdx].classList.add('slosh');
        
        this.renderBoard(null, toIdx);

        setTimeout(() => {
            containers[fromIdx]?.classList.remove('slosh');
            containers[toIdx]?.classList.remove('slosh');
            this.isAnimating = false;
            this.checkWin();
        }, 300); // 300ms matches CSS transition
    }

    explodeTube(index) {
        this.playSound('error');
        this.vibrate('error');
        this.shakeTube(index);
        
        // Reset level because it's too volatile!
        setTimeout(() => {
            alert("BOOM! The volatile potion exploded! Level reset.");
            this.initLevel();
        }, 500);
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

        if (lastMove.wasMixing) {
            // Revert the mix: Restore the original top color of the target tube and return the poured color to the source
            toTube[toTube.length - 1] = lastMove.originalToColor;
            fromTube.push(lastMove.color);
        } else {
            for (let i = 0; i < lastMove.amount; i++) {
                fromTube.push(toTube.pop());
            }
        }

        this.selectedTubeIndex = null;
        this.renderBoard();
    }

    addExtraTube() {
        if (this.tubes.length >= 12) {
            this.playSound('error');
            this.vibrate('error');
            alert("Maximum tubes reached!");
            return;
        }

        if (this.essence < VIAL_COST) {
            this.playSound('error');
            this.vibrate('error');
            alert(`You need ${VIAL_COST} Diamonds to add a new vial!`);
            return;
        }

        // Deduct diamonds
        this.essence -= VIAL_COST;
        localStorage.setItem('colorSortEssence', this.essence);
        this.essenceDisplay.textContent = this.essence;

        this.playSound('win');
        this.vibrate('win');
        this.tubes.push([]);
        this.tubeStates.push({
            locked: false,
            hidden: false,
            frozen: false,
            volatile: false,
            stability: 5,
            lockCount: 0
        });
        this.selectedTubeIndex = null;
        const newIndex = this.tubes.length - 1;
        this.renderBoard(newIndex);
    }

    showHint() {
        if (this.isAnimating) return;

        if (this.essence < HINT_COST) {
            this.playSound('error');
            this.vibrate('error');
            alert(`You need ${HINT_COST} Diamonds for a hint!`);
            return;
        }

        // Deduct diamonds
        this.essence -= HINT_COST;
        localStorage.setItem('colorSortEssence', this.essence);
        this.essenceDisplay.textContent = this.essence;

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
            
            // Earn Diamonds
            const reward = this.isDailyChallenge ? 200 : (50 + Math.floor(this.level / 5) * 10);
            this.earnDiamonds(reward);
            
            setTimeout(() => {
                document.getElementById('essenceReward').textContent = reward;
                this.winModal.classList.remove('hidden');
                this.triggerWinAnimation();
            }, 500);
        }
    }

    triggerWinAnimation() {
        const container = document.getElementById('celebrationContainer');
        if (!container) return;

        container.innerHTML = '';
        const colors = ['#d4af37', '#b510d4', '#00f0ff', '#39ff14', '#ff3366'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            const x = (Math.random() - 0.5) * 400; // spread
            const d = 2 + Math.random() * 3; // duration
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = color;
            confetti.style.setProperty('--x', `${x}px`);
            confetti.style.setProperty('--d', `${d}s`);
            confetti.style.animationDelay = Math.random() * 2 + 's';
            
            container.appendChild(confetti);
        }
    }

    earnDiamonds(amount) {
        this.essence += amount;
        localStorage.setItem('colorSortEssence', this.essence);
        this.essenceDisplay.textContent = this.essence;
    }

    nextLevel() {
        if (this.isDailyChallenge) {
            this.isDailyChallenge = false;
        } else {
            this.level++;
        }
        this.updatePlayerTitle();
        this.initLevel();
    }

    // Shop Logic
    toggleShop() {
        this.shopModal.classList.toggle('hidden');
        if (!this.shopModal.classList.contains('hidden')) {
            this.renderShop();
        }
    }

    switchShopTab(tab) {
        this.shopTab = tab;
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(t => t.classList.toggle('active', t.textContent.toLowerCase().includes(tab)));
        this.renderShop();
    }

    renderShop() {
        this.shopItemsContainer.innerHTML = '';
        const items = this.shopTab === 'skins' ? [
            { id: 'skin-default', name: 'Default', price: 0, preview: '' },
            { id: 'skin-galaxy', name: 'Galaxy Glow', price: 500, preview: '/assets/images/galaxy_glow_texture_1777181001273.png' },
            { id: 'skin-gold', name: 'Molten Gold', price: 1000, preview: '/assets/images/molten_gold_texture_1777181017498.png' },
            { id: 'skin-rainbow', name: 'Rainbow Pulse', price: 1500, preview: '/assets/images/rainbow_pulse_texture_1777181035863.png' }
        ] : [
            { id: 'lab-default', name: 'Standard Lab', price: 0, preview: '' },
            { id: 'lab-premium', name: 'Master Laboratory', price: 2000, preview: '/assets/images/alchemist_lab_bg_1777181053658.png' }
        ];

        items.forEach(item => {
            const isOwned = this.purchasedItems.includes(item.id);
            const isActive = this.activeSkin === item.id || this.activeLab === item.id;
            
            const div = document.createElement('div');
            div.className = 'shop-item';
            div.innerHTML = `
                <div class="item-preview" style="background-image: url('${item.preview}')"></div>
                <span class="item-name">${item.name}</span>
                <span class="item-price">${isOwned ? 'OWNED' : '💎 ' + item.price}</span>
                <button class="btn btn-buy ${isOwned ? 'btn-secondary' : 'btn-premium'}" 
                        onclick="game.handleShopAction('${item.id}', ${item.price})">
                    ${isOwned ? (isActive ? 'Equipped' : 'Equip') : 'Buy'}
                </button>
            `;
            this.shopItemsContainer.appendChild(div);
        });
    }

    handleShopAction(id, price) {
        if (this.purchasedItems.includes(id)) {
            if (id.startsWith('skin')) this.activeSkin = id;
            else if (id.startsWith('lab')) this.activeLab = id;
            
            localStorage.setItem(id.startsWith('skin') ? 'colorSortActiveSkin' : 'colorSortActiveLab', id);
            this.applyLabBackground();
            this.renderShop();
            this.renderBoard();
        } else {
            const cost = parseInt(price) || 0;
            if (cost === 0 || this.essence >= cost) {
                if (cost > 0) {
                    this.essence -= cost;
                    localStorage.setItem('colorSortEssence', this.essence);
                    this.essenceDisplay.textContent = this.essence;
                }
                
                this.purchasedItems.push(id);
                localStorage.setItem('colorSortPurchased', JSON.stringify(this.purchasedItems));
                
                // Auto-equip newly purchased item
                if (id.startsWith('skin')) this.activeSkin = id;
                else if (id.startsWith('lab')) this.activeLab = id;
                localStorage.setItem(id.startsWith('skin') ? 'colorSortActiveSkin' : 'colorSortActiveLab', id);
                
                this.applyLabBackground();
                this.playSound('win');
                this.renderShop();
                this.renderBoard();
            } else {
                this.playSound('error');
                alert("Not enough Diamonds!");
            }
        }
    }

    startDailyChallenge() {
        if (confirm("Start today's Daily Spell? It's much harder but rewards 200 Diamonds!")) {
            this.isDailyChallenge = true;
            this.initLevel();
            this.playSound('win');
        }
    }
}

// Initialize game
const game = new Game();
window.game = game;
