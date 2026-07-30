let gameState = {
    player: null,
    phase: 1, // 1: Civil, 2: Hub/Donjon
    currentEventIndex: 0,
    combat: null
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
const hubNav = document.getElementById('hub-navigation');

function switchScreen(from, to) {
    from.classList.remove('active');
    from.classList.add('hidden');
    setTimeout(() => {
        to.classList.remove('hidden');
        to.classList.add('active');
    }, 300);
}

btnHistory.addEventListener('click', () => switchScreen(screenHome, screenHistory));
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
    hudRang.textContent = gameState.player.niveau >= 10 ? 'D' : 'E';
    hudLvl.textContent = gameState.player.niveau;
    hudPv.textContent = gameState.player.statsActuelles.pvActuels;
    hudPvMax.textContent = gameState.player.statsMax.pvMax;
    hudOr.textContent = gameState.player.or;
    hudLoyer.textContent = gameState.player.timers.loyerJours;
}

// --- PHASE 1 : ÉVÉNEMENTS CIVILS ---
function loadCivilEvent() {
    hubNav.classList.add('hidden');
    const events = GAME_DATA.evenementsCivils;

    if (gameState.currentEventIndex >= events.length) {
        // Fin de la Phase 1 -> Transition Phase 2
        gameState.phase = 2;
        eventTitle.textContent = "[ ÉVEIL DU SYSTÈME ]";
        eventText.innerHTML = "Votre corps réagit. Une interface holographique bleue s'illumine soudainement devant vos yeux.<br><br><em>⚠️ [QUÊTE JOURNALIÈRE ATTRIBUÉE] : Survivez et gagnez votre place.</em>";
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
            gameState.player.statsMax[choix.gainStat] += choix.valeur;
            eventText.innerHTML += `<br><br><span style="color:var(--neon-blue);">[SYSTÈMES] : +${choix.valeur} en ${choix.gainStat.toUpperCase()} enregistré.</span>`;
            eventChoices.innerHTML = "";
            setTimeout(() => {
                gameState.currentEventIndex++;
                loadCivilEvent();
            }, 1200);
        });
        eventChoices.appendChild(btn);
    });
}

// --- PHASE 2 : HUB CENTRAL ---
function enterHub() {
    hubNav.classList.remove('hidden');
    eventTitle.textContent = "[ HUB CENTRAL - QUARTIER GÉNÉRAL ]";
    eventText.innerHTML = "Que souhaitez-vous faire aujourd'hui ?<br><br><em>Rappel : Le loyer tombe dans <span style='color:var(--neon-red);'>" + gameState.player.timers.loyerJours + " jours</span>.</em>";
    eventChoices.innerHTML = "";
}

// Avancer d'un jour (Gestion des dettes)
function advanceDay() {
    gameState.player.timers.loyerJours--;
    if (gameState.player.timers.loyerJours <= 0) {
        if (gameState.player.or >= 150) {
            gameState.player.or -= 150;
            gameState.player.timers.loyerJours = 7;
            alert("Le propriétaire a prélevé 150 Or pour le loyer.");
        } else {
            alert("FAILLITE : Vous n'avez pas de quoi payer le loyer. Expulsion imminente !");
        }
    }
    updateHUD();
    enterHub();
}

// --- DONJONS ET COMBATS ---
function openDungeons() {
    eventTitle.textContent = "[ SÉLECTION DES PORTAILS ]";
    eventText.textContent = "Choisissez un donjon à explorer :";
    eventChoices.innerHTML = "";
    hubNav.classList.add('hidden');

    GAME_DATA.donjons.forEach(d => {
        const btn = document.createElement('button');
        btn.className = "hologram-btn";
        btn.textContent = `${d.nom} (Rang ${d.rang})`;
        btn.addEventListener('click', () => startCombat(d.monstreId));
        eventChoices.appendChild(btn);
    });

    const backBtn = document.createElement('button');
    backBtn.className = "hologram-btn";
    backBtn.textContent = "Retour au Hub";
    backBtn.addEventListener('click', enterHub);
    eventChoices.appendChild(backBtn);
}

function startCombat(monstreKey) {
    const template = GAME_DATA.monstres[monstreKey];
    gameState.combat = {
        monstre: JSON.parse(JSON.stringify(template))
    };
    renderCombatTurn();
}

function renderCombatTurn() {
    const m = gameState.combat.monstre;
    eventTitle.textContent = `[ COMBAT : ${m.nom.toUpperCase()} ]`;
    eventText.innerHTML = `Monstre - PV : ${m.stats.pv}/${m.stats.pvMax} | Force : ${m.stats.force}<br>Vos PV : ${gameState.player.statsActuelles.pvActuels}/${gameState.player.statsMax.pvMax}`;
    eventChoices.innerHTML = "";
    hubNav.classList.add('hidden');

    const btnAttaquer = document.createElement('button');
    btnAttaquer.className = "hologram-btn primary";
    btnAttaquer.textContent = "🗡️ Attaquer";
    btnAttaquer.addEventListener('click', () => executeCombatAction('attaquer'));
    eventChoices.appendChild(btnAttaquer);

    const btnFuir = document.createElement('button');
    btnFuir.className = "hologram-btn";
    btnFuir.textContent = "🏃 Fuir le donjon";
    btnFuir.addEventListener('click', enterHub);
    eventChoices.appendChild(btnFuir);
}

function executeCombatAction(action) {
    const m = gameState.combat.monstre;
    if (action === 'attaquer') {
        let degatsJoueur = gameState.player.statsMax.force * 2;
        m.stats.pv -= degatsJoueur;

        if (m.stats.pv <= 0) {
            // Victoire
            const orGagne = Math.floor(Math.random() * (m.recompenses.orMax - m.recompenses.orMin)) + m.recompenses.orMin;
            gameState.player.or += orGagne;
            eventTitle.textContent = "[ VICTOIRE ]";
            eventText.innerHTML = `Vous avez vaincu le ${m.nom} !<br>Butin récupéré : +${orGagne} Or.`;
            eventChoices.innerHTML = `<button class="hologram-btn primary" onclick="enterHub()">Retour au Hub</button>`;
            updateHUD();
            return;
        }

        // Riposte du monstre
        let degatsMonstre = Math.max(1, m.stats.force - Math.floor(gameState.player.statsMax.vitalite / 2));
        gameState.player.statsActuelles.pvActuels -= degatsMonstre;

        if (gameState.player.statsActuelles.pvActuels <= 0) {
            gameState.player.statsActuelles.pvActuels = 0;
            updateHUD();
            eventTitle.textContent = "[ ÉCHEC CRITIQUE ]";
            eventText.innerHTML = "Vous avez succombé dans le donjon... Le Système intervient d'urgence.";
            eventChoices.innerHTML = `<button class="hologram-btn warning" onclick="location.reload()">Recommencer</button>`;
            return;
        }
    }
    updateHUD();
    renderCombatTurn();
}

// --- BOUTIQUE ---
function openShop() {
    eventTitle.textContent = "[ BOUTIQUE DU SYSTÈMES ]";
    eventText.textContent = "Achetez de quoi survivre :";
    eventChoices.innerHTML = "";
    hubNav.classList.add('hidden');

    Object.values(GAME_DATA.objets).forEach(obj => {
        const btn = document.createElement('button');
        btn.className = "hologram-btn";
        btn.textContent = `${obj.nom} - ${obj.prix} Or`;
        btn.addEventListener('click', () => {
            if (gameState.player.or >= obj.prix) {
                gameState.player.or -= obj.prix;
                gameState.player.inventaire.push(obj.id);
                alert(`Achat réussi : ${obj.nom}`);
                updateHUD();
            } else {
                alert("Fonds insuffisants.");
            }
        });
        eventChoices.appendChild(btn);
    });

    const backBtn = document.createElement('button');
    backBtn.className = "hologram-btn";
    backBtn.textContent = "Retour au Hub";
    backBtn.addEventListener('click', enterHub);
    eventChoices.appendChild(backBtn);
}

// --- INVENTAIRE & MODALES ---
function openInventoryModal() {
    const grid = document.getElementById('inventory-grid-container');
    grid.innerHTML = "";
    
    for (let i = 0; i < 15; i++) {
        const slot = document.createElement('div');
        slot.className = "inventory-slot";
        const itemId = gameState.player.inventaire[i];
        if (itemId && GAME_DATA.objets[itemId]) {
            const obj = GAME_DATA.objets[itemId];
            slot.textContent = obj.nom;
            slot.addEventListener('click', () => {
                document.getElementById('item-details').textContent = `${obj.nom} (${obj.type}) - Prix : ${obj.prix} Or`;
            });
        } else {
            slot.textContent = "[Vide]";
        }
        grid.appendChild(slot);
    }
    document.getElementById('modal-inventory').classList.remove('hidden');
}

function closeInventoryModal() {
    document.getElementById('modal-inventory').classList.add('hidden');
}

function openStatsModal() {
    const p = gameState.player;
    const content = document.getElementById('stats-content');
    content.innerHTML = `
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
