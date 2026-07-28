const CityManager = {
    openShop() {
        this.showModal("Boutique", "Acheter des potions (5000 ₩) ?", 
        `<button class="btn primary" onclick="CityManager.buy(5000)">Acheter</button>
         <button class="btn outline" onclick="CityManager.closeModal()">Fermer</button>`);
    },
    buy(cost) {
        if (GameEngine.state.stats.money >= cost) {
            GameEngine.state.stats.money -= cost;
            alert("Achat effectué !");
            GameEngine.updateStatusBar();
        } else {
            alert("Pas assez d'argent.");
        }
        this.closeModal();
    },
    openTraining() {
        this.showModal("Entraînement", "Consomme de la fatigue pour augmenter les stats.", 
        `<button class="btn primary" onclick="CityManager.train()">S'entraîner (Fatigue +20)</button>
         <button class="btn outline" onclick="CityManager.closeModal()">Annuler</button>`);
    },
    train() {
        GameEngine.state.stats.fatigue += 20;
        GameEngine.state.stats.strength += 2;
        alert("Force +2 !");
        this.closeModal();
        this.consumeDay();
    },
    openSocial() {
        this.showModal("Réseaux", "Gérer votre réputation.", 
        `<button class="btn outline" onclick="CityManager.closeModal()">Fermer</button>`);
    },
    openLife() {
        GameEngine.state.stats.fatigue = Math.max(0, GameEngine.state.stats.fatigue - 30);
        alert("Vous êtes reposé. Fatigue -30.");
        this.consumeDay();
    },
    openRaidBoard() {
        this.showModal("Portails", "Sélectionnez un raid.", 
        `<button class="btn system" onclick="CityManager.enterDungeon()">Entrer dans le Portail</button>
         <button class="btn outline" onclick="CityManager.closeModal()">Fermer</button>`);
    },
    enterDungeon() {
        this.closeModal();
        GameEngine.switchScreen('screen-city', 'screen-dungeon');
        document.getElementById('dungeon-text-box').innerHTML = "<p>Vous entrez dans le donjon...</p>";
        document.getElementById('dungeon-choices').innerHTML = `<button class="btn primary" onclick="CityManager.exitDungeon()">Sortir (Test)</button>`;
    },
    exitDungeon() {
        GameEngine.switchScreen('screen-dungeon', 'screen-city');
    },
    consumeDay() {
        GameEngine.state.day++;
        GameEngine.state.daysLeft--;
        GameEngine.updateStatusBar();
        StorageManager.saveGame(GameEngine.state);
        document.getElementById('days-left').innerText = GameEngine.state.daysLeft;
    },
    showModal(title, text, buttonsHtml) {
        document.getElementById('modal-title').innerText = title;
        document.getElementById('modal-text').innerText = text;
        document.getElementById('modal-actions').innerHTML = buttonsHtml;
        document.getElementById('modal-overlay').classList.remove('hidden');
    },
    closeModal() {
        document.getElementById('modal-overlay').classList.add('hidden');
    }
};
