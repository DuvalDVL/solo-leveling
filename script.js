let gameState = {
    player: null,
    phase: 1, // 1: Civil, 2: Hub/Donjon
    currentEventIndex: 0,
    combat: null,
    dungeonStep: 0,
    currentDungeon: null
};

// Ciblages DOM
const screenHome = document.getElementById('screen-home');
const screenHistory = document.getElementById('screen-history');
const screenHelp = document.getElementById('screen-help');
const screenGame = document.getElementById('screen-game');

const btnNewGame = document.getElementById('btn-new-game');
const btnHistory = document.getElementById('btn-history');
const btnHelp = document.getElementById('btn-help');
const btnsBack = document.querySelectorAll('.btn-back');

const hudRang = document.getElementById('hud-rang');
const hudLvl = document.getElementById('hud-lvl');
const hudPv = document.getElementById('hud-pv');
const hudPvMax = document.getElementById('hud-pvmax');
const hudOr = document.getElementById('hud-or');
const hudLoyer = document.getElementById('hud-loyer');

const eventTitle = document.getElementById('event-title');
const eventText = document.getElementById('event-text');
const eventChoices = document.getElementById('event-choices');

function switchScreen(from, to) {
    from.classList.remove('active');
    from.classList.add('hidden');
    setTimeout(() => {
        to.classList.remove('hidden');
        to.classList.add('active');
    }, 300);
}

// Gestion de l'historique dans LocalStorage
function saveGameToHistory(statusText) {
    let history = JSON.parse(localStorage.getItem('system_history')) || [];
    history.unshift({ date: new Date().toLocaleDateString(), statut: statusText, niveau: gameState.player.niveau });
    if (history.length > 10) history.pop();
    localStorage.setItem('system_history', JSON.stringify(history));
}

function loadHistoryList() {
    const list = document.getElementById('history-list');
    let history = JSON.parse(localStorage.getItem('system_history')) || [];
    if (history.length === 0) {
        list.innerHTML = "<li>Aucune archive enregistrée.</li>";
        return;
    }
    list.innerHTML = "";
    history.forEach(h => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>[${h.date}]</strong> - Niveau ${h.niveau} - ${h.statut}`;
        list.appendChild(li);
    });
}

btnHistory.addEventListener('click', () => {
    loadHistoryList();
    switchScreen(screenHome, screenHistory);
});
btnHelp.addEventListener('click', () => switchScreen(screenHome, screenHelp));
btnsBack.forEach(btn => btn.addEventListener('click', (e) => switchScreen(e.target.closest('.screen'), screenHome)));

// Nouvelle Partie
btnNewGame.addEventListener('click', () => {
    gameState.player = JSON.parse(JSON.stringify(GAME_DATA.joueurTemplate));
    gameState.phase = 1;
    gameState.currentEventIndex = 0;
    switchScreen(screenHome, screenGame);
    updateHUD();
    loadCivilEvent();
});

function updateHUD() {
    if (!gameState.player) return;
    hudRang.textContent = gameState.player.rangLicence;
    hudLvl.textContent = gameState.player.niveau;
    hudPv.textContent = Math.floor(gameState.player.statsActuelles.pvActuels);
    hudPvMax.textContent = gameState.player.statsMax.pvMax;
    hudOr.textContent = gameState.player.or;
    hudLoyer.textContent = gameState.player.timers.loyerJours;
}

// --- PHASE 1 : ÉVÉNEMENTS CIVILS FIXES ---
function loadCivilEvent() {
    const events = GAME_DATA.evenementsCivils;

    if (gameState.currentEventIndex >= events.length) {
        // Fin de la Phase civile -> Évaluation de Chasseur Rang E
        gameState.phase = 2;
        eventTitle.textContent = "[ ÉVALUATION DE CHASSEUR ]";
        eventText.innerHTML = "Après votre parcours civil, l'Association des Chasseurs analyse vos réflexes et aptitudes.<br><br><em>📜 [RÉSULTAT] : Vous obtenez officiellement votre Licence de Chasseur de **Rang E**. Le Hub Central est désormais accessible.</em>";
        eventChoices.innerHTML = `<button class="hologram-btn primary" onclick="enterHub()">Accéder au Hub Central</button>`;
        return;
    }

    const evt = events[gameState.currentEventIndex];
    eventTitle.textContent = `[ ${evt.titre.toUpperCase()} ]`;
    eventText.textContent = evt.texte;
    eventChoices.innerHTML = "";

    evt.choix.forEach(choix => {
        const btn = document.createElement('button');
        btn.className = "hologram-btn";
        btn.textContent = choix.texte;
        btn.addEventListener('click', () => {
            // Appliquer le gain
            gameState.player.statsMax[choix.gainStat] += choix.valeur;
            
            // Afficher l'écran de résultat FIXE avec bouton CONTINUER
            eventTitle.textContent = "[ RÉSULTAT DE L'ACTION ]";
            eventText.innerHTML = `${choix.resultat}<br><br><span style="color:var(--neon-blue);">[SYSTÈMES] : +${choix.valeur} en ${choix.gainStat.toUpperCase()} enregistré.</span>`;
            eventChoices.innerHTML = "";

            const contBtn = document.createElement('button');
            contBtn.className = "hologram-btn primary";
            contBtn.textContent = "Continuer";
            contBtn.addEventListener('click', () => {
                gameState.currentEventIndex++;
                loadCivilEvent();
            });
            eventChoices.appendChild(contBtn);
        });
        eventChoices.appendChild(btn);
    });
}

// --- PHASE 2 : HUB CENTRAL ---
function enterHub() {
    eventTitle.textContent = "[ HUB CENTRAL - QUARTIER GÉNÉRAL ]";
    eventText.innerHTML = `Que souhaitez-vous faire aujourd'hui ?<br><br><em>Rappel : Le loyer tombe dans <span style='color:var(--neon-red);'>${gameState.player.timers.loyerJours} jours</span>. | Fatigue : ${gameState.player.statsActuelles.fatigue}/100</em>`;
    
    eventChoices.innerHTML = "";

    const actions = [
        { texte: "🚪 Explorer les Donjons", action: openDungeons },
        { texte: "🛒 Boutiques", action: openShopList },
        { texte: "🎒 Sac & Équipement", action: openInventoryModal },
        { texte: "📊 Statistiques", action: openStatsModal },
        { texte: "🏋️ Entraînement physique (+1 stat, 1 jour)", action: trainPhysically },
        { texte: "🛏️ Se reposer (Restaure des PV, 1 jour)", action: restAtHome },
        { texte: "⏳ Passer un Jour", action: advanceDay }
    ];

    actions.forEach(a => {
        const btn = document.createElement('button');
        btn.className = "hologram-btn";
        btn.textContent = a.texte;
        btn.addEventListener('click', a.action);
        eventChoices.appendChild(btn);
    });
}

// Avancer d'un jour
function advanceDay() {
    gameState.player.timers.loyerJours--;
    if (gameState.player.timers.loyerJours <= 0) {
        if (gameState.player.or >= 150) {
            gameState.player.or -= 150;
            gameState.player.timers.loyerJours = 7;
            eventText.innerHTML += "<br><span style='color:var(--neon-green);'>Le propriétaire a prélevé 150 Or pour le loyer.</span>";
        } else {
            saveGameToHistory("Expulsé pour impayés (Faillite)");
            alert("FAILLITE : Vous n'avez pas de quoi payer le loyer. Expulsion imminente !");
            location.reload();
            return;
        }
    }
    updateHUD();
    enterHub();
}

// Entraînement physique
function trainPhysically() {
    const statsList = ["force", "agilite", "vitalite", "reflexe"];
    const randomStat = statsList[Math.floor(Math.random() * statsList.length)];
    gameState.player.statsMax[randomStat] += 1;
    gameState.player.statsActuelles.fatigue = Math.min(100, gameState.player.statsActuelles.fatigue + 15);
    
    eventTitle.textContent = "[ ENTRAÎNEMENT TERMINÉ ]";
    eventText.innerHTML = `Vous avez sueur et sang à l'entraînement.<br><br><span style="color:var(--neon-blue);">[SYSTÈMES] : +1 en ${randomStat.toUpperCase()} !</span>`;
    eventChoices.innerHTML = `<button class="hologram-btn primary" onclick="finishHubAction(1)">Terminer la journée</button>`;
}

// Repos
function restAtHome() {
    const heal = Math.floor(gameState.player.statsMax.pvMax * 0.4);
    gameState.player.statsActuelles.pvActuels = Math.min(gameState.player.statsMax.pvMax, gameState.player.statsActuelles.pvActuels + heal);
    gameState.player.statsActuelles.fatigue = Math.max(0, gameState.player.statsActuelles.fatigue - 30);

    eventTitle.textContent = "[ REPOS PROFOND ]";
    eventText.innerHTML = `Vous avez récupéré des forces chez vous.<br><br><span style="color:var(--neon-green);">PV restaurés : +${heal} | Fatigue réduite.</span>`;
    eventChoices.innerHTML = `<button class="hologram-btn primary" onclick="finishHubAction(1)">Continuer</button>`;
}

function finishHubAction(daysPassed) {
    for(let i=0; i<daysPassed; i++) {
        gameState.player.timers.loyerJours--;
        if (gameState.player.timers.loyerJours <= 0) {
            if (gameState.player.or >= 150) {
                gameState.player.or -= 150;
                gameState.player.timers.loyerJours = 7;
            } else {
                saveGameToHistory("Expulsé pour impayés (Faillite)");
                alert("FAILLITE : Expulsé pour impayés !");
                location.reload();
                return;
            }
        }
    }
    updateHUD();
    enterHub();
}

// --- BOUTIQUES MULTIPLES ---
function openShopList() {
    eventTitle.textContent = "[ MARCHÉS & BOUTIQUES ]";
    eventText.textContent = "Sélectionnez un comptoir commercial :";
    eventChoices.innerHTML = "";

    GAME_DATA.boutiques.forEach(shop => {
        let isLocked = false;
        let lockReason = "";

        if (shop.requis.type === "rang") {
            if (shop.requis.valeur === "D" && gameState.player.rangLicence !== "D" && gameState.player.rangLicence !== "C") {
                isLocked = true;
                lockReason = shop.requis.message;
            }
        } else if (shop.requis.type === "reputation") {
            if (gameState.player.reputation < shop.requis.valeur) {
                isLocked = true;
                lockReason = shop.requis.message;
            }
        }

        const btn = document.createElement('button');
        btn.className = `hologram-btn ${isLocked ? 'warning' : ''}`;
        btn.textContent = `${shop.nom} ${isLocked ? `[🔒 ${lockReason}]` : ''}`;
        
        if (!isLocked) {
            btn.addEventListener('click', () => openShopDetail(shop));
        } else {
            btn.addEventListener('click', () => {
                eventText.innerHTML = `<span style="color:var(--neon-red);">Accès refusé : ${lockReason}</span>`;
            });
        }
        eventChoices.appendChild(btn);
    });

    const backBtn = document.createElement('button');
    backBtn.className = "hologram-btn";
    backBtn.textContent = "Retour au Hub";
    backBtn.addEventListener('click', enterHub);
    eventChoices.appendChild(backBtn);
}

function openShopDetail(shop) {
    eventTitle.textContent = `[ ${shop.nom.toUpperCase()} ]`;
    eventText.innerHTML = "Articles disponibles à la vente :";
    eventChoices.innerHTML = "";

    shop.articles.forEach(itemId => {
        const obj = GAME_DATA.objets[itemId];
        if (!obj) return;

        const btn = document.createElement('button');
        btn.className = "hologram-btn";
        btn.textContent = `${obj.nom} — ${obj.prix} Or`;
        btn.addEventListener('click', () => {
            if (gameState.player.or >= obj.prix) {
                gameState.player.or -= obj.prix;
                gameState.player.inventaire.push(obj.id);
                updateHUD();
                eventText.innerHTML = `<span style="color:var(--neon-green);">[ACHAT RÉUSSI] : Vous avez acquis ${obj.nom}.</span>`;
            } else {
                eventText.innerHTML = `<span style="color:var(--neon-red);">[ERREUR] : Fonds insuffisants.</span>`;
            }
        });
        eventChoices.appendChild(btn);
    });

    const backBtn = document.createElement('button');
    backBtn.className = "hologram-btn";
    backBtn.textContent = "Retour aux Boutiques";
    backBtn.addEventListener('click', openShopList);
    eventChoices.appendChild(backBtn);
}

// --- DONJONS ET COMBATS EN ÉTAPES ---
function openDungeons() {
    eventTitle.textContent = "[ SÉLECTION DES PORTAILS ]";
    eventText.textContent = "Choisissez un portail de donjon à explorer :";
    eventChoices.innerHTML = "";

    GAME_DATA.donjons.forEach(d => {
        const btn = document.createElement('button');
        btn.className = "hologram-btn";
        btn.textContent = `${d.nom} (Rang ${d.rang})`;
        btn.addEventListener('click', () => startDungeonExploration(d));
        eventChoices.appendChild(btn);
    });

    const backBtn = document.createElement('button');
    backBtn.className = "hologram-btn";
    backBtn.textContent = "Retour au Hub";
    backBtn.addEventListener('click', enterHub);
    eventChoices.appendChild(backBtn);
}

function startDungeonExploration(dungeon) {
    gameState.currentDungeon = dungeon;
    gameState.dungeonStep = 1;
    renderDungeonStep();
}

function renderDungeonStep() {
    const d = gameState.currentDungeon;
    if (gameState.dungeonStep === 1) {
        eventTitle.textContent = `[ ${d.nom.toUpperCase()} - EXPLORATION ]`;
        eventText.innerHTML = "Vous franchissez le seuil du portail. Une atmosphère lourde et glaciale vous enveloppe. Les couloirs sombres résonnent de bruits inquiétants...";
        eventChoices.innerHTML = "";

        const nextBtn = document.createElement('button');
        nextBtn.className = "hologram-btn primary";
        nextBtn.textContent = "Avancer prudemment dans la zone";
        nextBtn.addEventListener('click', () => {
            gameState.dungeonStep = 2;
            renderDungeonStep();
        });
        eventChoices.appendChild(nextBtn);

    } else if (gameState.dungeonStep === 2) {
        // Lancer le combat
        const template = GAME_DATA.monstres[d.monstreId];
        gameState.combat = {
            monstre: JSON.parse(JSON.stringify(template))
        };
        renderCombatTurn();
    }
}

function renderCombatTurn() {
    const m = gameState.combat.monstre;
    eventTitle.textContent = `[ COMBAT : ${m.nom.toUpperCase()} ]`;
    eventText.innerHTML = `<em>${m.description}</em><br><br><strong>Monstre - PV :</strong> ${m.stats.pv}/${m.stats.pvMax} | <strong>Force :</strong> ${m.stats.force}<br><strong>Vos PV :</strong> ${Math.floor(gameState.player.statsActuelles.pvActuels)}/${gameState.player.statsMax.pvMax}`;
    eventChoices.innerHTML = "";

    const btnAttaquer = document.createElement('button');
    btnAttaquer.className = "hologram-btn primary";
    btnAttaquer.textContent = "🗡️ Attaquer au corps à corps";
    btnAttaquer.addEventListener('click', () => executeCombatAction());
    eventChoices.appendChild(btnAttaquer);

    const btnFuir = document.createElement('button');
    btnFuir.className = "hologram-btn warning";
    btnFuir.textContent = "🏃 Fuir en catastrophe vers le Hub";
    btnFuir.addEventListener('click', () => {
        finishHubAction(1);
    });
    eventChoices.appendChild(btnFuir);
}

function executeCombatAction() {
    const m = gameState.combat.monstre;
    let degatsJoueur = gameState.player.statsMax.force * 2;
    m.stats.pv -= degatsJoueur;

    if (m.stats.pv <= 0) {
        const orGagne = Math.floor(Math.random() * (m.recompenses.orMax - m.recompenses.orMin)) + m.recompenses.orMin;
        gameState.player.or += orGagne;
        gameState.player.reputation += 3;
        saveGameToHistory(`Victoire contre ${m.nom}`);
        
        eventTitle.textContent = "[ VICTOIRE DANS LE DONJON ]";
        eventText.innerHTML = `Vous terrassez le ${m.nom} dans un dernier assaut fulgurant !<br><br><span style="color:var(--neon-green);">Butin récupéré : +${orGagne} Or | +3 Réputation.</span>`;
        eventChoices.innerHTML = `<button class="hologram-btn primary" onclick="finishHubAction(1)">Retourner au Hub (1 jour écoulé)</button>`;
        updateHUD();
        return;
    }

    let degatsMonstre = Math.max(1, m.stats.force - Math.floor(gameState.player.statsMax.vitalite / 2));
    gameState.player.statsActuelles.pvActuels -= degatsMonstre;

    if (gameState.player.statsActuelles.pvActuels <= 0) {
        gameState.player.statsActuelles.pvActuels = 0;
        updateHUD();
        saveGameToHistory(`Mort au combat contre ${m.nom}`);
        eventTitle.textContent = "[ ÉCHEC CRITIQUE ]";
        eventText.innerHTML = "Vous avez succombé aux blessures infligées par le monstre... Le Système s'active d'urgence.";
        eventChoices.innerHTML = `<button class="hologram-btn warning" onclick="location.reload()">Recommencer une partie</button>`;
        return;
    }

    updateHUD();
    renderCombatTurn();
}

// --- INVENTAIRE, ÉQUIPEMENT & VENTE ---
function openInventoryModal() {
    renderInventoryGrid();
    renderEquipmentDisplay();
    document.getElementById('modal-inventory').classList.remove('hidden');
}

function renderInventoryGrid() {
    const grid = document.getElementById('inventory-grid-container');
    grid.innerHTML = "";
    document.getElementById('item-details').textContent = "Sélectionnez un objet.";
    document.getElementById('item-actions').innerHTML = "";

    for (let i = 0; i < 12; i++) {
        const slot = document.createElement('div');
        slot.className = "inventory-slot";
        const itemId = gameState.player.inventaire[i];
        
        if (itemId && GAME_DATA.objets[itemId]) {
            const obj = GAME_DATA.objets[itemId];
            slot.textContent = obj.nom; // Tronqué automatiquement par CSS si trop long
            slot.addEventListener('click', () => selectInventoryItem(i, obj));
        } else {
            slot.textContent = "[Vide]";
        }
        grid.appendChild(slot);
    }
}

function renderEquipmentDisplay() {
    const eq = gameState.player.equipement;
    document.getElementById('eq-tete').textContent = `Tête : ${eq.tete ? GAME_DATA.objets[eq.tete].nom : '[Vide]'}`;
    document.getElementById('eq-torse').textContent = `Torse : ${eq.torse ? GAME_DATA.objets[eq.torse].nom : '[Vide]'}`;
    document.getElementById('eq-mains').textContent = `Mains : ${eq.mains ? GAME_DATA.objets[eq.mains].nom : '[Vide]'}`;
    document.getElementById('eq-accessoire').textContent = `Accessoire : ${eq.accessoire ? GAME_DATA.objets[eq.accessoire].nom : '[Vide]'}`;
}

function selectInventoryItem(index, obj) {
    document.getElementById('item-details').textContent = `[${obj.nom}] (${obj.type}) — Prix d'achat: ${obj.prix} Or`;
    const actionsContainer = document.getElementById('item-actions');
    actionsContainer.innerHTML = "";

    if (obj.type === "consommable") {
        const useBtn = document.createElement('button');
        useBtn.className = "hologram-btn primary";
        useBtn.textContent = "Utiliser";
        useBtn.addEventListener('click', () => {
            useConsumable(index, obj);
        });
        actionsContainer.appendChild(useBtn);
    } else if (obj.type === "arme" || obj.type === "armure") {
        const equipBtn = document.createElement('button');
        equipBtn.className = "hologram-btn primary";
        equipBtn.textContent = "Équiper";
        equipBtn.addEventListener('click', () => {
            equipItemFromInventory(index, obj);
        });
        actionsContainer.appendChild(equipBtn);
    }

    // Bouton Vendre
    const sellBtn = document.createElement('button');
    sellBtn.className = "hologram-btn warning";
    sellBtn.textContent = `Vendre (+${Math.floor(obj.prix / 2)} Or)`;
    sellBtn.addEventListener('click', () => {
        sellItemFromInventory(index, obj);
    });
    actionsContainer.appendChild(sellBtn);
}

function useConsumable(index, obj) {
    const p = gameState.player;
    if (obj.effet.soinPv) {
        p.statsActuelles.pvActuels = Math.min(p.statsMax.pvMax, p.statsActuelles.pvActuels + obj.effet.soinPv);
    } else if (obj.effet.soinPvPourcentage) {
        const heal = Math.floor(p.statsMax.pvMax * (obj.effet.soinPvPourcentage / 100));
        p.statsActuelles.pvActuels = Math.min(p.statsMax.pvMax, p.statsActuelles.pvActuels + heal);
    }
    p.inventaire.splice(index, 1);
    updateHUD();
    renderInventoryGrid();
}

function equipItemFromInventory(index, obj) {
    const p = gameState.player;
    const slot = obj.slot;

    if (p.equipement[slot]) {
        const oldItemId = p.equipement[slot];
        const oldObj = GAME_DATA.objets[oldItemId];
        if (oldObj && oldObj.bonusStats) {
            for (let stat in oldObj.bonusStats) {
                p.statsMax[stat] -= oldObj.bonusStats[stat];
            }
        }
        p.inventaire[index] = oldItemId;
    } else {
        p.inventaire.splice(index, 1);
    }

    p.equipement[slot] = obj.id;
    if (obj.bonusStats) {
        for (let stat in obj.bonusStats) {
            p.statsMax[stat] += obj.bonusStats[stat];
        }
    }

    updateHUD();
    renderInventoryGrid();
    renderEquipmentDisplay();
}

function sellItemFromInventory(index, obj) {
    const p = gameState.player;
    const gain = Math.floor(obj.prix / 2);
    p.or += gain;
    p.inventaire.splice(index, 1);
    updateHUD();
    renderInventoryGrid();
    document.getElementById('item-details').textContent = `Vendu ${obj.nom} pour ${gain} Or.`;
}

function closeInventoryModal() {
    document.getElementById('modal-inventory').classList.add('hidden');
}

function openStatsModal() {
    const p = gameState.player;
    const content = document.getElementById('stats-content');
    content.innerHTML = `
        <strong>Rang de Licence :</strong> ${p.rangLicence}<br>
        <strong>Réputation :</strong> ${p.reputation}<br>
        <strong>Niveau :</strong> ${p.niveau}<br><br>
        Force : ${p.statsMax.force}<br>
        Agilité : ${p.statsMax.agilite}<br>
        Vitalité : ${p.statsMax.vitalite}<br>
        Intelligence : ${p.statsMax.intelligence}<br>
        Perception : ${p.statsMax.perception}<br>
        Réflexe : ${p.statsMax.reflexe}
    `;
    document.getElementById('modal-stats').classList.remove('hidden');
}

function closeStatsModal() {
    document.getElementById('modal-stats').classList.add('hidden');
}
