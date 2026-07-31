const StorageManager = {
    SAVE_KEY: 'solo_leveling_savegame',

    createDefaultSave() {
        return {
            mode: 1,
            day: 1,
            maxDays: 30,
            stats: {
                hp: 100,
                maxHp: 100,
                mp: 50,
                maxMp: 50,
                money: 10000,
                fatigue: 0,
                morale: 100,
                flow: 0,
                strength: 10,
                agility: 10,
                intelligence: 10,
                perception: 10,
                vitality: 10,
                stealth: 5,
                bladeMastery: 5
            },
            profile: {
                rank: 'E',
                classType: 'Inconnu',
                reputation: 0,
                karma: 0,
                injuries: []
            },
            inventory: {
                weapons: [],
                armor: null,
                accessories: [],
                consumables: [],
                materials: []
            },
            team: [],
            flags: {}
        };
    },

    saveGame(gameState) {
        try {
            const dataString = JSON.stringify(gameState);
            localStorage.setItem(this.SAVE_KEY, dataString);
            console.log("[Storage] Partie sauvegardée avec succès.");
            return true;
        } catch (e) {
            console.error("[Storage] Erreur lors de la sauvegarde :", e);
            return false;
        }
    },

    loadGame() {
        try {
            const dataString = localStorage.getItem(this.SAVE_KEY);
            if (!dataString) {
                console.log("[Storage] Aucune sauvegarde trouvée.");
                return null;
            }
            console.log("[Storage] Partie chargée avec succès.");
            return JSON.parse(dataString);
        } catch (e) {
            console.error("[Storage] Erreur lors du chargement :", e);
            return null;
        }
    },

    clearSave() {
        try {
            localStorage.removeItem(this.SAVE_KEY);
            console.log("[Storage] Sauvegarde supprimée.");
            return true;
        } catch (e) {
            console.error("[Storage] Erreur lors de la suppression :", e);
            return false;
        }
    },

    hasSave() {
        return localStorage.getItem(this.SAVE_KEY) !== null;
    }
};
