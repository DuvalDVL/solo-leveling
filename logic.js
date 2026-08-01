// logic.js - Partie 1 : État Global, Initialisation, Phase 1 et Événements Civils

let player = {
    name: "",
    job: "",
    class: "aucun",
    rank: "E",
    level: 1,
    exp: 0,
    expMax: 100,
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    fatigue: 0,
    gold: 100,
    essence: 0,
    karma: 0,
    stats: {
        force: 10,
        agilite: 10,
        intelligence: 10,
        vitalite: 10,
        perception: 10
    },
    freePoints: 0,
    inventory: [],
    rentDaysLeft: 7,
    dungeonsCleared: 0,
    phase: 1,
    eventCount: 0
};

// Lancement du jeu depuis l'écran de création (Début de la Phase 1)
function startGame() {
    const nameInput = document.getElementById("char-name").value.trim();
    const jobSelect = document.getElementById("char-job").value;

    if (!nameInput) {
        alert("Veuillez entrer un nom de personnage.");
        return;
    }

    player.name = nameInput;
    player.job = jobSelect;
    
    // Application des bonus du métier choisi
    const jobBonus = GAME_DATA.jobs[jobSelect].bonus;
    player.stats.force += jobBonus.force;
    player.stats.agilite += jobBonus.agilite;
    player.stats.intelligence += jobBonus.intelligence;
    player.stats.vitalite += jobBonus.vitalite;
    player.stats.perception += jobBonus.perception;
    player.gold = GAME_DATA.jobs[jobSelect].gold;

    // Recalcul des PV/PM max selon vitalité et intelligence
    player.maxHp = player.stats.vitalite * 10;
    player.hp = player.maxHp;
    player.maxMp = player.stats.intelligence * 5;
    player.mp = player.maxMp;

    // Passage à l'écran des événements civils
    document.getElementById("screen-creation").style.display = "none";
    document.getElementById("screen-event").style.display = "block";
    
    loadNextCivilEvent();
}

// Gestion des événements de la Phase 1 (4 à 5 événements avant l'Éveil Rang E)
function loadNextCivilEvent() {
    if (player.eventCount >= 4) {
        triggerRankEAwakening();
        return;
    }

    player.eventCount++;
    // Pour l'exemple, on pioche dans les événements phase1 ou on génère un événement textuel standard
    const eventsPool = GAME_DATA.events.phase1;
    const randomEvent = eventsPool[Math.floor(Math.random() * eventsPool.length)];

    document.getElementById("event-title").innerText = `Vie Quotidienne (${player.eventCount}/4) : ${randomEvent.title}`;
    document.getElementById("event-description").innerText = randomEvent.desc;

    const choicesContainer = document.getElementById("event-choices");
    choicesContainer.innerHTML = "";

    randomEvent.choices.forEach((choice, index) => {
        const btn = document.createElement("button");
        btn.innerText = choice.text;
        btn.onclick = () => resolveCivilChoice(choice);
        choicesContainer.appendChild(btn);
    });
}

function resolveCivilChoice(choice) {
    // Augmente la stat liée au choix
    player.stats[choice.stat] += choice.bonus;
    player.karma += choice.karma;
    
    // Charger l'événement suivant
    loadNextCivilEvent();
}

// Événement d'Éveil au Rang E (Fin de la Phase 1)
function triggerRankEAwakening() {
    document.getElementById("event-title").innerText = "Le Protocole d'Éveil";
    document.getElementById("event-description").innerText = "Une étrange résonance mystique parcourt votre corps. Vos cellules s'adaptent. L'Association des Chasseurs vous attribue officiellement votre statut : Chasseur de Rang E.";

    // Détermination de la classe de base selon la stat la plus haute
    let highestStat = "force";
    let maxVal = player.stats.force;
    for (let stat in player.stats) {
        if (player.stats[stat] > maxVal) {
            maxVal = player.stats[stat];
            highestStat = stat;
        }
    }

    if (highestStat === "force") player.class = "guerrier";
    else if (highestStat === "agilite") player.class = "assassin";
    else if (highestStat === "intelligence") player.class = "mage";
    else if (highestStat === "vitalite") player.class = "tank";
    else player.class = "ranger";

    const choicesContainer = document.getElementById("event-choices");
    choicesContainer.innerHTML = "";

    const btn = document.createElement("button");
    btn.innerText = "Entrer dans la Phase 2 (Le Chasseur de Rang E)";
    btn.onclick = () => enterPhase2();
    choicesContainer.appendChild(btn);
}

// Transition vers la Phase 2 (Le Hub Chasseur sans Système)
function enterPhase2() {
    player.phase = 2;
    document.getElementById("screen-event").style.display = "none";
    document.getElementById("screen-hub").style.display = "block";
    
    // Afficher le HUD de base (sans l'interface Système)
    document.getElementById("hud").style.display = "block";
    updateHUD();

    renderHub();
}

// Mise à jour de l'affichage HUD
function updateHUD() {
    document.getElementById("hud-name").innerText = player.name;
    document.getElementById("hud-class").innerText = GAME_DATA.classes[player.class].name;
    document.getElementById("hud-rank").innerText = player.rank;
    document.getElementById("hud-level").innerText = player.level;
    document.getElementById("hud-hp").innerText = player.hp;
    document.getElementById("hud-maxhp").innerText = player.maxHp;
    document.getElementById("hud-mp").innerText = player.mp;
    document.getElementById("hud-maxmp").innerText = player.maxMp;
    document.getElementById("hud-fatigue").innerText = player.fatigue;
    document.getElementById("hud-gold").innerText = player.gold;
    document.getElementById("hud-essence").innerText = player.essence;
    document.getElementById("hud-karma").innerText = player.karma;

    if (player.phase === 3) {
        document.getElementById("hud-system").style.display = "block";
        document.getElementById("hud-freepoints").innerText = player.freePoints;
        document.getElementById("btn-association").style.display = "inline-block";
        document.getElementById("btn-system-shop").style.display = "inline-block";
    }
}

function renderHub() {
    const alerts = document.getElementById("hub-alerts");
    if (player.phase === 2) {
        alerts.innerHTML = `<p style="color: red;"><strong>Alerte Loyer :</strong> Il vous reste ${player.rentDaysLeft} jours pour payer 250 Or.</p>`;
    } else {
        alerts.innerHTML = `<p style="color: green;"><strong>Statut :</strong> Joueur du Système actif.</p>`;
    }

    const content = document.getElementById("hub-content");
    content.innerHTML = `<p>Bienvenue au Hub Central. Choisissez une action ci-dessus pour progresser (Effectuez 4 donjons pour déclencher le Double Donjon en Phase 2).</p>`;
}

// Actions de base du Hub
function rest() {
    player.hp = player.maxHp;
    player.mp = player.maxMp;
    player.fatigue = Math.max(0, player.fatigue - 20);
    player.rentDaysLeft--;
    
    if (player.rentDaysLeft <= 0 && player.phase === 2) {
        alert("Vous n'avez pas payé votre loyer à temps ! Game Over narratif.");
        location.reload();
        return;
    }

    alert("Vous avez dormi. Vos PV/PM sont restaurés, la fatigue baisse. 1 jour s'écoule.");
    updateHUD();
    renderHub();
}

function train() {
    player.stats.force += 1;
    player.fatigue += 15;
    alert("Entraînement terminé : +1 en Force, mais la fatigue augmente.");
    updateHUD();
}

// logic.js - Partie 2 : Gestion des Donjons, Double Donjon et Passage en Phase 3

let currentDungeon = {
    rank: "E",
    step: 0,
    maxSteps: 3,
    activeEnemies: []
};

// Affichage de la sélection des portails
function showDungeons() {
    const content = document.getElementById("hub-content");
    content.innerHTML = `
        <h3>Portails Disponibles</h3>
        <p>Donjons terminés : ${player.dungeonsCleared}/4 ${player.phase === 2 ? "(Atteignez 4 pour déclencher le Double Donjon)" : ""}</p>
        <button onclick="enterDungeon('E')">Portail de Rang E (Facile)</button>
        <button onclick="enterDungeon('D')">Portail de Rang D (Moyen)</button>
        ${player.phase === 3 ? '<button onclick="enterDungeon(\'C\')">Portail de Rang C</button>' : ''}
    `;
}

// Entrer dans un donjon
function enterDungeon(rank) {
    // Vérification de la Phase 2 et du quota pour le Double Donjon
    if (player.phase === 2 && player.dungeonsCleared >= 4) {
        triggerDoubleDungeonEvent();
        return;
    }

    currentDungeon.rank = rank;
    currentDungeon.step = 0;
    currentDungeon.maxSteps = 3;
    
    // Génération des ennemis pour la première salle
    generateDungeonRoom();

    // Basculer vers l'écran de combat / événement
    document.getElementById("screen-hub").style.display = "none";
    document.getElementById("screen-combat").style.display = "block";
    document.getElementById("combat-title").innerText = `Donjon de Rang ${rank} - Salle ${currentDungeon.step + 1}/${currentDungeon.maxSteps}`;

    setupCombatInterface();
}

function generateDungeonRoom() {
    currentDungeon.step++;
    let enemyKey = "limon_e";
    if (currentDungeon.rank === "E") enemyKey = Math.random() > 0.5 ? "gobelin_e" : "loup_e";
    if (currentDungeon.rank === "D") enemyKey = Math.random() > 0.5 ? "macaque_d" : "araignee_d";

    // Si dernière étape, c'est le Boss
    if (currentDungeon.step >= currentDungeon.maxSteps) {
        if (currentDungeon.rank === "E") enemyKey = "boss_gobelin_e";
        if (currentDungeon.rank === "D") enemyKey = "boss_araignee_d";
    }

    let enemyTemplate = GAME_DATA.bestiary[enemyKey];
    currentDungeon.activeEnemies = [{
        name: enemyTemplate.name,
        hp: enemyTemplate.hp,
        maxHp: enemyTemplate.hp,
        attack: enemyTemplate.attack,
        defense: enemyTemplate.defense,
        isBoss: enemyTemplate.isBoss || false
    }];

    renderCombatEnemies();
    logCombat(`Vous entrez dans la salle ${currentDungeon.step}. Un ${enemyTemplate.name} apparaît !`);
}

function setupCombatInterface() {
    const actionsContainer = document.getElementById("combat-actions");
    actionsContainer.innerHTML = `
        <button onclick="playerAttack()">Attaquer</button>
        <button onclick="playerSkill()">Compétence / Sort</button>
        <button onclick="playerAnalyze()">Analyser</button>
        <button onclick="tryEscape()">Fuite</button>
    `;
}

function renderCombatEnemies() {
    const container = document.getElementById("combat-enemies");
    container.innerHTML = "";
    currentDungeon.activeEnemies.forEach((en, idx) => {
        container.innerHTML += `<div class="enemy-card"><strong>${en.name}</strong><br>PV : ${en.hp}/${en.maxHp}</div>`;
    });
}

function logCombat(message) {
    const logBox = document.getElementById("combat-log");
    logBox.innerHTML += `<p>${message}</p>`;
    logBox.scrollTop = logBox.scrollHeight;
}

// Actions de Combat basiques
function playerAttack() {
    let enemy = currentDungeon.activeEnemies[0];
    let damage = Math.max(5, player.stats.force - enemy.defense);
    enemy.hp -= damage;
    logCombat(`Vous attaquez ${enemy.name} et infligez ${damage} dégâts.`);

    if (enemy.hp <= 0) {
        handleVictory();
        return;
    }

    enemyTurn();
}

function enemyTurn() {
    let enemy = currentDungeon.activeEnemies[0];
    let damage = Math.max(2, enemy.attack - (player.stats.vitalite / 2));
    player.hp -= damage;
    logCombat(`${enemy.name} vous attaque et inflige ${damage} dégâts.`);
    updateHUD();

    if (player.hp <= 0) {
        handleDeath();
    }
}

function handleVictory() {
    let enemy = currentDungeon.activeEnemies[0];
    logCombat(`Victoire ! Vous avez vaincu ${enemy.name}.`);
    player.gold += 50;
    
    setTimeout(() => {
        if (currentDungeon.step < currentDungeon.maxSteps) {
            generateDungeonRoom();
        } else {
            // Fin du donjon
            player.dungeonsCleared++;
            alert(`Donjon terminé avec succès ! Total nettoyé : ${player.dungeonsCleared}`);
            document.getElementById("screen-combat").style.display = "none";
            document.getElementById("screen-hub").style.display = "block";
            updateHUD();
            renderHub();
        }
    }, 1500);
}

function handleDeath() {
    alert("Vous êtes mort au combat... Game Over.");
    location.reload();
}

// Gestion du Double Donjon (Temple de Carthénon) - Fin de la Phase 2
function triggerDoubleDungeonEvent() {
    document.getElementById("screen-hub").style.display = "none";
    document.getElementById("screen-event").style.display = "block";

    document.getElementById("event-title").innerText = "Le Double Donjon (Temple de Carthénon)";
    document.getElementById("event-description").innerText = "En explorant ce portail de rang E apparemment banal, votre groupe découvre une immense salle souterraine remplie de statues géantes. Les portes se referment soudainement. C'est le piège mortel du Double Donjon.";

    const choicesContainer = document.getElementById("event-choices");
    choicesContainer.innerHTML = "";

    const btn = document.createElement("button");
    btn.innerText = "Survivre aux règles des statues et accepter votre destin";
    btn.onclick = () => wakeUpInHospital();
    choicesContainer.appendChild(btn);
}

// Réveil à l'hôpital et passage en Phase 3 (Joueur du Système)
function wakeUpInHospital() {
    player.phase = 3;
    player.class = "joueur_systeme";
    player.freePoints = 15; // Points bonus suite à l'éveil du système
    player.hp = player.maxHp;

    document.getElementById("screen-event").style.display = "none";
    document.getElementById("screen-hub").style.display = "block";
    document.getElementById("hud").style.display = "block";

    alert("Vous vous réveillez en sursaut dans un lit d'hôpital. Une interface bleue transparente flotte devant vos yeux : [ VOUS ÊTES DEVENU UN JOUEUR ].");
    
    updateHUD();
    renderHub();
}

// Fonction de répartition des points de statistiques (Phase 3)
function addStat(statName) {
    if (player.freePoints > 0) {
        player.freePoints--;
        player.stats[statName] += 1;
        player.maxHp = player.stats.vitalite * 10;
        player.maxMp = player.stats.intelligence * 5;
        updateHUD();
    } else {
        alert("Vous n'avez pas de points libres disponibles.");
    }
}
