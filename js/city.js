const CityManager = {

    /* ==================================================
       PROFIL & STATS
    ================================================== */
    openProfile() {
        const p = GameEngine.state.profile;
        const s = GameEngine.state.stats;
        
        const html = `
            <div style="text-align: left;">
                <p><strong>Rang :</strong> ${p.rank}</p>
                <p><strong>Classe :</strong> ${p.classType}</p>
                <p><strong>Réputation :</strong> ${p.reputation} | <strong>Karma :</strong> ${p.karma}</p>
                <hr style="border-color: var(--border-color); margin: 10px 0;">
                <p>💪 Force : ${s.strength}</p>
                <p>🏃 Agilité : ${s.agility}</p>
                <p>🧠 Intelligence : ${s.intelligence}</p>
                <p>👁️ Perception : ${s.perception}</p>
                <p>🛡️ Vitalité : ${s.vitality}</p>
            </div>
            <button class="btn outline full-width" style="margin-top:15px;" onclick="CityManager.closeModal()">Fermer</button>
        `;
        this.showModal("Dossier Chasseur", "", html);
    },

    /* ==================================================
       ENTRAÎNEMENT
    ================================================== */
    openTraining() {
        if (GameEngine.state.stats.fatigue >= 100) {
            this.showModal("Épuisement", "Vous êtes trop fatigué pour vous entraîner. Reposez-vous.", `<button class="btn outline" onclick="CityManager.closeModal()">Fermer</button>`);
            return;
        }

        const html = `
            <button class="btn primary" onclick="CityManager.train('strength')">Musculation Intense (Force)</button>
            <button class="btn secondary" onclick="CityManager.train('agility')">Cardio & Réflexes (Agilité)</button>
            <button class="btn secondary" onclick="CityManager.train('perception')">Méditation (Perception)</button>
            <button class="btn outline" onclick="CityManager.closeModal()">Annuler</button>
        `;
        this.showModal("Entraînement", "Choisissez la caractéristique à améliorer (Coût : +20 Fatigue).", html);
    },

    train(statName) {
        this.closeModal();
        
        // Application de la fatigue (Capée à 100 max)
        GameEngine.state.stats.fatigue = Math.min(100, GameEngine.state.stats.fatigue + 20);
        
        const roll = Math.random();
        let resultMsg = "";

        if (roll < 0.05) {
            // Échec Critique (5%)
            GameEngine.state.stats.hp -= 15;
            GameEngine.state.stats.morale -= 10;
            resultMsg = "ÉCHEC CRITIQUE ! Vous vous êtes gravement blessé lors de l'entraînement. (-15 PV, -10 Moral, 0 Stat)";
        } 
        else if (roll < 0.25) {
            // Échec (20%)
            resultMsg = "ÉCHEC. Vous n'étiez pas concentré, la séance n'a rien donné. (+0 Stat)";
        }
        else if (roll < 0.85) {
            // Succès normal (60%)
            GameEngine.state.stats[statName] += 2;
            resultMsg = `SUCCÈS. Vous sentez votre corps s'améliorer. (+2 en ${statName})`;
        }
        else if (roll < 0.99) {
            // Succès Critique (14%)
            GameEngine.state.stats[statName] += 5;
            resultMsg = `SUCCÈS CRITIQUE ! Vous avez dépassé vos limites aujourd'hui ! (+5 en ${statName})`;
        }
        else {
            // Double Éveil (1% - Rare)
            GameEngine.state.stats[statName] += 15;
            GameEngine.state.stats.hp = GameEngine.state.stats.maxHp;
            GameEngine.state.profile.rank = this.upgradeRank(GameEngine.state.profile.rank);
            resultMsg = `ANOMALIE DÉTECTÉE : DOUBLE ÉVEIL !! Une puissance incommensurable explose en vous. (+15 ${statName}, PV max restaurés, Hausse de Rang probable !)`;
        }

        this.consumeDay();
        this.showModal("Résultat de l'Entraînement", resultMsg, `<button class="btn primary full-width" onclick="CityManager.closeModal()">Continuer</button>`);
    },

    upgradeRank(currentRank) {
        if (currentRank === 'E') return 'D';
        if (currentRank === 'D') return 'C';
        if (currentRank === 'C') return 'B';
        return currentRank; // A ou S reste bloqué ou géré différemment
    },

    /* ==================================================
       BOUTIQUE
    ================================================== */
    openShop() {
        const html = `
            <button class="btn primary" onclick="CityManager.buy('potion', 5000)">Potion de Soin (5 000 ₩)</button>
            <button class="btn secondary" onclick="CityManager.buy('weapon', 25000)">Arme de base Rang E (25 000 ₩)</button>
            <button class="btn secondary" onclick="CityManager.buy('armor', 30000)">Plastron de cuir (30 000 ₩)</button>
            <button class="btn outline" onclick="CityManager.closeModal()">Fermer</button>
        `;
        this.showModal("Boutique de l'Association", "Votre argent : " + GameEngine.state.stats.money + " ₩", html);
    },

    buy(type, cost) {
        if (GameEngine.state.stats.money >= cost) {
            GameEngine.state.stats.money -= cost;
            if(type === 'potion') { alert("Potion achetée !"); }
            if(type === 'weapon') { GameEngine.state.stats.strength += 3; alert("Arme équipée ! (+3 Force)"); }
            if(type === 'armor') { GameEngine.state.stats.vitality += 3; alert("Armure équipée ! (+3 Vitalité)"); }
            GameEngine.updateStatusBar();
            this.closeModal();
        } else {
            alert("Fonds insuffisants.");
        }
    },

    /* ==================================================
       RÉSEAUX & REPOS
    ================================================== */
    openSocial() {
        const html = `
            <button class="btn primary" onclick="CityManager.doSocial('pr')">Faire un don public (+Réputation, -Argent)</button>
            <button class="btn system" onclick="CityManager.doSocial('underground')">Accepter un contrat louche (+Argent, -Karma)</button>
            <button class="btn outline" onclick="CityManager.closeModal()">Fermer</button>
        `;
        this.showModal("Réseaux & Contacts", "Comment gérez-vous votre image ?", html);
    },

    doSocial(action) {
        if (action === 'pr') {
            GameEngine.state.stats.money -= 5000;
            GameEngine.state.profile.reputation += 5;
            alert("Vous avez redonné à la communauté. Les gens vous apprécient.");
        } else {
            GameEngine.state.stats.money += 10000;
            GameEngine.state.profile.karma -= 10;
            alert("Vous touchez de l'argent sale, votre conscience s'assombrit.");
        }
        this.consumeDay();
        this.closeModal();
    },

    openLife() {
        GameEngine.state.stats.fatigue = Math.max(0, GameEngine.state.stats.fatigue - 40);
        GameEngine.state.stats.morale = Math.min(100, GameEngine.state.stats.morale + 20);
        this.consumeDay();
        this.showModal("Repos", "Vous avez passé du temps à dormir et avec vos proches. (-40 Fatigue, +20 Moral)", `<button class="btn primary full-width" onclick="CityManager.closeModal()">Continuer</button>`);
    },

    /* ==================================================
       PORTAILS
    ================================================== */
    openRaidBoard() {
        const rank = GameEngine.state.profile.rank;
        const html = `
            <button class="btn primary" onclick="CityManager.enterDungeon('E')">Rejoindre un Raid de Rang E</button>
            ${(rank !== 'E') ? `<button class="btn secondary" onclick="CityManager.enterDungeon('D')">Rejoindre un Raid de Rang D</button>` : ''}
            <button class="btn outline" onclick="CityManager.closeModal()">Retour</button>
        `;
        this.showModal("Bureau des Raids", "Choisissez un portail adapté à votre niveau.", html);
    },

   enterDungeon(rank) {
        this.closeModal();
        DungeonManager.startDungeon(rank);
    },

    exitDungeon() {
        GameEngine.switchScreen('screen-dungeon', 'screen-city');
        alert("Raid terminé. (Version d'essai)");
    },

    consumeDay() {
        GameEngine.state.day++;
        GameEngine.state.daysLeft--;
        GameEngine.updateStatusBar();
        StorageManager.saveGame(GameEngine.state);
        document.getElementById('days-left').innerText = GameEngine.state.daysLeft;
    },

    /* ==================================================
       UTILITAIRES UI
    ================================================== */
    showModal(title, text, buttonsHtml) {
        document.getElementById('modal-title').innerText = title;
        document.getElementById('modal-text').innerHTML = text; // innerHTML supporte le HTML (ex: les br)
        document.getElementById('modal-actions').innerHTML = buttonsHtml;
        document.getElementById('modal-overlay').classList.remove('hidden');
    },

    closeModal() {
        document.getElementById('modal-overlay').classList.add('hidden');
    }
};
