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
            // Mode Principal : Initialisation de la phase pré-éveil (compteur d'événements avant l'éveil)
            this.state.preAwakeningStep = 1;
            this.triggerNextPreAwakeningEvent();
        } else {
            // Pour les modes 2 et 3, on saute directement en ville
            this.switchScreen('screen-creation', 'screen-city');
        }
    },

    triggerNextPreAwakeningEvent() {
        const creationTitle = document.getElementById('creation-title');
        const textBox = document.getElementById('creation-text-box');
        const choicesBox = document.getElementById('creation-choices');

        // Si le joueur a passé 3 étapes de vie quotidienne, l'Éveil se déclenche
        if (this.state.preAwakeningStep > 3) {
            this.triggerAwakeningEvent();
            return;
        }

        creationTitle.innerText = `Phase Pré-Éveil (Étape ${this.state.preAwakeningStep} / 3)`;
        
        // On pioche un événement aléatoire de civil_events si disponible, sinon choix d'origine par défaut
        textBox.innerHTML = `
            <p>Votre vie suit son cours. Chaque épreuve ou choix modifie subtilement votre condition physique et mentale avant que le destin ne bascule.</p>
            <p><strong>Situation actuelle :</strong> Vous faites face à un choix décisif de votre quotidien.</p>
        `;

        // Si c'est la première étape, on choisit l'origine / occupation
        if (this.state.preAwakeningStep === 1) {
            choicesBox.innerHTML = `
                <button class="btn" onclick="GameEngine.handlePreAwakeningChoice('student')">Étudiant surmené (Bonus Intelligence)</button>
                <button class="btn" onclick="GameEngine.handlePreAwakeningChoice('worker')">Employé de bureau (Résistance au stress)</button>
                <button class="btn" onclick="GameEngine.handlePreAwakeningChoice('street')">Enfance difficile / Survie (Bonus Perception)</button>
            `;
        } else {
            // Étapes suivantes : on pioche dans les événements civils ou des situations aléatoires
            choicesBox.innerHTML = `
                <button class="btn primary" onclick="GameEngine.handlePreAwakeningChoice('event_positive')">Faire face avec courage et détermination (+ Moral)</button>
                <button class="btn secondary" onclick="GameEngine.handlePreAwakeningChoice('event_hard')">Travailler dur quitte à y laisser la santé (+ Force / Fatigue +)</button>
            `;
        }
    },

    handlePreAwakeningChoice(type) {
        if (type === 'student') {
            this.state.stats.intelligence += 10;
        } else if (type === 'worker') {
            this.state.stats.vitality += 8;
        } else if (type === 'street') {
            this.state.stats.perception += 10;
        } else if (type === 'event_positive') {
            this.state.stats.morale += 10;
        } else if (type === 'event_hard') {
            this.state.stats.strength += 5;
            this.state.stats.fatigue += 15;
        }

        this.state.preAwakeningStep++;
        StorageManager.saveGame(this.state);
        this.triggerNextPreAwakeningEvent();
    },

    triggerAwakeningEvent() {
        const creationTitle = document.getElementById('creation-title');
        const textBox = document.getElementById('creation-text-box');
        const choicesBox = document.getElementById('creation-choices');

        creationTitle.innerText = "L'ÉVÉNEMENT : L'ÉVEIL";
        textBox.innerHTML = `
            <p style="color: var(--alert-red);"><strong>ALERTE DE FIÈVRE FOUDROYANTE</strong></p>
            <p>Sans prévenir, une douleur fulgurante traverse votre corps. Vous vous effondrez chez vous, brûlant d'une fièvre anormale pendant trois jours complets. Vos proches appellent les urgences in extremis.</p>
            <p>À votre réveil à l'hôpital, le monde a changé. Une énergie invisible pulse en vous. Vous venez de vous <strong>Éveiller</strong>.</p>
            <p>L'Association des Chasseurs a été prévenue. Vous êtes convoqué dans 7 jours pour passer un test d'évaluation officiel et déterminer votre Rang.</p>
        `;

        choicesBox.innerHTML = `
            <button class="btn primary" onclick="GameEngine.finishAwakeningAndEnterCity()">Se rendre à l'évaluation de l'Association (7 jours plus tard)</button>
        `;
    },

    finishAwakeningAndEnterCity() {
        // Attribuer un Rang aléatoire pondéré (majorité de E ou D pour le mode normal)
        const rand = Math.random();
        if (rand < 0.6) this.state.profile.rank = 'E';
        else if (rand < 0.9) this.state.profile.rank = 'D';
        else this.state.profile.rank = 'C';

        this.state.profile.classType = 'Chasseur Non-Classé (Évalué)';
        this.state.daysLeft = 30; // Initialisation propre du compteur avant le premier vrai raid en ville

        StorageManager.saveGame(this.state);

        // Passage officiel à la Ville
        this.switchScreen('screen-creation', 'screen-city');
        this.updateStatusBar();
        alert(`Évaluation terminée. Le verdict de l'Association tombe : vous êtes classé Chasseur de Rang ${this.state.profile.rank}. Bienvenue dans le monde des Chasseurs.`);
    }

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
