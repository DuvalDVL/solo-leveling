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

// logic.js - Partie 3 : Inventaire, Boutiques, Association et Système de Sauvegarde

function showInventory() {
    const content = document.getElementById("hub-content");
    content.innerHTML = `
        <h3>Inventaire</h3>
        <div id="inventory-grid" style="display: flex; flex-direction: column; gap: 5px;"></div>
    `;
    const grid = document.getElementById("inventory-grid");
    
    if (player.inventory.length === 0) {
        grid.innerHTML = "<p>Votre inventaire est vide.</p>";
        return;
    }

    player.inventory.forEach((item, index) => {
        grid.innerHTML += `
            <div class="item-slot" style="border: 1px solid #ccc; padding: 5px; display: flex; justify-content: space-between; align-items: center;">
                <span>${item.name}</span>
                <button onclick="useItem(${index})">Utiliser</button>
            </div>
        `;
    });
}

function useItem(index) {
    let item = player.inventory[index];
    if (item.type === "consumable") {
        if (item.effect && item.effect.hp) {
            player.hp = Math.min(player.maxHp, player.hp + item.effect.hp);
            alert(`Vous utilisez ${item.name} et regagnez ${item.effect.hp} PV.`);
        }
        player.inventory.splice(index, 1);
        updateHUD();
        showInventory();
    } else {
        alert("Cet objet ne peut pas être utilisé directement ici.");
    }
}

function showShops() {
    const content = document.getElementById("hub-content");
    content.innerHTML = `
        <h3>Boutiques de l'Association</h3>
        <p>Achetez des équipements ou des consommables pour vos incursions.</p>
        <button onclick="buyItem('potion_soin_e', 50)">Acheter Potion de Soin E (50 Or)</button>
        <button onclick="buyItem('bandages', 30)">Acheter Bandages (30 Or)</button>
    `;
}

function buyItem(itemId, price) {
    if (player.gold >= price) {
        player.gold -= price;
        player.inventory.push({ 
            id: itemId, 
            name: itemId === 'potion_soin_e' ? 'Potion de Soin (E)' : 'Bandages Médicaux', 
            type: "consumable", 
            effect: itemId === 'potion_soin_e' ? { hp: 50 } : { cure: "saignement" } 
        });
        alert("Achat réussi ! L'objet a été ajouté à votre inventaire.");
        updateHUD();
    } else {
        alert("Vous n'avez pas assez d'or.");
    }
}

function showSystemShop() {
    const content = document.getElementById("hub-content");
    content.innerHTML = `
        <h3>Boutique du Système (Exclusif Phase 3)</h3>
        <p>Utilisez vos Pierres d'Essence pour acquérir des objets de légende.</p>
        <button onclick="buySystemItem('elixir_vie', 10)">Acheter Élixir de Vie (10 Pierres d'Essence)</button>
    `;
}

function buySystemItem(itemId, cost) {
    if (player.essence >= cost) {
        player.essence -= cost;
        player.inventory.push({ id: itemId, name: "Élixir de Vie", type: "legendary" });
        alert("Acquisition légendaire réussie !");
        updateHUD();
    } else {
        alert("Pierres d'Essence insuffisantes.");
    }
}

function visitAssociation() {
    const content = document.getElementById("hub-content");
    content.innerHTML = `
        <h3>Association des Chasseurs</h3>
        <p>Demandez une réévaluation officielle de votre rang pour accéder à des portails plus exigeants.</p>
        <button onclick="requestRankUp()">Demander une réévaluation (Coût : 1000 Or)</button>
    `;
}

function requestRankUp() {
    if (player.gold >= 1000) {
        player.gold -= 1000;
        player.rank = "D";
        alert("Réévaluation réussie ! L'Association valide votre passage au Rang D.");
        updateHUD();
        renderHub();
    } else {
        alert("Frais de réévaluation insuffisants (1000 Or requis).");
    }
}

function showGuild() {
    const content = document.getElementById("hub-content");
    content.innerHTML = `
        <h3>Gestion de Guilde et Escouade</h3>
        <p>Recrutez des chasseurs de soutien pour vos donjons ou rejoignez une guilde mineure.</p>
        <button onclick="alert('Vous avez contracté avec les Chiens de Garde.')">Rejoindre Les Chiens de Garde</button>
    `;
}

// Sauvegarde et Chargement local (LocalStorage)
function saveGame() {
    localStorage.setItem("solo_leveling_save", JSON.stringify(player));
    alert("Partie sauvegardée avec succès dans le stockage local !");
}

function loadGame() {
    const saved = localStorage.getItem("solo_leveling_save");
    if (saved) {
        player = JSON.parse(saved);
        updateHUD();
        document.getElementById("screen-creation").style.display = "none";
        document.getElementById("screen-event").style.display = "none";
        document.getElementById("screen-combat").style.display = "none";
        document.getElementById("screen-hub").style.display = "block";
        document.getElementById("hud").style.display = "block";
        renderHub();
        alert("Partie chargée avec succès !");
    } else {
        alert("Aucune sauvegarde trouvée.");
    }
}

// logic.js - Partie 4 : Montée de Niveau, Système d'Expérience et Ascension en Monarque

// Gain d'expérience et passage de niveau (Phase 3)
function gainExp(amount) {
    if (player.phase !== 3) return;
    player.exp += amount;
    logCombat(`Vous gagnez ${amount} points d'expérience.`);

    while (player.exp >= player.expMax) {
        player.exp -= player.expMax;
        player.level++;
        player.expMax = Math.floor(player.expMax * 1.5);
        player.freePoints += 5; // 5 points de stats libres par niveau
        
        // Restauration partielle au level up
        player.hp = player.maxHp;
        player.mp = player.maxMp;
        
        logCombat(`[ SYSTÈME ] Niveau supérieur atteint ! Vous êtes niveau ${player.level}. +5 points de statistiques libres.`);
        alert(`[ SYSTÈME ] Félicitations pour votre passage au niveau ${player.level} !`);
    }
    updateHUD();
}

// Événement d'Ascension finale : Devenir un Monarque (Endgame)
function checkMonarchAscension() {
    // Nécessite d'avoir la Clé S dans l'inventaire et un niveau élevé
    const hasKeyS = player.inventory.some(item => item.id === 'cle_s');
    if (!hasKeyS || player.level < 50) {
        alert("L'Ascension requiert la Clé S (Héritage) et d'avoir atteint au moins le niveau 50.");
        return;
    }

    const content = document.getElementById("hub-content");
    content.innerHTML = `
        <h3>Le Seuil de l'Ascension : Choisissez votre Voie de Monarque</h3>
        <p>Votre corps transcende les limites humaines. Choisissez l'héritage qui définira votre puissance cosmique :</p>
        <button onclick="chooseMonarch('ombres')">Monarque des Ombres (Ashborn - Nécromancie)</button>
        <button onclick="chooseMonarch('flammes')">Monarque des Flammes Blanches (Baran - Destruction)</button>
        <button onclick="chooseMonarch('crocs')">Monarque des Crocs (Tarnak - Férocité)</button>
        <button onclick="chooseMonarch('givre')">Monarque du Givre (Sillad - Contrôle & Gel)</button>
        <button onclick="chooseMonarch('fer')">Monarque du Corps de Fer (Legia - Invincibilité)</button>
        <button onclick="chooseMonarch('fleaux')">Monarque des Fléaux (Querehsha - Poison & Putréfaction)</button>
    `;
}

function chooseMonarch(type) {
    let monarchNames = {
        ombres: "Monarque des Ombres",
        flammes: "Monarque des Flammes Blanches",
        crocs: "Monarque des Crocs",
        givre: "Monarque du Givre",
        fer: "Monarque du Corps de Fer",
        fleaux: "Monarque des Fléaux"
    };

    player.class = `monarque_${type}`;
    alert(`[ ASCENSION RÉUSSIE ] Vous avez abandonné votre condition humaine. Vous êtes désormais le ${monarchNames[type]}. Votre puissance est absolue.`);
    updateHUD();
    renderHub();
}

