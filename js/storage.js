const StorageManager = {
    SAVE_KEY: 'solo_leveling_save',

    createDefaultSave() {
        return {
            mode: 1,
            preAwakeningStep: 1, // Gestion de la phase avant l'éveil
            day: 1,
            daysLeft: 30, // N'apparaît qu'en Ville
            stats: { hp: 100, maxHp: 100, mp: 50, maxMp: 50, money: 500, fatigue: 0, morale: 100, strength: 10, agility: 10, intelligence: 10, perception: 10, vitality: 10 },
            profile: { rank: 'Non-Éveillé', classType: 'Civil', reputation: 0, karma: 0 },
            inventory: { weapons: [], consumables: [] }
        };
    },
    saveGame(state) {
        localStorage.setItem(this.SAVE_KEY, JSON.stringify(state));
    },
    loadGame() {
        const data = localStorage.getItem(this.SAVE_KEY);
        return data ? JSON.parse(data) : null;
    },
    hasSave() {
        return localStorage.getItem(this.SAVE_KEY) !== null;
    }
};
