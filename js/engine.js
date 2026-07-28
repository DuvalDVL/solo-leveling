const GameEngine = {
    state: null,

    init() {
        if (StorageManager.hasSave()) {
            document.getElementById('btn-load').classList.remove('hidden');
        }
    },

    startMode(mode) {
        this.state = StorageManager.createDefaultSave();
        this.state.mode = mode;
        
        if (mode === 2) {
            this.state.profile.rank = 'A';
            this.switchScreen('screen-title', 'screen-city');
        } else {
            this.switchScreen('screen-title', 'screen-creation');
            this.runPreAwakening();
        }
        StorageManager.saveGame(this.state);
    },

    loadGame() {
        this.state = StorageManager.loadGame();
        this.updateStatusBar();
        if (this.state.profile.rank === 'Non-Éveillé') {
            this.switchScreen('screen-title', 'screen-creation');
            this.runPreAwakening();
        } else {
            this.switchScreen('screen-title', 'screen-city');
        }
    },

    switchScreen(hideId, showId) {
        document.getElementById(hideId).classList.replace('active', 'hidden');
        document.getElementById(showId).classList.replace('hidden', 'active');
        
        if (showId !== 'screen-title' && showId !== 'screen-creation') {
            document.getElementById('status-bar').classList.remove('hidden');
        } else {
            document.getElementById('status-bar').classList.add('hidden');
        }
    },

    updateStatusBar() {
        if (!this.state) return;
        document.getElementById('stat-hp').innerText = this.state.stats.hp;
        document.getElementById('stat-mp').innerText = this.state.stats.mp;
        document.getElementById('stat-money').innerText = this.state.stats.money;
        document.getElementById('stat-fatigue').innerText = this.state.stats.fatigue;
        document.getElementById('stat-morale').innerText = this.state.stats.morale;
        
        const rankEl = document.getElementById('player-rank');
        if(rankEl) rankEl.innerText = this.state.profile.rank;
    },

    runPreAwakening() {
        const title = document.getElementById('creation-title');
        const text = document.getElementById('creation-text-box');
        const choices = document.getElementById('creation-choices');

        // ÉTAPE 1 : Choix d'origine
        if (this.state.preAwakeningStep === 1) {
            title.innerText = "Avant la Magie : Qui étiez-vous ?";
            text.innerHTML = "<p>Avant que le monde ne change pour vous, quelle était votre vie ?</p>";
            choices.innerHTML = `
                <button class="btn primary" onclick="GameEngine.applyOrigin('student')">Étudiant surmené (+ Intelligence)</button>
                <button class="btn primary" onclick="GameEngine.applyOrigin('worker')">Employé (Salaryman) (+ Résistance)</button>
                <button class="btn primary" onclick="GameEngine.applyOrigin('street')">Enfant de la rue (+ Perception)</button>
            `;
        } 
        // ÉTAPES 2 & 3 : Événements de vie aléatoires
        else if (this.state.preAwakeningStep <= 3) {
            title.innerText = `Le Quotidien (Mois ${this.state.preAwakeningStep - 1})`;
            const eventObj = CIVIL_EVENTS[Math.floor(Math.random() * CIVIL_EVENTS.length)];
            text.innerHTML = `<p>${eventObj.text}</p>`;
            
            let html = '';
            eventObj.choices.forEach((c, index) => {
                html += `<button class="btn secondary" onclick="GameEngine.applyEventEffect(${index}, '${eventObj.id}')">${c.text}</button>`;
            });
            choices.innerHTML = html;
        } 
        // ÉTAPE 4 : L'Éveil
        else if (this.state.preAwakeningStep === 4) {
            title.innerText = "L'ÉVÉNEMENT";
            text.innerHTML = `<p style="color:var(--alert-red); font-weight:bold;">FIÈVRE FOUDROYANTE</p><p>Vous vous effondrez. Votre corps brûle pendant 3 jours. À votre réveil, une énergie incroyable pulse dans vos veines. L'Association vous convoque dans 7 jours pour l'évaluation de votre Rang.</p>`;
            choices.innerHTML = `<button class="btn system" onclick="GameEngine.goToEvaluation()">Attendre 7 jours et passer le test</button>`;
        }
    },

    applyOrigin(type) {
        if (type === 'student') this.state.stats.intelligence += 15;
        if (type === 'worker') this.state.stats.vitality += 10;
        if (type === 'street') this.state.stats.perception += 15;
        this.state.preAwakeningStep++;
        this.runPreAwakening();
    },

    applyEventEffect(choiceIndex, eventId) {
        const eventObj = CIVIL_EVENTS.find(e => e.id === eventId);
        const effect = eventObj.choices[choiceIndex].effect;
        if (effect) {
            for (let stat in effect) {
                this.state.stats[stat] += effect[stat];
            }
        }
        this.state.preAwakeningStep++;
        this.runPreAwakening();
    },

    goToEvaluation() {
        const rand = Math.random();
        if (rand < 0.6) this.state.profile.rank = 'E';
        else if (rand < 0.9) this.state.profile.rank = 'D';
        else this.state.profile.rank = 'C';

        this.state.preAwakeningStep = 5; // Phase terminée
        StorageManager.saveGame(this.state);
        
        alert(`ÉVALUATION TERMINÉE :\nL'Association vous a attribué le RANG ${this.state.profile.rank}. Bienvenue dans le monde des Chasseurs.`);
        
        this.updateStatusBar();
        this.switchScreen('screen-creation', 'screen-city');
    }
};

document.addEventListener('DOMContentLoaded', () => GameEngine.init());
