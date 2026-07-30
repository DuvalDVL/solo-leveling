let gameState = {
    player: null,
    civilEventsSequence: [],
    currentEventIndex: 0,
    affinites: { Guerrier: 0, Assassin: 0, Mage: 0, Ranger: 0, Tank: 0 },
    
    eveilStep: 0,
    compteurDonjons: 0, 
    
    entrainementsEffectues: { force: 0, agilite: 0, vitalite: 0, intelligence: 0, perception: 0 },
    
    combat: null,
    dungeonStep: 0,
    currentDungeon: null,
    isRedDungeon: false
};

// --- GESTION DES ÉCRANS & MODALES ---
const screenHome = document.getElementById('screen-home');
const screenCreation = document.getElementById('screen-creation');
const screenGame = document.getElementById('screen-game');

document.getElementById('btn-new-game').addEventListener('click', () => switchScreen(screenHome, screenCreation));
document.getElementById('btn-start-civil').addEventListener('click', startCivilLife);

function switchScreen(from, to) {
    from.classList.remove('active');
    from.classList.add('hidden');
    setTimeout(() => {
        to.classList.remove('hidden');
        to.classList.add('active');
    }, 300);
}

function openRulesModal() { document.getElementById('modal-rules').classList.remove('hidden'); }
function closeRulesModal() { document.getElementById('modal-rules').classList.add('hidden'); }

// --- SAUVEGARDE ET PANTHÉON ---
function saveGame() {
    if (gameState.player) {
        localStorage.setItem('systeme_save', JSON.stringify(gameState));
    }
}

function loadGame() {
    const saved = localStorage.getItem('systeme_save');
    if (saved) {
        gameState = JSON.parse(saved);
        switchScreen(screenHome, screenGame);
        updateHUD();
        if (gameState.player.classe === "Aucune") {
            if (gameState.currentEventIndex < gameState.civilEventsSequence.length) loadCivilEvent();
            else renderAwakeningStep();
        } else {
            enterHub();
        }
    }
}

function clearSave() {
    localStorage.removeItem('systeme_save');
}

function archiveToPantheon(status) {
    let pantheon = JSON.parse(localStorage.getItem('systeme_pantheon')) || [];
    if (gameState.player) {
        pantheon.push({
            nom: gameState.player.nom,
            classe: gameState.player.classe,
            niveau: gameState.player.niveau,
            rang: gameState.player.rangLicence,
            status: status,
            date: new Date().toLocaleDateString()
        });
        localStorage.setItem('systeme_pantheon', JSON.stringify(pantheon));
    }
}

function openPantheonModal() {
    const container = document.getElementById('pantheon-content');
    let pantheon = JSON.parse(localStorage.getItem('systeme_pantheon')) || [];
    
    if (pantheon.length === 0) {
        container.innerHTML = "Aucun Chasseur enregistré dans les archives.";
    } else {
        container.innerHTML = pantheon.map(p => 
            `<div style="margin-bottom:10px; border-bottom:1px solid var(--neon-blue); padding-bottom:5px;">
                <strong>${p.nom}</strong> - ${p.classe} (Niv.${p.niveau} / Rang ${p.rang})<br>
                <span style="color:${p.status.includes('Mort') ? 'var(--neon-red)' : 'var(--neon-green)'}">Statut: ${p.status}</span> - <em>${p.date}</em>
            </div>`
        ).reverse().join('');
    }
    document.getElementById('modal-pantheon').classList.remove('hidden');
}

function closePantheonModal() { document.getElementById('modal-pantheon').classList.add('hidden'); }

window.onload = () => {
    if (localStorage.getItem('systeme_save')) {
        const btnContinue = document.getElementById('btn-continue');
        btnContinue.style.display = 'inline-block';
        btnContinue.addEventListener('click', loadGame);
    }
};

// --- PHASE CIVILE ---
function startCivilLife() {
    const nom = document.getElementById('input-nom').value || "Sung";
    const metier = document.getElementById('select-metier').value;
    
    gameState.player = JSON.parse(JSON.stringify(GAME_DATA.joueurTemplate));
    gameState.player.nom = nom;
    gameState.player.metierCivil = metier;

    const bonus = GAME_DATA.metiers[metier];
    gameState.player.statsMax.force += bonus.force;
    gameState.player.statsMax.vitalite += bonus.vitalite;
    gameState.player.statsMax.agilite += bonus.agilite;
    gameState.player.statsMax.intelligence += bonus.intelligence;
    gameState.player.statsMax.perception += bonus.perception;
    gameState.player.statsMax.reflexe += bonus.reflexe;
    gameState.player.or = bonus.or;

    gameState.civilEventsSequence = [...GAME_DATA.evenementsCivils].sort(() => 0.5 - Math.random()).slice(0, 3);
    gameState.currentEventIndex = 0;
    gameState.compteurDonjons = 0;

    saveGame();
    switchScreen(screenCreation, screenGame);
    updateHUD();
    loadCivilEvent();
}

function updateHUD() {
    if (!gameState.player) return;
    document.getElementById('hud-rang').textContent = gameState.player.rangLicence;
    document.getElementById('hud-classe').textContent = gameState.player.classe;
    document.getElementById('hud-niveau').textContent = gameState.player.niveau;
    document.getElementById('hud-pv').textContent = Math.floor(gameState.player.statsActuelles.pvActuels);
    document.getElementById('hud-pvmax').textContent = gameState.player.statsMax.pvMax;
    document.getElementById('hud-pm').textContent = Math.floor(gameState.player.statsActuelles.pmActuels);
    document.getElementById('hud-pmmax').textContent = gameState.player.statsMax.pmMax;
    document.getElementById('hud-or').textContent = gameState.player.or;
    document.getElementById('hud-loyer').textContent = gameState.player.timers.loyerJours;

    if (gameState.player.doubleEveille) {
        document.getElementById('hud-container-xp').style.display = "inline-block";
        document.getElementById('hud-xp').textContent = gameState.player.xp;
        document.getElementById('hud-xpsuiv').textContent = gameState.player.xpSuivant;
    }
}

function loadCivilEvent() {
    if (gameState.currentEventIndex >= gameState.civilEventsSequence.length) {
        initAwakeningSequence();
        return;
    }

    const evt = gameState.civilEventsSequence[gameState.currentEventIndex];
    const eventTitle = document.getElementById('event-title');
    const eventText = document.getElementById('event-text');
    const eventChoices = document.getElementById('event-choices');

    eventTitle.textContent = `[ ${evt.titre.toUpperCase()} ]`;
    eventText.textContent = evt.texte;
    eventChoices.innerHTML = "";

    evt.choix.forEach(choix => {
        const btn = document.createElement('button');
        btn.className = "hologram-btn";
        btn.textContent = choix.texte;
        btn.addEventListener('click', () => {
            gameState.player.statsMax[choix.gainStat] += choix.valeur;
            if (choix.gainStat === "vitalite") gameState.player.statsMax.pvMax += 10;
            if (choix.gainStat === "intelligence") gameState.player.statsMax.pmMax += 10;
            
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
                saveGame();
                loadCivilEvent(); 
            });
            eventChoices.appendChild(contBtn);
        });
        eventChoices.appendChild(btn);
    });
}

// --- ÉVEIL INITIAL ---
function initAwakeningSequence() {
    gameState.classeAttribuee = Object.keys(gameState.affinites).reduce((a, b) => gameState.affinites[a] > gameState.affinites[b] ? a : b);
    gameState.eveilStep = 0;
    renderAwakeningStep();
}

function renderAwakeningStep() {
    const sequence = GAME_DATA.sequencesEveil[gameState.classeAttribuee];
    const eventTitle = document.getElementById('event-title');
    const eventText = document.getElementById('event-text');
    const eventChoices = document.getElementById('event-choices');
    
    if (gameState.eveilStep < sequence.length) {
        eventTitle.textContent = `[ JOUR 1 - LE RÉVEIL ]`;
        eventText.innerHTML = `<em>${sequence[gameState.eveilStep]}</em>`;
        eventChoices.innerHTML = "";

        const btn = document.createElement('button');
        btn.className = "hologram-btn primary";
        btn.textContent = gameState.eveilStep === sequence.length - 1 ? "Accepter la Licence" : "Continuer...";
        btn.addEventListener('click', () => {
            gameState.eveilStep++;
            renderAwakeningStep();
        });
        eventChoices.appendChild(btn);
    } else {
        gameState.player.classe = gameState.classeAttribuee;
        gameState.player.statsActuelles.pvActuels = gameState.player.statsMax.pvMax;
        updateHUD();
        saveGame();
        eventTitle.textContent = "[ STATUT ENREGISTRÉ ]";
        eventText.innerHTML = `Votre licence de Chasseur Rang E est active. Le monde des Donjons s'ouvre à vous. Attention à votre loyer !`;
        eventChoices.innerHTML = `<button class="hologram-btn primary" onclick="enterHub()">Entrer dans le Hub Central</button>`;
    }
}

// --- HUB CENTRAL ---
function enterHub() {
    saveGame(); 
    const eventTitle = document.getElementById('event-title');
    const eventText = document.getElementById('event-text');
    const eventChoices = document.getElementById('event-choices');

    eventTitle.textContent = "[ HUB CENTRAL DE L'ASSOCIATION ]";
    eventText.innerHTML = `Que souhaitez-vous faire ?<br><br><em>Loyer : <span style="color:var(--neon-red);">${gameState.player.timers.montantLoyer} Or</span> dans <span style='color:var(--neon-red);'>${gameState.player.timers.loyerJours} jours</span>. | Fatigue : ${gameState.player.statsActuelles.fatigue}/100</em>`;
    
    eventChoices.innerHTML = "";
    const actions = [
        { texte: "🚪 Explorer un Portail", action: openDungeons },
        { texte: "🛒 Boutiques", action: openShopList },
        { texte: "🏋️ S'entraîner (1 jour)", action: openTrainings },
        { texte: "🛏️ Dormir (1 jour - Restaure PV/PM)", action: restAtHome }
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
                const eventTitle = document.getElementById('event-title');
                const eventText = document.getElementById('event-text');
                const eventChoices = document.getElementById('event-choices');
                eventTitle.textContent = "[ PRÉLÈVEMENT DU LOYER ]";
                eventText.innerHTML = `Le propriétaire a prélevé <span style="color:var(--neon-red);">${loyer} Or</span>. Votre bail est renouvelé.`;
                eventChoices.innerHTML = `<button class="hologram-btn primary" onclick="enterHub()">Continuer</button>`;
                updateHUD();
                return;
            } else {
                const eventTitle = document.getElementById('event-title');
                const eventText = document.getElementById('event-text');
                const eventChoices = document.getElementById('event-choices');
                eventTitle.textContent = "[ EXPULSION - GAME OVER ]";
                eventText.innerHTML = `<span style="color:var(--neon-red);">FAILLITE : Impossible de payer le loyer.</span><br><br>Expulsé et épuisé, votre corps cède. Le Système révoque votre accès.`;
                eventChoices.innerHTML = `<button class="hologram-btn warning" onclick="location.reload()">Recommencer</button>`;
                archiveToPantheon("Mort (Faillite)");
                clearSave();
                return; 
            }
        }
    }
    updateHUD();
    enterHub();
}

// --- ENTRAÎNEMENT ---
function openTrainings() {
    const eventTitle = document.getElementById('event-title');
    const eventText = document.getElementById('event-text');
    const eventChoices = document.getElementById('event-choices');

    eventTitle.textContent = "[ SALLE D'ENTRAÎNEMENT ]";
    eventText.textContent = "Sélectionnez un programme (coûte 1 jour et de la fatigue) :";
    eventChoices.innerHTML = "";

    const trainings = [
        { nom: "Musculation (Force)", stat: "force" },
        { nom: "Sprint et Agilité (Agilité)", stat: "agilite" },
        { nom: "Endurance & Résistance (Vitalité)", stat: "vitalite" },
        { nom: "Concentration (Intelligence)", stat: "intelligence" },
        { nom: "Réflexes de combat (Perception)", stat: "perception" }
    ];

    trainings.forEach(t => {
        const btn = document.createElement('button');
        btn.className = "hologram-btn";
        btn.textContent = t.nom;
        btn.addEventListener('click', () => executeTraining(t.stat));
        eventChoices.appendChild(btn);
    });

    const backBtn = document.createElement('button');
    backBtn.className = "hologram-btn warning";
    backBtn.textContent = "Retour";
    backBtn.addEventListener('click', enterHub);
    eventChoices.appendChild(backBtn);
}

function executeTraining(stat) {
    const eventTitle = document.getElementById('event-title');
    const eventText = document.getElementById('event-text');
    const eventChoices = document.getElementById('event-choices');

    gameState.player.statsActuelles.fatigue = Math.min(100, gameState.player.statsActuelles.fatigue + 15);

    if (!gameState.player.doubleEveille) {
        if (gameState.entrainementsEffectues[stat] < 3) {
            gameState.entrainementsEffectues[stat]++;
            gameState.player.statsMax[stat] += 1;
            if (stat === "vitalite") gameState.player.statsMax.pvMax += 10;
            if (stat === "intelligence") gameState.player.statsMax.pmMax += 10;

            eventTitle.textContent = "[ RÉSULTAT DE SÉANCE ]";
            eventText.innerHTML = `Séance intense validée.<br><br><span style="color:var(--neon-blue);">+1 en ${stat.toUpperCase()} !</span>`;
        } else {
            eventTitle.textContent = "[ LIMITE ATTEINTE ]";
            eventText.innerHTML = `<span style="color:var(--neon-red);">Vous avez atteint vos limites corporelles actuelles pour cet exercice.</span>`;
        }
    } else {
        // Logique Système (illimitée et bonifiée)
        gameState.player.statsMax[stat] += 1;
        if (stat === "vitalite") gameState.player.statsMax.pvMax += 10;
        eventTitle.textContent = "[ QUÊTE QUOTIDIENNE DU SYSTÈME ]";
        eventText.innerHTML = `L'entraînement porte ses fruits. <span style="color:var(--neon-green);">+1 en ${stat.toUpperCase()}.</span>`;
    }

    eventChoices.innerHTML = `<button class="hologram-btn primary" onclick="finishHubAction(1)">Terminer la journée</button>`;
}

function restAtHome() {
    gameState.player.statsActuelles.pvActuels = gameState.player.statsMax.pvMax;
    gameState.player.statsActuelles.pmActuels = gameState.player.statsMax.pmMax;
    gameState.player.statsActuelles.fatigue = 0;
    
    const eventTitle = document.getElementById('event-title');
    const eventText = document.getElementById('event-text');
    const eventChoices = document.getElementById('event-choices');
    eventTitle.textContent = "[ NUIT DE REPOS ]";
    eventText.innerHTML = `<span style="color:var(--neon-green);">Sommeil réparateur. PV, PM et Fatigue restaurés.</span>`;
    eventChoices.innerHTML = `<button class="hologram-btn primary" onclick="finishHubAction(1)">Continuer</button>`;
}

// --- BOUTIQUES ---
function openShopList() {
    const eventTitle = document.getElementById('event-title');
    const eventText = document.getElementById('event-text');
    const eventChoices = document.getElementById('event-choices');

    eventTitle.textContent = "[ RÉSEAU DE MARCHÉ ]";
    eventText.textContent = "Choisissez un comptoir :";
    eventChoices.innerHTML = "";

    GAME_DATA.boutiques.forEach(shop => {
        let isLocked = false; 
        let lockReason = "";
        if (shop.requis.type === "systeme" && !gameState.player.doubleEveille) {
            isLocked = true; lockReason = shop.requis.message;
        }
        const btn = document.createElement('button');
        btn.className = `hologram-btn ${isLocked ? 'warning' : ''}`;
        btn.textContent = `${shop.nom} ${isLocked ? `[🔒 ${lockReason}]` : ''}`;
        if (!isLocked) btn.addEventListener('click', () => openShopDetail(shop));
        eventChoices.appendChild(btn);
    });

    const backBtn = document.createElement('button'); 
    backBtn.className = "hologram-btn warning"; 
    backBtn.textContent = "Retour"; 
    backBtn.addEventListener('click', enterHub); 
    eventChoices.appendChild(backBtn);
}

function openShopDetail(shop) {
    const eventTitle = document.getElementById('event-title');
    const eventText = document.getElementById('event-text');
    const eventChoices = document.getElementById('event-choices');

    eventTitle.textContent = `[ ${shop.nom.toUpperCase()} ]`;
    eventText.innerHTML = "Articles disponibles :";
    eventChoices.innerHTML = "";

    shop.articles.forEach(itemId => {
        const obj = GAME_DATA.objets[itemId];
        const btn = document.createElement('button');
        btn.className = "hologram-btn";
        btn.textContent = `${obj.nom} — ${obj.prix} Or`;
        btn.addEventListener('click', () => {
            if (gameState.player.or >= obj.prix) {
                gameState.player.or -= obj.prix; 
                gameState.player.inventaire.push(obj.id); 
                updateHUD();
                eventText.innerHTML = `<span style="color:var(--neon-green);">Achat réussi : ${obj.nom}.</span>`;
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

// --- DONJONS ET ÉVÉNEMENTS ---
function openDungeons() {
    const eventTitle = document.getElementById('event-title');
    const eventText = document.getElementById('event-text');
    const eventChoices = document.getElementById('event-choices');

    eventTitle.textContent = "[ SÉLECTION DE PORTAIL ]";
    eventText.innerHTML = "Les Portails suivants sont ouverts (Coûte 1 jour) :";
    eventChoices.innerHTML = "";

    GAME_DATA.donjonsStandards.forEach(d => {
        const btn = document.createElement('button');
        btn.className = "hologram-btn";
        btn.textContent = `${d.nom} [Rang ${d.rang}]`;
        btn.addEventListener('click', () => startDungeon(d));
        eventChoices.appendChild(btn);
    });

    const backBtn = document.createElement('button');
    backBtn.className = "hologram-btn warning";
    backBtn.textContent = "Retour au Hub";
    backBtn.addEventListener('click', enterHub);
    eventChoices.appendChild(backBtn);
}

function startDungeon(dungeon) {
    gameState.compteurDonjons++;
    gameState.player.timers.loyerJours--; 
    
    // Trigger secret du Temple de Carthenon (Donjon Rouge)
    if (gameState.compteurDonjons === 7 && !gameState.player.doubleEveille) {
        triggerRedDungeon();
        return;
    }

    gameState.currentDungeon = dungeon;
    gameState.dungeonStep = 0;
    runDungeonStep();
}

function runDungeonStep() {
    updateHUD();
    const eventTitle = document.getElementById('event-title');
    const eventText = document.getElementById('event-text');
    const eventChoices = document.getElementById('event-choices');

    if (gameState.dungeonStep >= gameState.currentDungeon.etapes.length) {
        // Fin des étapes textuelles -> Lancement du Boss/Combat final du donjon
        startCombat(gameState.currentDungeon.monstreId);
        return;
    }

    const step = gameState.currentDungeon.etapes[gameState.dungeonStep];
    eventTitle.textContent = `[ ${gameState.currentDungeon.nom.toUpperCase()} ]`;
    eventText.innerHTML = step.texte;
    eventChoices.innerHTML = "";

    if (step.type === "texte") {
        const btn = document.createElement('button');
        btn.className = "hologram-btn primary";
        btn.textContent = "Avancer";
        btn.addEventListener('click', () => {
            gameState.dungeonStep++;
            runDungeonStep();
        });
        eventChoices.appendChild(btn);
    } else if (step.type === "interactif") {
        step.choix.forEach(c => {
            const btn = document.createElement('button');
            btn.className = "hologram-btn";
            btn.textContent = c.texte;
            btn.addEventListener('click', () => {
                const statValue = gameState.player.statsMax[c.stat];
                let roll = Math.floor(Math.random() * 6) + 1 + statValue; 
                eventChoices.innerHTML = "";
                
                if (roll >= c.diff) {
                    eventText.innerHTML = `<span style="color:var(--neon-green);">${c.succes}</span>`;
                    if (c.lootOr) { gameState.player.or += c.lootOr; updateHUD(); }
                } else {
                    eventText.innerHTML = `<span style="color:var(--neon-red);">${c.echec}</span>`;
                    takeDamage(c.degats);
                }

                if (gameState.player.statsActuelles.pvActuels > 0) {
                    const contBtn = document.createElement('button');
                    contBtn.className = "hologram-btn primary";
                    contBtn.textContent = "Continuer";
                    contBtn.addEventListener('click', () => {
                        gameState.dungeonStep++;
                        runDungeonStep();
                    });
                    eventChoices.appendChild(contBtn);
                }
            });
            eventChoices.appendChild(btn);
        });
    }
}

// --- TEMPLE DE CARTHENON (DONJON ROUGE) ---
function triggerRedDungeon() {
    gameState.isRedDungeon = true;
    const eventTitle = document.getElementById('event-title');
    const eventText = document.getElementById('event-text');
    const eventChoices = document.getElementById('event-choices');

    eventTitle.textContent = "[ ALERTE SYSTÈME - DOUBLE DONJON ]";
    eventText.innerHTML = `<span style="color:var(--neon-red);">Le portail que vous avez emprunté s'est refermé derrière vous. L'environnement se dissipe pour révéler de gigantesques portes de pierre... Vous êtes dans le Temple de Carthenon.</span>`;
    eventChoices.innerHTML = "";

    const btn = document.createElement('button');
    btn.className = "hologram-btn warning";
    btn.textContent = "Entrer dans la salle des statues";
    btn.addEventListener('click', () => {
        startCombat("mob_statue_dieu");
    });
    eventChoices.appendChild(btn);
}

// --- SYSTÈME DE COMBAT ---
function startCombat(monstreId) {
    const mobTemplate = GAME_DATA.monstres[monstreId];
    gameState.combat = {
        mob: JSON.parse(JSON.stringify(mobTemplate)),
        tour: 1
    };
    renderCombatInterface();
}

function renderCombatInterface() {
    updateHUD();
    const eventTitle = document.getElementById('event-title');
    const eventText = document.getElementById('event-text');
    const eventChoices = document.getElementById('event-choices');

    const mob = gameState.combat.mob;
    eventTitle.textContent = `[ COMBAT : ${mob.nom.toUpperCase()} ]`;
    eventText.innerHTML = `
        <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--neon-blue); padding-bottom:10px; margin-bottom:10px;">
            <div><strong>VOUS</strong><br>PV: ${Math.floor(gameState.player.statsActuelles.pvActuels)}/${gameState.player.statsMax.pvMax}</div>
            <div style="text-align:right;"><strong>${mob.nom}</strong><br>PV: ${Math.floor(mob.stats.pv)}/${mob.stats.pvMax}</div>
        </div>
        <em>${mob.description}</em><br><br>Que faites-vous ?
    `;

    eventChoices.innerHTML = "";

    const btnAttaque = document.createElement('button');
    btnAttaque.className = "hologram-btn primary";
    btnAttaque.textContent = "Attaquer (Force)";
    btnAttaque.addEventListener('click', () => executePlayerTurn('attaque'));
    eventChoices.appendChild(btnAttaque);

    const btnMagie = document.createElement('button');
    btnMagie.className = "hologram-btn";
    btnMagie.textContent = "Compétence (-10 PM)";
    btnMagie.addEventListener('click', () => executePlayerTurn('magie'));
    eventChoices.appendChild(btnMagie);
}

function executePlayerTurn(action) {
    const mob = gameState.combat.mob;
    let log = "";
    
    // Action du joueur
    if (action === 'attaque') {
        const degats = Math.max(1, gameState.player.statsMax.force + Math.floor(Math.random()*3));
        mob.stats.pv -= degats;
        log += `Vous infligez <span style="color:var(--neon-green);">${degats} dégâts</span>.<br>`;
    } else if (action === 'magie') {
        if (gameState.player.statsActuelles.pmActuels >= 10) {
            gameState.player.statsActuelles.pmActuels -= 10;
            const degats = Math.max(5, gameState.player.statsMax.intelligence * 2 + Math.floor(Math.random()*5));
            mob.stats.pv -= degats;
            log += `Votre attaque chargée inflige <span style="color:var(--neon-blue);">${degats} dégâts magiques</span>.<br>`;
        } else {
            log += `<span style="color:var(--neon-red);">Pas assez de PM ! Vous perdez l'initiative.</span><br>`;
        }
    }

    if (mob.stats.pv <= 0) {
        endCombat(true);
        return;
    }

    // Action du monstre
    const mobDmg = Math.max(1, mob.stats.force - Math.floor(gameState.player.statsMax.vitalite / 2));
    
    // L'évitement basé sur l'agilité
    const esquiveRoll = Math.random() * 100;
    if (esquiveRoll < (gameState.player.statsMax.agilite * 2)) {
         log += `Le monstre attaque, mais <span style="color:var(--neon-green);">vous esquivez !</span>`;
    } else {
         gameState.player.statsActuelles.pvActuels -= mobDmg;
         log += `${mob.nom} vous frappe et inflige <span style="color:var(--neon-red);">${mobDmg} dégâts</span>.`;
    }

    updateHUD();

    if (gameState.player.statsActuelles.pvActuels <= 0) {
        endCombat(false);
        return;
    }

    const eventText = document.getElementById('event-text');
    const eventChoices = document.getElementById('event-choices');
    eventText.innerHTML += `<br><br>` + log;
    eventChoices.innerHTML = `<button class="hologram-btn primary" onclick="renderCombatInterface()">Tour Suivant</button>`;
}

function endCombat(victoire) {
    const eventTitle = document.getElementById('event-title');
    const eventText = document.getElementById('event-text');
    const eventChoices = document.getElementById('event-choices');

    if (victoire) {
        if (gameState.isRedDungeon) {
            // Victoire impossible contre la Statue en l'état normal, mais si le joueur y parvient
            triggerDoubleAwakening();
            return;
        }

        const mob = gameState.combat.mob;
        const orGagne = Math.floor(Math.random() * (mob.recompenses.orMax - mob.recompenses.orMin)) + mob.recompenses.orMin;
        gameState.player.or += orGagne;

        eventTitle.textContent = "[ VICTOIRE ]";
        eventText.innerHTML = `Vous avez vaincu ${mob.nom}.<br><br>Butin : <span style="color:gold;">${orGagne} Or</span>.`;
        
        if (gameState.player.doubleEveille) {
             gainXP(mob.recompenses.xp);
        }
        
        eventChoices.innerHTML = `<button class="hologram-btn primary" onclick="finishHubAction(0)">Retourner au Hub</button>`;
    } else {
        if (gameState.isRedDungeon) {
            triggerDoubleAwakening();
        } else {
            eventTitle.textContent = "[ MORT ]";
            eventText.innerHTML = `<span style="color:var(--neon-red);">Vous avez été tué dans le donjon.</span>`;
            eventChoices.innerHTML = `<button class="hologram-btn warning" onclick="location.reload()">Recommencer</button>`;
            archiveToPantheon("Mort au combat");
            clearSave();
        }
    }
}

function takeDamage(amount) {
    gameState.player.statsActuelles.pvActuels -= amount;
    updateHUD();
    if (gameState.player.statsActuelles.pvActuels <= 0) {
        if (gameState.isRedDungeon) {
            triggerDoubleAwakening();
        } else {
            const eventTitle = document.getElementById('event-title');
            const eventText = document.getElementById('event-text');
            const eventChoices = document.getElementById('event-choices');
            eventTitle.textContent = "[ MORT ]";
            eventText.innerHTML = `<span style="color:var(--neon-red);">Vos blessures sont fatales. Le monde s'assombrit.</span>`;
            eventChoices.innerHTML = `<button class="hologram-btn warning" onclick="location.reload()">Recommencer</button>`;
            archiveToPantheon("Mort (Piège)");
            clearSave();
        }
    }
}

// --- LE DOUBLE ÉVEIL ---
function triggerDoubleAwakening() {
    gameState.isRedDungeon = false;
    gameState.player.doubleEveille = true;
    gameState.player.statsActuelles.pvActuels = gameState.player.statsMax.pvMax; 

    const eventTitle = document.getElementById('event-title');
    const eventText = document.getElementById('event-text');
    const eventChoices = document.getElementById('event-choices');

    eventTitle.textContent = "[ COURAGE DU FAIBLE - CONDITIONS REMPLIES ]";
    eventText.innerHTML = `<span style="color:var(--neon-blue);">Vous avez survécu à l'épreuve du Temple de Carthenon en fixant la mort dans les yeux.</span><br><br>
    <strong>Félicitations. Vous êtes devenu un [Joueur].</strong><br>
    Votre corps a été soigné. Vous avez maintenant accès à l'Inventaire Rapide, aux Quêtes Quotidiennes, et vos caractéristiques n'ont plus de limites humaines.`;

    eventChoices.innerHTML = `<button class="hologram-btn primary" onclick="finishHubAction(0)">Se réveiller à l'hôpital</button>`;
}

function gainXP(amount) {
    gameState.player.xp += amount;
    if (gameState.player.xp >= gameState.player.xpSuivant) {
        gameState.player.niveau++;
        gameState.player.xp -= gameState.player.xpSuivant;
        gameState.player.xpSuivant = Math.floor(gameState.player.xpSuivant * 1.5);
        gameState.player.statsMax.pvMax += 20;
        gameState.player.statsMax.pmMax += 10;
        gameState.player.statsMax.force += 2;
        gameState.player.statsMax.agilite += 2;
        gameState.player.statsMax.vitalite += 2;
        gameState.player.statsMax.intelligence += 2;
        gameState.player.statsMax.perception += 2;
        gameState.player.statsActuelles.pvActuels = gameState.player.statsMax.pvMax;
        
        alert(`Niveau Supérieur ! Vous êtes maintenant niveau ${gameState.player.niveau}. Toutes vos stats augmentent.`);
    }
    updateHUD();
}

// --- INVENTAIRE & ÉQUIPEMENT ---
function openInventoryModal() {
    if (!gameState.player) return;
    document.getElementById('modal-inventory').classList.remove('hidden');
    renderInventoryGrid();
    renderEquippedItems();
}

function closeInventoryModal() {
    document.getElementById('modal-inventory').classList.add('hidden');
}

function renderInventoryGrid() {
    const grid = document.getElementById('inventory-grid-container');
    grid.innerHTML = "";
    gameState.player.inventaire.forEach((itemId, index) => {
        const item = GAME_DATA.objets[itemId];
        const slot = document.createElement('div');
        slot.className = `inventory-slot ${item.rarete}`;
        slot.textContent = item.nom.substring(0, 10) + "...";
        slot.addEventListener('click', () => showItemDetails(item, index));
        grid.appendChild(slot);
    });
}

function renderEquippedItems() {
    const equip = gameState.player.equipement;
    document.getElementById('eq-tete').textContent = `Tête : ${equip.tete ? GAME_DATA.objets[equip.tete].nom : '[Vide]'}`;
    document.getElementById('eq-torse').textContent = `Torse : ${equip.torse ? GAME_DATA.objets[equip.torse].nom : '[Vide]'}`;
    document.getElementById('eq-mains').textContent = `Mains : ${equip.mains ? GAME_DATA.objets[equip.mains].nom : '[Vide]'}`;
    document.getElementById('eq-accessoire').textContent = `Access. : ${equip.accessoire ? GAME_DATA.objets[equip.accessoire].nom : '[Vide]'}`;
}

function showItemDetails(item, index) {
    const detailsDiv = document.getElementById('item-details');
    const actionsDiv = document.getElementById('item-actions');
    
    let statsText = "";
    if (item.bonusStats) {
        statsText = Object.entries(item.bonusStats).map(([stat, val]) => `+${val} ${stat.toUpperCase()}`).join(', ');
    }
    if (item.effet) {
        statsText = JSON.stringify(item.effet).replace(/["{}]/g, '');
    }

    detailsDiv.innerHTML = `<strong>${item.nom}</strong><br>Type: ${item.type}<br><em>${statsText}</em>`;
    actionsDiv.innerHTML = "";

    if (item.type === "consommable") {
        const btn = document.createElement('button');
        btn.className = "hologram-btn primary";
        btn.textContent = "Utiliser";
        btn.addEventListener('click', () => {
            if (item.effet.soinPv) gameState.player.statsActuelles.pvActuels = Math.min(gameState.player.statsMax.pvMax, gameState.player.statsActuelles.pvActuels + item.effet.soinPv);
            if (item.effet.soinPm) gameState.player.statsActuelles.pmActuels = Math.min(gameState.player.statsMax.pmMax, gameState.player.statsActuelles.pmActuels + item.effet.soinPm);
            gameState.player.inventaire.splice(index, 1);
            updateHUD();
            renderInventoryGrid();
            detailsDiv.innerHTML = "Objet consommé.";
            actionsDiv.innerHTML = "";
        });
        actionsDiv.appendChild(btn);
    } else if (item.type === "armure" || item.type === "arme") {
        const btn = document.createElement('button');
        btn.className = "hologram-btn primary";
        btn.textContent = "Équiper";
        btn.addEventListener('click', () => {
            if (gameState.player.equipement[item.slot]) {
                gameState.player.inventaire.push(gameState.player.equipement[item.slot]); // Déséquipe l'ancien
            }
            gameState.player.equipement[item.slot] = item.id;
            gameState.player.inventaire.splice(index, 1);
            
            // Appliquer bonus stats (simplifié : permanent lors de l'équipement)
            if(item.bonusStats) {
                for (const [s, v] of Object.entries(item.bonusStats)) {
                    gameState.player.statsMax[s] += v;
                }
            }

            updateHUD();
            renderInventoryGrid();
            renderEquippedItems();
            detailsDiv.innerHTML = "Objet équipé.";
            actionsDiv.innerHTML = "";
        });
        actionsDiv.appendChild(btn);
    }
}

// --- STATISTIQUES ---
function openStatsModal() {
    if (!gameState.player) return;
    const content = document.getElementById('stats-content');
    const p = gameState.player;
    content.innerHTML = `
        <strong>Nom:</strong> ${p.nom}<br>
        <strong>Classe:</strong> ${p.classe} (Rang ${p.rangLicence})<br>
        <strong>Niveau:</strong> ${p.niveau} ${p.doubleEveille ? `(XP: ${p.xp}/${p.xpSuivant})` : ''}<br>
        <hr style="border: 0.5px solid var(--neon-blue); margin: 10px 0;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div>🗡️ Force : ${p.statsMax.force}</div>
            <div>🏃 Agilité : ${p.statsMax.agilite}</div>
            <div>🛡️ Vitalité : ${p.statsMax.vitalite}</div>
            <div>🧠 Intelligence : ${p.statsMax.intelligence}</div>
            <div>👁️ Perception : ${p.statsMax.perception}</div>
            <div>⚡ Réflexe : ${p.statsMax.reflexe}</div>
        </div>
    `;
    document.getElementById('modal-stats').classList.remove('hidden');
}

function closeStatsModal() {
    document.getElementById('modal-stats').classList.add('hidden');
}
