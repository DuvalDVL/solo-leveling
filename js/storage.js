const StorageManager = {
    SAVE_KEY: 'solo_leveling_save',

    createDefaultSave() {
        return {
            mode: 1, preAwakeningStep: 1, day: 1, daysLeft: 30,
            stats: { hp: 100, maxHp: 100, mp: 50, maxMp: 50, money: 500, fatigue: 0, morale: 100, strength: 10, agility: 10, intelligence: 10, perception: 10, vitality: 10 },
            profile: { rank: 'Non-Éveillé', classType: 'Civil', reputation: 0, karma: 0 },
            traits: [], // Tableau des traits
            career: { blueGates: 0, redGates: 0, monstersKilled: 0, bossesKilled: 0, moneyCollected: 0, events: [] },
            inventory: { weapons: [], consumables: [] }
        };
    },
    saveGame(state) {
        localStorage.setItem(this.SAVE_KEY, JSON.stringify(state));
    },
    loadGame() {
        const dataStr = localStorage.getItem(this.SAVE_KEY);
        if (!dataStr) return null;
        let data = JSON.parse(dataStr);
        // Sécurité pour les anciennes saves
        if (!data.traits) data.traits = [];
        if (!data.career) data.career = { blueGates: 0, redGates: 0, monstersKilled: 0, bossesKilled: 0, moneyCollected: 0, events: [] };
        return data;
    },
    hasSave() {
        return localStorage.getItem(this.SAVE_KEY) !== null;
    }
};
