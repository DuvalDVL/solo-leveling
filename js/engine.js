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
        this.updateStatusBar();
        
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
    },

    updateStatusBar() {
        if (!this.state) return;
        
        // Sécuriser les jauges
        this.state.stats.fatigue = Math.max(0, Math.min(100, this.state.stats.fatigue));
        
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
            text.innerHTML = "<p>Avant que le monde ne bascule, quelle était votre vie quotidienne ?</p>";
            choices.innerHTML = `
                <button class="btn primary" onclick="GameEngine.applyOrigin('student')">Étudiant surmené</button>
                <button class="btn primary" onclick="GameEngine.applyOrigin('worker')">Employé / Salaryman</button>
                <button class="btn primary" onclick="GameEngine.applyOrigin('street')">Survie dans la rue</button>
            `;
        } 
        // ÉTAPES 2 à 10 : Événements de vie
        else if (this.state.preAwakeningStep <= 10) {
            title.innerText = `Le Quotidien (Étape ${this.state.preAwakeningStep - 1} / 9)`;
            const eventObj = CIVIL_EVENTS[Math.floor(Math.random() * CIVIL_EVENTS.length)];
            text.innerHTML = `<p>${eventObj.text}</p>`;
            
            let html = '';
            eventObj.choices.forEach((c, index) => {
                html += `<button class="btn secondary" onclick="GameEngine.applyEventEffect(${index}, '${eventObj.id}')">${c.text}</button>`;
            });
            choices.innerHTML = html;
        } 
        // ÉTAPE 11 : L'Éveil
        else if (this.state.preAwakeningStep === 11) {
            title.innerText = "L'ÉVÉNEMENT : FIÈVRE FOUDROYANTE";
            text.innerHTML = `<p style="color:var(--alert-red); font-weight:bold;">Alerte Médicale !</p><p>Vous vous effondrez. Votre corps brûle de l'intérieur pendant 3 jours. À votre réveil, une énergie incroyable pulse dans vos veines. L'Association a détecté l'anomalie.</p><p>Vous êtes convoqué pour l'évaluation de votre Rang.</p>`;
            choices.innerHTML = `<button class="btn system" onclick="GameEngine.goToEvaluation()">Passer le test d'Évaluation (7 jours plus tard)</button>`;
        }
    },

    applyOrigin(type) {
        let resultText = "";
        if (type === 'student') { this.state.stats.intelligence += 15; resultText = "Vous avez passé vos nuits dans les livres. (+15 Intelligence)"; }
        if (type === 'worker') { this.state.stats.vitality += 10; resultText = "La pression du travail a forgé votre résistance mentale et physique. (+10 Vitalité)"; }
        if (type === 'street') { this.state.stats.perception += 15; resultText = "Vivre dans la rue a aiguisé vos sens. (+15 Perception)"; }
        
        this.showResultScreen("Vos Origines", resultText);
    },

    applyEventEffect(choiceIndex, eventId) {
        const eventObj = CIVIL_EVENTS.find(e => e.id === eventId);
        const choice = eventObj.choices[choiceIndex];
        
        if (choice.effect) {
            for (let stat in choice.effect) {
                this.state.stats[stat] += choice.effect[stat];
            }
        }
        
        this.updateStatusBar();
        this.showResultScreen("Résultat de l'action", choice.resultText);
    },

    showResultScreen(titleText, bodyText) {
        document.getElementById('creation-title').innerText = titleText;
        document.getElementById('creation-text-box').innerHTML = `<p>${bodyText}</p>`;
        document.getElementById('creation-choices').innerHTML = `<button class="btn primary" onclick="GameEngine.state.preAwakeningStep++; GameEngine.runPreAwakening();">Continuer</button>`;
    },

    goToEvaluation() {
        // Détermination du Rang
        const rand = Math.random();
        if (rand < 0.50) this.state.profile.rank = 'E';
        else if (rand < 0.85) this.state.profile.rank = 'D';
        else this.state.profile.rank = 'C';

        this.state.profile.classType = "Combattant Polyvalent"; // Classe par défaut
        this.state.preAwakeningStep = 12; // Phase terminée
        StorageManager.saveGame(this.state);
        
        document.getElementById('creation-title').innerText = "RÉSULTAT DE L'ÉVALUATION";
        document.getElementById('creation-text-box').innerHTML = `
            <p>La sphère de l'Association s'illumine. Les examinateurs notent vos résultats sur leur tablette.</p>
            <p style="font-size: 1.2em; text-align: center; color: var(--primary-blue); margin: 15px 0;">
                Vous êtes officiellement classé :<br><strong>CHASSEUR DE RANG ${this.state.profile.rank}</strong>
            </p>
            <hr style="border-color: var(--border-color); margin: 15px 0;">
            <p><strong>Vos Statistiques Initiales :</strong></p>
            <ul>
                <li>Force : ${this.state.stats.strength}</li>
                <li>Agilité : ${this.state.stats.agility}</li>
                <li>Intelligence : ${this.state.stats.intelligence}</li>
                <li>Perception : ${this.state.stats.perception}</li>
                <li>Vitalité : ${this.state.stats.vitality}</li>
            </ul>
        `;
        document.getElementById('creation-choices').innerHTML = `<button class="btn primary" onclick="GameEngine.finishEvaluation()">Entrer dans le Monde des Chasseurs</button>`;
    },

    finishEvaluation() {
        this.updateStatusBar();
        this.switchScreen('screen-creation', 'screen-city');
    }
};

document.addEventListener('DOMContentLoaded', () => GameEngine.init());
