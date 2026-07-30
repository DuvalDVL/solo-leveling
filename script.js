let gameState = {
    player: null,
    civilEventsSequence: [],
    currentEventIndex: 0,
    affinites: { Guerrier: 0, Assassin: 0, Mage: 0, Ranger: 0, Tank: 0 },
    
    eveilStep: 0,
    compteurDonjons: 0, // Compteur secret pour déclencher le Donjon Rouge au 7ème
    
    entrainementsEffectues: { force: 0, agilite: 0, vitalite: 0, intelligence: 0, perception: 0 },
    
    combat: null,
    dungeonStep: 0,
    currentDungeon: null,
    isRedDungeon: false,
    isDefending: false
};

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

// --- PHASE CIVILE ---
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
        updateHUD();
        eventTitle.textContent = "[ STATUT ENREGISTRÉ ]";
        eventText.innerHTML = `Votre licence de Chasseur Rang E est active. Le monde des Donjons s'ouvre à vous. Attention à votre loyer !`;
        eventChoices.innerHTML = `<button class="hologram-btn primary" onclick="enterHub()">Entrer dans le Hub Central</button>`;
    }
}

// --- HUB CENTRAL ---
function enterHub() {
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
        { texte: "🛏️ Dormir (Restaure PV, PM et Fatigue)", action: restAtHome }
    ];

    if (gameState.player.doubleEveille) {
        actions.push({ texte: "📋 Demander une Réévaluation de Rang", action: reevaluerRang });
    }

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
                return; 
            }
        }
    }
    updateHUD();
    enterHub();
}

// --- ENTRAÎNEMENT AVEC GESTION DES LIMITES ET DU DOUBLE ÉVEIL ---
function openTrainings() {
    const eventTitle = document.getElementById('event-title');
    const eventText = document.getElementById('event-text');
    const eventChoices = document.getElementById('event-choices');

    eventTitle.textContent = "[ SALLE D'ENTRAÎNEMENT ]";
    eventText.textContent = "Sélectionnez un programme d'exercice (coûte 1 jour) :";
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
        // Avant double éveil : max 3 par compétence, sans afficher le compteur
        if (gameState.entrainementsEffectues[stat] < 3) {
            gameState.entrainementsEffectues[stat]++;
            gameState.player.statsMax[stat] += 1;
            if (stat === "vitalite") gameState.player.statsMax.pvMax += 10;
            if (stat === "intelligence") gameState.player.statsMax.pmMax += 10;

            eventTitle.textContent = "[ RÉSULTAT DE SÉANCE ]";
            eventText.innerHTML = `Séance intense validée.<br><br><span style="color:var(--neon-blue);">+1 en ${stat.toUpperCase()} !</span>`;
        } else {
            // 4ème tentative ou plus : message d'atteinte des limites, consomme l'énergie et le jour sans gain
            eventTitle.textContent = "[ LIMITE ATTEINTE ]";
            eventText.innerHTML = `<span style="color:var(--neon-red);">Vous avez atteint vos limites corporelles actuelles pour cet exercice. Aucun progrès n'a été stimulé, mais l'énergie a été dépensée.</span>`;
        }
    } else {
        // Après double éveil : entraînement illimité dynamique (succès critique, échec, double stat, etc.)
        const roll = Math.random();
        if (roll < 0.15) {
            // Échec / fatigue accrue
            gameState.player.statsActuelles.fatigue += 20;
            eventTitle.textContent = "[ SÉANCE DIFFICILE ]";
            eventText.innerHTML = `<span style="color:var(--neon-red);">Mauvaise posture durant l'exercice. Votre corps encaisse une fatigue excessive sans gain notable.</span>`;
        } else if (roll < 0.60) {
            // Standard +1
            gameState.player.statsMax[stat] += 1;
            if (stat === "vitalite") gameState.player.statsMax.pvMax += 10;
            eventTitle.textContent = "[ PROGRESSION CONSTANTE ]";
            eventText.innerHTML = `Séance rigoureuse. <span style="color:var(--neon-blue);">+1 en ${stat.toUpperCase()}.</span>`;
        } else if (roll < 0.85) {
            // Critique +2
            gameState.player.statsMax[stat] += 2;
            if (stat === "vitalite") gameState.player.statsMax.pvMax += 20;
            eventTitle.textContent = "[ SUCCÈS CRITIQUE ]";
            eventText.innerHTML = `Vos limites brisent un nouveau plafond ! <span style="color:var(--neon-green);">+2 en ${stat.toUpperCase()} !</span>`;
        } else {
            // Double stat bonus
            gameState.player.statsMax[stat] += 1;
            gameState.player.statsMax.agilite += 1;
            eventTitle.textContent = "[ ÉVEIL SYNAPTIQUE ]";
            eventText.innerHTML = `Effet secondaire inattendu de votre condition de Joueur : l'effort stimule une deuxième capacité connexe. <span style="color:var(--neon-green);">+1 en ${stat.toUpperCase()} et +1 en Agilité !</span>`;
        }
    }

    eventChoices.innerHTML = `<button class="hologram-btn primary" onclick="finishHubAction(1)">Terminer la journée</button>`;
}

function restAtHome() {
    gameState.player.statsActuelles.pvActuels = gameState.player.statsMax.pvMax;
    gameState.player.statsActuelles.pmActuels = gameState.player.statsMax.pmMax; // Mana remonte à 100%
    gameState.player.statsActuelles.fatigue = 0;
    
    const eventTitle = document.getElementById('event-title');
    const eventText = document.getElementById('event-text');
    const eventChoices = document.getElementById('event-choices');
    eventTitle.textContent = "[ NUIT DE REPOS ]";
    eventText.innerHTML = `<span style="color:var(--neon-green);">Sommeil réparateur. PV, PM et Fatigue entièrement restaurés.</span>`;
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

// --- GESTION DES DONJONS & DONJON ROUGE (ÉVEIL SECRET) ---
function openDungeons() {
    const eventTitle = document.getElementById('event-title');
    const eventText = document.getElementById('event-text');
    const eventChoices = document.getElementById('event-choices');

    eventTitle.textContent = "[ SÉLECTION DES PORTAILS ]";
    eventText.textContent = "Portails détectés dans votre secteur :";
    eventChoices.innerHTML = "";

    // Si compteur >= 7 et pas encore double éveillé, on force le donjon rouge
    if (gameState.compteurDonjons >= 6 && !gameState.player.doubleEveille) {
        const btnRed = document.createElement('button');
        btnRed.className = "hologram-btn warning";
        btnRed.textContent = "⚠️ Portail Inconnu (Anomalie Énergétique Rouge)";
        btnRed.addEventListener('click', startRedDungeon);
        eventChoices.appendChild(btnRed);
    } else {
        GAME_DATA.donjonsStandards.forEach(d => {
            const btn = document.createElement('button');
            btn.className = "hologram-btn"; 
            btn.textContent = `${d.nom} (Rang ${d.rang})`;
            btn.addEventListener('click', () => startDungeon(d));
            eventChoices.appendChild(btn);
        });
    }

    const backBtn = document.createElement('button'); 
    backBtn.className = "hologram-btn warning"; 
    backBtn.textContent = "Retour"; 
    backBtn.addEventListener('click', enterHub); 
    eventChoices.appendChild(backBtn);
}

function startDungeon(dungeon) {
    gameState.currentDungeon = dungeon;
    gameState.dungeonStep = 0;
    gameState.isRedDungeon = false;
    renderDungeonStep();
}

function startRedDungeon() {
    gameState.isRedDungeon = true;
    gameState.dungeonStep = 0;
    renderRedDungeonStep();
}

function renderDungeonStep() {
    const d = gameState.currentDungeon;
    const eventTitle = document.getElementById('event-title');
    const eventText = document.getElementById('event-text');
    const eventChoices = document.getElementById('event-choices');
    
    if (gameState.dungeonStep < d.etapes.length) {
        const etape = d.etapes[gameState.dungeonStep];
        eventTitle.textContent = `[ ${d.nom} - ÉTAPE ${gameState.dungeonStep + 1} ]`;
        eventText.innerHTML = etape.texte;
        eventChoices.innerHTML = "";

        if (etape.type === "texte") {
            const nextBtn = document.createElement('button');
            nextBtn.className = "hologram-btn primary"; 
            nextBtn.textContent = "Avancer";
            nextBtn.addEventListener('click', () => { gameState.dungeonStep++; renderDungeonStep(); });
            eventChoices.appendChild(nextBtn);
        } 
        else if (etape.type === "interactif") {
            etape.choix.forEach(choix => {
                const btn = document.createElement('button');
                btn.className = "hologram-btn"; 
                btn.textContent = choix.texte;
                btn.addEventListener('click', () => {
                    const jet = Math.floor(Math.random() * 10) + gameState.player.statsMax[choix.stat];
                    let resultatText = "";
                    if (jet >= choix.diff) {
                        resultatText = `<span style="color:var(--neon-green);">${choix.succes}</span>`;
                        if (choix.lootOr) { gameState.player.or += choix.lootOr; updateHUD(); }
                    } else {
                        resultatText = `<span style="color:var(--neon-red);">${choix.echec}</span>`;
                        if (choix.degats) { gameState.player.statsActuelles.pvActuels -= choix.degats; updateHUD(); }
                    }
                    eventText.innerHTML = resultatText;
                    eventChoices.innerHTML = `<button class="hologram-btn primary" onclick="gameState.dungeonStep++; renderDungeonStep();">Continuer</button>`;
                });
                eventChoices.appendChild(btn);
            });
        }
    } else {
        gameState.compteurDonjons++;
        if (gameState.player.statsActuelles.pvActuels <= 0) { location.reload(); return; }
        const template = GAME_DATA.monstres[d.monstreId];
        gameState.combat = { monstre: JSON.parse(JSON.stringify(template)) };
        renderCombatTurn();
    }
}

// --- SÉQUENCE DU DONJON ROUGE ET DU DOUBLE ÉVEIL ---
function renderRedDungeonStep() {
    const eventTitle = document.getElementById('event-title');
    const eventText = document.getElementById('event-text');
    const eventChoices = document.getElementById('event-choices');

    const etapesRouges = [
        "Vous franchissez le portail. Le ciel s'assombrit instantanément. Vous découvrez un immense temple souterrain aux portes cyclopéennes : le Temple de Carthenon.",
        "À l'intérieur, des dizaines de statues géantes en pierre dominent la salle. Au fond, un autel mystérieux pulse d'une lueur écarlate.",
        "Soudain, les portes se referment dans un vacarme assourdissant. Les statues commencent à bouger. C'est un piège mortel de rang double ! Vos coéquipiers tombent les uns après les autres."
    ];

    if (gameState.dungeonStep < etapesRouges.length) {
        eventTitle.textContent = `[ DONJON ROUGE - TEMPLE DE CARTHENON ]`;
        eventText.innerHTML = `<em>${etapesRouges[gameState.dungeonStep]}</em>`;
        eventChoices.innerHTML = "";

        const btn = document.createElement('button');
        btn.className = "hologram-btn warning";
        btn.textContent = "Continuer...";
        btn.addEventListener('click', () => {
            gameState.dungeonStep++;
            renderRedDungeonStep();
        });
        eventChoices.appendChild(btn);
    } else {
        // Combat contre la Statue de Dieu (Mort scriptée menant au Double Éveil)
        const template = GAME_DATA.monstres["mob_statue_dieu"];
        gameState.combat = { monstre: JSON.parse(JSON.stringify(template)) };
        renderCombatTurn();
    }
}

// --- SYSTÈME DE COMBAT ---
function renderCombatTurn() {
    const m = gameState.combat.monstre;
    const eventTitle = document.getElementById('event-title');
    const eventText = document.getElementById('event-text');
    const eventChoices = document.getElementById('event-choices');

    eventTitle.textContent = `[ COMBAT : ${m.nom.toUpperCase()} ]`;
    eventText.innerHTML = `<em>${m.description}</em><br><br><strong>Cible :</strong> ${m.stats.pv}/${m.stats.pvMax} PV<br><strong>Vous :</strong> ${Math.floor(gameState.player.statsActuelles.pvActuels)} PV`;
    eventChoices.innerHTML = "";

    const btnCAC = document.createElement('button'); 
    btnCAC.className = "hologram-btn primary"; 
    btnCAC.textContent = "🗡️ Attaque Directe (Force)";
    btnCAC.addEventListener('click', () => executeCombatTurn("cac")); 
    eventChoices.appendChild(btnCAC);

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

    if (actionType === "cac") degatsJoueur = p.statsMax.force * 2;
    else if (actionType === "defendre") gameState.isDefending = true;

    m.stats.pv -= Math.floor(degatsJoueur);

    if (m.stats.pv <= 0) {
        // Victoire normale
        p.or += 300; 
        p.reputation += 5;
        if (gameState.player.doubleEveille) {
            gainXpAndCheckLevel(m.recompenses.xp);
        }
        const eventTitle = document.getElementById('event-title');
        const eventText = document.getElementById('event-text');
        const eventChoices = document.getElementById('event-choices');
        eventTitle.textContent = "[ VICTOIRE ]";
        eventText.innerHTML = `Portail nettoyé avec succès.<br><br><span style="color:var(--neon-green);">+300 Or</span>`;
        eventChoices.innerHTML = `<button class="hologram-btn primary" onclick="finishHubAction(1)">Retour au Hub</button>`;
        updateHUD(); 
        return;
    }

    // Riposte du monstre
    let degatsMonstre = m.stats.force - Math.floor(p.statsMax.vitalite / 2);
    if (gameState.isDefending) degatsMonstre = Math.floor(degatsMonstre * 0.25);
    p.statsActuelles.pvActuels -= Math.max(1, degatsMonstre);

    // Si le joueur tombe à 0 PV
    if (p.statsActuelles.pvActuels <= 0) {
        if (gameState.isRedDungeon && !gameState.player.doubleEveille) {
            // DÉCLENCHEMENT DU DOUBLE ÉVEIL (ÉVEIL SECRET DU JOUEUR DU SYSTÈME)
            gameState.player.doubleEveille = true;
            p.statsActuelles.pvActuels = p.statsMax.pvMax;
            p.statsActuelles.pmActuels = p.statsMax.pmMax;
            p.statsMax.force += 20;
            p.statsMax.agilite += 20;
            p.statsMax.intelligence += 20;
            p.rangLicence = "S"; // Ou revalorisation
            p.classe = `Joueur du Système (${p.classe})`;

            const eventTitle = document.getElementById('event-title');
            const eventText = document.getElementById('event-text');
            const eventChoices = document.getElementById('event-choices');

            eventTitle.textContent = "[ ⚠️ ANOMALIE CRITIQUE : DOUBLE ÉVEIL ]";
            eventText.innerHTML = `<span style="color:var(--neon-blue);">[ Vous avez rempli les conditions secrètes. ]</span><br><br>Une interface holographique bleue apparaît devant vos yeux. Vos blessures se referment instantanément. Le Système vous a choisi comme unique Joueur. Vos statistiques ont explosé !`;
            eventChoices.innerHTML = `<button class="hologram-btn primary" onclick="enterHub()">Accepter le Système</button>`;
            updateHUD();
            return;
        } else {
            const eventTitle = document.getElementById('event-title');
            const eventText = document.getElementById('event-text');
            const eventChoices = document.getElementById('event-choices');
            eventTitle.textContent = "[ MORT ]"; 
            eventText.innerHTML = "Vous avez succombé dans les ténèbres du donjon.";
            eventChoices.innerHTML = `<button class="hologram-btn warning" onclick="location.reload()">Recommencer</button>`;
            return;
        }
    }
    updateHUD();
    renderCombatTurn();
}

// --- GESTION DE L'XP ET DES NIVEAUX ---
function gainXpAndCheckLevel(amount) {
    gameState.player.xp += amount;
    while (gameState.player.xp >= gameState.player.xpSuivant) {
        gameState.player.xp -= gameState.player.xpSuivant;
        gameState.player.niveau++;
        gameState.player.xpSuivant = Math.floor(gameState.player.xpSuivant * 1.5);
        gameState.player.statsMax.force += 2;
        gameState.player.statsMax.agilite += 2;
        gameState.player.statsMax.vitalite += 2;
        gameState.player.statsMax.pvMax += 25;
        gameState.player.statsActuelles.pvActuels = gameState.player.statsMax.pvMax;
    }
    updateHUD();
}

function reevaluerRang() {
    const eventTitle = document.getElementById('event-title');
    const eventText = document.getElementById('event-text');
    const eventChoices = document.getElementById('event-choices');

    let nouveauRang = gameState.player.rangLicence;
    if (gameState.player.niveau >= 5 && nouveauRang === "E") nouveauRang = "D";
    if (gameState.player.niveau >= 10 && nouveauRang === "D") nouveauRang = "C";
    
    gameState.player.rangLicence = nouveauRang;
    updateHUD();

    eventTitle.textContent = "[ RÉÉVALUATION DE L'ASSOCIATION ]";
    eventText.innerHTML = `L'Association a analysé votre aura magique.<br><br>Votre licence officielle est désormais mise à jour au <strong>Rang ${nouveauRang}</strong>.`;
    eventChoices.innerHTML = `<button class="hologram-btn primary" onclick="enterHub()">Retour au Hub</button>`;
}

// --- INVENTAIRE ET STATS ---
function openInventoryModal() { renderInventoryGrid(); renderEquipmentDisplay(); document.getElementById('modal-inventory').classList.remove('hidden'); }
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
        const btn = document.createElement('button'); 
        btn.className = "hologram-btn primary"; 
        btn.textContent = "Utiliser"; 
        btn.onclick = () => { 
            if(obj.effet.soinPv) gameState.player.statsActuelles.pvActuels = Math.min(gameState.player.statsMax.pvMax, gameState.player.statsActuelles.pvActuels + obj.effet.soinPv); 
            if(obj.effet.soinPm) gameState.player.statsActuelles.pmActuels = Math.min(gameState.player.statsMax.pmMax, gameState.player.statsActuelles.pmActuels + obj.effet.soinPm); 
            gameState.player.inventaire.splice(index, 1); 
            updateHUD(); 
            renderInventoryGrid(); 
        }; 
        actions.appendChild(btn); 
    } 
}
function renderEquipmentDisplay() { 
    const eq = gameState.player.equipement; 
    ['tete', 'torse', 'mains', 'accessoire'].forEach(slot => { 
        document.getElementById(`eq-${slot}`).textContent = `${slot.toUpperCase()} : ${eq[slot] ? GAME_DATA.objets[eq[slot]].nom : '[Vide]'}`; 
    }); 
}
function closeInventoryModal() { document.getElementById('modal-inventory').classList.add('hidden'); }
function openStatsModal() { 
    document.getElementById('modal-stats').classList.remove('hidden'); 
    document.getElementById('stats-content').innerHTML = `Force: ${gameState.player.statsMax.force} <br> Agilité: ${gameState.player.statsMax.agilite} <br> Vitalité: ${gameState.player.statsMax.vitalite} <br> Intelligence: ${gameState.player.statsMax.intelligence} <br> Perception: ${gameState.player.statsMax.perception} <br> Réflexe: ${gameState.player.statsMax.reflexe}`; 
}
function closeStatsModal() { document.getElementById('modal-stats').classList.add('hidden'); }
