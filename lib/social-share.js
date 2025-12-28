// Social Sharing System
// One-click Twitter/LinkedIn share with pre-filled text

class SocialShare {
    constructor() {
        this.baseUrl = window.location.origin;
    }

    shareTwitter(gameTitle, score = null, gameUrl = null) {
        const url = gameUrl || window.location.href;
        let text = `Just played ${gameTitle} on Game Hub!`;
        
        if (score !== null) {
            text = `Just scored ${score} in ${gameTitle}! 🎮`;
        }

        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=HTML5Games,WebGames,GameHub`;
        this.openShareWindow(twitterUrl, 550, 420);
    }

    shareLinkedIn(gameTitle, score = null, gameUrl = null) {
        const url = gameUrl || window.location.href;
        let text = `Just played ${gameTitle} on Game Hub!`;
        
        if (score !== null) {
            text = `Just scored ${score} in ${gameTitle}! 🎮`;
        }

        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        this.openShareWindow(linkedInUrl, 600, 500);
    }

    shareFacebook(gameTitle, gameUrl = null) {
        const url = gameUrl || window.location.href;
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        this.openShareWindow(facebookUrl, 600, 500);
    }

    shareNative(gameTitle, score = null, gameUrl = null) {
        if (!navigator.share) {
            // Fallback to clipboard
            this.copyToClipboard(gameUrl || window.location.href);
            return;
        }

        const url = gameUrl || window.location.href;
        let text = `Check out ${gameTitle} on Game Hub!`;
        
        if (score !== null) {
            text = `I scored ${score} in ${gameTitle}! 🎮`;
        }

        navigator.share({
            title: gameTitle,
            text: text,
            url: url
        }).catch(err => {
            console.log('Share cancelled or failed:', err);
        });
    }

    openShareWindow(url, width = 600, height = 500) {
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        
        window.open(
            url,
            'share',
            `width=${width},height=${height},left=${left},top=${top},toolbar=0,menubar=0,location=0,status=0`
        );
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Link copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
            this.showToast('Failed to copy link');
        }
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'share-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 14px;
            animation: fadeInOut 2s ease;
        `;
        
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    createShareButtons(gameTitle, score = null, gameUrl = null) {
        const container = document.createElement('div');
        container.className = 'share-buttons';
        container.innerHTML = `
            <button class="share-btn twitter" aria-label="Share on Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
                Twitter
            </button>
            <button class="share-btn linkedin" aria-label="Share on LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                LinkedIn
            </button>
            <button class="share-btn native" aria-label="Share">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                </svg>
                Share
            </button>
        `;

        // Add styles
        if (!document.getElementById('share-buttons-style')) {
            const style = document.createElement('style');
            style.id = 'share-buttons-style';
            style.textContent = `
                .share-buttons {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                    margin: 20px 0;
                }
                .share-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 16px;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: white;
                }
                .share-btn.twitter {
                    background: #1DA1F2;
                }
                .share-btn.twitter:hover {
                    background: #1a8cd8;
                    transform: translateY(-2px);
                }
                .share-btn.linkedin {
                    background: #0077b5;
                }
                .share-btn.linkedin:hover {
                    background: #006399;
                    transform: translateY(-2px);
                }
                .share-btn.native {
                    background: #667eea;
                }
                .share-btn.native:hover {
                    background: #5568d3;
                    transform: translateY(-2px);
                }
                @keyframes fadeInOut {
                    0%, 100% { opacity: 0; transform: translateX(-50%) translateY(10px); }
                    10%, 90% { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }

        // Add event listeners
        container.querySelector('.twitter').addEventListener('click', () => {
            this.shareTwitter(gameTitle, score, gameUrl);
        });
        container.querySelector('.linkedin').addEventListener('click', () => {
            this.shareLinkedIn(gameTitle, score, gameUrl);
        });
        container.querySelector('.native').addEventListener('click', () => {
            this.shareNative(gameTitle, score, gameUrl);
        });

        return container;
    }
}

// Export singleton instance
const socialShare = new SocialShare();

