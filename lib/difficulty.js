// Difficulty System
// Easy/Normal/Hard toggle in settings

class DifficultySystem {
    constructor() {
        this.difficulties = {
            easy: { multiplier: 0.7, label: 'Easy' },
            normal: { multiplier: 1.0, label: 'Normal' },
            hard: { multiplier: 1.5, label: 'Hard' }
        };
        
        this.currentDifficulty = this.loadDifficulty();
    }

    loadDifficulty() {
        return localStorage.getItem('difficulty') || 'normal';
    }

    setDifficulty(difficulty) {
        if (this.difficulties[difficulty]) {
            this.currentDifficulty = difficulty;
            localStorage.setItem('difficulty', difficulty);
            this.onDifficultyChange(difficulty);
        }
    }

    getMultiplier() {
        return this.difficulties[this.currentDifficulty].multiplier;
    }

    getLabel() {
        return this.difficulties[this.currentDifficulty].label;
    }

    onDifficultyChange(difficulty) {
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('difficultyChanged', {
            detail: { difficulty, multiplier: this.difficulties[difficulty].multiplier }
        }));
    }

    createDifficultySelector() {
        const container = document.createElement('div');
        container.className = 'difficulty-selector';
        container.innerHTML = `
            <label for="difficultySelect">Difficulty:</label>
            <select id="difficultySelect" aria-label="Select Difficulty">
                ${Object.keys(this.difficulties).map(diff => `
                    <option value="${diff}" ${this.currentDifficulty === diff ? 'selected' : ''}>
                        ${this.difficulties[diff].label}
                    </option>
                `).join('')}
            </select>
        `;

        // Add styles
        if (!document.getElementById('difficulty-selector-style')) {
            const style = document.createElement('style');
            style.id = 'difficulty-selector-style';
            style.textContent = `
                .difficulty-selector {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin: 20px 0;
                }
                .difficulty-selector label {
                    font-weight: 500;
                    color: var(--text, #000000);
                }
                .difficulty-selector select {
                    padding: 8px 12px;
                    border-radius: 8px;
                    border: 2px solid var(--accent, #667eea);
                    background: var(--bg, #ffffff);
                    color: var(--text, #000000);
                    font-size: 14px;
                    cursor: pointer;
                }
            `;
            document.head.appendChild(style);
        }

        // Add event listener
        const select = container.querySelector('#difficultySelect');
        select.addEventListener('change', (e) => {
            this.setDifficulty(e.target.value);
        });

        return container;
    }

    applyToGame(gameConfig) {
        const multiplier = this.getMultiplier();
        
        // Apply difficulty multiplier to game config
        if (gameConfig.ballSpeed) gameConfig.ballSpeed *= multiplier;
        if (gameConfig.enemySpeed) gameConfig.enemySpeed *= multiplier;
        if (gameConfig.spawnRate) gameConfig.spawnRate *= multiplier;
        if (gameConfig.damage) gameConfig.damage *= multiplier;
        if (gameConfig.health) gameConfig.health /= multiplier;
        
        return gameConfig;
    }
}

// Export singleton instance
const difficulty = new DifficultySystem();

