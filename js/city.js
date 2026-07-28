/**
 * Module de Gestion de la Ville (CityManager)
 * Gère les actions du monde réel, les points d'action (jours restants), 
 * les entraînements, le shopping et les événements aléatoires post-action.
 */

const CityManager = {

    /**
     * Ouvre la boutique (Shop) pour acheter/vendre du matériel ou des consommables.
     */
    openShop() {
        const modal = document.getElementById('modal-overlay');
        const title = document.getElementById('modal-title');
        const text = document.getElementById('modal-text');
        const actions = document.getElementById('modal-actions');

        title.innerText = "Boutique de l'Association";
        text.innerText = "Bienvenue, Chasseur. Que souhaitez-vous acquérir pour votre prochain raid ?";
        
        actions.innerHTML = `
            <button class="btn primary" onclick="CityManager.buyItem('potion', 5000)">Acheter Potion de Soin (5 000 ₩)</button>
            <button class="btn secondary" onclick="CityManager.buyItem('gear', 20000)">Améliorer l'équipement de base (20 000 ₩)</button>
            <button class="btn outline" onclick="CityManager.closeModal()">Fermer la boutique</button>
        `;

        modal.classList.remove('hidden');
    },

    /**
     * Gère l'achat d'objets.
     */
    buyItem(itemType, cost) {
        if (GameEngine.state.stats.money >= cost) {
            GameEngine.state.stats.money -= cost;
            if (itemType === 'potion') {
                GameEngine.state.inventory.consumables.push('Potion de Soin');
                alert("Vous avez acheté une Potion de Soin.");
            } else if (itemType === 'gear') {
                GameEngine.state.stats.strength += 3;
                GameEngine.state.stats.agility += 3;
                alert("Votre équipement a été amélioré ! Vos statistiques augmentent.");
            }
            GameEngine.updateStatusBar();
            StorageManager.saveGame(GameEngine.state);
            this.closeModal();
        } else {
            alert("Fonds insuffisants !");
        }
    },

    /**
     * Gère l'entraînement physique en ville.
     */
    openTraining() {
        const modal = document.getElementById('modal-overlay');
        const title = document.getElementById('modal-title');
        const text = document.getElementById('modal-text');
        const actions = document.getElementById('modal-actions');

        title.innerText = "Centre d'Entraînement";
        text.innerText = "Poussez vos limites physiques. Attention, un entraînement intensif augmente votre fatigue et comporte des risques de blessure si vos limites naturelles sont atteintes.";

        actions.innerHTML = `
            <button class="btn primary" onclick="CityManager.executeTraining('strength')">S'entraîner en Force</button>
            <button class="btn secondary" onclick="CityManager.executeTraining('agility')">S'entraîner en Agilité</button>
            <button class="btn outline" onclick="CityManager.closeModal()">Annuler</button>
        `;

        modal.classList.remove('hidden');
    },

    /**
     * Exécute la logique de l'entraînement avec un jet de réussite/échec.
     */
    executeTraining(statName) {
        this.closeModal();
        
        // Coût en fatigue
        GameEngine.state.stats.fatigue += 15;
        
        // Jet aléatoire pour l'entraînement (Succès, Échec ou Critique)
        const roll = Math.random();
        
        if (roll < 0.15) {
            // Échec / Blessure légère
            GameEngine.state.stats.morale -= 5;
            alert("Échec de l'entraînement : Votre corps fatigue et vous vous blessez légèrement. Votre moral baisse.");
        } else if (roll > 0.85) {
            // Succès Critique / Dépassement de limites
            GameEngine.state.stats[statName] += 5;
            GameEngine.state.stats.flow += 10;
            alert(`SUCCÈS CRITIQUE ! Vous repoussez vos limites. +5 en ${statName} !`);
        } else {
            // Succès normal
            GameEngine.state.stats[statName] += 2;
            alert(`Entraînement réussi. +2 en ${statName}.`);
        }

        this.consumeDayAndTriggerEvent();
    },

    /**
     * Gère le networking et la communication publique (réseaux sociaux).
     */
    openSocial() {
        const modal = document.getElementById('modal-overlay');
        const title = document.getElementById('modal-title');
        const text = document.getElementById('modal-text');
        const actions = document.getElementById('modal-actions');

        title.innerText = "Réseaux Sociaux & Networking";
        text.innerText = "Comment souhaitez-vous gérer votre image publique aujourd'hui ?";

        actions.innerHTML = `
            <button class="btn primary" onclick="CityManager.executeSocial('comm')">Faire une campagne de com' positive (+ Réputation)</button>
            <button class="btn secondary" onclick="CityManager.executeSocial('underground')">Nouer des contacts louches (+ Karma - / Argent +)</button>
            <button class="btn outline" onclick="CityManager.closeModal()">Annuler</button>
        `;

        modal.classList.remove('hidden');
    },

    executeSocial(type) {
        this.closeModal();
        if (type === 'comm') {
            GameEngine.state.profile.reputation += 5;
            GameEngine.state.stats.money -= 2000; // Coût de l'agence
            alert("Votre image s'améliore auprès du grand public, mais les agences coûtent cher.");
        } else if (type === 'underground') {
            GameEngine.state.profile.karma -= 5;
            GameEngine.state.stats.money += 10000;
            alert("Vous avez accepté un arrangement douteux. Votre compte s'enrichit, mais votre conscience s'assombrit.");
        }
        this.consumeDayAndTriggerEvent();
    },

    /**
     * Gère la vie privée et le repos.
     */
    openLife() {
        GameEngine.state.stats.fatigue = Math.max(0, GameEngine.state.stats.fatigue - 30);
        GameEngine.state.stats.morale = Math.min(100, GameEngine.state.stats.morale + 15);
        alert("Vous prenez du temps pour vous reposer. Votre fatigue diminue et votre moral s'améliore.");
        this.consumeDayAndTriggerEvent();
    },

    /**
     * Ouvre le tableau des portails pour partir en Raid.
     */
    openRaidBoard() {
        const modal = document.getElementById('modal-overlay');
        const title = document.getElementById('modal-title');
        const text = document.getElementById('modal-text');
        const actions = document.getElementById('modal-actions');

        title.innerText = "Tableau des Portails Disponibles";
        text.innerText = "Sélectionnez un portail à explorer. Attention, une fois entré, la survie dépendra de votre préparation.";

        actions.innerHTML = `
            <button class="btn primary" onclick="CityManager.startDungeon('E')">Portail de Rang E (Facile)</button>
            <button class="btn secondary" onclick="CityManager.startDungeon('D')">Portail de Rang D (Intermédiaire)</button>
            <button class="btn outline" onclick="CityManager.closeModal()">Retour</button>
        `;

        modal.classList.remove('hidden');
    },

    /**
     * Lance l'écran de donjon.
     */
    startDungeon(rank) {
        this.closeModal();
        GameEngine.switchScreen('screen-city', 'screen-dungeon');
        
        // Initialiser l'affichage du donjon
        document.getElementById('dungeon-name').innerText = `Portail de Rang ${rank}`;
        document.getElementById('dungeon-progress').innerText = "Salle 1 / 3";
        
        const textBox = document.getElementById('dungeon-text-box');
        const choicesBox = document.getElementById('dungeon-choices');

        textBox.innerHTML = "<p>Vous franchissez le seuil lumineux du portail. L'air se densifie, l'atmosphère devient glaciale. Le donjon commence.</p>";
        choicesBox.innerHTML = `
            <button class="btn primary" onclick="CityManager.exploreNextRoom('${rank}')">Avancer vers la salle suivante</button>
        `;
    },

    /**
     * Avance dans le donjon (simulation d'une étape d'exploration).
     */
    exploreNextRoom(rank) {
        const textBox = document.getElementById('dungeon-text-box');
        const choicesBox = document.getElementById('dungeon-choices');

        // On pioche un événement aléatoire dans notre base de données events_dungeon.js
        const randomEvent = DUNGEON_EVENTS.standard[Math.floor(Math.random() * DUNGEON_EVENTS.standard.length)];

        textBox.innerHTML = `<h4>${randomEvent.title}</h4><p>${randomEvent.text}</p>`;
        
        let choicesHtml = '';
        randomEvent.choices.forEach((choice, index) => {
            choicesHtml += `<button class="btn secondary" onclick="CityManager.resolveDungeonChoice('${rank}', '${randomEvent.id}', ${index})">${choice.text}</button>`;
        });
        choicesBox.innerHTML = choicesHtml;
    },

    /**
     * Résout un choix de donjon.
     */
    resolveDungeonChoice(rank, eventId, choiceIndex) {
        const eventObj = DUNGEON_EVENTS.standard.find(e => e.id === eventId);
        const choice = eventObj.choices[choiceIndex];

        let resultText = "";
        if (choice.statCheck) {
            const playerStat = GameEngine.state.stats[choice.statCheck] || 10;
            if (playerStat >= choice.difficulty) {
                resultText = choice.success.text;
                this.applyEffect(choice.success.effect);
            } else {
                resultText = choice.failure.text;
                this.applyEffect(choice.failure.effect);
            }
        } else {
            resultText = choice.successText || "Vous passez cette étape sans encombre.";
            if (choice.effect) this.applyEffect(choice.effect);
        }

        const textBox = document.getElementById('dungeon-text-box');
        const choicesBox = document.getElementById('dungeon-choices');

        textBox.innerHTML += `<p style="margin-top: 15px; color: var(--primary-blue);"><em>${resultText}</em></p>`;
        
        // Bouton pour sortir du donjon et revenir en ville après l'événement (pour le test)
        choicesBox.innerHTML = `
            <button class="btn primary" onclick="CityManager.returnToCityFromDungeon()">Terminer le Raid et rentrer en ville</button>
        `;
    },

    /**
     * Applique les effets d'un choix sur les stats.
     */
    applyEffect(effect) {
        if (!effect) return;
        for (const [key, val] of Object.entries(effect)) {
            if (GameEngine.state.stats[key] !== undefined) {
                GameEngine.state.stats[key] += val;
            }
        }
        GameEngine.updateStatusBar();
    },

    /**
     * Revient en ville après un donjon.
     */
    returnToCityFromDungeon() {
        GameEngine.state.daysLeft = 30; // Réinitialisation du cycle
        StorageManager.saveGame(GameEngine.state);
        GameEngine.switchScreen('screen-dungeon', 'screen-city');
        GameEngine.updateStatusBar();
        alert("Vous êtes rentré sain et sauf dans le monde réel.");
    },

    /**
     * Consomme un jour de PA et déclenche potentiellement un événement civil aléatoire.
     */
    consumeDayAndTriggerEvent() {
        GameEngine.state.day++;
        GameEngine.updateStatusBar();
        StorageManager.saveGame(GameEngine.state);

        // 35% de chance de déclencher un événement aléatoire post-action
        if (Math.random() < 0.35 && CIVIL_EVENTS.length > 0) {
            const randomEvent = CIVIL_EVENTS[Math.floor(Math.random() * CIVIL_EVENTS.length)];
            this.triggerCivilEventModal(randomEvent);
        }
    },

    /**
     * Affiche un événement civil aléatoire sous forme de modale.
     */
    triggerCivilEventModal(eventObj) {
        const modal = document.getElementById('modal-overlay');
        const title = document.getElementById('modal-title');
        const text = document.getElementById('modal-text');
        const actions = document.getElementById('modal-actions');

        title.innerText = `[Événement] ${eventObj.title}`;
        text.innerText = eventObj.text;

        let html = '';
        eventObj.choices.forEach((choice, index) => {
            html += `<button class="btn secondary" onclick="CityManager.resolveCivilChoice('${eventObj.id}', ${index})">${choice.text}</button>`;
        });
        actions.innerHTML = html;

        modal.classList.remove('hidden');
    },

    /**
     * Résout un choix d'événement civil et applique ses effets.
     */
    resolveCivilChoice(eventId, choiceIndex) {
        const eventObj = CIVIL_EVENTS.find(e => e.id === eventId);
        const choice = eventObj.choices[choiceIndex];

        if (choice.effect) {
            this.applyEffect(choice.effect);
        }

        alert(choice.resultText);
        this.closeModal();
        StorageManager.saveGame(GameEngine.state);
        GameEngine.updateStatusBar();
    },

    /**
     * Ferme la modale active.
     */
    closeModal() {
        document.getElementById('modal-overlay').classList.add('hidden');
    }
};
