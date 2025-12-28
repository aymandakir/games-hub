// Leaderboard System using Supabase (Free Tier)
// Supabase setup: https://supabase.com

class Leaderboard {
    constructor() {
        // Supabase configuration (replace with your project URL and anon key)
        this.supabaseUrl = 'https://your-project.supabase.co';
        this.supabaseKey = 'your-anon-key';
        this.tableName = 'game_scores';
        
        // Fallback to localStorage if Supabase not configured
        this.useLocalStorage = !this.supabaseUrl.includes('your-project');
    }

    async init() {
        if (this.useLocalStorage) {
            console.log('Leaderboard: Using localStorage fallback');
            return;
        }

        // Initialize Supabase client
        if (typeof supabase === 'undefined') {
            // Load Supabase client library
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            document.head.appendChild(script);
            
            await new Promise((resolve) => {
                script.onload = resolve;
            });
        }

        this.supabase = supabase.createClient(this.supabaseUrl, this.supabaseKey);
    }

    async submitScore(gameId, playerName, score, metadata = {}) {
        const scoreData = {
            game_id: gameId,
            player_name: playerName || 'Anonymous',
            score: score,
            metadata: metadata,
            created_at: new Date().toISOString()
        };

        if (this.useLocalStorage) {
            return this.submitScoreLocal(gameId, playerName, score, metadata);
        }

        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .insert([scoreData])
                .select();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Leaderboard submit error:', error);
            // Fallback to localStorage
            return this.submitScoreLocal(gameId, playerName, score, metadata);
        }
    }

    submitScoreLocal(gameId, playerName, score, metadata) {
        const scores = JSON.parse(localStorage.getItem('leaderboard') || '{}');
        if (!scores[gameId]) scores[gameId] = [];
        
        scores[gameId].push({
            player_name: playerName || 'Anonymous',
            score: score,
            metadata: metadata,
            created_at: new Date().toISOString()
        });

        // Keep top 100 scores per game
        scores[gameId].sort((a, b) => b.score - a.score);
        scores[gameId] = scores[gameId].slice(0, 100);
        
        localStorage.setItem('leaderboard', JSON.stringify(scores));
        return { success: true, local: true };
    }

    async getTopScores(gameId, limit = 10) {
        if (this.useLocalStorage) {
            return this.getTopScoresLocal(gameId, limit);
        }

        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .select('*')
                .eq('game_id', gameId)
                .order('score', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return { success: true, data: data || [] };
        } catch (error) {
            console.error('Leaderboard fetch error:', error);
            return this.getTopScoresLocal(gameId, limit);
        }
    }

    getTopScoresLocal(gameId, limit) {
        const scores = JSON.parse(localStorage.getItem('leaderboard') || '{}');
        const gameScores = (scores[gameId] || []).slice(0, limit);
        return { success: true, data: gameScores, local: true };
    }

    async getPlayerRank(gameId, score) {
        if (this.useLocalStorage) {
            return this.getPlayerRankLocal(gameId, score);
        }

        try {
            const { count } = await this.supabase
                .from(this.tableName)
                .select('*', { count: 'exact', head: true })
                .eq('game_id', gameId)
                .gt('score', score);

            return { success: true, rank: (count || 0) + 1 };
        } catch (error) {
            console.error('Leaderboard rank error:', error);
            return this.getPlayerRankLocal(gameId, score);
        }
    }

    getPlayerRankLocal(gameId, score) {
        const scores = JSON.parse(localStorage.getItem('leaderboard') || '{}');
        const gameScores = scores[gameId] || [];
        const rank = gameScores.filter(s => s.score > score).length + 1;
        return { success: true, rank, local: true };
    }
}

// Export singleton instance
const leaderboard = new Leaderboard();
leaderboard.init();

