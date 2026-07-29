const DungeonManager = {
    currentRank: 'E',
    roomCount: 0,
    maxRooms: 5,
    currentEncounter: null, // Mémorise la salle actuelle

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
            this.currentEncounter = DUNGEON_EVENTS[this.currentRank].boss;
            document.getElementById('dungeon-progress').innerText = `SALLE DU BOSS`;
            this.displayEncounter(true);
        } else {
            const data = DUNGEON_EVENTS[this.currentRank];
            this.currentEncounter = (Math.random() < 0.7) 
                ? data.monsters[Math.floor(Math.random() * data.monsters.length)]
                : data.traps[Math.floor(Math.random() * data.traps.length)];
            this.displayEncounter(false);
        }
    },

    displayEncounter(isBoss) {
        const title = this.currentEncounter.name ? `<strong>${this.currentEncounter.name}</strong>` : "<strong>Événement</strong>";
        document.getElementById('dungeon-text-box').innerHTML = `<p>${title}</p><p>${this.currentEncounter.text}</p>`;
        
        let html = '';
        this.currentEncounter.choices.forEach((choice, index) => {
            // VERIFICATION DES TRAITS : Si le choix a besoin d'un trait que le joueur n'a pas, on le masque
            if (choice.requiredTrait && !GameEngine.state.traits.includes(choice.requiredTrait)) {
                return; 
            }
            // Bouton simplifié (plus de JSON qui casse)
            html += `<button class="btn primary" onclick="DungeonManager.resolveChoice(${index}, ${isBoss})">${choice.text}</button>`;
        });
        
        document.getElementById('dungeon-choices').innerHTML = html;
    },

    resolveChoice(choiceIndex, isBoss) {
        const choice = this.currentEncounter.choices[choiceIndex];
        const playerStats = GameEngine.state.stats;
        
        let statValue = (choice.statCheck === 'hybrid') 
            ? playerStats.strength + playerStats.agility 
            : (playerStats[choice.statCheck] || 0);

        // Les traits influencent aussi passivement la puissance globale
        if (GameEngine.state.traits.includes("ampute_bras") && (choice.statCheck === 'strength' || choice.statCheck === 'hybrid')) statValue -= 5;
        if (GameEngine.state.traits.includes("courageux")) statValue += 2; // Bonus passif de courage

        const roll = Math.floor(Math.random() * 10) + 1;
        const isSuccess = (statValue + roll) >= choice.diff;
        const outcome = isSuccess ? choice.win : choice.lose;

        if (outcome.effect) {
            for (let key in outcome.effect) GameEngine.state.stats[key] += outcome.effect[key];
        }
        
        if (isSuccess) {
            if (isBoss) {
                GameEngine.state.career.bossesKilled++;
                GameEngine.state.career.events.push(`A vaincu le boss : ${this.currentEncounter.name}`);
                // Exemple d'obtention de trait
                if (this.currentEncounter.name === "Chef Gobelin" && !GameEngine.state.traits.includes("tueur_gobelin")) {
                    GameEngine.state.traits.push("tueur_gobelin");
                    outcome.text += "<br><strong>[Nouveau Trait Débloqué : Fléau des Gobelins]</strong>";
                }
            } else {
                GameEngine.state.career.monstersKilled++;
            }
        }

        GameEngine.updateStatusBar();

        if (GameEngine.state.stats.hp <= 0) {
            this.handleDeath();
            return;
        }

        let resultHtml = `<p>${outcome.text}</p>`;
        
        if (isBoss && isSuccess) {
            const loot = this.currentEncounter.loot;
            GameEngine.state.stats.money += loot.money;
            resultHtml += `<hr style="border-color: var(--border-color); margin: 15px 0;"><p><strong>BUTIN :</strong><br>+${loot.money} ₩<br>Objet : ${loot.item}</p>`;
            document.getElementById('dungeon-choices').innerHTML = `<button class="btn system" onclick="DungeonManager.exitDungeon(true)">Quitter le portail victorieux</button>`;
        } else if (isBoss && !isSuccess) {
            document.getElementById('dungeon-choices').innerHTML = `<button class="btn primary" onclick="DungeonManager.displayEncounter(true)">Continuer le combat</button> <button class="btn outline" onclick="DungeonManager.exitDungeon(false)">Fuir</button>`;
        } else {
            document.getElementById('dungeon-choices').innerHTML = `<button class="btn secondary" onclick="DungeonManager.nextRoom()">Continuer l'exploration</button>`;
        }

        document.getElementById('dungeon-text-box').innerHTML = resultHtml;
    },

    handleDeath() {
        const roll = Math.random();
        let title = "", text = "", actions = "";

        if (roll < 0.3) {
            title = "MORT AU COMBAT";
            text = "Votre corps rejoint les cadavres qui tapissent ce portail. Votre histoire s'arrête ici.";
            actions = `<button class="btn system" onclick="GameEngine.showSummary(true)">Voir le bilan de carrière</button>`;
        } 
        else if (roll < 0.7) {
            GameEngine.state.stats.morale -= 30;
            GameEngine.state.stats.hp = 10;
            if (!GameEngine.state.traits.includes("lache")) GameEngine.state.traits.push("lache");
            
            title = "SAUVETAGE IN EXTREMIS";
            text = "Un groupe de chasseurs vous a tiré de là. Vous survivez, mais votre fierté est brisée.<br><span style='color:var(--alert-red);'>-30 Moral. Trait 'Lâche' obtenu (si non possédé).</span>";
            actions = `<button class="btn primary" onclick="CityManager.exitDungeon(false)">Continuer (Retour en ville)</button> <button class="btn outline" onclick="GameEngine.showSummary(false)">Prendre sa retraite</button>`;
        } 
        else {
            const debt = 50000;
            GameEngine.state.stats.money -= debt;
            GameEngine.state.stats.hp = 20;
            GameEngine.state.stats.strength = Math.max(1, GameEngine.state.stats.strength - 10);
            if (!GameEngine.state.traits.includes("ampute_bras")) GameEngine.state.traits.push("ampute_bras");

            title = "RÉVEIL À L'HÔPITAL";
            text = `Ils ont dû vous amputer d'un bras pour vous sauver.<br><br><strong>Frais :</strong> <span style='color:var(--alert-red);'>-${debt} ₩</span><br><strong>Force diminuée.</strong><br><span style='color:var(--alert-red);'>Trait 'Amputé (Bras)' obtenu.</span>`;
            actions = `<button class="btn primary" onclick="CityManager.exitDungeon(false)">S'adapter et Continuer</button> <button class="btn outline" onclick="GameEngine.showSummary(false)">Prendre sa retraite</button>`;
        }

        document.getElementById('dungeon-text-box').innerHTML = `<p style="font-weight: bold; font-size: 1.2rem;">${title}</p><p>${text}</p>`;
        document.getElementById('dungeon-choices').innerHTML = actions;
    },

    exitDungeon(isVictory) {
        if (isVictory) {
            GameEngine.state.career.blueGates++;
            GameEngine.state.career.moneyCollected += this.currentEncounter.loot.money;
            alert("Vous avez fermé le portail avec succès !");
            CityManager.consumeDay();
        }
        GameEngine.switchScreen('screen-dungeon', 'screen-city');
    }
};
