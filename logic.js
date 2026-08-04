// logic.js - Partie 1 : État Global, HUD, Phase 1 (Civil/Éveil) & Gestion du Hub

// ==========================================
// 1. ÉTAT GLOBAL DU JEU
// ==========================================
let gameState = {
    phase: 1, // 1: Civil, 2: Chasseur E, 3: Joueur du Système
    player: {
        name: "Sung",
        profession: "ouvrier",
        classId: "inconnue",
        className: "Inconnue",
        rank: "E",
        level: 1,
        exp: 0,
        maxExp: 100,
        hp: 100,
        maxHp: 100,
        mp: 50,
        maxMp: 50,
        fatigue: 0,
        gold: 100,
        essence: 0,
        karma: 0,
        freePoints: 0,
        stats: { str: 10, agi: 10, int: 10, vit: 10, per: 10 },
        affinities: { guerrier: 0, assassin: 0, mage: 0, tank: 0, ranger: 0 },
        inventory: [
            { id: "potion_e", qty: 2 }
        ],
        equipment: { weapon: null }
    },
    rent: {
        amount: 250,
        daysLeft: 7
    },
    dungeonsCompleted: 0,
    trainingCount: { str: 0, agi: 0, int: 0, vit: 0, per: 0 },
    currentCivilEventIndex: 0,
    activeDungeon: null,
    combat: null
};

// ==========================================
// 2. GESTION DE L'AFFICHAGE & HUD
// ==========================================
function showScreen(screenId) {
    const screens = [
        "screen-creation", "screen-civil", "screen-awakening", 
        "screen-hub", "screen-dungeon", "screen-special-dungeon", 
        "screen-hospital", "screen-combat", "screen-penalty", "screen-monarch"
    ];
    screens.forEach(s => {
        const el = document.getElementById(s);
        if (el) el.style.display = (s === screenId) ? "block" : "none";
    });
}

function updateHUD() {
    const p = gameState.player;
    
    // Règle absolue : Recalcul dynamique des PV et PM Max selon Vitalité et Intelligence
    p.maxHp = 50 + (p.stats.vit * 5);
    p.maxMp = 20 + (p.stats.int * 3);
    
    if (p.hp > p.maxHp) p.hp = p.maxHp;
    if (p.mp > p.maxMp) p.mp = p.maxMp;

    document.getElementById("hud-name").innerText = p.name;
    document.getElementById("hud-profession").innerText = p.profession.toUpperCase();
    document.getElementById("hud-class").innerText = "Classe : " + p.className;
    document.getElementById("hud-rank").innerText = p.rank;
    
    document.getElementById("hud-hp").innerText = p.hp;
    document.getElementById("hud-max-hp").innerText = p.maxHp;
    document.getElementById("hud-mp").innerText = p.mp;
    document.getElementById("hud-max-mp").innerText = p.maxMp;
    document.getElementById("hud-fatigue").innerText = p.fatigue;
    
    document.getElementById("hud-rent-gold").innerText = gameState.rent.amount;
    document.getElementById("hud-rent-days").innerText = gameState.rent.daysLeft;

    document.getElementById("hud-str").innerText = p.stats.str;
    document.getElementById("hud-agi").innerText = p.stats.agi;
    document.getElementById("hud-int").innerText = p.stats.int;
    document.getElementById("hud-vit").innerText = p.stats.vit;
    document.getElementById("hud-per").innerText = p.stats.per;

    // Interface Système réservée à la Phase 3
    const systemHUD = document.getElementById("hud-system");
    if (gameState.phase === 3) {
        systemHUD.style.display = "block";
        document.getElementById("hud-level").innerText = p.level;
        document.getElementById("hud-exp").innerText = p.exp;
        document.getElementById("hud-max-exp").innerText = p.maxExp;
        document.getElementById("hud-free-points").innerText = p.freePoints;
        document.getElementById("hud-essence").innerText = p.essence;
        document.getElementById("hud-karma").innerText = p.karma;
        document.getElementById("btn-daily-quest").style.display = "inline-block";
    } else {
        systemHUD.style.display = "none";
        document.getElementById("btn-daily-quest").style.display = "none";
    }
}

// ==========================================
// 3. PHASE 1 : CRÉATION ET ÉVÉNEMENTS CIVILS
// ==========================================
function startCivilPhase() {
    const nameInput = document.getElementById("player-name").value.trim();
    if (nameInput) gameState.player.name = nameInput;

    const prof = document.getElementById("player-profession").value;
    gameState.player.profession = prof;

    // Métiers : Statistiques et Or de départ
    if (prof === "ouvrier") {
        gameState.player.stats.str += 2;
        gameState.player.stats.vit += 2;
        gameState.player.gold = 100;
    } else if (prof === "employe") {
        gameState.player.stats.int += 2;
        gameState.player.stats.per += 2;
        gameState.player.gold = 300;
    } else if (prof === "livreur") {
        gameState.player.stats.agi += 3;
        gameState.player.stats.vit += 1;
        gameState.player.gold = 150;
    } else if (prof === "etudiant") {
        gameState.player.stats.int += 3;
        gameState.player.stats.agi += 1;
        gameState.player.gold = 50;
    }

    gameState.currentCivilEventIndex = 0;
    document.getElementById("hud").style.display = "block";
    updateHUD();
    loadCivilEvent();
}

function loadCivilEvent() {
    if (gameState.currentCivilEventIndex >= civilEvents.length) {
        triggerAwakening();
        return;
    }

    const ev = civilEvents[gameState.currentCivilEventIndex];
    showScreen("screen-civil");

    document.getElementById("civil-title").innerText = ev.title;
    document.getElementById("civil-description").innerText = ev.description;

    const choicesDiv = document.getElementById("civil-choices");
    choicesDiv.innerHTML = "";

    ev.choices.forEach((choice, index) => {
        const btn = document.createElement("button");
        btn.innerText = choice.text;
        btn.onclick = () => makeCivilChoice(index);
        choicesDiv.appendChild(btn);
    });
}

function makeCivilChoice(choiceIndex) {
    const ev = civilEvents[gameState.currentCivilEventIndex];
    const choice = ev.choices[choiceIndex];

    // Application des bonus de stats
    for (let stat in choice.stats) {
        gameState.player.stats[stat] += choice.stats[stat];
    }

    // Accumulation d'affinité vers la classe
    if (choice.affinity) {
        gameState.player.affinities[choice.affinity] += 1;
    }

    gameState.currentCivilEventIndex++;
    updateHUD();
    loadCivilEvent();
}

function triggerAwakening() {
    // Calcul de la classe selon l'affinité maximale
    let maxAffinity = -1;
    let selectedClass = "guerrier";

    for (let classKey in gameState.player.affinities) {
        if (gameState.player.affinities[classKey] > maxAffinity) {
            maxAffinity = gameState.player.affinities[classKey];
            selectedClass = classKey;
        }
    }

    gameState.player.classId = selectedClass;
    gameState.player.className = classesData[selectedClass].name;

    showScreen("screen-awakening");
    document.getElementById("awakening-text").innerText = classesData[selectedClass].awakeningText;
    updateHUD();
}

// ==========================================
// 4. TRANSITION VERS PHASE 2 (HUB & CHASSEUR E)
// ==========================================
function enterPhase2Hub() {
    gameState.phase = 2;
    showScreen("screen-hub");
    updateHUD();
    document.getElementById("hub-content").innerHTML = `
        <h3>Bienvenue au Hub des Chasseurs (Rang E)</h3>
        <p>Vous avez obtenu votre premier éveil. Vous n'avez pas encore accès aux pouvoirs du "Système".</p>
        <p>Gagnez de l'or en accomplissant des donjons pour payer votre <strong>loyer de ${gameState.rent.amount} Or</strong> dans les temps !</p>
    `;
}

// ==========================================
// 5. GESTION DU HUB : DORMIR, ENTRAÎNEMENT & LOYER
// ==========================================
function restPlayer() {
    gameState.rent.daysLeft -= 1;
    gameState.player.hp = gameState.player.maxHp;
    gameState.player.mp = gameState.player.maxMp;
    gameState.player.fatigue = 0;

    checkRentDeadline();
    updateHUD();

    document.getElementById("hub-content").innerHTML = `
        <h3>Une bonne nuit de sommeil...</h3>
        <p>Vous vous réveillez parfaitement reposé. PV et PM restaurés à 100%. Fatigue remise à 0.</p>
        <p>Il vous reste <strong>${gameState.rent.daysLeft} jours</strong> pour payer le loyer.</p>
    `;
}

function checkRentDeadline() {
    if (gameState.rent.daysLeft <= 0) {
        if (gameState.player.gold >= gameState.rent.amount) {
            gameState.player.gold -= gameState.rent.amount;
            gameState.rent.daysLeft = 7;
            alert("Loyer payé automatiquement (-" + gameState.rent.amount + " Or). Nouveau délai : 7 jours.");
        } else {
            alert("GAME OVER : Vous n'avez pas pu payer le loyer. Vous êtes expulsé et mourez de fatigue dans la rue.");
            location.reload();
        }
    }
}

function showTrainMenu() {
    let html = `<h3>Salle d'Entraînement</h3><p>Chaque séance prend 1 jour. Limite : 3 séances max par statistique.</p><ul>`;
    const statsList = [
        { key: "str", name: "Force" },
        { key: "agi", name: "Agilité" },
        { key: "int", name: "Intelligence" },
        { key: "vit", name: "Vitalité" },
        { key: "per", name: "Perception" }
    ];

    statsList.forEach(s => {
        const count = gameState.trainingCount[s.key];
        if (count < 3) {
            html += `<li>${s.name} (+1) - Effectué : ${count}/3 <button onclick="trainStat('${s.key}')">S'entraîner</button></li>`;
        } else {
            html += `<li>${s.name} - Maximum atteint (${count}/3)</li>`;
        }
    });

    html += `</ul>`;
    document.getElementById("hub-content").innerHTML = html;
}

function trainStat(statKey) {
    if (gameState.trainingCount[statKey] < 3) {
        gameState.trainingCount[statKey]++;
        gameState.player.stats[statKey]++;
        gameState.rent.daysLeft--;
        
        checkRentDeadline();
        updateHUD();
        showTrainMenu();
    }
}

// ==========================================
// 6. GÉNÉRATION ET EXPLORATION DES DONJONS
// ==========================================
function showDungeonSelection() {
    let html = `<h3>Portails Disponibles</h3><p>Choisissez un donjon à explorer. Attention, le danger est réel.</p>`;
    
    // Génère 2 à 3 portails aléatoires
    const numPortals = Math.floor(Math.random() * 2) + 2; 
    for(let i=0; i<numPortals; i++) {
        const ranks = ["E", "E", "D"]; // Prépondérance E au début
        const rank = ranks[Math.floor(Math.random() * ranks.length)];
        const envs = ["Grotte Humide", "Forêt Sombre", "Ruines Antiques"];
        const env = envs[Math.floor(Math.random() * envs.length)];
        
        html += `<button onclick="enterDungeon('${rank}', '${env}')">Portail de Rang ${rank} - ${env}</button>`;
    }
    
    document.getElementById("hub-content").innerHTML = html;
}

function enterDungeon(rank, environment) {
    // Vérifier si c'est le moment du Donjon Spécial (Phase 2, après 4 donjons normaux)
    if (gameState.phase === 2 && gameState.dungeonsCompleted === 4) {
        triggerSpecialDungeon();
        return;
    }

    gameState.activeDungeon = {
        rank: rank,
        environment: environment,
        step: 1,
        maxSteps: 4 // 3 événements + 1 Boss
    };
    
    showScreen("screen-dungeon");
    document.getElementById("dungeon-title").innerText = `Portail de Rang ${rank} : ${environment}`;
    nextDungeonStep();
}

function nextDungeonStep() {
    const d = gameState.activeDungeon;
    document.getElementById("dungeon-step").innerText = d.step;
    document.getElementById("dungeon-max-steps").innerText = d.maxSteps;

    const choicesDiv = document.getElementById("dungeon-choices");
    choicesDiv.innerHTML = "";

    if (d.step === d.maxSteps) {
        // Salle du Boss
        document.getElementById("dungeon-event-text").innerText = "Vous entrez dans la salle du Boss. Les portes se referment derrière vous. Impossible de fuir.";
        const btn = document.createElement("button");
        btn.innerText = "Affronter le Boss";
        btn.onclick = () => initCombat(true);
        choicesDiv.appendChild(btn);
    } else {
        // Événement procédural (Piège, Monstre normal, Découverte)
        const eventType = Math.random();
        if (eventType < 0.4) {
            document.getElementById("dungeon-event-text").innerText = "Un monstre vous barre la route !";
            const btn = document.createElement("button");
            btn.innerText = "Combattre";
            btn.onclick = () => initCombat(false);
            choicesDiv.appendChild(btn);
        } else if (eventType < 0.7) {
            document.getElementById("dungeon-event-text").innerText = "Vous repérez un piège runique au sol.";
            const btn = document.createElement("button");
            btn.innerText = "Désamorcer (Jet de Perception)";
            btn.onclick = () => statCheck("per", 12, "Vous désamorcez le piège et trouvez un noyau magique.", "Le piège explose ! (-15 PV)", 15);
            choicesDiv.appendChild(btn);
        } else {
            document.getElementById("dungeon-event-text").innerText = "Vous trouvez le cadavre d'un ancien chasseur.";
            const btn = document.createElement("button");
            btn.innerText = "Fouiller le corps";
            btn.onclick = () => {
                alert("Vous trouvez une Potion de Soin (E) !");
                addToInventory("potion_e", 1);
                endDungeonStep();
            };
            choicesDiv.appendChild(btn);
        }
    }
}

function statCheck(stat, target, successMsg, failMsg, dmg) {
    const roll = Math.floor(Math.random() * 20) + 1 + gameState.player.stats[stat];
    if (roll >= target) {
        alert("Succès ! " + successMsg);
    } else {
        alert("Échec ! " + failMsg);
        gameState.player.hp -= dmg;
        updateHUD();
        if (gameState.player.hp <= 0) gameOver();
    }
    endDungeonStep();
}

function endDungeonStep() {
    gameState.activeDungeon.step++;
    if (gameState.activeDungeon.step > gameState.activeDungeon.maxSteps) {
        // Fin du donjon
        gameState.dungeonsCompleted++;
        alert("Donjon terminé ! Vous retournez au Hub.");
        showScreen("screen-hub");
    } else {
        nextDungeonStep();
    }
}

// ==========================================
// 7. LE DONJON SPÉCIAL (CLIMAX PHASE 2)
// ==========================================
function triggerSpecialDungeon() {
    showScreen("screen-special-dungeon");
    
    // Tirage aléatoire (50% Carthénon, 25% Abîme, 25% Illusions)
    const rng = Math.random() * 100;
    let selectedDungeon;
    
    if (rng <= 50) selectedDungeon = specialDungeons[0]; // Temple de Carthénon
    else if (rng <= 75) selectedDungeon = specialDungeons[1]; // Abîme Oublié
    else selectedDungeon = specialDungeons[2]; // Labyrinthe des Illusions

    document.getElementById("special-dungeon-title").innerText = selectedDungeon.title;
    document.getElementById("special-dungeon-text").innerText = selectedDungeon.description;
    
    const choicesDiv = document.getElementById("special-dungeon-choices");
    choicesDiv.innerHTML = "";

    selectedDungeon.choices.forEach(choice => {
        const btn = document.createElement("button");
        btn.innerText = choice.text;
        btn.onclick = () => {
            if (choice.action === "death") {
                alert(choice.reason);
                triggerHospitalAwakening(); // La mort dans ce donjon mène au double éveil
            } else if (choice.action === "survive") {
                triggerHospitalAwakening();
            } else if (choice.action === "stat_check") {
                alert("La situation vous submerge... vous perdez connaissance.");
                triggerHospitalAwakening();
            }
        };
        choicesDiv.appendChild(btn);
    });
}

function triggerHospitalAwakening() {
    showScreen("screen-hospital");
    document.getElementById("hospital-text").innerHTML = `
        <p>Vous ouvrez les yeux, ébloui par une lumière blanche. Vous êtes dans un lit d'hôpital.</p>
        <p>Des inspecteurs de l'Association vous ont retrouvé inconscient dans le donjon. Tous les autres chasseurs ont péri.</p>
        <p>Soudain, un écran holographique bleu flotte devant vos yeux : <strong>[ LE SYSTÈME VOUS SOUHAITE LA BIENVENUE ]</strong>.</p>
    `;
}

function activateSystemPlayer() {
    gameState.phase = 3;
    gameState.player.classId = "joueur";
    gameState.player.className = classesData["joueur"].name;
    gameState.player.level = 1;
    gameState.player.freePoints = 5;
    
    alert("Vous avez obtenu la classe secrète : Joueur du Système ! Accès complet déverrouillé.");
    
    showScreen("screen-hub");
    updateHUD();
    document.getElementById("hub-content").innerHTML = `
        <h3>Hub - Phase 3 (Le Système)</h3>
        <p>L'interface du Système est désormais canonique. Vous avez accès à vos points de statistiques libres, à la Quête Quotidienne, et bientôt à la Boutique du Système.</p>
    `;
}

// ==========================================
// 8. SYSTÈME DE COMBAT TACTIQUE
// ==========================================
function initCombat(isBoss) {
    const rankEnemies = bestiary[gameState.activeDungeon.rank];
    const enemyTemplate = rankEnemies[Math.floor(Math.random() * rankEnemies.length)];
    
    // Si c'est un boss, on prend le dernier de la liste du rang (simplification)
    const enemyData = isBoss ? rankEnemies[rankEnemies.length - 1] : enemyTemplate;

    gameState.combat = {
        enemy: {
            name: (isBoss ? "Boss : " : "") + enemyData.name,
            hp: enemyData.hp,
            maxHp: enemyData.maxHp,
            attack: enemyData.attack,
            defense: enemyData.defense,
            status: enemyData.status
        },
        turn: 1
    };

    showScreen("screen-combat");
    updateCombatUI();
    logCombat(`Un ${gameState.combat.enemy.name} apparaît !`);
    generateCombatButtons();
}

function updateCombatUI() {
    const p = gameState.player;
    const e = gameState.combat.enemy;

    document.getElementById("combat-player-hp").innerText = p.hp;
    document.getElementById("combat-player-max-hp").innerText = p.maxHp;
    document.getElementById("combat-player-mp").innerText = p.mp;
    document.getElementById("combat-player-max-mp").innerText = p.maxMp;

    document.getElementById("combat-enemy-name").innerText = e.name;
    document.getElementById("combat-enemy-hp").innerText = e.hp;
    document.getElementById("combat-enemy-max-hp").innerText = e.maxHp;
    document.getElementById("combat-enemy-status").innerText = e.status;
}

function generateCombatButtons() {
    const actionsDiv = document.getElementById("combat-actions");
    actionsDiv.innerHTML = "";

    // Bouton Attaque Basique
    const btnAttack = document.createElement("button");
    btnAttack.innerText = "Attaque Rapide";
    btnAttack.onclick = () => playerAttack(1);
    actionsDiv.appendChild(btnAttack);

    // Bouton Compétence de Classe (Signature)
    const btnSkill = document.createElement("button");
    const classData = classesData[gameState.player.classId] || classesData["guerrier"];
    btnSkill.innerText = classData.signatureMove + " (-10 PM)";
    btnSkill.onclick = () => playerSkill();
    actionsDiv.appendChild(btnSkill);

    // Bouton Défense / Esquive
    const btnDefend = document.createElement("button");
    btnDefend.innerText = "Se Protéger";
    btnDefend.onclick = () => playerDefend();
    actionsDiv.appendChild(btnDefend);
}

function logCombat(msg) {
    const logBox = document.getElementById("combat-log");
    logBox.innerHTML = `<p>${msg}</p>` + logBox.innerHTML;
}

function playerAttack(multiplier) {
    const p = gameState.player;
    const e = gameState.combat.enemy;
    
    // Calcul des dégâts basé sur la stat principale de la classe
    let mainStatValue = p.stats.str; // Défaut
    if (p.classId === "assassin") mainStatValue = p.stats.agi;
    if (p.classId === "mage") mainStatValue = p.stats.int;
    if (p.classId === "tank") mainStatValue = p.stats.vit;
    if (p.classId === "ranger") mainStatValue = p.stats.per;
    if (p.classId === "joueur") mainStatValue = Math.max(p.stats.str, p.stats.agi, p.stats.int);

    const dmg = Math.max(1, Math.floor((mainStatValue * 2 * multiplier) - (e.defense * 0.5)));
    e.hp -= dmg;
    
    logCombat(`Vous attaquez et infligez ${dmg} dégâts !`);
    checkCombatState();
}

function playerSkill() {
    if (gameState.player.mp < 10) {
        logCombat("Pas assez de PM !");
        return;
    }
    gameState.player.mp -= 10;
    playerAttack(2.5); // Attaque plus puissante
}

function playerDefend() {
    logCombat("Vous vous préparez à encaisser le prochain coup.");
    enemyTurn(true);
}

function checkCombatState() {
    updateCombatUI();
    if (gameState.combat.enemy.hp <= 0) {
        logCombat("Monstre vaincu !");
        setTimeout(endCombat, 1500);
    } else {
        setTimeout(() => enemyTurn(false), 1000);
    }
}

function enemyTurn(playerDefending) {
    const p = gameState.player;
    const e = gameState.combat.enemy;

    let dmg = Math.max(1, e.attack - (p.stats.vit * (playerDefending ? 2 : 1)));
    p.hp -= dmg;
    
    logCombat(`Le ${e.name} riposte et inflige ${dmg} dégâts.`);
    
    // Mécanique d'Anomalie (Double Éveil) - 5% de chance si coup fatal
    if (p.hp <= 0) {
        if (Math.random() < 0.05) {
            p.hp = p.maxHp;
            p.stats.str += 10; p.stats.agi += 10; p.stats.vit += 10;
            logCombat("RÉSONANCE DÉTECTÉE ! DOUBLE ÉVEIL ! Vos blessures guérissent et votre force explose !");
            updateHUD();
            return;
        } else {
            gameOver();
        }
    } else {
        updateCombatUI();
        updateHUD();
    }
}

function endCombat() {
    // Gagne de l'or et exp (si Phase 3)
    gameState.player.gold += 50;
    if (gameState.phase === 3) {
        gameState.player.exp += 30;
        if (gameState.player.exp >= gameState.player.maxExp) {
            gameState.player.level++;
            gameState.player.freePoints += 5;
            gameState.player.exp = 0;
            gameState.player.maxExp *= 1.5;
            alert("Niveau Supérieur ! Vous gagnez 5 points libres.");
        }
    }
    
    alert("Victoire ! Vous gagnez 50 Or.");
    updateHUD();
    endDungeonStep();
}

// ==========================================
// 9. INVENTAIRE
// ==========================================
function toggleInventory() {
    const modal = document.getElementById("inventory-modal");
    if (modal.style.display === "none" || modal.style.display === "") {
        modal.style.display = "block";
        renderInventory();
    } else {
        modal.style.display = "none";
    }
}

function renderInventory() {
    const grid = document.getElementById("inventory-grid");
    grid.innerHTML = "";
    
    gameState.player.inventory.forEach(itemEntry => {
        const itemData = itemsDatabase[itemEntry.id];
        if (itemData) {
            grid.innerHTML += `<div class="inventory-item">
                <strong>${itemData.name}</strong> x${itemEntry.qty}<br>
                Type : ${itemData.type}
            </div>`;
        }
    });
}

function addToInventory(itemId, qty) {
    const existing = gameState.player.inventory.find(i => i.id === itemId);
    if (existing && itemsDatabase[itemId].stackable) {
        existing.qty += qty;
    } else {
        gameState.player.inventory.push({ id: itemId, qty: qty });
    }
}

// ==========================================
// 10. UTILITAIRES
// ==========================================
function gameOver() {
    alert("GAME OVER. Vos points de vie sont tombés à zéro.");
    location.reload();
}

// Lancement initial
window.onload = () => {
    updateHUD();
    showScreen("screen-creation");
};
