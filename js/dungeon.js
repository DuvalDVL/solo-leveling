const DungeonManager = {
    currentRank: 'E',
    roomCount: 0,
    maxRooms: 5,

    startDungeon(rank) {
        this.currentRank = rank;
        this.roomCount = 0;
        document.getElementById('dungeon-name').innerText = `Portail Rang ${rank}`;
        
        GameEngine.switchScreen('screen-city', 'screen-dungeon');
        this.nextRoom();
    },

    nextRoom() {
        this.roomCount++;
        document.getElementById('dungeon-progress').innerText = `Salle ${this.roomCount} / ${this.maxRooms}`;
        
        if (this.roomCount === this.maxRooms) {
            this.generateBossRoom();
        } else {
            this.generateRandomRoom();
        }
    },

    generateRandomRoom() {
        // 70% chance de monstre, 30% chance de piège/événement
        const roll = Math.random();
        const data = DUNGEON_EVENTS[this.currentRank];
        
        let encounter;
        if (roll < 0.7) {
            encounter = data.monsters[Math.floor(Math.random() * data.monsters.length)];
        } else {
            encounter = data.traps[Math.floor(Math.random() * data.traps.length)];
        }

        this.displayEncounter(encounter);
    },

    generateBossRoom() {
        const boss = DUNGEON_EVENTS[this.currentRank].boss;
        document.getElementById('dungeon-progress').innerText = `SALLE DU BOSS`;
        this.displayEncounter(boss, true);
    },

    displayEncounter(encounter, isBoss = false) {
        const title = encounter.name ? `<strong>${encounter.name}</strong>` : "<strong>Piège / Événement</strong>";
        document.getElementById('dungeon-text-box').innerHTML = `<p>${title}</p><p>${encounter.text}</p>`;
        
        let html = '';
        encounter.choices.forEach((choice, index) => {
            // Convertir l'objet en string pour le passer dans le onclick
            const choiceStr = encodeURIComponent(JSON.stringify(choice));
            html += `<button class="btn primary" onclick="DungeonManager.resolveChoice('${choiceStr}', ${isBoss})">${choice.text}</button>`;
        });
        
        document.getElementById('dungeon-choices').innerHTML = html;
    },

    resolveChoice(choiceStr, isBoss) {
        const choice = JSON.parse(decodeURIComponent(choiceStr));
        const playerStats = GameEngine.state.stats;
        let isSuccess = false;

        // Calcul de la réussite basé sur la stat requise
        let statValue = 0;
        if (choice.statCheck === 'hybrid') {
            statValue = playerStats.strength + playerStats.agility; // Ex: pour le boss
        } else {
            statValue = playerStats[choice.statCheck] || 0;
        }

        // Ajout d'une part d'aléatoire (le joueur peut réussir avec de la chance même si sa stat est un peu basse)
        const roll = Math.floor(Math.random() * 10) + 1; // 1 à 10
        const totalPower = statValue + roll;

        isSuccess = totalPower >= choice.diff;
        const outcome = isSuccess ? choice.win : choice.lose;

        // Appliquer les effets
        if (outcome.effect) {
            for (let key in outcome.effect) {
                GameEngine.state.stats[key] += outcome.effect[key];
            }
        }
        
        GameEngine.updateStatusBar();

        // Vérifier la mort du joueur
        if (GameEngine.state.stats.hp <= 0) {
            this.handleDeath();
            return;
        }

        // Afficher l'écran de résultat de l'action
        let resultHtml = `<p>${outcome.text}</p>`;
        
        if (isBoss && isSuccess) {
            const loot = DUNGEON_EVENTS[this.currentRank].boss.loot;
            GameEngine.state.stats.money += loot.money;
            resultHtml += `<hr style="margin: 15px 0; border-color: var(--border-color);"><p><strong>RÉCOMPENSES DE RAID :</strong><br>+${loot.money} ₩<br>Objet : ${loot.item}</p>`;
            document.getElementById('dungeon-choices').innerHTML = `<button class="btn system" onclick="DungeonManager.exitDungeon(true)">Quitter le portail victorieux</button>`;
        } else if (isBoss && !isSuccess) {
            // Si le joueur rate contre le boss, on lui propose de réessayer (le combat continue) ou de fuir
            document.getElementById('dungeon-choices').innerHTML = `
                <button class="btn primary" onclick="DungeonManager.generateBossRoom()">Continuer le combat</button>
                <button class="btn outline" onclick="DungeonManager.exitDungeon(false)">Fuir le portail (Échec)</button>
            `;
        } else {
            document.getElementById('dungeon-choices').innerHTML = `<button class="btn secondary" onclick="DungeonManager.nextRoom()">Continuer l'exploration</button>`;
        }

        document.getElementById('dungeon-text-box').innerHTML = resultHtml;
    },

    handleDeath() {
        document.getElementById('dungeon-text-box').innerHTML = `
            <p style="color: var(--alert-red); font-weight: bold; font-size: 1.2rem;">VOUS ÊTES MORT</p>
            <p>Les monstres ont eu raison de vous. Votre aventure s'arrête ici.</p>
        `;
        document.getElementById('dungeon-choices').innerHTML = `<button class="btn system" onclick="location.reload()">Retour à l'écran titre</button>`;
        localStorage.removeItem(StorageManager.SAVE_KEY); // Optionnel : efface la sauvegarde (Permadeath)
    },

    exitDungeon(isVictory) {
        if (isVictory) {
            alert("Vous avez fermé le portail avec succès !");
            CityManager.consumeDay(); // L'exploration prend un jour
        } else {
            alert("Vous fuyez le portail la queue entre les jambes...");
        }
        GameEngine.switchScreen('screen-dungeon', 'screen-city');
    }
};
