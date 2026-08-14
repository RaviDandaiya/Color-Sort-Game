const COLOR_PALETTE = {
    'red': '#FF6B81',
    'blue': '#54A0FF',
    'green': '#2ED573',
    'yellow': '#FFC312',
    'purple': '#A55EEA',
    'pink': '#FF6B9D',
    'orange': '#FF9F43',
    'cyan': '#48DBFB',
};

const FRUIT_MAPPING = {
    'red': '🍓',
    'blue': '🫐',
    'green': '🍏',
    'yellow': '🍋',
    'purple': '🍇',
    'pink': '🍑',
    'orange': '🍊',
    'cyan': '🍈',
};

const TUBE_CAPACITY = 4;
const HINT_COST = 100;
const VIAL_COST = 300;

const THEMES = [
    {
        id: "origins",
        range: [1, 10],
        name: "Candy Garden",
        bgColor: "#E8F4FD",
        bgGradient1: "rgba(255, 182, 193, 0.15)",
        bgGradient2: "rgba(173, 216, 230, 0.15)",
        tubeBorder: "rgba(255, 255, 255, 0.9)",
        tubeBase: "linear-gradient(90deg, #fff, #f0f0f0, #fff)",
        tubeShadow: "0 8px 20px rgba(100, 140, 180, 0.15)",
        tubeRadius: "22px 22px 34px 34px",
        particle: "'✨'",
        bgPattern: `none`,
        splashRadius: "50%"
    },
    {
        id: "frozen",
        range: [11, 20],
        name: "Snow Cloud",
        bgColor: "#E6F2FF",
        bgGradient1: "rgba(173, 216, 255, 0.2)",
        bgGradient2: "rgba(200, 230, 255, 0.15)",
        tubeBorder: "rgba(200, 235, 255, 0.9)",
        tubeBase: "linear-gradient(90deg, #f5faff, #e8f4ff, #f5faff)",
        tubeShadow: "0 8px 20px rgba(100, 180, 230, 0.18)",
        tubeRadius: "22px 22px 34px 34px",
        particle: "'❄️'",
        bgPattern: `none`,
        splashRadius: "50%"
    },
    {
        id: "grove",
        range: [21, 30],
        name: "Magic Forest",
        bgColor: "#EAFFF0",
        bgGradient1: "rgba(144, 238, 144, 0.12)",
        bgGradient2: "rgba(200, 255, 180, 0.1)",
        tubeBorder: "rgba(200, 255, 200, 0.9)",
        tubeBase: "linear-gradient(90deg, #f0fff5, #e5ffe0, #f0fff5)",
        tubeShadow: "0 8px 20px rgba(100, 200, 120, 0.15)",
        tubeRadius: "22px 22px 34px 34px",
        particle: "'🍀'",
        bgPattern: `none`,
        splashRadius: "50%"
    },
    {
        id: "illusion",
        range: [31, 50],
        name: "Star Palace",
        bgColor: "#F0E6FF",
        bgGradient1: "rgba(200, 160, 255, 0.12)",
        bgGradient2: "rgba(180, 140, 230, 0.1)",
        tubeBorder: "rgba(220, 200, 255, 0.9)",
        tubeBase: "linear-gradient(90deg, #f5f0ff, #ece4ff, #f5f0ff)",
        tubeShadow: "0 8px 20px rgba(150, 100, 220, 0.15)",
        tubeRadius: "22px 22px 34px 34px",
        particle: "'⭐'",
        bgPattern: `none`,
        splashRadius: "50%"
    },
    {
        id: "chaos",
        range: [51, 9999],
        name: "Rainbow World",
        bgColor: "#FFF5E6",
        bgGradient1: "rgba(255, 200, 150, 0.12)",
        bgGradient2: "rgba(255, 180, 200, 0.1)",
        tubeBorder: "rgba(255, 220, 200, 0.9)",
        tubeBase: "linear-gradient(90deg, #fff8f0, #fff0e8, #fff8f0)",
        tubeShadow: "0 8px 20px rgba(220, 120, 80, 0.15)",
        tubeRadius: "22px 22px 34px 34px",
        particle: "'🌟'",
        bgPattern: `none`,
        splashRadius: "50%"
    }
];

class Game {
    constructor() {
        this.level = parseInt(localStorage.getItem('colorSortCurrentLevel')) || 1;
        this.tubes = [];
        this.selectedTubeIndex = null;
        this.moveHistory = [];
        this.isAnimating = false;
        this.isDailyChallenge = false;
        this.mainGameLevel = this.level; // Track main level when in daily

        this.audioEnabled = true;
        this.vibrationEnabled = true;
        this.audioCtx = null;

        this.boardElement = document.getElementById('gameBoard');
        this.levelDisplay = document.getElementById('levelDisplay');
        this.winModal = document.getElementById('winModal');
        this.playerNameDisplay = document.getElementById('playerName');
        this.tutorialTip = document.getElementById('tutorialTip');
        this.legalModal = document.getElementById('legalModal');
        this.legalTitle = document.getElementById('legalTitle');
        this.legalText = document.getElementById('legalText');
        this.mascotGuide = document.getElementById('mascotGuide');

        this.tutorialCompleted = localStorage.getItem('colorSortTutorial') === 'true';
        this.tutorialStep = 0;

        this.hintsUsedThisLevel = 0;
        this.progressTab = 'map';
        this.progressModal = document.getElementById('progressModal');
        this.progressTabContent = document.getElementById('progressTabContent');

        this.initPlayer();
        this.initMeta();

        // Check if the saved state was a Daily Challenge
        const savedStateStr = localStorage.getItem('colorSortActiveGameState');
        if (savedStateStr) {
            try {
                const savedState = JSON.parse(savedStateStr);
                if (savedState.isDailyChallenge) {
                    this.isDailyChallenge = true;
                    // Switch the header button label
                    const dailyBtn = document.getElementById('dailyBtn');
                    if (dailyBtn) {
                        dailyBtn.innerHTML = '🏠 Main Level';
                        dailyBtn.onclick = () => this.exitDaily();
                        dailyBtn.classList.add('btn-back');
                    }
                }
            } catch (e) {
                console.error("Failed to parse saved active state in constructor:", e);
            }
        }

        this.initLevel();
        this.initParticles();
        this.handleSplash();

        // Recalculate board layout on resize/orientation change
        window.addEventListener('resize', () => this.updateBoardLayout());
    }

    initParticles() {
        const container = document.getElementById('particlesContainer');
        if (!container) return;

        const particleCount = 6; // Further reduced for performance
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
            "Mixing up the magic...",
            "Polishing the bottles...",
            "Stirring the rainbow...",
            "Adding sparkles...",
            "Almost ready to play!"
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
            const prefixes = ['Happy', 'Super', 'Lucky', 'Star', 'Magic', 'Cool'];
            const names = ['Sorter', 'Player', 'Mixer', 'Buddy', 'Hero', 'Kid'];
            playerName = `${prefixes[Math.floor(Math.random() * prefixes.length)]}${names[Math.floor(Math.random() * names.length)]}${Math.floor(Math.random() * 999)}`;
            localStorage.setItem('colorSortPlayerName', playerName);
        }
        
        if (this.playerNameDisplay) {
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

        this.updatePlayerTitle();
    }

    updatePlayerTitle() {
        const titles = [
            { min: 1, title: "Beginner" },
            { min: 10, title: "Color Fan" },
            { min: 30, title: "Sorter" },
            { min: 60, title: "Color Expert" },
            { min: 100, title: "Rainbow Master" },
            { min: 150, title: "Color Legend" }
        ];

        const titleObj = titles.reverse().find(t => this.level >= t.min);
        const titleEl = document.getElementById('playerTitle');
        if (titleEl) {
            titleEl.textContent = titleObj ? titleObj.title : "Novice";
        }
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
        for (let i = 0; i < 4; i++) { // Reduced from 8
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

    getUnlockedFruitsForLevel(level) {
        const list = ['red', 'blue', 'green']; // Strawberry, Blueberry, Apple
        if (level >= 4) list.push('orange');
        if (level >= 7) list.push('yellow');
        if (level >= 11) list.push('purple');
        if (level >= 16) list.push('pink');
        if (level >= 22) list.push('cyan');
        return list;
    }

    getDateSeed() {
        const today = new Date();
        return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    }

    createSeededRandom(seed) {
        return function() {
            let t = seed += 0x6D2B79F5;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        }
    }

    getTargetMovesForLevel(level) {
        const effectiveLevel = this.isDailyChallenge ? 25 : level;
        if (effectiveLevel <= 3) return 10;
        if (effectiveLevel <= 10) return 18;
        if (effectiveLevel <= 30) return 26;
        return 35;
    }

    getWorldNameForLevel(level) {
        if (this.isDailyChallenge) {
            const streak = localStorage.getItem('colorSortDailyStreak') || '0';
            return `Daily Challenge 📅 (Streak: 🔥 ${streak})`;
        }
        if (level <= 5) return "Berry Garden 🍓";
        if (level <= 15) return "Fruit Orchard 🍊";
        return "Tropical Garden 🍉";
    }

    initLevel() {
        const effectiveLevel = this.isDailyChallenge ? Math.max(this.level + 10, 100) : this.level;
        const displayLevel = this.isDailyChallenge ? "Daily" : this.level;

        // Check if there is a saved active state matching the current level/mode
        const savedStateStr = localStorage.getItem('colorSortActiveGameState');
        if (savedStateStr) {
            try {
                const savedState = JSON.parse(savedStateStr);
                if (savedState.level === this.level && savedState.isDailyChallenge === this.isDailyChallenge) {
                    this.tubes = savedState.tubes;
                    this.tubeStates = savedState.tubeStates;
                    this.moveHistory = savedState.moveHistory;
                    this.hintsUsedThisLevel = savedState.hintsUsedThisLevel || 0;
                    this.selectedTubeIndex = null;
                    this.isAnimating = false;
                    
                    if (this.levelDisplay) this.levelDisplay.textContent = displayLevel;
                    const worldEl = document.getElementById('worldDisplay');
                    if (worldEl) worldEl.textContent = this.getWorldNameForLevel(this.level);
                    this.winModal.classList.add('hidden');
                    
                    // Apply visual theme
                    const theme = THEMES.find(t => effectiveLevel >= t.range[0] && effectiveLevel <= t.range[1]) || THEMES[THEMES.length - 1];
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
                    this.applyLabBackground();
                    this.renderBoard();
                    return; // Skip generation!
                }
            } catch (e) {
                console.error("Failed to restore active state", e);
            }
        }

        this.selectedTubeIndex = null;
        this.moveHistory = [];
        this.isAnimating = false;
        this.hintsUsedThisLevel = 0; // Reset hints count
        
        if (this.levelDisplay) {
            this.levelDisplay.textContent = displayLevel;
        }
        
        // Update World display in main header
        const worldEl = document.getElementById('worldDisplay');
        if (worldEl) {
            worldEl.textContent = this.getWorldNameForLevel(this.level);
        }
        
        this.winModal.classList.add('hidden');

        if (!this.isDailyChallenge && this.level === 1 && !this.tutorialCompleted) {
            this.tutorialStep = 1;
            this.updateTutorial();
        } else {
            this.tutorialStep = 0;
            if (this.tutorialTip) this.tutorialTip.classList.add('hidden');
        }

        // Apply visual theme based on level progression
        const theme = THEMES.find(t => effectiveLevel >= t.range[0] && effectiveLevel <= t.range[1]) || THEMES[THEMES.length - 1];
        
        // Update Title UI if elements exist
        const headerH1 = document.querySelector('.level-info h1');
        if (headerH1) {
            headerH1.innerHTML = `\u2B50 Level <span id="levelDisplay">${displayLevel}</span>`;
            this.levelDisplay = document.getElementById('levelDisplay');
        }
        
        const settingsLvl = document.getElementById('settingsLevelDisplay');
        if (settingsLvl) settingsLvl.textContent = displayLevel;
        
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

        // Ensure shop items override base theme
        this.applyLabBackground();

        // Difficulty scaling: 
        // Level 1-3: Easy (3 colors, 2 empty)
        // Level 4-10: Normal (4-5 colors, 2 empty)
        // Level 11-30: Medium (6-7 colors, 2 empty)
        // Level 31+: Hard (8 colors, 2 empty)
        let numColors;
        let numEmptyTubes = 2;

        if (effectiveLevel <= 3) {
            numColors = 3;
        } else if (effectiveLevel <= 10) {
            numColors = 4 + Math.floor((effectiveLevel - 4) / 4); // 4 to 5
        } else if (effectiveLevel <= 30) {
            numColors = 6 + Math.floor((effectiveLevel - 11) / 10); // 6 to 7
        } else {
            numColors = 8;
            if (effectiveLevel > 60) numEmptyTubes = 3;
        }

        const totalTubes = numColors + numEmptyTubes;
        this.generateTubes(numColors, totalTubes);

        // Apply mechanics based on theme/level
        this.applyMechanics(theme.id);
        this.renderBoard();
        this.saveActiveState();
    }

    applyMechanics(themeId) {
        // Reset mechanic states
        this.tubeStates = this.tubes.map((tube) => ({
            locked: false,
            hiddenUntil: -1, // Index up to which segments are hidden
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
            this.tubeStates.forEach((state, i) => {
                if (this.tubes[i].length > 0) {
                    state.hiddenUntil = this.tubes[i].length - 2;
                }
            });
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
            this.tubeStates.forEach((state, i) => {
                if (this.tubes[i].length > 0) {
                    state.hiddenUntil = this.tubes[i].length - 2;
                }
            });
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

    isSolvable(initialTubes) {
        // Simple BFS solver
        const serialize = (state) => state.map(t => t.join(',')).join('|');
        const queue = [initialTubes.map(t => [...t])];
        const visited = new Set([serialize(initialTubes)]);
        
        let iterations = 0;
        const maxIterations = 800;

        while (queue.length > 0) {
            const curr = queue.shift();
            iterations++;
            if (iterations > maxIterations) {
                return true; 
            }

            const won = curr.every(tube => {
                if (tube.length === 0) return true;
                if (tube.length !== TUBE_CAPACITY) return false;
                return tube.every(c => c === tube[0]);
            });
            if (won) return true;

            for (let i = 0; i < curr.length; i++) {
                for (let j = 0; j < curr.length; j++) {
                    if (i === j) continue;
                    if (this.canPourTubes(curr, i, j)) {
                        const nextState = curr.map(t => [...t]);
                        const fromTube = nextState[i];
                        const toTube = nextState[j];
                        const color = fromTube[fromTube.length - 1];
                        
                        let amount = 0;
                        for (let k = fromTube.length - 1; k >= 0; k--) {
                            if (fromTube[k] === color) amount++;
                            else break;
                        }
                        const actualAmount = Math.min(amount, TUBE_CAPACITY - toTube.length);
                        for (let k = 0; k < actualAmount; k++) {
                            toTube.push(fromTube.pop());
                        }

                        const key = serialize(nextState);
                        if (!visited.has(key)) {
                            visited.add(key);
                            queue.push(nextState);
                        }
                    }
                }
            }
        }
        return false;
    }

    canPourTubes(tubesList, fromIdx, toIdx) {
        const fromTube = tubesList[fromIdx];
        const toTube = tubesList[toIdx];
        if (fromTube.length === 0) return false;
        if (toTube.length >= TUBE_CAPACITY) return false;
        if (toTube.length === 0) return true;
        return fromTube[fromTube.length - 1] === toTube[toTube.length - 1];
    }

    generateTubes(numColors, totalTubes) {
        const availableColors = this.getUnlockedFruitsForLevel(this.level);
        const actualColors = Math.min(numColors, availableColors.length);
        const colorKeys = availableColors.slice(0, actualColors);

        const pool = [];
        for (let i = 0; i < actualColors; i++) {
            for (let j = 0; j < TUBE_CAPACITY; j++) {
                pool.push(colorKeys[i]);
            }
        }

        // Determine random function (seeded for determinism and replayability)
        let randomFn;
        if (this.isDailyChallenge) {
            const seed = this.getDateSeed();
            randomFn = this.createSeededRandom(seed);
        } else {
            const seed = this.level * 1000 + 12345;
            randomFn = this.createSeededRandom(seed);
        }

        let attempts = 0;
        do {
            // Shuffle
            const tempPool = [...pool];
            for (let i = tempPool.length - 1; i > 0; i--) {
                const j = Math.floor(randomFn() * (i + 1));
                [tempPool[i], tempPool[j]] = [tempPool[j], tempPool[i]];
            }

            // Fill tubes
            this.tubes = [];
            for (let i = 0; i < totalTubes; i++) {
                const tube = [];
                if (i < actualColors) {
                    for (let j = 0; j < TUBE_CAPACITY; j++) {
                        tube.push(tempPool.pop());
                    }
                }
                this.tubes.push(tube);
            }
            attempts++;
            if (this.isSolvable(this.tubes)) {
                break;
            }
        } while (attempts < 20);
    }

    renderBoard(newTubeIndex = null, mergeGlowTubeIndex = null) {
        // Only rebuild the board structure if the number of tubes changed
        if (this.boardElement.children.length !== this.tubes.length) {
            this.boardElement.innerHTML = '';
            this.tubes.forEach((tube, index) => {
                const tubeContainer = document.createElement('div');
                tubeContainer.className = 'tube-container';
                tubeContainer.setAttribute('data-index', index);
                tubeContainer.onclick = () => this.handleTubeClick(index);
                
                const tubeDiv = document.createElement('div');
                tubeDiv.className = 'tube';

                const bottleNeck = document.createElement('div');
                bottleNeck.className = 'bottle-neck';
                const bottleRim = document.createElement('div');
                bottleRim.className = 'bottle-rim';
                
                const fruitStack = document.createElement('div');
                fruitStack.className = 'fruit-stack';
                
                // Pre-fill fruit piece slots
                for (let j = 0; j < TUBE_CAPACITY; j++) {
                    const piece = document.createElement('div');
                    piece.className = 'fruit-piece';
                    piece.style.display = 'none';
                    fruitStack.appendChild(piece);
                }
                
                tubeDiv.appendChild(bottleNeck);
                tubeDiv.appendChild(bottleRim);
                tubeDiv.appendChild(fruitStack);
                tubeContainer.appendChild(tubeDiv);
                this.boardElement.appendChild(tubeContainer);
            });
            this.updateBoardLayout();
        }

        const containers = this.boardElement.children;

        this.tubes.forEach((tube, index) => {
            const tubeContainer = containers[index];
            const state = this.tubeStates[index];

            // Update tube container classes
            const isSelected = this.selectedTubeIndex === index;
            tubeContainer.classList.toggle('selected', isSelected);
            tubeContainer.classList.toggle(
                'destination-preview',
                this.selectedTubeIndex !== null && !isSelected && this.canPour(this.selectedTubeIndex, index)
            );
            tubeContainer.classList.toggle('pop-in', index === newTubeIndex);
            tubeContainer.classList.toggle('locked', state.locked);
            
            const isStorm = state.moving || state.volatile;
            tubeContainer.classList.toggle('storm', isStorm);
            tubeContainer.classList.toggle('volatile', !!state.volatile);
            tubeContainer.classList.toggle('is-empty', tube.length === 0);

            const fruitStack = tubeContainer.querySelector('.fruit-stack');
            const pieces = fruitStack.children;

            for (let i = 0; i < TUBE_CAPACITY; i++) {
                const piece = pieces[i];
                if (i < tube.length) {
                    const segmentIndex = tube.length - 1 - i;
                    const color = tube[segmentIndex];
                    const fruit = FRUIT_MAPPING[color] || '●';

                    piece.style.display = 'flex';
                    piece.style.height = '25%';
                    piece.style.backgroundColor = '';

                    // States
                    const isFrozen = state.frozen && segmentIndex === tube.length - 1;
                    const isHidden = segmentIndex <= state.hiddenUntil;
                    const isMergeGlow = index === mergeGlowTubeIndex && segmentIndex === tube.length - 1;

                    piece.classList.toggle('frozen-layer', isFrozen);
                    piece.classList.toggle('hidden-layer', isHidden);
                    piece.classList.toggle('merge-glow', isMergeGlow);

                    if (isHidden) {
                        piece.textContent = '?';
                    } else {
                        piece.textContent = fruit;
                    }
                } else {
                    piece.style.display = 'none';
                    piece.style.backgroundColor = '';
                    piece.textContent = '';
                    piece.classList.remove('frozen-layer', 'hidden-layer', 'merge-glow');
                }
            }
        });
    }

    updateBoardLayout() {
        const count = this.tubes.length;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const maxWidth = Math.min(vw, 500);

        // Determine optimal columns
        let cols;
        if (count <= 5) cols = count;
        else if (count <= 8) cols = Math.min(count, Math.ceil(count / 2) + (count % 2 === 0 ? 0 : 0));
        else cols = Math.min(count, 5);

        // Adjust for very small widths
        if (count <= 5) cols = count;
        else if (count <= 10) cols = Math.min(5, Math.ceil(count / 2));
        else cols = Math.min(6, Math.ceil(count / 2));

        const rows = Math.ceil(count / cols);

        // Calculate bottle dimensions to fit
        const hGap = 8;
        const vGap = 12;
        const padH = 20;
        const availableW = maxWidth - padH * 2;
        const availableH = vh * 0.52; // reserve space for header, mascot, controls

        const bottleW = Math.min(66, Math.max(40, Math.floor((availableW - (cols - 1) * hGap) / cols)));
        const maxProportionalH = Math.floor(bottleW * 2.7);
        const bottleH = Math.min(180, Math.max(100, Math.min(maxProportionalH, Math.floor((availableH - (rows - 1) * vGap - 30 * rows) / rows))));

        this.boardElement.style.setProperty('--bottle-w', `${bottleW}px`);
        this.boardElement.style.setProperty('--bottle-h', `${bottleH}px`);
        this.boardElement.style.setProperty('--board-gap', `${hGap}px`);
        this.boardElement.style.setProperty('--board-cols', `${cols}`);
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
        
        // Hide tutorial tip on first interaction
        if (this.tutorialTip && !this.tutorialTip.classList.contains('hidden') && this.tutorialStep === 1) {
            // Handled by updateTutorial logic below
        }

        const state = this.tubeStates[index];

        if (state.locked) {
            this.playSound('error');
            this.vibrate('error');
            this.shakeTube(index);
            this.reactMascot('confused');
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
                this.reactMascot('confused');
                return;
            }
            this.playSound('tap');
            this.vibrate('tap');
            this.selectedTubeIndex = index;
            this.renderBoard();
            this.reactMascot('ready');

            if (this.tutorialStep === 1) {
                this.tutorialStep = 2;
                this.updateTutorial();
            }
        } else {
            // Try to pour
            if (this.canPour(this.selectedTubeIndex, index)) {
                this.playSound('pour');
                this.vibrate('pour');
                this.pour(this.selectedTubeIndex, index);

                if (this.tutorialStep === 2) {
                    this.tutorialStep = 3;
                    this.updateTutorial();
                }
            } else {
                this.playSound('error');
                this.vibrate('error');
                this.shakeTube(index); // Invalid move feedback
                this.reactMascot('confused');
                this.selectedTubeIndex = null;
                this.renderBoard();
            }
        }
    }

    shakeTube(index) {
        const tubeElements = this.boardElement.querySelectorAll('.tube-container');
        const tube = tubeElements[index];
        if (!tube) return;

        tube.classList.remove('invalid-move');
        void tube.offsetWidth;
        tube.classList.add('shake', 'invalid-move');
        setTimeout(() => {
            tube.classList.remove('shake', 'invalid-move');
        }, 360);
    }

    canPour(fromIdx, toIdx) {
        const fromTube = this.tubes[fromIdx];
        const toTube = this.tubes[toIdx];

        if (fromTube.length === 0) return false;
        if (toTube.length >= TUBE_CAPACITY) return false;

        if (toTube.length === 0) return true; // Can pour into empty

        const fromColor = fromTube[fromTube.length - 1];
        const toColor = toTube[toTube.length - 1];

        // Standard Color Sort Rule: Top colors must match
        return fromColor === toColor;
    }

    pour(fromIdx, toIdx) {
        this.isAnimating = true;

        const fromTube = this.tubes[fromIdx];
        const toTube = this.tubes[toIdx];

        // Find how many blocks of the same color we can move
        const fromColor = fromTube[fromTube.length - 1];
        
        let amountToMove = 0;
        for (let i = fromTube.length - 1; i >= 0; i--) {
            if (fromTube[i] === fromColor) amountToMove++;
            else break;
        }

        // Standard logic: move as many as possible of the same color
        const actualMoveAmount = Math.min(amountToMove, TUBE_CAPACITY - toTube.length);

        this.selectedTubeIndex = null;

        // === IMMEDIATE STATE MUTATION (fixes stale-destination bug) ===
        this.moveHistory.push({ from: fromIdx, to: toIdx, amount: actualMoveAmount, color: fromColor });

        for (let i = 0; i < actualMoveAmount; i++) {
            toTube.push(fromTube.pop());

            const fromState = this.tubeStates[fromIdx];
            if (fromTube.length > 0 && fromTube.length - 1 <= fromState.hiddenUntil) {
                fromState.hiddenUntil = fromTube.length - 2;
            }
        }

        this.tubeStates.forEach((state) => {
            if (state.locked && state.lockCount > 0) {
                state.lockCount--;
                if (state.lockCount === 0) state.locked = false;
            }
        });

        // Persist level state mid-level
        this.saveActiveState();

        // Render immediately — source and destination update NOW
        this.renderBoard(null, toIdx);

        // Start visual overlay animation (purely cosmetic)
        const animationDuration = this.animatePour(fromIdx, toIdx, fromColor, actualMoveAmount);
        this.reactMascot('happy');

        // After animation completes: splash, celebrate, check win
        setTimeout(() => {
            this.createSplash(toIdx, fromColor);

            const completedBottles = this.tubes
                .map((tube, index) => this.isCompletedBottle(tube) ? index : -1)
                .filter(index => index !== -1);
            this.celebrateCompletedBottles(completedBottles);

            this.isAnimating = false;
            this.checkWin();
        }, animationDuration);
    }

    animatePour(fromIdx, toIdx, color, amount) {
        const containers = this.boardElement.children;
        const source = containers[fromIdx];
        const destination = containers[toIdx];
        const sourceTube = source?.querySelector('.tube');
        const destinationTube = destination?.querySelector('.tube');

        if (!source || !destination || !sourceTube || !destinationTube) return 300;

        const sourceRect = sourceTube.getBoundingClientRect();
        const destinationRect = destinationTube.getBoundingClientRect();
        const poursRight = destinationRect.left > sourceRect.left;

        // Calculate direct translation so the source bottle moves to sit right over destination neck
        const dx = destinationRect.left - sourceRect.left;
        const dy = destinationRect.top - sourceRect.top;
        const tx = dx + (poursRight ? -36 : 36);
        const ty = dy - 60;

        sourceTube.style.setProperty('--pour-tx', `${tx}px`);
        sourceTube.style.setProperty('--pour-ty', `${ty}px`);

        const pourClass = poursRight ? 'pouring-right' : 'pouring-left';
        source.classList.add(pourClass);

        const fruit = FRUIT_MAPPING[color] || '●';
        const flyDuration = 320;
        const stagger = 80;
        const liftDelay = 220; // Allow bottle to lift and glide slightly before fruit flies
        const settleDelay = 120; // After last fruit lands
        const totalDuration = liftDelay + flyDuration + (amount - 1) * stagger + settleDelay;

        // After the bottle tilts, launch the flying fruits
        setTimeout(() => {
            // Recalculate start position at the mouth of the tilted bottle
            const srcRect = sourceTube.getBoundingClientRect();
            const dstRect = destinationTube.getBoundingClientRect();
            const startX = srcRect.left + srcRect.width * (poursRight ? 0.75 : 0.25);
            const startY = srcRect.top + 5;
            const endX = dstRect.left + dstRect.width * 0.5;
            const endY = dstRect.top + 10;

            destination.classList.add('receiving-pour');

            for (let i = 0; i < amount; i++) {
                setTimeout(() => {
                    const flyEl = document.createElement('div');
                    flyEl.className = 'fruit-fly';
                    flyEl.textContent = fruit;
                    flyEl.style.left = `${startX}px`;
                    flyEl.style.top = `${startY}px`;

                    const fdx = endX - startX;
                    const fdy = endY - startY;
                    const arcH = Math.max(35, Math.abs(fdy) * 0.45 + 25);

                    flyEl.style.setProperty('--fly-mid-x', `${fdx * 0.5}px`);
                    flyEl.style.setProperty('--fly-mid-y', `${Math.min(fdy * 0.5, -arcH)}px`);
                    flyEl.style.setProperty('--fly-end-x', `${fdx}px`);
                    flyEl.style.setProperty('--fly-end-y', `${fdy}px`);
                    flyEl.style.setProperty('--fly-duration', `${flyDuration}ms`);

                    document.body.appendChild(flyEl);

                    // When this fruit lands
                    setTimeout(() => {
                        flyEl.remove();

                        // Squash receiving bottle
                        destinationTube.classList.remove('bounce-receive');
                        void destinationTube.offsetWidth; // trigger reflow
                        destinationTube.classList.add('bounce-receive');

                        // Squash the corresponding fruit piece inside the bottle
                        const pieces = destinationTube.querySelectorAll('.fruit-piece');
                        const destTotal = this.tubes[toIdx].length;
                        const landIndex = destTotal - amount + i;
                        if (pieces && pieces[landIndex]) {
                            pieces[landIndex].classList.add('fruit-land');
                            setTimeout(() => {
                                pieces[landIndex].classList.remove('fruit-land');
                            }, 400);
                        }
                    }, flyDuration);

                }, i * stagger);
            }
        }, liftDelay);

        setTimeout(() => {
            source.classList.remove(pourClass);
            destination.classList.remove('receiving-pour');
            sourceTube.style.removeProperty('--pour-tx');
            sourceTube.style.removeProperty('--pour-ty');
        }, totalDuration);

        return totalDuration;
    }

    isCompletedBottle(tube) {
        return tube.length === TUBE_CAPACITY && tube.every(color => color === tube[0]);
    }

    celebrateCompletedBottles(indexes) {
        const containers = this.boardElement.children;

        indexes.forEach(index => {
            const bottle = containers[index];
            if (!bottle || bottle.classList.contains('completed-celebration')) return;

            const completedColor = this.tubes[index][0];
            const fruit = FRUIT_MAPPING[completedColor] || '✨';

            bottle.classList.add('completed-celebration');
            for (let i = 0; i < 5; i++) {
                const sparkle = document.createElement('span');
                sparkle.className = 'bottle-sparkle';
                sparkle.textContent = fruit;
                sparkle.style.setProperty('--sparkle-x', `${(Math.random() - 0.5) * 70}px`);
                sparkle.style.setProperty('--sparkle-y', `${-25 - Math.random() * 45}px`);
                sparkle.style.animationDelay = `${i * 60}ms`;
                bottle.appendChild(sparkle);
                setTimeout(() => sparkle.remove(), 800);
            }

            setTimeout(() => bottle.classList.remove('completed-celebration'), 700);

            // Update mascot with specific fruit name
            const fruitNames = {
                'red': 'Strawberries', 'blue': 'Blueberries', 'green': 'Apples',
                'yellow': 'Lemons', 'purple': 'Grapes', 'pink': 'Peaches',
                'orange': 'Oranges', 'cyan': 'Melons'
            };
            const name = fruitNames[completedColor] || 'Fruit';
            const speech = this.mascotGuide?.querySelector('.mascot-speech');
            if (speech) speech.textContent = `${name} sorted!`;
        });

        if (indexes.length) this.reactMascot('celebrate');
    }

    reactMascot(reaction) {
        if (!this.mascotGuide) return;

        const reactionClasses = ['mascot-idle', 'mascot-ready', 'mascot-happy', 'mascot-confused', 'mascot-celebrate'];
        this.mascotGuide.classList.remove(...reactionClasses);
        this.mascotGuide.classList.add(`mascot-${reaction}`);

        const speech = this.mascotGuide.querySelector('.mascot-speech');
        const messages = {
            idle: "Sort the fruit!",
            ready: 'Pick a match!',
            happy: 'Yummy!',
            confused: 'Try another fruit!',
            celebrate: 'Fruit sorted!'
        };
        if (speech) speech.textContent = messages[reaction] || messages.idle;

        if (reaction !== 'idle') {
            setTimeout(() => {
                if (!this.mascotGuide) return;
                this.mascotGuide.classList.remove(...reactionClasses);
                this.mascotGuide.classList.add('mascot-idle');
                if (speech) speech.textContent = messages.idle;
            }, reaction === 'celebrate' ? 760 : 520);
        }
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
        this.saveActiveState();
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
            hiddenUntil: -1,
            frozen: false,
            volatile: false,
            stability: 5,
            lockCount: 0
        });
        this.selectedTubeIndex = null;
        const newIndex = this.tubes.length - 1;
        this.renderBoard(newIndex);
        this.saveActiveState();
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
        this.hintsUsedThisLevel++;

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
                    this.selectedTubeIndex = null;
                    foundHint = true;
                    this.renderBoard(); // reset selection

                    // Apply classes after a short delay to ensure renderBoard doesn't interfere
                    this.hintTimeout = setTimeout(() => {
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
        } else {
            this.saveActiveState();
        }
    }

    clearHints() {
        if (this.hintTimeout) {
            clearTimeout(this.hintTimeout);
            this.hintTimeout = null;
        }
        const containers = this.boardElement.children;
        for (let i = 0; i < containers.length; i++) {
            containers[i].classList.remove('hint-highlight');
        }
    }

    updateTutorial() {
        if (!this.tutorialTip) return;
        if (this.tutorialCompleted || this.level !== 1 || this.tutorialStep === 0) {
            this.tutorialTip.classList.add('hidden');
            return;
        }

        const textEl = document.getElementById('tutorialText');
        this.tutorialTip.classList.remove('hidden');

        // Give DOM time to create children if needed
        setTimeout(() => {
            const containers = this.boardElement.children;
            if (!containers || containers.length === 0) return;

            this.tutorialTip.style.position = 'absolute';
            this.tutorialTip.style.top = '-40px';
            this.tutorialTip.style.left = '50%';
            this.tutorialTip.style.transform = 'translateX(-50%)';

            if (this.tutorialStep === 1) {
                if (textEl) textEl.textContent = 'Tap me!';
                containers[0].appendChild(this.tutorialTip);
            } else if (this.tutorialStep === 2) {
                if (textEl) textEl.textContent = 'Match the fruit!';
                containers[containers.length - 1].appendChild(this.tutorialTip);
            } else if (this.tutorialStep === 3) {
                if (textEl) textEl.textContent = 'Great! 🍓';
                // Find where the player just poured by checking selectedTubeIndex?
                // The tip is currently on the destination container because we appended it there in step 2.
                setTimeout(() => {
                    this.tutorialCompleted = true;
                    localStorage.setItem('colorSortTutorial', 'true');
                    this.tutorialTip.classList.add('hidden');
                }, 2000);
            }
        }, 50);
    }

    getTotalStars() {
        const starsObj = JSON.parse(localStorage.getItem('colorSortLevelStars') || '{}');
        return Object.values(starsObj).reduce((sum, val) => sum + val, 0);
    }

    getNextUnlockProgress() {
        const level = this.level;
        const totalStars = this.getTotalStars();
        const dailyWins = parseInt(localStorage.getItem('colorSortDailyWinsCount') || '0');
        
        if (level < 4) {
            return { text: "Next Unlock: Orange 🍊 at Level 4", current: level, target: 4 };
        }
        if (level < 7) {
            return { text: "Next Unlock: Lemon 🍋 at Level 7", current: level, target: 7 };
        }
        if (level < 10 && !this.purchasedItems.includes('skin-candy')) {
            return { text: "Next Unlock: Candy Bottle 🍬 at Level 10", current: level, target: 10 };
        }
        if (level < 11) {
            return { text: "Next Unlock: Grape 🍇 at Level 11", current: level, target: 11 };
        }
        if (totalStars < 20 && !this.purchasedItems.includes('skin-rainbow')) {
            return { text: "Next Unlock: Rainbow Bottle 🌈 at 20 Stars", current: totalStars, target: 20 };
        }
        if (level < 16) {
            return { text: "Next Unlock: Peach 🍑 at Level 16", current: level, target: 16 };
        }
        if (level < 22) {
            return { text: "Next Unlock: Melon 🍈 at Level 22", current: level, target: 22 };
        }
        if (dailyWins < 5 && !this.purchasedItems.includes('skin-bunny')) {
            return { text: "Next Unlock: Bunny Bottle 🐰 at 5 Daily Wins", current: dailyWins, target: 5 };
        }
        return { text: "All Collection Unlocked! 🎉", current: 1, target: 1 };
    }

    checkAchievementUnlocks() {
        const level = this.level;
        const totalStars = this.getTotalStars();
        const dailyWins = parseInt(localStorage.getItem('colorSortDailyWinsCount') || '0');
        
        let unlockedNew = false;
        
        if (level >= 10 && !this.purchasedItems.includes('skin-candy')) {
            this.purchasedItems.push('skin-candy');
            unlockedNew = true;
        }
        if (totalStars >= 20 && !this.purchasedItems.includes('skin-rainbow')) {
            this.purchasedItems.push('skin-rainbow');
            unlockedNew = true;
        }
        if (dailyWins >= 5 && !this.purchasedItems.includes('skin-bunny')) {
            this.purchasedItems.push('skin-bunny');
            unlockedNew = true;
        }
        
        if (unlockedNew) {
            localStorage.setItem('colorSortPurchased', JSON.stringify(this.purchasedItems));
            this.reactMascot('celebrate');
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
            this.reactMascot('celebrate');
            
            // Star calculations
            const moves = this.moveHistory.length;
            const hints = this.hintsUsedThisLevel || 0;
            const target = this.getTargetMovesForLevel(this.level);

            let stars = 1;
            if (moves <= target && hints === 0) {
                stars = 3;
            } else if (moves <= target * 1.5 && hints <= 1) {
                stars = 2;
            }

            // Check if level was already completed before this win
            let earnedAlready = false;
            if (!this.isDailyChallenge) {
                const starsObj = JSON.parse(localStorage.getItem('colorSortLevelStars') || '{}');
                if (starsObj[this.level] !== undefined && starsObj[this.level] > 0) {
                    earnedAlready = true;
                }
            }

            // Save stars in localStorage
            if (!this.isDailyChallenge) {
                const starsObj = JSON.parse(localStorage.getItem('colorSortLevelStars') || '{}');
                const existingStars = starsObj[this.level] || 0;
                if (stars > existingStars) {
                    starsObj[this.level] = stars;
                    localStorage.setItem('colorSortLevelStars', JSON.stringify(starsObj));
                }
            }

            // Toggle stars in the DOM
            const starItems = document.querySelectorAll('.star-item');
            starItems.forEach((star, idx) => {
                if (idx < stars) {
                    star.style.display = 'inline-block';
                    star.textContent = '⭐';
                } else {
                    star.style.display = 'inline-block';
                    star.textContent = '☆';
                }
            });

            const starLabel = document.querySelector('.star-label');
            if (starLabel) {
                starLabel.textContent = stars === 3 ? "Perfect! ⭐⭐⭐" : (stars === 2 ? "Great! ⭐⭐" : "Good! ⭐");
            }

            // Earn Diamonds
            const reward = this.isDailyChallenge ? 200 : (50 + Math.floor(this.level / 5) * 10);
            
            if (this.isDailyChallenge) {
                // Mark today as won & calculate streak
                const lastDateStr = localStorage.getItem('colorSortLastDailyWin');
                const today = new Date();
                const todayStr = today.toDateString();
                
                let currentStreak = parseInt(localStorage.getItem('colorSortDailyStreak') || '0');
                if (lastDateStr) {
                    const lastDate = new Date(lastDateStr);
                    const diffTime = Math.abs(today - lastDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays === 1) {
                        currentStreak++;
                    } else if (diffDays > 1) {
                        currentStreak = 1;
                    }
                } else {
                    currentStreak = 1;
                }
                
                localStorage.setItem('colorSortDailyStreak', currentStreak);
                localStorage.setItem('colorSortLastDailyWin', todayStr);
                
                const count = parseInt(localStorage.getItem('colorSortDailyWinsCount') || '0') + 1;
                localStorage.setItem('colorSortDailyWinsCount', count);
            }
            
            if (!earnedAlready) {
                this.earnDiamonds(reward);
            }

            // Clear mid-level saved state upon winning
            this.clearActiveState();

            // Auto achievement checks
            this.checkAchievementUnlocks();
            
            // Get unique fruit emojis from current level tubes
            const uniqueColors = [...new Set(this.tubes.flat())].filter(Boolean);
            const fruits = uniqueColors.map(color => FRUIT_MAPPING[color] || '●');
            
            const fruitsContainer = document.getElementById('completedFruitsContainer');
            if (fruitsContainer) {
                fruitsContainer.innerHTML = '';
                fruits.forEach((fruit, idx) => {
                    const span = document.createElement('span');
                    span.textContent = fruit;
                    span.style.animationDelay = `${0.4 + idx * 0.1}s`;
                    fruitsContainer.appendChild(span);
                });
            }

            // Next Unlock milestone progress display
            const progressInfo = this.getNextUnlockProgress();
            const winProgressText = document.getElementById('winProgressText');
            const winProgressBarFill = document.getElementById('winProgressBarFill');
            if (winProgressText && winProgressBarFill) {
                winProgressText.textContent = progressInfo.text;
                const pct = Math.min(100, Math.floor((progressInfo.current / progressInfo.target) * 100));
                winProgressBarFill.style.width = `${pct}%`;
            }
            
            setTimeout(() => {
                document.getElementById('essenceReward').textContent = earnedAlready ? "0 (Replayed)" : reward;
                this.winModal.classList.remove('hidden');
                this.triggerWinAnimation();
            }, 500);
        }
    }

    triggerWinAnimation() {
        const container = document.getElementById('celebrationContainer');
        if (!container) return;

        container.innerHTML = '';
        const colors = ['#FF6B9D', '#7C4DFF', '#4ECDC4', '#FFD93D', '#FF9F43', '#FF4757'];
        
        for (let i = 0; i < 25; i++) { // Reduced from 50
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
        if (this.nextLevelLocked) return;
        this.nextLevelLocked = true;
        setTimeout(() => { this.nextLevelLocked = false; }, 800);

        if (this.isDailyChallenge) {
            this.isDailyChallenge = false;
            this.level = this.mainGameLevel;
        } else {
            this.level++;
            localStorage.setItem('colorSortCurrentLevel', this.level);
        }
        this.updatePlayerTitle();
        this.initLevel();
    }

    startDailyChallenge() {
        if (this.isDailyChallenge) return;

        // Check if already completed today
        const lastDate = localStorage.getItem('colorSortLastDailyWin');
        const today = new Date().toDateString();
        
        if (lastDate === today) {
            this.playSound('error');
            alert("You have already mastered today's Daily Spell! Come back tomorrow.");
            return;
        }

        this.mainGameLevel = this.level;
        this.isDailyChallenge = true;
        this.initLevel();
        
        // Update Daily button to "Main Level"
        const dailyBtn = document.getElementById('dailyBtn');
        if (dailyBtn) {
            dailyBtn.innerHTML = '🏠 Main Level';
            dailyBtn.onclick = () => this.exitDaily();
            dailyBtn.classList.add('btn-back');
        }
    }

    exitDaily() {
        if (!this.isDailyChallenge) return;
        this.isDailyChallenge = false;
        this.level = this.mainGameLevel;
        
        // Restore Daily button
        const dailyBtn = document.getElementById('dailyBtn');
        if (dailyBtn) {
            dailyBtn.innerHTML = '📅 Daily';
            dailyBtn.onclick = () => this.startDailyChallenge();
            dailyBtn.classList.remove('btn-back');
        }
        
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
        
        const level = this.level;
        const totalStars = this.getTotalStars();
        const dailyWins = parseInt(localStorage.getItem('colorSortDailyWinsCount') || '0');

        this.shopData = this.shopTab === 'skins' ? [
            { id: 'skin-default', name: 'Default Bottle', price: 0, type: 'diamonds', preview: '' },
            { id: 'skin-candy', name: 'Candy Bottle 🍬', price: 0, type: 'achievement', reqText: 'Reach Level 10', isUnlocked: level >= 10, preview: '' },
            { id: 'skin-rainbow', name: 'Rainbow Bottle 🌈', price: 0, type: 'achievement', reqText: 'Earn 20 Stars', isUnlocked: totalStars >= 20, preview: '/assets/images/rainbow_pulse_texture_1777181035863.png' },
            { id: 'skin-bunny', name: 'Bunny Bottle 🐰', price: 0, type: 'achievement', reqText: 'Win 5 Dailies', isUnlocked: dailyWins >= 5, preview: '' },
            { id: 'skin-galaxy', name: 'Galaxy Glow', price: 500, type: 'diamonds', preview: '/assets/images/galaxy_glow_texture_1777181001273.png' },
            { id: 'skin-gold', name: 'Molten Gold', price: 1000, type: 'diamonds', preview: '/assets/images/molten_gold_texture_1777181017498.png' }
        ] : [
            { id: 'lab-default', name: 'Standard Lab', price: 0, type: 'diamonds', preview: '' },
            { id: 'lab-premium', name: 'Master Laboratory', price: 2000, type: 'diamonds', preview: '/assets/images/alchemist_lab_bg_1777181053658.png' }
        ];

        // Ensure auto-unlock items are in purchased list
        this.shopData.forEach(item => {
            if (item.type === 'achievement' && item.isUnlocked && !this.purchasedItems.includes(item.id)) {
                this.purchasedItems.push(item.id);
                localStorage.setItem('colorSortPurchased', JSON.stringify(this.purchasedItems));
            }
        });

        this.shopData.forEach(item => {
            const isOwned = this.purchasedItems.includes(item.id);
            const isActive = this.activeSkin === item.id || this.activeLab === item.id;
            
            let priceLabel = 'FREE';
            let actionBtn = '';
            
            if (isOwned) {
                priceLabel = 'OWNED';
                actionBtn = `<button class="btn btn-buy ${isActive ? 'btn-secondary' : 'btn-premium'}" onclick="game.handleShopAction('${item.id}', 0)">${isActive ? 'Equipped' : 'Equip'}</button>`;
            } else if (item.type === 'achievement') {
                priceLabel = `🏆 ${item.reqText}`;
                actionBtn = `<button class="btn btn-buy btn-secondary" disabled>Locked</button>`;
            } else {
                priceLabel = item.price === 0 ? 'FREE' : '💎 ' + item.price;
                actionBtn = `<button class="btn btn-buy btn-premium" onclick="game.handleShopAction('${item.id}', ${item.price})">Buy</button>`;
            }

            const div = document.createElement('div');
            div.className = 'shop-item';
            div.innerHTML = `
                <div class="item-preview" style="background-image: url('${item.preview}')"></div>
                <span class="item-name">${item.name}</span>
                <span class="item-price">${priceLabel}</span>
                ${actionBtn}
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


    toggleProgressModal() {
        if (!this.progressModal) {
            this.progressModal = document.getElementById('progressModal');
            this.progressTabContent = document.getElementById('progressTabContent');
        }
        if (!this.progressModal) return;
        this.progressModal.classList.toggle('hidden');
        if (!this.progressModal.classList.contains('hidden')) {
            this.renderProgress();
        }
    }

    switchProgressTab(tab) {
        this.progressTab = tab;
        
        const tabMapBtn = document.getElementById('tabMapBtn');
        const tabFruitsBtn = document.getElementById('tabFruitsBtn');
        const tabMilestonesBtn = document.getElementById('tabMilestonesBtn');
        
        if (tabMapBtn) tabMapBtn.classList.toggle('active', tab === 'map');
        if (tabFruitsBtn) tabFruitsBtn.classList.toggle('active', tab === 'fruits');
        if (tabMilestonesBtn) tabMilestonesBtn.classList.toggle('active', tab === 'milestones');
        
        this.renderProgress();
    }

    renderProgress() {
        if (!this.progressTabContent) return;
        this.progressTabContent.innerHTML = '';
        
        const level = this.level;
        const totalStars = this.getTotalStars();
        const dailyWins = parseInt(localStorage.getItem('colorSortDailyWinsCount') || '0');
        const starsObj = JSON.parse(localStorage.getItem('colorSortLevelStars') || '{}');

        if (this.progressTab === 'map') {
            const container = document.createElement('div');
            container.className = 'progress-map';
            
            const worlds = [
                { name: "Berry Garden 🍓", range: [1, 5] },
                { name: "Fruit Orchard 🍊", range: [6, 15] },
                { name: "Tropical Garden 🍉", range: [16, 100] }
            ];
            
            worlds.forEach(w => {
                if (level >= w.range[0]) {
                    const section = document.createElement('div');
                    section.className = 'map-world-section';
                    section.innerHTML = `<h3>${w.name}</h3>`;
                    
                    const grid = document.createElement('div');
                    grid.className = 'map-grid';
                    
                    const maxRenderLvl = Math.min(w.range[1], level + 3);
                    for (let l = w.range[0]; l <= maxRenderLvl; l++) {
                        const isCompleted = l < level;
                        const isCurrent = l === level;
                        const isLocked = l > level;
                        
                        let starDisplay = '';
                        if (isCompleted) {
                            const lStars = starsObj[l] || 1;
                            starDisplay = '⭐'.repeat(lStars) + '☆'.repeat(3 - lStars);
                        } else if (isCurrent) {
                            starDisplay = '🎯 Active';
                        } else {
                            starDisplay = '🔒 Locked';
                        }
                        
                        const item = document.createElement('div');
                        item.className = `map-node ${isCurrent ? 'current' : (isLocked ? 'locked' : 'completed')}`;
                        item.innerHTML = `
                            <span class="map-level-num">Lvl ${l}</span>
                            <span class="map-level-stars">${starDisplay}</span>
                        `;
                        if (!isLocked) {
                            item.onclick = () => {
                                this.level = l;
                                this.initLevel();
                                this.toggleProgressModal();
                            };
                        }
                        grid.appendChild(item);
                    }
                    section.appendChild(grid);
                    container.appendChild(section);
                }
            });
            this.progressTabContent.appendChild(container);
            
        } else if (this.progressTab === 'fruits') {
            const container = document.createElement('div');
            container.className = 'progress-fruits-grid';
            
            const fruits = [
                { char: '🍓', name: 'Strawberry', req: 0, desc: 'Sweet starter!' },
                { char: '🫐', name: 'Blueberry', req: 0, desc: 'Juicy berry!' },
                { char: '🍏', name: 'Green Apple', req: 0, desc: 'Sour bite!' },
                { char: '🍊', name: 'Orange', req: 4, desc: 'Zesty orange!' },
                { char: '🍋', name: 'Lemon', req: 7, desc: 'Super sour!' },
                { char: '🍇', name: 'Grape', req: 11, desc: 'Perfect grape!' },
                { char: '🍑', name: 'Peach', req: 16, desc: 'Soft peach!' },
                { char: '🍈', name: 'Melon', req: 22, desc: 'Tropical melon!' }
            ];
            
            fruits.forEach(f => {
                const isUnlocked = level >= f.req;
                const div = document.createElement('div');
                div.className = `collection-item ${isUnlocked ? 'unlocked' : 'locked'}`;
                
                div.innerHTML = `
                    <span class="collection-char">${isUnlocked ? f.char : '🔒'}</span>
                    <span class="collection-name">${f.name}</span>
                    <span class="collection-desc">${isUnlocked ? f.desc : 'Reach Lvl ' + f.req}</span>
                `;
                container.appendChild(div);
            });
            this.progressTabContent.appendChild(container);
            
        } else if (this.progressTab === 'milestones') {
            const container = document.createElement('div');
            container.className = 'progress-milestones';
            
            const achievements = [
                {
                    title: "Candy Garden Mastery 🍬",
                    desc: "Unlock Candy Bottle skin at Level 10",
                    current: level,
                    target: 10,
                    id: "skin-candy"
                },
                {
                    title: "Star Collector 🌈",
                    desc: "Unlock Rainbow Bottle skin at 20 Stars",
                    current: totalStars,
                    target: 20,
                    id: "skin-rainbow"
                },
                {
                    title: "Daily Challenger 🐰",
                    desc: "Unlock Bunny Bottle skin at 5 Daily wins",
                    current: dailyWins,
                    target: 5,
                    id: "skin-bunny"
                }
            ];
            
            achievements.forEach(a => {
                const isCompleted = a.current >= a.target;
                const isEquipped = this.activeSkin === a.id;
                const pct = Math.min(100, Math.floor((a.current / a.target) * 100));
                
                let btnHtml = '';
                if (isCompleted) {
                    btnHtml = `<button class="btn btn-buy ${isEquipped ? 'btn-secondary' : 'btn-premium'}" onclick="game.equipMilestoneSkin('${a.id}')">${isEquipped ? 'Equipped' : 'Equip'}</button>`;
                } else {
                    btnHtml = `<button class="btn btn-secondary btn-buy" disabled>In Progress</button>`;
                }
                
                const div = document.createElement('div');
                div.className = 'milestone-card';
                div.innerHTML = `
                    <div class="milestone-info">
                        <h4>${a.title}</h4>
                        <p>${a.desc}</p>
                    </div>
                    <div class="milestone-progress-section">
                        <div class="milestone-bar-bg">
                            <div class="milestone-bar-fill" style="width: ${pct}%"></div>
                        </div>
                        <span class="milestone-progress-text">${a.current} / ${a.target}</span>
                    </div>
                    ${btnHtml}
                `;
                container.appendChild(div);
            });
            this.progressTabContent.appendChild(container);
        }
    }

    equipMilestoneSkin(id) {
        if (!this.purchasedItems.includes(id)) {
            this.purchasedItems.push(id);
            localStorage.setItem('colorSortPurchased', JSON.stringify(this.purchasedItems));
        }
        this.activeSkin = id;
        localStorage.setItem('colorSortActiveSkin', id);
        this.applyLabBackground();
        this.renderProgress();
        this.renderBoard();
    }

    saveActiveState() {
        const stateObj = {
            level: this.level,
            isDailyChallenge: this.isDailyChallenge,
            tubes: this.tubes,
            tubeStates: this.tubeStates,
            moveHistory: this.moveHistory,
            hintsUsedThisLevel: this.hintsUsedThisLevel
        };
        localStorage.setItem('colorSortActiveGameState', JSON.stringify(stateObj));
    }

    clearActiveState() {
        localStorage.removeItem('colorSortActiveGameState');
    }

    showLegal(type) {
        this.legalModal.classList.remove('hidden');
        if (type === 'privacy') {
            this.legalTitle.textContent = "Privacy Policy";
            this.legalText.innerHTML = `
                <p><strong>Mystic Alchemy</strong> respects your privacy. We do not collect personal identification information.</p>
                <p><strong>Data Storage:</strong> All game progress, diamonds, and settings are stored locally on your device using LocalStorage. We do not have access to this data.</p>
                <p><strong>Ads & Analytics:</strong> This application is ad-free and does not use third-party tracking or analytics services.</p>
                <p><strong>Changes:</strong> We may update our Privacy Policy from time to time. You are advised to review this page periodically for any changes.</p>
            `;
        } else {
            this.legalTitle.textContent = "Terms of Service";
            this.legalText.innerHTML = `
                <p>By downloading or using the <strong>Mystic Alchemy</strong> app, these terms will automatically apply to you.</p>
                <p><strong>Usage:</strong> You are not allowed to copy, or modify the app, any part of the app, or our trademarks in any way.</p>
                <p><strong>Content:</strong> All mystical elements, elixir designs, and arcane symbols are the intellectual property of Skyforge.</p>
                <p><strong>Liability:</strong> Skyforge is not responsible for any direct or indirect loss resulting from the use of this magical application.</p>
            `;
        }
    }

    hideLegal() {
        this.legalModal.classList.add('hidden');
    }
}

// Initialize game
const game = new Game();
window.game = game;
