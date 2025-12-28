// Accessibility System
// Screen reader support and reduced motion mode

class Accessibility {
    constructor() {
        this.reducedMotion = this.loadReducedMotion();
        this.init();
    }

    loadReducedMotion() {
        // Check user preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const saved = localStorage.getItem('reducedMotion');
        return saved === 'true' || (saved === null && prefersReducedMotion);
    }

    init() {
        // Apply reduced motion if enabled
        if (this.reducedMotion) {
            document.documentElement.setAttribute('data-reduced-motion', 'true');
        }

        // Listen for system preference changes
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            if (e.matches && !localStorage.getItem('reducedMotion')) {
                this.setReducedMotion(true);
            }
        });

        // Add skip to content link
        this.addSkipLink();

        // Enhance keyboard navigation
        this.enhanceKeyboardNav();

        // Add ARIA labels to interactive elements
        this.addAriaLabels();
    }

    setReducedMotion(enabled) {
        this.reducedMotion = enabled;
        localStorage.setItem('reducedMotion', enabled ? 'true' : 'false');
        
        if (enabled) {
            document.documentElement.setAttribute('data-reduced-motion', 'true');
        } else {
            document.documentElement.removeAttribute('data-reduced-motion');
        }
    }

    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 0;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            z-index: 10000;
        `;
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '0';
        });
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    enhanceKeyboardNav() {
        // Add keyboard navigation for game cards
        document.querySelectorAll('.game-card').forEach(card => {
            if (!card.hasAttribute('tabindex')) {
                card.setAttribute('tabindex', '0');
            }
            
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });

        // Add keyboard navigation for buttons
        document.querySelectorAll('button').forEach(btn => {
            if (!btn.hasAttribute('tabindex')) {
                btn.setAttribute('tabindex', '0');
            }
        });
    }

    addAriaLabels() {
        // Add ARIA labels to icon buttons
        document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])').forEach(btn => {
            if (btn.textContent.trim() === '' && btn.querySelector('svg')) {
                const icon = btn.querySelector('svg');
                const title = icon.querySelector('title');
                if (title) {
                    btn.setAttribute('aria-label', title.textContent);
                }
            }
        });

        // Add ARIA live regions for dynamic content
        if (!document.getElementById('aria-live')) {
            const liveRegion = document.createElement('div');
            liveRegion.id = 'aria-live';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
            document.body.appendChild(liveRegion);
        }
    }

    announce(message, priority = 'polite') {
        const liveRegion = document.getElementById('aria-live');
        if (liveRegion) {
            liveRegion.setAttribute('aria-live', priority);
            liveRegion.textContent = message;
            // Clear after announcement
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    createAccessibilityMenu() {
        const menu = document.createElement('div');
        menu.className = 'accessibility-menu';
        menu.innerHTML = `
            <button class="accessibility-toggle" aria-label="Accessibility Settings" aria-expanded="false">
                ♿
            </button>
            <div class="accessibility-panel" style="display: none;">
                <h3>Accessibility Settings</h3>
                <label>
                    <input type="checkbox" id="reducedMotion" ${this.reducedMotion ? 'checked' : ''}>
                    Reduce Motion
                </label>
                <button id="resetSettings">Reset Settings</button>
            </div>
        `;

        // Add styles
        if (!document.getElementById('accessibility-menu-style')) {
            const style = document.createElement('style');
            style.id = 'accessibility-menu-style';
            style.textContent = `
                .accessibility-menu {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 1000;
                }
                .accessibility-toggle {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: #667eea;
                    color: white;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                }
                .accessibility-panel {
                    position: absolute;
                    bottom: 60px;
                    right: 0;
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    min-width: 200px;
                }
                .accessibility-panel label {
                    display: block;
                    margin: 10px 0;
                }
                @media (max-width: 768px) {
                    .accessibility-menu {
                        bottom: 10px;
                        right: 10px;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Add event listeners
        const toggle = menu.querySelector('.accessibility-toggle');
        const panel = menu.querySelector('.accessibility-panel');
        const checkbox = menu.querySelector('#reducedMotion');
        const resetBtn = menu.querySelector('#resetSettings');

        toggle.addEventListener('click', () => {
            const isExpanded = panel.style.display !== 'none';
            panel.style.display = isExpanded ? 'none' : 'block';
            toggle.setAttribute('aria-expanded', !isExpanded);
        });

        checkbox.addEventListener('change', (e) => {
            this.setReducedMotion(e.target.checked);
        });

        resetBtn.addEventListener('click', () => {
            this.setReducedMotion(false);
            checkbox.checked = false;
            localStorage.removeItem('reducedMotion');
        });

        return menu;
    }
}

// Export singleton instance
const accessibility = new Accessibility();

// Add reduced motion CSS
if (!document.getElementById('reduced-motion-style')) {
    const style = document.createElement('style');
    style.id = 'reduced-motion-style';
    style.textContent = `
        @media (prefers-reduced-motion: reduce), [data-reduced-motion="true"] {
            *,
            *::before,
            *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        }
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border-width: 0;
        }
    `;
    document.head.appendChild(style);
}

