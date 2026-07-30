let gameState = {
    player: null,
    civilEventsSequence: [],
    currentEventIndex: 0,
    affinites: { Guerrier: 0, Assassin: 0, Mage: 0, Ranger: 0, Tank: 0 },
    combat: null,
    dungeonStep: 0,
    currentDungeon: null,
    isDefending: false,
    doubleEveilDeclenche: false
};

const screenHome = document.getElementById('screen-home');
const screenCreation = document.getElementById('screen-creation');
const screenGame = document.getElementById('screen-game');

const btnNewGame = document.getElementById('btn-new-game');
const btnStartCivil = document.getElementById('btn-start-civil');

const hudRang = document.getElementById('hud-rang');
const hudClasse = document.getElementById('hud-classe');
const hudPv = document.getElementById('hud-pv');
const hudPvMax = document.getElementById('hud-pvmax');
const hudPm = document.getElementById('hud-pm');
const hudPmMax = document.getElementById('hud-pmmax');
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

// Lancement de partie -> Écran de création
btnNewGame.addEventListener('click', () => {
    switchScreen(screenHome, screenCreation);
});

btnStartCivil.addEventListener('click', () => {
    const nom = document.getElementById('input-nom').value || "Sung";
    const metier = document.getElementById('select-metier').value;
    
    // Initialisation
    gameState.player = JSON.parse(JSON.stringify(GAME_DATA.joueurTemplate));
    gameState.player.nom = nom;
    gameState.player.metierCivil = metier;

    // Bonus de métier
    const bonus = GAME_DATA.metiers[metier];
    gameState.player.statsMax.force += bonus.force;
    gameState.player.statsMax.vitalite += bonus.vitalite;
    gameState.player.statsMax.agilite += bonus.agilite;
    gameState.player.statsMax.intelligence += bonus.intelligence;
    gameState.player.statsMax.perception += bonus.perception;
    gameState.player.statsMax.reflexe += bonus.reflexe;
    gameState.player.or = bonus.or;

    // Mélanger les événements civils et en prendre 5
    gameState.civilEventsSequence = [...GAME_DATA.evenementsCivils]
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);
    
    gameState.currentEventIndex = 0;
    gameState.affinites = { Guerrier: 0, Assassin: 0, Mage: 0, Ranger: 0, Tank: 0 };
    gameState.doubleEveilDeclenche = false;

    switchScreen(screenCreation, screenGame);
    updateHUD();
    loadCivilEvent();
});

function updateHUD() {
    if (!gameState.player) return;
    hudRang.textContent = gameState.player.rangLicence;
    hudClasse.textContent = gameState.player.classe;
    hudPv.textContent = Math.floor(gameState.player.statsActuelles.pvActuels);
    hudPvMax.textContent = gameState.player.statsMax.pvMax;
    hudPm.textContent = Math.floor(gameState.player.statsActuelles.pmActuels);
    hudPmMax.textContent = gameState.player.statsMax.pmMax;
    hudOr.textContent = gameState.player.or;
    hudLoyer.textContent = gameState.player.timers.loyerJours;
}

// --- PHASE 1 : ÉVÉNEMENTS CIVILS ---
function loadCivilEvent() {
    if (gameState.currentEventIndex >= gameState.civilEventsSequence.length) {
        triggerAwakening();
        return;
    }

    const evt = gameState.civilEventsSequence[gameState.currentEventIndex];
    eventTitle.textContent = `[ ${evt.titre.toUpperCase()} ]`;
    eventText.textContent = evt.texte;
    eventChoices.innerHTML = "";

    evt.choix.forEach(choix => {
        const btn = document.createElement('button');
        btn.className = "hologram-btn";
        btn.textContent = choix.texte;
        btn.addEventListener('click', () => {
            gameState.player.statsMax[choix.gainStat] += choix.valeur;
            if (gameState.affinites[choix.affinite] !== undefined) {
                gameState.affinites[choix.affinite]++;
            }
            
            eventTitle.textContent = "[ RÉSULTAT ]";
            eventText.innerHTML = `${choix.resultat}<br><br><span style="color:var(--neon-blue);">+${choix.valeur} en ${choix.gainStat.toUpperCase()}</span>`;
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

// Attribution de classe basée sur les choix
function triggerAwakening() {
    // Trouve la classe avec le plus de points d'affinité
    const classeAttribuee = Object.keys(gameState.affinites).reduce((a, b) => gameState.affinites[a] > gameState.affinites[b] ? a : b);
    gameState.player.classe = classeAttribuee;
    updateHUD();

    eventTitle.textContent = "[ ÉVEIL DU SYSTÈME ]";
    eventText.innerHTML = `${GAME_DATA.textesEveil[classeAttribuee]}<br><br><em>📜 Vous obtenez votre Licence de Chasseur Rang E en tant que **${classeAttribuee}**.</em>`;
    eventChoices.innerHTML = `<button class="hologram-btn primary" onclick="enterHub()">Accéder au Hub Central</button>`;
}

// --- HUB CENTRAL & LOYER ---
function enterHub() {
    eventTitle.textContent = "[ HUB CENTRAL ]";
    eventText.innerHTML = `Que souhaitez-vous faire ?<br><br><em>Rappel : Le loyer de <span style="color:var(--neon-red);">${gameState.player.timers.montantLoyer} Or</span> tombe dans <span style='color:var(--neon-red);'>${gameState.player.timers.loyerJours} jours</span>. | Fatigue : ${gameState.player.statsActuelles.fatigue}/100</em>`;
    
    eventChoices.innerHTML = "";
    const actions = [
        { texte: "🚪 Explorer les Donjons", action: openDungeons },
        { texte: "🛒 Boutiques", action: openShopList },
        { texte: "🏋️ Salle d'Entraînement", action: openTrainings },
        { texte: "🛏️ Se reposer (Restaure PV/PM, 1 jour)", action: restAtHome },
        { texte: "⏳ Passer un Jour", action: () => finishHubAction(1) }
    ];

    actions.forEach(a => {
        const btn = document.createElement('button');
        btn.className = "hologram-btn";
        btn.textContent = a.texte;
        btn.addEventListener('click', a.action);
        eventChoices.appendChild(btn);
    });
}

function finishHubAction(daysPassed) {
    for(let i=0; i<daysPassed; i++) {
        gameState.player.timers.loyerJours--;
        if (gameState.player.timers.loyerJours <= 0) {
            const loyer = gameState.player.timers.montantLoyer;
            if (gameState.player.or >= loyer) {
                gameState.player.or -= loyer;
                gameState.player.timers.loyerJours = 7;
                alert(`Le propriétaire a prélevé ${loyer} Or pour le loyer.`);
            } else {
                alert(`FAILLITE : Vous n'avez pas les ${loyer} Or pour payer le loyer. Expulsion !`);
                location.reload();
                return;
            }
        }
    }
    updateHUD();
    enterHub();
}

// Entraînements ciblés
function openTrainings() {
    eventTitle.textContent = "[ SALLE D'ENTRAÎNEMENT ]";
    eventText.textContent = "Chaque séance prend 1 jour et augmente votre fatigue.";
    eventChoices.innerHTML = "";

    const trainings = [
        { nom: "Musculation Intensive (+Force)", stat: "force" },
        { nom: "Cardio & Sprints (+Agilité)", stat: "agilite" },
        { nom: "Encaisser les chocs (+Vitalité)", stat: "vitalite" },
        { nom: "Méditation Profonde (+Intelligence)", stat: "intelligence" },
        { nom: "Tir sur cible (+Perception)", stat: "perception" }
    ];

    trainings.forEach(t => {
        const btn = document.createElement('button');
        btn.className = "hologram-btn";
        btn.textContent = t.nom;
        btn.addEventListener('click', () => {
            gameState.player.statsMax[t.stat] += 1;
            gameState.player.statsActuelles.fatigue = Math.min(100, gameState.player.statsActuelles.fatigue + 20);
            
            eventTitle.textContent = "[ ENTRAÎNEMENT TERMINÉ ]";
            eventText.innerHTML = `Vous progressez.<br><br><span style="color:var(--neon-blue);">[SYSTÈMES] : +1 en ${t.stat.toUpperCase()} !</span>`;
            eventChoices.innerHTML = `<button class="hologram-btn primary" onclick="finishHubAction(1)">Terminer la journée</button>`;
        });
        eventChoices.appendChild(btn);
    });

    const backBtn = document.createElement('button');
    backBtn.className = "hologram-btn warning";
    backBtn.textContent = "Retour";
    backBtn.addEventListener('click', enterHub);
    eventChoices.appendChild(backBtn);
}

function restAtHome() {
    gameState.player.statsActuelles.pvActuels = gameState.player.statsMax.pvMax;
    gameState.player.statsActuelles.pmActuels = gameState.player.statsMax.pmMax;
    gameState.player.statsActuelles.fatigue = 0;
    eventTitle.textContent = "[ REPOS COMPLET ]";
    eventText.innerHTML = `<span style="color:var(--neon-green);">PV, PM et Fatigue entièrement restaurés.</span>`;
    eventChoices.innerHTML = `<button class="hologram-btn primary" onclick="finishHubAction(1)">Continuer</button>`;
}

// --- BOUTIQUES (Identique à la V1.1) ---
function openShopList() {
    eventTitle.textContent = "[ MARCHÉS & BOUTIQUES ]";
    eventText.textContent = "Sélectionnez un comptoir commercial :";
    eventChoices.innerHTML = "";

    GAME_DATA.boutiques.forEach(shop => {
        let isLocked = false; let lockReason = "";
        if (shop.requis.type === "rang") {
            if (shop.requis.valeur === "D" && gameState.player.rangLicence !== "D" && gameState.player.rangLicence !== "C") {
                isLocked = true; lockReason = shop.requis.message;
            }
        } else if (shop.requis.type === "reputation") {
            if (gameState.player.reputation < shop.requis.valeur) {
                isLocked = true; lockReason = shop.requis.message;
            }
        }

        const btn = document.createElement('button');
        btn.className = `hologram-btn ${isLocked ? 'warning' : ''}`;
        btn.textContent = `${shop.nom} ${isLocked ? `[🔒 ${lockReason}]` : ''}`;
        
        if (!isLocked) btn.addEventListener('click', () => openShopDetail(shop));
        else btn.addEventListener('click', () => eventText.innerHTML = `<span style="color:var(--neon-red);">Accès refusé.</span>`);
        
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
    eventText.innerHTML = "Articles disponibles :";
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
                eventText.innerHTML = `<span style="color:var(--neon-green);">Vous avez acheté ${obj.nom}.</span>`;
            } else {
                eventText.innerHTML = `<span style="color:var(--neon-red);">Fonds insuffisants.</span>`;
            }
        });
        eventChoices.appendChild(btn);
    });

    const backBtn = document.createElement('button');
    backBtn.className = "hologram-btn";
    backBtn.textContent = "Retour";
    backBtn.addEventListener('click', openShopList);
    eventChoices.appendChild(backBtn);
}

// --- DONJONS ET COMBAT ---
function openDungeons() {
    eventTitle.textContent = "[ SÉLECTION DES PORTAILS ]";
    eventText.textContent = "Choisissez un portail :";
    eventChoices.innerHTML = "";

    GAME_DATA.donjons.forEach(d => {
        const btn = document.createElement('button');
        btn.className = "hologram-btn";
        btn.textContent = `${d.nom}`;
        btn.addEventListener('click', () => startDungeon(d));
        eventChoices.appendChild(btn);
    });

    const backBtn = document.createElement('button');
    backBtn.className = "hologram-btn warning";
    backBtn.textContent = "Retour";
    backBtn.addEventListener('click', enterHub);
    eventChoices.appendChild(backBtn);
}

function startDungeon(dungeon) {
    gameState.currentDungeon = dungeon;
    gameState.dungeonStep = 0;
    renderDungeonStep();
}

function renderDungeonStep() {
    const d = gameState.currentDungeon;
    
    if (gameState.dungeonStep < d.etapes.length) {
        eventTitle.textContent = `[ ${d.nom} - PHASE ${gameState.dungeonStep + 1} ]`;
        eventText.innerHTML = d.etapes[gameState.dungeonStep];
        eventChoices.innerHTML = "";

        const nextBtn = document.createElement('button');
        nextBtn.className = "hologram-btn primary";
        nextBtn.textContent = "Avancer";
        nextBtn.addEventListener('click', () => {
            gameState.dungeonStep++;
            renderDungeonStep();
        });
        eventChoices.appendChild(nextBtn);
    } else {
        // Début du combat
        const template = GAME_DATA.monstres[d.monstreId];
        gameState.combat = { monstre: JSON.parse(JSON.stringify(template)) };
        renderCombatTurn();
    }
}

function renderCombatTurn() {
    const m = gameState.combat.monstre;
    eventTitle.textContent = `[ COMBAT : ${m.nom.toUpperCase()} ]`;
    eventText.innerHTML = `<em>${m.description}</em><br><br>
        <strong>Monstre :</strong> ${m.stats.pv}/${m.stats.pvMax} PV<br>
        <strong>Vous :</strong> ${Math.floor(gameState.player.statsActuelles.pvActuels)} PV | ${Math.floor(gameState.player.statsActuelles.pmActuels)} PM`;
    eventChoices.innerHTML = "";

    const btnCAC = document.createElement('button');
    btnCAC.className = "hologram-btn primary";
    btnCAC.textContent = "🗡️ Frappe Mêlée (Force)";
    btnCAC.addEventListener('click', () => executeCombatTurn("cac"));
    eventChoices.appendChild(btnCAC);

    const btnMagie = document.createElement('button');
    btnMagie.className = "hologram-btn primary";
    btnMagie.textContent = "🔥 Magie (Intel | -10 PM)";
    if (gameState.player.statsActuelles.pmActuels < 10) btnMagie.disabled = true;
    btnMagie.addEventListener('click', () => executeCombatTurn("magie"));
    eventChoices.appendChild(btnMagie);

    const btnDistance = document.createElement('button');
    btnDistance.className = "hologram-btn primary";
    btnDistance.textContent = "🏹 Tir Précis (Perception)";
    btnDistance.addEventListener('click', () => executeCombatTurn("distance"));
    eventChoices.appendChild(btnDistance);

    const btnDefendre = document.createElement('button');
    btnDefendre.className = "hologram-btn";
    btnDefendre.textContent = "🛡️ Posture Défensive";
    btnDefendre.addEventListener('click', () => executeCombatTurn("defendre"));
    eventChoices.appendChild(btnDefendre);
}

function executeCombatTurn(actionType) {
    const m = gameState.combat.monstre;
    const p = gameState.player;
    let degatsJoueur = 0;
    gameState.isDefending = false;

    // Phase Attaque du Joueur
    if (actionType === "cac") {
        degatsJoueur = p.statsMax.force * 2;
    } else if (actionType === "magie") {
        p.statsActuelles.pmActuels -= 10;
        degatsJoueur = p.statsMax.intelligence * 2.5;
    } else if (actionType === "distance") {
        degatsJoueur = p.statsMax.perception * 1.5 + p.statsMax.agilite;
    } else if (actionType === "defendre") {
        gameState.isDefending = true;
    }

    m.stats.pv -= Math.floor(degatsJoueur);

    // Victoire ?
    if (m.stats.pv <= 0) {
        const orGagne = Math.floor(Math.random() * (m.recompenses.orMax - m.recompenses.orMin)) + m.recompenses.orMin;
        p.or += orGagne;
        p.reputation += 3;
        
        eventTitle.textContent = "[ VICTOIRE ]";
        eventText.innerHTML = `Le monstre s'effondre.<br><br><span style="color:var(--neon-green);">+${orGagne} Or | +3 Rép</span>`;
        eventChoices.innerHTML = `<button class="hologram-btn primary" onclick="finishHubAction(1)">Retourner au Hub</button>`;
        updateHUD();
        return;
    }

    // Phase Attaque du Monstre
    let esquiveJoueur = Math.random() * 100 < (p.statsMax.agilite * 2);
    let logDefense = "";

    if (esquiveJoueur) {
        logDefense = "Vous avez esquivé l'attaque !";
    } else {
        let degatsMonstre = m.stats.force - Math.floor(p.statsMax.vitalite / 2);
        if (gameState.isDefending) degatsMonstre = Math.floor(degatsMonstre * 0.25); // Réduction 75%
        if (degatsMonstre < 1) degatsMonstre = 1;

        p.statsActuelles.pvActuels -= degatsMonstre;
        logDefense = `Le monstre inflige ${degatsMonstre} dégâts.`;
    }

    // Mort / Double Éveil
    if (p.statsActuelles.pvActuels <= 0) {
        if (!gameState.doubleEveilDeclenche && Math.random() < 0.2) { 
            // 20% de chance de déclencher le Double Éveil à la mort
            gameState.doubleEveilDeclenche = true;
            p.statsActuelles.pvActuels = p.statsMax.pvMax;
            p.statsActuelles.pmActuels = p.statsMax.pmMax;
            p.statsMax.force += 15;
            p.statsMax.agilite += 15;
            p.statsMax.intelligence += 15;
            p.rangLicence = "C";
            p.classe = `Grand ${p.classe}`;

            eventTitle.textContent = "[ ANOMALIE DÉTECTÉE : DOUBLE ÉVEIL ]";
            eventText.innerHTML = `<span style="color:var(--neon-blue); font-size:1.1em; text-shadow: 0 0 10px var(--neon-blue);">Une aura écrasante jaillit de votre corps à l'instant où vous alliez succomber. Le Système redémarre... Vos statistiques explosent !</span>`;
            eventChoices.innerHTML = `<button class="hologram-btn primary" onclick="renderCombatTurn()">Exterminer la cible</button>`;
            updateHUD();
            return;
        } else {
            eventTitle.textContent = "[ MORT ]";
            eventText.innerHTML = "Vous avez succombé dans le donjon.";
            eventChoices.innerHTML = `<button class="hologram-btn warning" onclick="location.reload()">Recommencer</button>`;
            return;
        }
    }

    updateHUD();
    eventText.innerHTML += `<br><br><strong>Tour ennemi :</strong> ${logDefense}`;
    
    // On met un timeout léger pour laisser le joueur lire le log avant de rafraichir (ou l'ajouter dans le rendu)
    setTimeout(renderCombatTurn, 1000); 
}

// --- INVENTAIRE & STATS (Géré comme V1.1) ---
function openInventoryModal() {
    renderInventoryGrid();
    renderEquipmentDisplay();
    document.getElementById('modal-inventory').classList.remove('hidden');
}

function renderInventoryGrid() {
    const grid = document.getElementById('inventory-grid-container');
    grid.innerHTML = "";
    for (let i = 0; i < 12; i++) {
        const slot = document.createElement('div');
        slot.className = "inventory-slot";
        const itemId = gameState.player.inventaire[i];
        if (itemId && GAME_DATA.objets[itemId]) {
            const obj = GAME_DATA.objets[itemId];
            slot.textContent = obj.nom;
            slot.addEventListener('click', () => selectInventoryItem(i, obj));
        } else {
            slot.textContent = "[Vide]";
        }
        grid.appendChild(slot);
    }
}

function selectInventoryItem(index, obj) {
    const actions = document.getElementById('item-actions');
    actions.innerHTML = "";
    if (obj.type === "consommable") {
        const btn = document.createElement('button'); btn.className = "hologram-btn primary"; btn.textContent = "Utiliser";
        btn.onclick = () => {
            if(obj.effet.soinPv) gameState.player.statsActuelles.pvActuels = Math.min(gameState.player.statsMax.pvMax, gameState.player.statsActuelles.pvActuels + obj.effet.soinPv);
            if(obj.effet.soinPm) gameState.player.statsActuelles.pmActuels = Math.min(gameState.player.statsMax.pmMax, gameState.player.statsActuelles.pmActuels + obj.effet.soinPm);
            gameState.player.inventaire.splice(index, 1); updateHUD(); renderInventoryGrid();
        };
        actions.appendChild(btn);
    }
    // Vendre
    const sellBtn = document.createElement('button'); sellBtn.className = "hologram-btn warning"; sellBtn.textContent = `Vendre (+${Math.floor(obj.prix/2)})`;
    sellBtn.onclick = () => { gameState.player.or += Math.floor(obj.prix/2); gameState.player.inventaire.splice(index, 1); updateHUD(); renderInventoryGrid(); };
    actions.appendChild(sellBtn);
}

function renderEquipmentDisplay() {
    const eq = gameState.player.equipement;
    ['tete', 'torse', 'mains', 'accessoire'].forEach(slot => {
        document.getElementById(`eq-${slot}`).textContent = `${slot.toUpperCase()} : ${eq[slot] ? GAME_DATA.objets[eq[slot]].nom : '[Vide]'}`;
    });
}

function closeInventoryModal() { document.getElementById('modal-inventory').classList.add('hidden'); }
function openStatsModal() { document.getElementById('modal-stats').classList.remove('hidden'); document.getElementById('stats-content').innerHTML = `Force: ${gameState.player.statsMax.force} <br> Agilité: ${gameState.player.statsMax.agilite} <br> Vitalité: ${gameState.player.statsMax.vitalite} <br> Intelligence: ${gameState.player.statsMax.intelligence} <br> Perception: ${gameState.player.statsMax.perception}`; }
function closeStatsModal() { document.getElementById('modal-stats').classList.add('hidden'); }
