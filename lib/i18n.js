// Internationalization (i18n) System
// Multi-language support: EN, IT, ES, FR

class I18n {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'en';
        this.translations = {
            en: {
                // Common
                'play': 'Play',
                'pause': 'Pause',
                'restart': 'Restart',
                'score': 'Score',
                'high_score': 'High Score',
                'game_over': 'Game Over',
                'victory': 'Victory',
                'settings': 'Settings',
                'share': 'Share',
                'leaderboard': 'Leaderboard',
                'achievements': 'Achievements',
                
                // Neon Breakout
                'neon_breakout': 'Neon Breakout',
                'breakout_description': 'Classic arcade action with cyberpunk visuals!',
                'lives': 'Lives',
                'final_score': 'Final Score',
                
                // Pixel Garden
                'pixel_garden': 'Pixel Garden',
                'garden_description': 'Grow your pixel garden in this relaxing idle game!',
                'seeds': 'Seeds',
                'prestige': 'Prestige',
                
                // Geometry Dash
                'geometry_dash': 'Geometry Dash Mini',
                'dash_description': 'One-button rhythm platformer!',
                'best_time': 'Best Time',
                'attempts': 'Attempts',
                
                // Hub
                'game_hub': 'Game Hub',
                'all_games': 'All Games',
                'search_games': 'Search games...',
                'featured': 'Featured',
                'new': 'New',
                'arcade': 'Arcade',
                'puzzle': 'Puzzle',
                'casual': 'Casual'
            },
            it: {
                // Common
                'play': 'Gioca',
                'pause': 'Pausa',
                'restart': 'Ricomincia',
                'score': 'Punteggio',
                'high_score': 'Punteggio Massimo',
                'game_over': 'Game Over',
                'victory': 'Vittoria',
                'settings': 'Impostazioni',
                'share': 'Condividi',
                'leaderboard': 'Classifica',
                'achievements': 'Risultati',
                
                // Neon Breakout
                'neon_breakout': 'Neon Breakout',
                'breakout_description': 'Azione arcade classica con visuali cyberpunk!',
                'lives': 'Vite',
                'final_score': 'Punteggio Finale',
                
                // Pixel Garden
                'pixel_garden': 'Giardino Pixel',
                'garden_description': 'Coltiva il tuo giardino pixel in questo rilassante gioco idle!',
                'seeds': 'Semi',
                'prestige': 'Prestigio',
                
                // Geometry Dash
                'geometry_dash': 'Geometry Dash Mini',
                'dash_description': 'Platformer ritmico a un pulsante!',
                'best_time': 'Miglior Tempo',
                'attempts': 'Tentativi',
                
                // Hub
                'game_hub': 'Hub Giochi',
                'all_games': 'Tutti i Giochi',
                'search_games': 'Cerca giochi...',
                'featured': 'In Evidenza',
                'new': 'Nuovo',
                'arcade': 'Arcade',
                'puzzle': 'Puzzle',
                'casual': 'Casuale'
            },
            es: {
                // Common
                'play': 'Jugar',
                'pause': 'Pausa',
                'restart': 'Reiniciar',
                'score': 'Puntuación',
                'high_score': 'Puntuación Máxima',
                'game_over': 'Game Over',
                'victory': 'Victoria',
                'settings': 'Configuración',
                'share': 'Compartir',
                'leaderboard': 'Clasificación',
                'achievements': 'Logros',
                
                // Neon Breakout
                'neon_breakout': 'Neon Breakout',
                'breakout_description': '¡Acción arcade clásica con visuales cyberpunk!',
                'lives': 'Vidas',
                'final_score': 'Puntuación Final',
                
                // Pixel Garden
                'pixel_garden': 'Jardín Pixel',
                'garden_description': '¡Cultiva tu jardín pixel en este relajante juego idle!',
                'seeds': 'Semillas',
                'prestige': 'Prestigio',
                
                // Geometry Dash
                'geometry_dash': 'Geometry Dash Mini',
                'dash_description': '¡Platformer rítmico de un botón!',
                'best_time': 'Mejor Tiempo',
                'attempts': 'Intentos',
                
                // Hub
                'game_hub': 'Hub de Juegos',
                'all_games': 'Todos los Juegos',
                'search_games': 'Buscar juegos...',
                'featured': 'Destacado',
                'new': 'Nuevo',
                'arcade': 'Arcade',
                'puzzle': 'Puzzle',
                'casual': 'Casual'
            },
            fr: {
                // Common
                'play': 'Jouer',
                'pause': 'Pause',
                'restart': 'Redémarrer',
                'score': 'Score',
                'high_score': 'Meilleur Score',
                'game_over': 'Game Over',
                'victory': 'Victoire',
                'settings': 'Paramètres',
                'share': 'Partager',
                'leaderboard': 'Classement',
                'achievements': 'Succès',
                
                // Neon Breakout
                'neon_breakout': 'Neon Breakout',
                'breakout_description': 'Action arcade classique avec visuels cyberpunk !',
                'lives': 'Vies',
                'final_score': 'Score Final',
                
                // Pixel Garden
                'pixel_garden': 'Jardin Pixel',
                'garden_description': 'Cultivez votre jardin pixel dans ce jeu idle relaxant !',
                'seeds': 'Graines',
                'prestige': 'Prestige',
                
                // Geometry Dash
                'geometry_dash': 'Geometry Dash Mini',
                'dash_description': 'Platformer rythmique à un bouton !',
                'best_time': 'Meilleur Temps',
                'attempts': 'Tentatives',
                
                // Hub
                'game_hub': 'Hub de Jeux',
                'all_games': 'Tous les Jeux',
                'search_games': 'Rechercher des jeux...',
                'featured': 'En Vedette',
                'new': 'Nouveau',
                'arcade': 'Arcade',
                'puzzle': 'Puzzle',
                'casual': 'Casual'
            }
        };
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('language', lang);
            this.updatePage();
        }
    }

    t(key, fallback = null) {
        return this.translations[this.currentLang]?.[key] || 
               this.translations['en']?.[key] || 
               fallback || 
               key;
    }

    updatePage() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = this.t(key);
        });

        // Update placeholder attributes
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = this.t(key);
        });

        // Update title attributes
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            el.title = this.t(key);
        });

        // Update HTML lang attribute
        document.documentElement.lang = this.currentLang;
    }

    createLanguageSelector() {
        const selector = document.createElement('div');
        selector.className = 'language-selector';
        selector.innerHTML = `
            <select id="languageSelect" aria-label="Select Language">
                <option value="en" ${this.currentLang === 'en' ? 'selected' : ''}>English</option>
                <option value="it" ${this.currentLang === 'it' ? 'selected' : ''}>Italiano</option>
                <option value="es" ${this.currentLang === 'es' ? 'selected' : ''}>Español</option>
                <option value="fr" ${this.currentLang === 'fr' ? 'selected' : ''}>Français</option>
            </select>
        `;

        selector.querySelector('select').addEventListener('change', (e) => {
            this.setLanguage(e.target.value);
        });

        // Add styles
        if (!document.getElementById('language-selector-style')) {
            const style = document.createElement('style');
            style.id = 'language-selector-style';
            style.textContent = `
                .language-selector {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 1000;
                }
                .language-selector select {
                    padding: 8px 12px;
                    border-radius: 8px;
                    border: 2px solid var(--accent, #667eea);
                    background: var(--bg, #ffffff);
                    color: var(--text, #000000);
                    font-size: 14px;
                    cursor: pointer;
                }
                @media (max-width: 768px) {
                    .language-selector {
                        top: 10px;
                        right: 10px;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        return selector;
    }
}

// Export singleton instance
const i18n = new I18n();

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => i18n.updatePage());
} else {
    i18n.updatePage();
}

