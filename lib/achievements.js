// Achievement System
// Unlock badges for milestones across games

class AchievementSystem {
    constructor() {
        this.achievements = {
            // Neon Breakout
            'breakout_first_play': {
                id: 'breakout_first_play',
                name: 'First Break',
                description: 'Play your first game of Neon Breakout',
                icon: '🎯',
                game: 'neon-breakout',
                condition: (data) => data.plays >= 1
            },
            'breakout_1000': {
                id: 'breakout_1000',
                name: 'Breaking Through',
                description: 'Score 1000 points in Neon Breakout',
                icon: '💯',
                game: 'neon-breakout',
                condition: (data) => data.highScore >= 1000
            },
            'breakout_5000': {
                id: 'breakout_5000',
                name: 'Brick Master',
                description: 'Score 5000 points in Neon Breakout',
                icon: '👑',
                game: 'neon-breakout',
                condition: (data) => data.highScore >= 5000
            },
            'breakout_10k': {
                id: 'breakout_10k',
                name: 'Neon Legend',
                description: 'Score 10000 points in Neon Breakout',
                icon: '⭐',
                game: 'neon-breakout',
                condition: (data) => data.highScore >= 10000
            },
            'breakout_victory': {
                id: 'breakout_victory',
                name: 'Clear Victory',
                description: 'Clear all bricks in Neon Breakout',
                icon: '🏆',
                game: 'neon-breakout',
                condition: (data) => data.victories >= 1
            },

            // Pixel Garden
            'garden_first_play': {
                id: 'garden_first_play',
                name: 'Green Thumb',
                description: 'Start your first garden',
                icon: '🌱',
                game: 'pixel-garden',
                condition: (data) => data.plays >= 1
            },
            'garden_10k': {
                id: 'garden_10k',
                name: 'Seed Collector',
                description: 'Accumulate 10,000 seeds',
                icon: '💰',
                game: 'pixel-garden',
                condition: (data) => data.maxSeeds >= 10000
            },
            'garden_prestige': {
                id: 'garden_prestige',
                name: 'Garden Master',
                description: 'Perform your first prestige',
                icon: '🌟',
                game: 'pixel-garden',
                condition: (data) => data.prestiges >= 1
            },
            'garden_all_flowers': {
                id: 'garden_all_flowers',
                name: 'Floral Expert',
                description: 'Unlock all flower types',
                icon: '🌸',
                game: 'pixel-garden',
                condition: (data) => data.unlockedFlowers >= 6
            },

            // Geometry Dash Mini
            'dash_first_play': {
                id: 'dash_first_play',
                name: 'First Jump',
                description: 'Play your first game of Geometry Dash Mini',
                icon: '⚡',
                game: 'geometry-dash-mini',
                condition: (data) => data.plays >= 1
            },
            'dash_complete': {
                id: 'dash_complete',
                name: 'Speed Demon',
                description: 'Complete Geometry Dash Mini',
                icon: '🏁',
                game: 'geometry-dash-mini',
                condition: (data) => data.completions >= 1
            },
            'dash_under_30': {
                id: 'dash_under_30',
                name: 'Lightning Fast',
                description: 'Complete in under 30 seconds',
                icon: '⚡',
                game: 'geometry-dash-mini',
                condition: (data) => data.bestTime > 0 && data.bestTime < 30
            },
            'dash_10_attempts': {
                id: 'dash_10_attempts',
                name: 'Persistent',
                description: 'Attempt Geometry Dash Mini 10 times',
                icon: '💪',
                game: 'geometry-dash-mini',
                condition: (data) => data.attempts >= 10
            },

            // Cross-game achievements
            'play_all_games': {
                id: 'play_all_games',
                name: 'Game Explorer',
                description: 'Play all three games',
                icon: '🎮',
                game: 'all',
                condition: (data) => {
                    const games = ['neon-breakout', 'pixel-garden', 'geometry-dash-mini'];
                    return games.every(game => data[game]?.plays >= 1);
                }
            },
            'total_playtime_1h': {
                id: 'total_playtime_1h',
                name: 'Dedicated Player',
                description: 'Play for a total of 1 hour',
                icon: '⏰',
                game: 'all',
                condition: (data) => data.totalPlayTime >= 3600
            },
            'total_playtime_10h': {
                id: 'total_playtime_10h',
                name: 'Hardcore Gamer',
                description: 'Play for a total of 10 hours',
                icon: '🔥',
                game: 'all',
                condition: (data) => data.totalPlayTime >= 36000
            }
        };

        this.unlocked = this.loadUnlocked();
    }

    loadUnlocked() {
        return JSON.parse(localStorage.getItem('achievements') || '[]');
    }

    saveUnlocked() {
        localStorage.setItem('achievements', JSON.stringify(this.unlocked));
    }

    isUnlocked(achievementId) {
        return this.unlocked.includes(achievementId);
    }

    unlock(achievementId) {
        if (this.isUnlocked(achievementId)) {
            return false;
        }

        this.unlocked.push(achievementId);
        this.saveUnlocked();
        this.showNotification(this.achievements[achievementId]);
        return true;
    }

    checkAchievements(gameId, gameData) {
        const gameAchievements = Object.values(this.achievements).filter(
            ach => ach.game === gameId || ach.game === 'all'
        );

        let newUnlocks = 0;
        gameAchievements.forEach(achievement => {
            if (!this.isUnlocked(achievement.id)) {
                // Get all game data for cross-game achievements
                const allGameData = this.getAllGameData();
                if (achievement.condition(allGameData)) {
                    this.unlock(achievement.id);
                    newUnlocks++;
                }
            }
        });

        return newUnlocks;
    }

    getAllGameData() {
        // Load analytics data from localStorage
        const sessions = JSON.parse(localStorage.getItem('gameSessions') || '[]');
        const data = {
            'neon-breakout': { plays: 0, highScore: 0, victories: 0 },
            'pixel-garden': { plays: 0, maxSeeds: 0, prestiges: 0, unlockedFlowers: 0 },
            'geometry-dash-mini': { plays: 0, completions: 0, bestTime: Infinity, attempts: 0 },
            totalPlayTime: 0
        };

        sessions.forEach(session => {
            const gameId = session.gameId;
            if (!data[gameId]) return;

            data[gameId].plays++;
            data.totalPlayTime += (session.sessionEnd - session.sessionStart) / 1000;

            session.events.forEach(event => {
                if (event.name === 'victory') {
                    if (gameId === 'neon-breakout') data[gameId].victories++;
                    if (gameId === 'geometry-dash-mini') data[gameId].completions++;
                }
                if (event.name === 'game_over' && event.data?.finalScore) {
                    data[gameId].highScore = Math.max(data[gameId].highScore, event.data.finalScore);
                }
                if (event.name === 'prestige') {
                    data[gameId].prestiges++;
                }
                if (event.name === 'flower_unlock') {
                    data[gameId].unlockedFlowers = Math.max(
                        data[gameId].unlockedFlowers,
                        event.data.totalUnlocked || 0
                    );
                }
                if (event.name === 'victory' && event.data?.finalTime) {
                    if (data[gameId].bestTime === Infinity || event.data.finalTime < data[gameId].bestTime) {
                        data[gameId].bestTime = event.data.finalTime;
                    }
                }
                if (event.name === 'game_start' && event.data?.attempts) {
                    data[gameId].attempts = Math.max(data[gameId].attempts, event.data.attempts);
                }
            });
        });

        return data;
    }

    showNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-content">
                <div class="achievement-title">Achievement Unlocked!</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.description}</div>
            </div>
        `;

        // Add styles if not already added
        if (!document.getElementById('achievement-styles')) {
            const style = document.createElement('style');
            style.id = 'achievement-styles';
            style.textContent = `
                .achievement-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 20px;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                    z-index: 10000;
                    display: flex;
                    gap: 16px;
                    align-items: center;
                    min-width: 300px;
                    animation: slideInRight 0.3s ease-out;
                }
                .achievement-icon {
                    font-size: 48px;
                    line-height: 1;
                }
                .achievement-content {
                    flex: 1;
                }
                .achievement-title {
                    font-size: 12px;
                    opacity: 0.9;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 4px;
                }
                .achievement-name {
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 4px;
                }
                .achievement-desc {
                    font-size: 14px;
                    opacity: 0.9;
                }
                @keyframes slideInRight {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @media (max-width: 768px) {
                    .achievement-notification {
                        right: 10px;
                        left: 10px;
                        min-width: auto;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    getUnlockedAchievements() {
        return this.unlocked.map(id => this.achievements[id]).filter(Boolean);
    }

    getAllAchievements() {
        return Object.values(this.achievements);
    }

    getProgress() {
        const total = Object.keys(this.achievements).length;
        const unlocked = this.unlocked.length;
        return {
            total,
            unlocked,
            percentage: Math.round((unlocked / total) * 100)
        };
    }
}

// Export singleton instance
const achievements = new AchievementSystem();

