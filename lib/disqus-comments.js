// Disqus Comments Integration
// Simple Disqus integration below each game

class DisqusComments {
    constructor() {
        // Replace with your Disqus shortname (free tier)
        this.shortname = 'your-disqus-shortname';
        this.loaded = false;
    }

    init(identifier, title, url) {
        if (this.loaded) {
            this.reset(identifier, title, url);
            return;
        }

        // Load Disqus script
        const script = document.createElement('script');
        script.src = `https://${this.shortname}.disqus.com/embed.js`;
        script.setAttribute('data-timestamp', +new Date());
        script.async = true;
        script.defer = true;
        (document.head || document.body).appendChild(script);

        this.loaded = true;
        this.reset(identifier, title, url);
    }

    reset(identifier, title, url) {
        if (typeof DISQUS !== 'undefined') {
            DISQUS.reset({
                reload: true,
                config: function() {
                    this.page.identifier = identifier;
                    this.page.url = url || window.location.href;
                    this.page.title = title || document.title;
                }
            });
        } else {
            // Wait for Disqus to load
            setTimeout(() => this.reset(identifier, title, url), 100);
        }
    }

    createCommentsSection(gameId, gameTitle) {
        const container = document.createElement('div');
        container.id = 'disqus_thread';
        container.className = 'disqus-comments';
        container.setAttribute('data-game-id', gameId);
        
        // Add styles
        if (!document.getElementById('disqus-comments-style')) {
            const style = document.createElement('style');
            style.id = 'disqus-comments-style';
            style.textContent = `
                .disqus-comments {
                    max-width: 800px;
                    margin: 40px auto;
                    padding: 20px;
                    background: var(--bg, #ffffff);
                    border-radius: 12px;
                }
                .disqus-comments h3 {
                    margin-bottom: 20px;
                    color: var(--text, #000000);
                }
                @media (max-width: 768px) {
                    .disqus-comments {
                        margin: 20px;
                        padding: 16px;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Initialize Disqus
        this.init(`game-${gameId}`, gameTitle, window.location.href);

        return container;
    }
}

// Export singleton instance
const disqusComments = new DisqusComments();

