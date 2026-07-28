/**
 * Module Moteur de Jeu (GameEngine)
 * Gère la logique globale, l'état courant de la partie et la navigation entre les écrans.
 */

const GameEngine = {
    state: null,

    /**
     * Initialisation du moteur au chargement de la page.
     */
    init() {
        console.log("[Engine] Initialisation du jeu...");
        this.checkSaveAvailability();
    },

    /**
     * Vérifie si un bouton de chargement doit être actif sur l'écran titre.
     */
    checkSaveAvailability() {
        const btnLoad = document.getElementById('btn-load');
        if (btnLoad) {
            if (StorageManager.hasSave()) {
                btnLoad.classList.remove('hidden');
            } else {
                btnLoad.classList.add('hidden');
            }
        }
    },

    /**
     * Lance une nouvelle partie selon le mode choisi.
     * @param {number} modeNumber - 1: Principal, 2: Chasseur Établi, 3: Système
     */
    startMode(modeNumber) {
        console.log(`[Engine] Lancement du Mode ${modeNumber}`);
        
        // Initialiser un état par défaut
        this.state = StorageManager.createDefaultSave();
        this.state.mode = modeNumber;

        // Si Mode 2 (Chasseur Établi), on ajuste les stats de départ (minimum Rang A)
        if (modeNumber === 2) {
            this.state.profile.rank = 'A';
            this.state.profile.classType = 'Combattant d\'Élite';
            this.state.stats.strength = 60;
            this.state.stats.agility = 55;
            this.state.stats.hp = 200;
            this.state.stats.maxHp = 200;
        } 
        // Si Mode 3 (Système), on ajuste pour l'éveil du système
        else if (modeNumber === 3) {
            this.state.profile.rank = 'E (Anomalie)';
            this.state.profile.classType = 'Joueur';
        }

        // Sauvegarde initiale de la nouvelle partie
        StorageManager.saveGame(this.state);

        // Transition d'écran
        this.switchScreen('screen-title', 'screen-creation');
        
        // Lancer la première phase selon le mode
        this.initModeFlow();
    },

    /**
     * Charge une partie existante depuis le LocalStorage.
     */
    loadGame() {
        const savedData = StorageManager.loadGame();
        if (savedData) {
            this.state = savedData;
            console.log("[Engine] Partie chargée avec succès.");
            this.switchScreen('screen-title', 'screen-city');
            this.updateStatusBar();
        } else {
            alert("Aucune sauvegarde trouvée.");
        }
    },

    /**
     * Gère la transition visuelle entre deux écrans.
     * @param {string} hideScreenId 
     * @param {string} showScreenId 
     */
    switchScreen(hideScreenId, showScreenId) {
        document.getElementById(hideScreenId).classList.remove('active');
        document.getElementById(hideScreenId).classList.add('hidden');

        const targetScreen = document.getElementById(showScreenId);
        targetScreen.classList.remove('hidden');
        targetScreen.classList.add('active');

        // Afficher la barre d'état si on n'est plus sur l'écran titre
        const statusBar = document.getElementById('status-bar');
        if (showScreenId === 'screen-title') {
            statusBar.classList.add('hidden');
        } else {
            statusBar.classList.remove('hidden');
            this.updateStatusBar();
        }
    },

    /**
     * Met à jour l'affichage de la barre d'état en haut de l'écran mobile.
     */
    updateStatusBar() {
        if (!this.state) return;
        
        document.getElementById('stat-hp').innerText = `${this.state.stats.hp}/${this.state.stats.maxHp}`;
        document.getElementById('stat-mp').innerText = `${this.state.stats.mp}/${this.state.stats.maxMp}`;
        document.getElementById('stat-money').innerText = this.state.stats.money.toLocaleString();
        document.getElementById('stat-fatigue').innerText = this.state.stats.fatigue;
        document.getElementById('stat-morale').innerText = this.state.stats.morale;
    },

    /**
     * Détermine la suite logique selon le mode après l'écran titre.
     */
    initModeFlow() {
        if (this.state.mode === 1) {
            // Mode Principal : Commence par la phase de transition / pré-éveil (les choix d'origine)
            document.getElementById('creation-title').innerText = "Phase 1 : Origines & Transition";
            document.getElementById('creation-text-box').innerHTML = 
                "<p>Avant d'obtenir vos pouvoirs et d'entrer dans le monde impitoyable des Chasseurs, vous devez mener votre vie quotidienne. Vos choix façonneront votre corps et votre esprit.</p>" +
                "<p><strong>Première étape : Quelle était votre situation avant l'éveil ?</strong></p>";
            
            // Injection des premiers choix d'origine (Exemple simple en attendant le fichier d'événements dédiés)
            const choicesBox = document.getElementById('creation-choices');
            choicesBox.innerHTML = `
                <button class="btn" onclick="GameEngine.handleCreationChoice('student')">Étudiant surmené (Bonus Intelligence, Malus Force)</button>
                <button class="btn" onclick="GameEngine.handleCreationChoice('worker')">Employé de bureau (Résistance accrue, Malus Agilité)</button>
                <button class="btn" onclick="GameEngine.handleCreationChoice('street')">Orphelin / Survie urbaine (Bonus Perception & Furtivité, Malus Argent)</button>
            `;
        } else {
            // Pour les modes 2 et 3, on saute directement en ville pour l'action
            this.switchScreen('screen-creation', 'screen-city');
        }
    },

    /**
     * Gère temporairement les choix de création (sera externalisé plus tard).
     */
    handleCreationChoice(type) {
        if (type === 'student') {
            this.state.stats.intelligence += 15;
            this.state.stats.strength -= 5;
        } else if (type === 'worker') {
            this.state.stats.vitality += 10;
            this.state.stats.agility -= 5;
        } else if (type === 'street') {
            this.state.stats.perception += 15;
            this.state.stats.stealth += 10;
            this.state.stats.money = 1000;
        }

        StorageManager.saveGame(this.state);
        
        // Passer directement au Hub de la Ville pour la suite du test
        this.switchScreen('screen-creation', 'screen-city');
        this.updateStatusBar();
    }
};

// Lancement automatique au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    GameEngine.init();
});
