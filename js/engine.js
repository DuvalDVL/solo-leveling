const GameEngine = {
    state: null,
    preAwakeningEventsCount: 0,
    
    init() {
        console.log("[Engine] Initialisation du jeu...");
        this.checkSaveAvailability();
    },

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

    startMode(modeNumber) {
        console.log(`[Engine] Lancement du Mode ${modeNumber}`);
        this.state = StorageManager.createDefaultSave();
        this.state.mode = modeNumber;

        if (modeNumber === 2) {
            this.state.profile.rank = 'A';
            this.state.profile.classType = 'Combattant d\'Elite';
            this.state.stats.strength = 60;
            this.state.stats.agility = 55;
            this.state.stats.hp = 200;
            this.state.stats.maxHp = 200;
        } else if (modeNumber === 3) {
            this.state.profile.rank = 'E (Anomalie)';
            this.state.profile.classType = 'Joueur';
        }

        StorageManager.saveGame(this.state);
        this.switchScreen('screen-title', 'screen-creation');
        this.initModeFlow();
    },

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

    switchScreen(hideScreenId, showScreenId) {
        document.getElementById(hideScreenId).classList.remove('active');
        document.getElementById(hideScreenId).classList.add('hidden');
        
        const targetScreen = document.getElementById(showScreenId);
        targetScreen.classList.remove('hidden');
        targetScreen.classList.add('active');
        
        const statusBar = document.getElementById('status-bar');
        if (showScreenId === 'screen-title') {
            statusBar.classList.add('hidden');
        } else {
            statusBar.classList.remove('hidden');
            this.updateStatusBar();
        }
    },

    updateStatusBar() {
        if (!this.state) return;
        document.getElementById('stat-hp').innerText = `${this.state.stats.hp}/${this.state.stats.maxHp}`;
        document.getElementById('stat-mp').innerText = `${this.state.stats.mp}/${this.state.stats.maxMp}`;
        document.getElementById('stat-money').innerText = this.state.stats.money.toLocaleString();
        document.getElementById('stat-fatigue').innerText = this.state.stats.fatigue;
        document.getElementById('stat-morale').innerText = this.state.stats.morale;
    },

    initModeFlow() {
        if (this.state.mode === 1) {
            this.preAwakeningEventsCount = 0;
            document.getElementById('creation-title').innerText = "Phase 1 : Origines & Transition";
            document.getElementById('creation-text-box').innerHTML = 
                "<p>Avant d'obtenir vos pouvoirs et d'entrer dans le monde impitoyable des Chasseurs, vous devez mener votre vie quotidienne.</p>" +
                "<p><strong>Première étape : Quelle était votre situation avant l'éveil ?</strong></p>";
            
            const choicesBox = document.getElementById('creation-choices');
            choicesBox.innerHTML = `
                <button class="btn secondary" onclick="GameEngine.handleCreationChoice('student')">Étudiant surmené (Bonus Intelligence, Malus Force)</button>
                <button class="btn secondary" onclick="GameEngine.handleCreationChoice('worker')">Employé de bureau (Résistance accrue, Malus Agilité)</button>
                <button class="btn secondary" onclick="GameEngine.handleCreationChoice('street')">Orphelin / Survie urbaine (Bonus Perception & Furtivité, Malus Argent)</button>
            `;
        } else {
            this.switchScreen('screen-creation', 'screen-city');
        }
    },

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
        this.updateStatusBar();
        this.triggerNextPreAwakeningEvent();
    },

    triggerNextPreAwakeningEvent() {
        if (this.preAwakeningEventsCount >= 3) {
            this.triggerAwakening();
            return;
        }
        this.preAwakeningEventsCount++;
        const randomEvent = CIVIL_EVENTS[Math.floor(Math.random() * CIVIL_EVENTS.length)];
        
        document.getElementById('creation-title').innerText = `L'année de Transition : Événement ${this.preAwakeningEventsCount} / 3`;
        document.getElementById('creation-text-box').innerHTML = `<h4>${randomEvent.title}</h4><p>${randomEvent.text}</p>`;
        
        let html = '';
        randomEvent.choices.forEach((choice, index) => {
            html += `<button class="btn secondary" onclick="GameEngine.resolvePreAwakeningChoice('${randomEvent.id}', ${index})">${choice.text}</button>`;
        });
        document.getElementById('creation-choices').innerHTML = html;
    },

    resolvePreAwakeningChoice(eventId, choiceIndex) {
        const eventObj = CIVIL_EVENTS.find(e => e.id === eventId);
        const choice = eventObj.choices[choiceIndex];
        
        if (choice.effect) {
            for (const [key, val] of Object.entries(choice.effect)) {
                if (this.state.stats[key] !== undefined) this.state.stats[key] += val;
                if (this.state.profile[key] !== undefined) this.state.profile[key] += val;
            }
        }
        
        this.updateStatusBar();
        this.triggerNextPreAwakeningEvent();
    },

    triggerAwakening() {
        document.getElementById('creation-title').innerText = "Le Moment de l'Éveil";
        document.getElementById('creation-text-box').innerHTML = 
            "<p>Une forte fièvre vous cloue soudainement au lit. Votre corps entier brûle et vos sens s'aiguisent d'une façon inhumaine...</p>" +
            "<p>L'Association des Chasseurs a détecté votre signature magique. Vous êtes convoqué pour une évaluation officielle dans 7 jours.</p>";
        
        document.getElementById('creation-choices').innerHTML = `
            <button class="btn primary" onclick="GameEngine.finishAwakening()">Passer l'évaluation et débuter votre nouvelle vie</button>
        `;
    },

    finishAwakening() {
        this.state.profile.rank = 'E';
        this.state.profile.classType = 'Combattant';
        
        StorageManager.saveGame(this.state);
        this.switchScreen('screen-creation', 'screen-city');
        this.updateStatusBar();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    GameEngine.init();
});
