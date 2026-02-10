// Add to backend/server.js

// Gamification endpoints

// Get user gamification data
app.get('/api/gamification/:userId', authenticateToken, (req, res) => {
    try {
        const userId = req.params.userId;
        
        // In-memory storage for gamification data (replace with database)
        const gamificationData = gamificationStorage[userId] || {
            userStats: {
                xp: 0,
                level: 1,
                gems: 100,
                streak: 0,
                longestStreak: 0,
                lastActive: null,
                totalXP: 0
            },
            dailyMissions: [],
            badges: [],
            powerUps: []
        };

        res.json({
            success: true,
            data: gamificationData
        });
    } catch (error) {
        console.error('Get gamification error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Update user gamification data
app.post('/api/gamification/:userId', authenticateToken, (req, res) => {
    try {
        const userId = req.params.userId;
        const { userStats, dailyMissions, badges, powerUps } = req.body;

        // Validate data
        if (!userStats) {
            return res.status(400).json({ 
                success: false, 
                error: 'User stats required' 
            });
        }

        // Store data (replace with database)
        gamificationStorage[userId] = {
            userStats,
            dailyMissions: dailyMissions || [],
            badges: badges || [],
            powerUps: powerUps || [],
            updatedAt: new Date().toISOString()
        };

        res.json({
            success: true,
            message: 'Gamification data updated successfully'
        });
    } catch (error) {
        console.error('Update gamification error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Add XP to user
app.post('/api/gamification/:userId/xp', authenticateToken, (req, res) => {
    try {
        const userId = req.params.userId;
        const { amount, source } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'Valid XP amount required' 
            });
        }

        // Get current data
        const currentData = gamificationStorage[userId] || {
            userStats: { xp: 0, level: 1, gems: 100, streak: 0, longestStreak: 0, totalXP: 0 }
        };

        // Update XP
        const newXP = currentData.userStats.xp + amount;
        const newTotalXP = currentData.userStats.totalXP + amount;
        
        // Calculate new level
        const newLevel = calculateLevel(newTotalXP);
        const levelUp = newLevel > currentData.userStats.level;

        // Update data
        currentData.userStats.xp = newXP;
        currentData.userStats.totalXP = newTotalXP;
        currentData.userStats.level = newLevel;

        // Level up rewards
        if (levelUp) {
            currentData.userStats.gems += newLevel * 10;
        }

        gamificationStorage[userId] = currentData;

        res.json({
            success: true,
            data: {
                newXP,
                newLevel,
                levelUp,
                gemsEarned: levelUp ? newLevel * 10 : 0
            }
        });
    } catch (error) {
        console.error('Add XP error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// In-memory storage (replace with database)
let gamificationStorage = {};

// Helper function to calculate level
function calculateLevel(totalXP) {
    const LEVEL_XP_REQUIREMENTS = [
        0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500,
        6600, 7800, 9100, 10500, 12000, 13600, 15300, 17100, 19000, 21000
    ];
    
    for (let i = LEVEL_XP_REQUIREMENTS.length - 1; i >= 0; i--) {
        if (totalXP >= LEVEL_XP_REQUIREMENTS[i]) {
            return i + 1;
        }
    }
    return 1;
}