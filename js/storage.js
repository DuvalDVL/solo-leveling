/**
 * Module de gestion de la persistance (LocalStorage)
 * Permet de sauvegarder, charger, effacer ou exporter la progression du joueur.
 */

const StorageManager = {
    SAVE_KEY: 'solo_leveling_savegame',

    /**
     * Crée un objet de sauvegarde par défaut avec toutes les stats de base du joueur.
     */
    createDefaultSave() {
        return {
            mode: 1, // 1: Principal, 2: Chasseur Établi, 3: Système
            day: 1,
            maxDays: 30, // Jours avant le prochain raid obligatoire
            stats: {
                hp: 100,
                maxHp: 100,
                mp: 50,
                maxMp: 50,
                money: 10000, // En Won (₩)
                fatigue: 0,
                morale: 100,
                flow: 0, // Jauge cachée ou subtile
                // Caractéristiques principales
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
                reputation: 0, // Publique
                karma: 0,      // Caché / Privé
                injuries: []   // Ex: ['Perte d'un oeil', 'Bras affaibli']
            },
            inventory: {
                weapons: [],
                armor: null,
                accessories: [],
                consumables: [],
                materials: []
            },
            team: [], // Mercenaires ou PNJ récurrents
            flags: {} // Pour mémoriser les choix narratifs importants (ex: quêtes de guilde)
        };
    },

    /**
     * Sauvegarde l'état actuel du jeu dans le localStorage.
     * @param {Object} gameState - L'objet contenant toute la progression.
     */
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

    /**
     * Charge la partie depuis le localStorage.
     * @returns {Object|null} L'objet de sauvegarde ou null si aucune sauvegarde n'existe.
     */
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

    /**
     * Supprime la sauvegarde existante.
     */
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

    /**
     * Vérifie si une sauvegarde existe.
     * @returns {boolean}
     */
    hasSave() {
        return localStorage.getItem(this.SAVE_KEY) !== null;
    }
};
