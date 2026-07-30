// ==========================================
// MOTEUR DE JEU - PARTIE 1 : ÉTAT & GESTION
// ==========================================

// 1. ÉTAT DU JOUEUR (Modèle de base)
let player = {
    nom: "Chasseur",
    classe: "Ranger", // Sera remplacé plus tard par l'Héritage du Monarque
    rang: "E",
    niveau: 1,
    xp: 0,
    xpMax: 100,
    pv: 100,
    pvMax: 100,
    pm: 50,
    pmMax: 50,
    or: 500,
    pierresEssence: 0,
    fatigue: 0,
    loyerJoursRestants: 3,
    loyerCout: 300,
    karma: 0,
    queteQuotidienneEffectuee: false,
    compteurQuetes: 0, // Pour automatiser au bout de 3 jours
    stats: { force: 5, agilite: 5, vitalite: 5, intelligence: 5, perception: 5, pointsLibres: 0 },
    inventaire: [], // Contiendra des objets { id: "...", quantite: 1 }
    equipement: { tete: null, torse: null, mains: null, accessoire: null }
};

// 2. INITIALISATION DU JEU
function initGame() {
    loadGame(); // Tente de charger une sauvegarde existante
    updateUI(); // Met à jour l'affichage
    renderInventory(); // Dessine la grille de 12 slots
    logMessage("Système activé. Bienvenue, Joueur.");
}

// 3. MISE À JOUR DE L'INTERFACE UTILISATEUR
function updateUI() {
    // Barre Supérieure
    document.getElementById('ui-rang').textContent = player.rang;
    // On met à jour la couleur du rang
    document.getElementById('ui-rang').className = `value rang-${player.rang.toLowerCase()}`; 
    document.getElementById('ui-classe').textContent = player.classe;
    document.getElementById('ui-niveau').textContent = player.niveau;
    document.getElementById('ui-xp').textContent = `${player.xp}/${player.xpMax}`;
    document.getElementById('ui-pv').textContent = `${player.pv}/${player.pvMax}`;
    document.getElementById('ui-pm').textContent = `${player.pm}/${player.pmMax}`;
    document.getElementById('ui-or').textContent = player.or;
    document.getElementById('ui-loyer').textContent = `${player.loyerJoursRestants}j`;

    // Panneau Latéral (Tracker)
    document.getElementById('ui-fatigue').textContent = `${player.fatigue}/100`;
    
    let karmaText = "Neutre";
    if(player.karma > 20) karmaText = "Héros";
    if(player.karma < -20) karmaText = "Renégat";
    document.getElementById('ui-karma').textContent = karmaText;

    // Modale de Stats
    document.getElementById('stat-str').textContent = player.stats.force;
    document.getElementById('stat-agi').textContent = player.stats.agilite;
    document.getElementById('stat-vit').textContent = player.stats.vitalite;
    document.getElementById('stat-int').textContent = player.stats.intelligence;
    document.getElementById('stat-per').textContent = player.stats.perception;
    document.getElementById('stat-points').textContent = player.stats.pointsLibres;
}

// 4. GESTION DE L'INVENTAIRE (Empilement & Grille)
function addToInventory(itemId, quantiteAAjouter = 1) {
    const itemData = gameData.items.find(i => i.id === itemId);
    if (!itemData) return;

    if (itemData.stackable) {
        let existingItem = player.inventaire.find(i => i.id === itemId);
        if (existingItem) {
            existingItem.quantite += quantiteAAjouter;
        } else {
            if (player.inventaire.length < 12) player.inventaire.push({ id: itemId, quantite: quantiteAAjouter });
            else logMessage("Votre sac est plein !");
        }
    } else {
        if (player.inventaire.length < 12) player.inventaire.push({ id: itemId, quantite: 1 });
        else logMessage("Votre sac est plein !");
    }
    renderInventory();
    saveGame();
}

function renderInventory() {
    const bagGrid = document.querySelector('.bag-grid');
    bagGrid.innerHTML = ''; // On vide la grille existante

    // On crée exactement 12 slots
    for (let i = 0; i < 12; i++) {
        if (i < player.inventaire.length) {
            // Slot occupé
            let invItem = player.inventaire[i];
            let itemData = gameData.items.find(d => d.id === invItem.id);
            
            let slot = document.createElement('div');
            slot.className = `item-slot border-${itemData.rang.toLowerCase()}`;
            slot.onclick = () => showItemDetails(itemData);

            let img = document.createElement('img');
            img.src = itemData.image;
            img.className = "item-img img-placeholder";

            let name = document.createElement('span');
            name.className = `item-name rang-${itemData.rang.toLowerCase()}`;
            name.textContent = `(${itemData.rang}) ${itemData.nom}`;

            slot.appendChild(img);
            slot.appendChild(name);

            if (itemData.stackable && invItem.quantite > 1) {
                let stack = document.createElement('span');
                stack.className = "item-stack";
                stack.textContent = `x${invItem.quantite}`;
                slot.appendChild(stack);
            }
            bagGrid.appendChild(slot);
        } else {
            // Slot vide
            let emptySlot = document.createElement('div');
            emptySlot.className = "item-slot empty";
            bagGrid.appendChild(emptySlot);
        }
    }
}

function showItemDetails(itemData) {
    const detailBox = document.getElementById('item-details');
    detailBox.innerHTML = `
        <h4 class="item-detail-name rang-${itemData.rang.toLowerCase()}">${itemData.nom}</h4>
        <p class="item-detail-type">Type: ${itemData.type}</p>
        <p class="item-detail-desc">${itemData.description}</p>
    `;
}

// 5. LA BOUCLE QUOTIDIENNE (Le Repos)
function restNextDay() {
    player.loyerJoursRestants -= 1;
    player.fatigue = 0;
    player.pv = player.pvMax;
    player.pm = player.pmMax;
    player.queteQuotidienneEffectuee = false;

    // Gestion du Loyer
    if (player.loyerJoursRestants <= 0) {
        if (player.or >= player.loyerCout) {
            player.or -= player.loyerCout;
            player.loyerJoursRestants = 30; // Payé pour le mois
            logMessage(`Vous avez payé votre loyer de ${player.loyerCout} Or.`);
        } else {
            // Mécanique de faillite à développer
            logMessage("ALERTE : Impossible de payer le loyer. L'Association va vous expulser !");
        }
    } else {
        logMessage("Vous vous reposez. Une nouvelle journée commence.");
    }
    
    // Check de la Quête Quotidienne Automatique
    if (player.compteurQuetes >= 3) {
        // RNG pour le double quota automatique
        if (Math.random() < 0.2) {
            logMessage("Le Système vous a fait doubler votre quota pendant la nuit. Bonus obtenu !");
            player.stats.force += 1;
        }
        player.queteQuotidienneEffectuee = true;
    } else {
        logMessage("N'oubliez pas de faire votre quête quotidienne !");
    }

    updateUI();
    saveGame();
}

// 6. SYSTÈME DE SAUVEGARDE ET DE LOGS
function saveGame() {
    localStorage.setItem("soloHunterSave", JSON.stringify(player));
}

function loadGame() {
    let savedData = localStorage.getItem("soloHunterSave");
    if (savedData) {
        player = JSON.parse(savedData);
    } else {
        // Objets de départ pour tester
        addToInventory("potion_soin_e", 3);
        addToInventory("dague_emoussee", 1);
    }
}

function logMessage(msg) {
    // Si l'élément combat-log n'est pas actif, on peut faire un alert ou un toast
    // Pour l'instant, on l'affiche dans la console ou on peut créer un log général au Hub
    console.log(`[SYSTÈME] : ${msg}`);
}

// Lancement du jeu au chargement de la page
window.onload = initGame;

// ==========================================
// MOTEUR DE JEU - PARTIE 2 : EXPLORATION & COMBAT
// ==========================================

// VARIABLES D'ÉTAT DU DONJON EN COURS
let currentDonjon = {
    actif: false,
    rang: "E",
    theme: "tous",
    salleActuelle: 1,
    sallesTotales: 3,
    position: "avant_garde", // "avant_garde" ou "arriere_garde"
    ennemisActuels: [],
    alliensActuels: []
};

// ------------------------------------------
// 1. GESTION DES VUES (UI NAVIGATION)
// ------------------------------------------
function switchView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
}

// ------------------------------------------
// 2. SYSTÈME D'ÉVÉNEMENTS (PHASE 1 OU DONJON)
// ------------------------------------------
function lancerEvenementPhase1() {
    if (player.queteQuotidienneEffectuee) {
        logToCombatBox("Vous avez déjà accompli votre quête quotidienne aujourd'hui.");
        return;
    }

    // Pioche aléatoire dans le réservoir phase 1
    const pool = gameData.evenements.phase1;
    const eventRandom = pool[Math.floor(Math.random() * pool.length)];
    
    // Affichage simple de l'événement dans la fenêtre principale (ou une modale dédiée)
    let texteAction = `[QUÊTE QUOTIDIENNE]\n${eventRandom.texte}\n\n`;
    eventRandom.choix.forEach((choix, index) => {
        texteAction += `[${index + 1}] ${choix.texte}\n`;
    });

    // Pour l'exemple, on simule le premier choix ou on déclenche une résolution automatique
    choisirOptionEvenement(eventRandom.choix[0]);
}

function choisirOptionEvenement(choix) {
    if (choix.effet) {
        if (choix.effet.or) player.or += choix.effet.or;
        if (choix.effet.pv) player.pv = Math.max(0, player.pv + choix.effet.pv);
        if (choix.effet.karma) player.karma += choix.effet.karma;
        logToCombatBox(choix.effet.msg);
    }
    player.queteQuotidienneEffectuee = true;
    player.compteurQuetes += 1;
    updateUI();
    saveGame();
}

// ------------------------------------------
// 3. LANCEMENT D'UN DONJON / RAID
// ------------------------------------------
let etatCombat = {
    monstreActif: null,
    tour: 1,
    statutMonstre: null, // ex: { type: "brulure", duree: 2 }
    statutJoueur: null
};

function demarrerDonjon(rangPortail, themePortail) {
    currentDonjon.actif = true;
    currentDonjon.rang = rangPortail;
    currentDonjon.theme = themePortail;
    currentDonjon.salleActuelle = 1;
    currentDonjon.sallesTotales = (rangPortail === "S" ? 5 : 3);

    switchView('view-combat');
    logToCombatBox(`--- OUVERTURE DU PORTAIL [RANG ${rangPortail}] ---`);
    chargerSalleDonjon();
}

function chargerSalleDonjon() {
    if (currentDonjon.salleActuelle > currentDonjon.sallesTotales) {
        // Victoire finale du donjon !
        logToCombatBox("Victoire ! Le portail est nettoyé. Butins récupérés.");
        addToInventory("pierre_essence", 1);
        player.xp += 50 * currentDonjon.sallesTotales;
        currentDonjon.actif = false;
        switchView('view-hub');
        updateUI();
        return;
    }

    logToCombatBox(`--- SALLE ${currentDonjon.salleActuelle} / ${currentDonjon.sallesTotales} ---`);
    
    // On pioche un monstre correspondant au rang du donjon
    const monstresEligibles = gameData.monstres.filter(m => m.rang === currentDonjon.rang);
    if (monstresEligibles.length > 0) {
        let mobTemplate = monstresEligibles[Math.floor(Math.random() * monstresEligibles.length)];
        // Copie profonde pour éviter d'écraser la base de données
        etatCombat.monstreActif = JSON.parse(JSON.stringify(mobTemplate));
    } else {
        // Fallback par défaut
        etatCombat.monstreActif = { nom: "Monstre errant", stats: { pv: 50, attaque: 8, defense: 3, agilite: 5 } };
    }

    mettreAJourInterfaceCombat();
}

function mettreAJourInterfaceCombat() {
    const mob = etatCombat.monstreActif;
    document.getElementById('enemy-name').textContent = `(${currentDonjon.rang}) ${mob.nom} - PV: ${mob.stats.pv}`;
}

// ------------------------------------------
// 4. LE MOTEUR DE COMBAT (TOURS & ACTIONS)
// ------------------------------------------
function actionAttaquer() {
    let mob = etatCombat.monstreActif;
    
    // Calcul de dégâts de base (Force du joueur + Arme - Défense du mob)
    let degats = Math.max(1, (player.stats.force * 2) - mob.stats.defense);
    mob.stats.pv -= degats;

    logToCombatBox(`Vous attaquez ${mob.nom} et infligez ${degats} dégâts.`);

    verifierFinDeTourCombat();
}

// La Mécanique de Perception (Analyse Tactique)
function actionAnalyserPerception() {
    let jet = Math.random() * 20 + player.stats.perception; // Jet de dé + stat Perception
    
    if (jet > 30) {
        // Succès Critique (One-Shot environnemental ou gros bonus)
        logToCombatBox("RÉUSSITE CRITIQUE (Perception) : Vous repérez une faille structurelle ! Le décor s'effondre sur le monstre !");
        etatCombat.monstreActif.stats.pv = 0;
        player.xp += 50;
        player.stats.perception += 1; // Gain permanent de stat
    } else if (jet > 15) {
        // Réussite Normale (Point faible détecté -> Critique garanti au prochain tour)
        logToCombatBox("SUCCÈS : Vous détectez un angle mort. Votre prochaine attaque sera un coup critique garanti !");
        etatCombat.prochainCoupCritique = true;
    } else if (jet < 5) {
        // Échec Critique (Le joueur est distrait et prend cher)
        logToCombatBox("ÉCHEC CRITIQUE : En voulant trop observer, vous vous découvrez et prenez un coup en pleine face !");
        player.pv = Math.max(0, player.pv - 15);
    } else {
        logToCombatBox("ÉCHEC : Vous n'avez rien remarqué d'inhabituel.");
    }

    verifierFinDeTourCombat();
}

function verifierFinDeTourCombat() {
    let mob = etatCombat.monstreActif;

    // Vérification de la mort du monstre
    if (mob.stats.pv <= 0) {
        logToCombatBox(`Le monstre ${mob.nom} est vaincu !`);
        currentDonjon.salleActuelle++;
        setTimeout(chargerSalleDonjon, 1500);
        return;
    }

    // Tour de riposte du monstre
    let degatsEnnemi = Math.max(1, mob.stats.attaque - (player.stats.vitalite / 2));
    
    // Gestion du positionnement (Si arrière-garde, les dégâts sont réduits ou pris par les alliés)
    if (currentDonjon.position === "arriere_garde") {
        degatsEnnemi = Math.floor(degatsEnnemi * 0.5);
        logToCombatBox("Vos alliés en première ligne absorbent une partie de l'impact !");
    }

    player.pv = Math.max(0, player.pv - degatsEnnemi);
    logToCombatBox(`${mob.nom} contre-attaque et vous inflige ${degatsEnnemi} dégâts.`);

    if (player.pv <= 0) {
        logToCombatBox("VOUS ÊTES MORT... Le Système active une pénalité critique.");
        currentDonjon.actif = false;
        switchView('view-hub');
        player.pv = 10; // Sauvé de justesse avec pénalité
    }

    updateUI();
}

function actionFuirTrahir() {
    logToCombatBox("Vous fuyez lachement le combat ou abandonnez vos alliés ! Votre Karma diminue.");
    player.karma -= 5;
    currentDonjon.actif = false;
    switchView('view-hub');
    updateUI();
}

// ------------------------------------------
// 5. JOURNAL DE COMBAT ET LOGS VISUELS
// ------------------------------------------
function logToCombatBox(message) {
    const logBox = document.getElementById('combat-log');
    if (logBox) {
        const p = document.createElement('p');
        p.className = "log-text";
        p.textContent = `> ${message}`;
        logBox.appendChild(p);
        logBox.scrollTop = logBox.scrollHeight; // Auto-scroll vers le bas
    }
    console.log(`[LOG] ${message}`);
}
