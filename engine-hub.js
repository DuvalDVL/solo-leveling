// ==========================================
// ENGINE-HUB.JS
// Phase 1 (passe civil et eveil), Hub quotidien (loyer, entrainement, quete quotidienne), Zone de Penalite
// Depend de engine-core.js (player, sauvegarderPartie, ajouterMarqueur, logMessage, switchView, updateUI, terminerPartie)
// Depend des fichiers data-evenements-phase1.js, data-monstres.js, data-items.js
// ==========================================

// ------------------------------------------
// 1. METIERS DE DEPART (Phase 1)
// ------------------------------------------
const METIERS = {
    ouvrier: { nom: "Ouvrier", statsDepart: { force: 3, vitalite: 2 }, orDepart: 250 },
    employe: { nom: "Employe", statsDepart: { intelligence: 3, perception: 1 }, orDepart: 400 },
    livreur: { nom: "Livreur", statsDepart: { agilite: 3, perception: 1 }, orDepart: 300 },
    etudiant: { nom: "Etudiant", statsDepart: { intelligence: 2, perception: 2 }, orDepart: 150 }
};

// ------------------------------------------
// 2. DEMARRAGE DE LA PHASE CIVILE
// ------------------------------------------
function demarrerPhaseCivile(nomJoueur, idMetier) {
    const metier = METIERS[idMetier];
    if (!metier) {
        logMessage("Metier inconnu.");
        return;
    }

    player.nom = nomJoueur || "Chasseur";
    player.metier = idMetier;
    player.or = metier.orDepart;
    Object.keys(metier.statsDepart).forEach(stat => {
        player.stats[stat] += metier.statsDepart[stat];
    });

    player._pileEvenementsCivils = piocherEvenementsPhase1(5);
    sauvegarderPartie();
    afficherProchainEvenementCivil();
}

function piocherEvenementsPhase1(nombre) {
    const pool = evenementsPhase1Data.slice();
    const tirage = [];
    for (let i = 0; i < nombre && pool.length > 0; i++) {
        const index = Math.floor(Math.random() * pool.length);
        tirage.push(pool.splice(index, 1)[0]);
    }
    return tirage;
}

// ------------------------------------------
// 3. RESOLUTION DES EVENEMENTS CIVILS
// ------------------------------------------
function afficherProchainEvenementCivil() {
    if (!player._pileEvenementsCivils || player._pileEvenementsCivils.length === 0) {
        declencherProtocoleEveil();
        return;
    }

    switchView("view-phase-civile");
    const evenement = player._pileEvenementsCivils[0];

    const zoneTexte = document.getElementById("civil-texte");
    if (zoneTexte) zoneTexte.textContent = evenement.texte;

    const zoneChoix = document.getElementById("civil-choix");
    if (zoneChoix) {
        zoneChoix.innerHTML = "";
        evenement.choix.forEach((choix, index) => {
            if (choix.condition && !verifierConditionStat(choix.condition)) return;
            const bouton = document.createElement("button");
            bouton.textContent = choix.texte;
            bouton.onclick = () => resoudreChoixCivil(index);
            zoneChoix.appendChild(bouton);
        });
    }
}

function verifierConditionStat(condition) {
    if (!condition || !condition.stat) return true;
    return (player.stats[condition.stat] || 0) >= condition.min;
}

function resoudreChoixCivil(indexChoix) {
    const evenement = player._pileEvenementsCivils[0];
    const choix = evenement.choix[indexChoix];
    if (!choix) return;

    appliquerEffetCivil(choix.effet, evenement.id);

    // Verification de mort pendant la phase civile (permadeath des la premiere phase)
    if (player.pv <= 0) {
        finDePartieMortPrecoce();
        return;
    }

    player._pileEvenementsCivils.shift();
    sauvegarderPartie();
    afficherProchainEvenementCivil();
}

function appliquerEffetCivil(effet, idEvenement) {
    if (!effet) return;

    if (effet.or) player.or += effet.or;
    if (effet.pv) player.pv = Math.max(0, player.pv + effet.pv);
    if (effet.pm) player.pm = Math.max(0, player.pm + effet.pm);
    if (effet.pvMax) { player.bonusPvMax = (player.bonusPvMax || 0) + effet.pvMax; recalculerStatsDerivees(); }
    if (effet.pmMax) { player.bonusPmMax = (player.bonusPmMax || 0) + effet.pmMax; recalculerStatsDerivees(); }
    if (effet.fatigue) player.fatigue = Math.max(0, Math.min(100, player.fatigue + effet.fatigue));
    if (effet.karma) player.karma += effet.karma;

    const statsPossibles = ["force", "agilite", "intelligence", "perception", "vitalite"];
    statsPossibles.forEach(stat => {
        if (effet[stat]) {
            player.stats[stat] += effet[stat];
            enregistrerAffiniteClasse(stat, effet[stat]);
        }
    });

    if (effet.item_gagne) ajouterAInventaire(effet.item_gagne, 1);
    if (effet.msg) logMessage(effet.msg);
}

// Chaque stat gagnee pendant la phase civile alimente l'affinite de la ou des classes qui en dependent
const STAT_VERS_CLASSES = {
    force: ["guerrier"],
    agilite: ["assassin", "ranger"],
    intelligence: ["mage"],
    perception: ["ranger"],
    vitalite: ["tank"]
};

function enregistrerAffiniteClasse(stat, valeur) {
    const classesConcernees = STAT_VERS_CLASSES[stat] || [];
    classesConcernees.forEach(classe => {
        player.affinitesClasse[classe] += valeur;
    });
}

function finDePartieMortPrecoce() {
    player.rang = null;
    player.classe = "Civil";
    logMessage("Votre existence s'arrete avant meme d'avoir decouvert votre pouvoir.");
    const resultat = terminerPartie("mort");
    switchView("view-fin-partie");
    return resultat;
}

// ------------------------------------------
// 4. PROTOCOLE D'EVEIL ET ATTRIBUTION DE CLASSE
// ------------------------------------------
const SEQUENCE_EVEIL = [
    "Une douleur fulgurante vous traverse le crane. Le monde vacille.",
    "Des lignes de texte bleutees apparaissent devant vos yeux, defiant toute logique.",
    "Une recherche fievreuse sur internet vous apprend que vous n'etes pas seul. D'autres ont vecu cela.",
    "Convoque par l'Association des Chasseurs, vous subissez votre premiere evaluation officielle."
];

function declencherProtocoleEveil() {
    switchView("view-eveil");
    afficherEtapeEveil(0);
}

function afficherEtapeEveil(indexEtape) {
    const zoneTexte = document.getElementById("eveil-texte");
    if (indexEtape >= SEQUENCE_EVEIL.length) {
        finaliserEveil();
        return;
    }
    if (zoneTexte) zoneTexte.textContent = SEQUENCE_EVEIL[indexEtape];

    const boutonSuivant = document.getElementById("eveil-suivant");
    if (boutonSuivant) boutonSuivant.onclick = () => afficherEtapeEveil(indexEtape + 1);
}

const STAT_PRINCIPALE_PAR_CLASSE = {
    guerrier: "force",
    assassin: "agilite",
    mage: "intelligence",
    tank: "vitalite",
    ranger: "perception"
};

const ARME_DEPART_PAR_CLASSE = {
    guerrier: "epee_rouillee",
    assassin: "dague_emoussee",
    mage: "baton_bois",
    tank: "bouclier_bois",
    ranger: "arc_chasse"
};

function finaliserEveil() {
    // Attribution de la classe selon l'affinite la plus haute accumulee en phase civile
    let classeChoisie = "guerrier";
    let scoreMax = -Infinity;
    Object.keys(player.affinitesClasse).forEach(classe => {
        if (player.affinitesClasse[classe] > scoreMax) {
            scoreMax = player.affinitesClasse[classe];
            classeChoisie = classe;
        }
    });

    player.classe = classeChoisie;
    player.rang = "E";
    player.phase = 2;

    // Bonus de stat principale a l'eveil
    const statPrincipale = STAT_PRINCIPALE_PAR_CLASSE[classeChoisie];
    player.stats[statPrincipale] += 10;

    recalculerStatsDerivees();
    player.pv = player.pvMax;
    player.pm = player.pmMax;

    ajouterAInventaire(ARME_DEPART_PAR_CLASSE[classeChoisie], 1);

    logMessage(`Vous vous eveillez en tant que ${classeChoisie}. Rang E attribue par l'Association.`);
    sauvegarderPartie();
    switchView("view-hub");
    updateUI();
}

// PV max / PM max derives de la Vitalite et de l'Intelligence, plus un bonus plat eventuel accorde par certains evenements
function recalculerStatsDerivees() {
    player.pvMax = 100 + player.stats.vitalite * 10 + (player.bonusPvMax || 0);
    player.pmMax = 50 + player.stats.intelligence * 10 + (player.bonusPmMax || 0);
}

// ------------------------------------------
// 5. HUB QUOTIDIEN - LOYER
// ------------------------------------------
function passerJournee() {
    player.jourActuel += 1;
    player.loyerJoursRestants -= 1;

    if (player.loyerJoursRestants <= 0) {
        if (player.or >= player.loyerCout) {
            player.or -= player.loyerCout;
            player.loyerJoursRestants = 7;
            logMessage(`Vous avez paye votre loyer de ${player.loyerCout} Or.`);
        } else {
            declencherExpulsion();
            return false;
        }
    }
    return true;
}

function declencherExpulsion() {
    logMessage("Impossible de payer le loyer. L'Association prononce votre expulsion. Epuise, vous disparaissez du systeme.");
    terminerPartie("mort");
    switchView("view-fin-partie");
}

// ------------------------------------------
// 6. HUB QUOTIDIEN - DORMIR
// ------------------------------------------
function actionDormir() {
    if (!passerJournee()) return;

    player.pv = player.pvMax;
    player.pm = player.pmMax;
    player.fatigue = 0;
    player.queteQuotidienneEffectuee = false;

    if (player.compteurQuetes >= 3) {
        resoudreQueteAutomatique();
    } else {
        logMessage("Une nouvelle journee commence. N'oubliez pas votre quete quotidienne.");
    }

    if (player.guildeActuelle && typeof collecterSalaireGuilde === "function") {
        collecterSalaireGuilde();
    }

    sauvegarderPartie();
    updateUI();
}

function resoudreQueteAutomatique() {
    const chanceDoublage = 0.2;
    if (Math.random() < chanceDoublage) {
        appliquerGainQueteQuotidienne(true);
        logMessage("Le Systeme a automatise votre entrainement et l'a double cette nuit.");
    } else {
        appliquerGainQueteQuotidienne(false);
    }
    player.queteQuotidienneEffectuee = true;
}

// ------------------------------------------
// 7. HUB QUOTIDIEN - ENTRAINEMENT
// ------------------------------------------
function actionEntrainer(stat) {
    if (!["force", "agilite", "intelligence", "perception", "vitalite"].includes(stat)) {
        logMessage("Statistique invalide.");
        return;
    }
    if (player.entrainements[stat] >= 3) {
        logMessage("Cette statistique a deja atteint la limite de 3 entrainements.");
        return;
    }
    if (!passerJournee()) return;

    player.stats[stat] += 1;
    player.entrainements[stat] += 1;
    recalculerStatsDerivees();

    logMessage(`Une journee d'entrainement intense porte ses fruits : +1 ${stat}.`);
    sauvegarderPartie();
    updateUI();
}

// ------------------------------------------
// 8. QUETE QUOTIDIENNE (phase d'apprentissage manuelle, jours 1 a 3)
// ------------------------------------------
function actionQueteQuotidienne(choix) {
    if (player.queteQuotidienneEffectuee) {
        logMessage("Vous avez deja rempli votre quete quotidienne aujourd'hui.");
        return;
    }

    if (choix === "faire") {
        appliquerGainQueteQuotidienne(false);
        player.queteQuotidienneEffectuee = true;
        player.compteurQuetes += 1;
    } else if (choix === "doubler") {
        appliquerGainQueteQuotidienne(true);
        player.queteQuotidienneEffectuee = true;
        player.compteurQuetes += 1;

        const chanceCoffreMaudit = 0.25;
        if (Math.random() < chanceCoffreMaudit) {
            attribuerCoffreMaudit();
        }
    } else if (choix === "ignorer") {
        entreeZonePenalite();
        return;
    }

    sauvegarderPartie();
    updateUI();
}

function appliquerGainQueteQuotidienne(doublee) {
    const statsPossibles = ["force", "agilite", "intelligence", "perception", "vitalite"];
    const statTiree = statsPossibles[Math.floor(Math.random() * statsPossibles.length)];

    player.stats[statTiree] += doublee ? 2 : 1;
    recalculerStatsDerivees();

    const coutFatigue = doublee ? 30 : 15;
    player.fatigue = Math.min(100, player.fatigue + coutFatigue);

    const soin = doublee ? 0.4 : 0.2;
    player.pv = Math.min(player.pvMax, player.pv + Math.floor(player.pvMax * soin));

    logMessage(doublee
        ? `Vous poussez votre corps a l'extreme. +2 ${statTiree}, fatigue accrue.`
        : `Vous accomplissez votre quota du jour. +1 ${statTiree}.`);
}

function attribuerCoffreMaudit() {
    const clesDisponibles = ["cle_donjon_e", "cle_donjon_d", "cle_donjon_c", "cle_donjon_b", "cle_donjon_a"];
    const rangMaxIndex = Math.min(clesDisponibles.length - 1, Math.floor(player.niveau / 8));
    const cleTiree = clesDisponibles[Math.floor(Math.random() * (rangMaxIndex + 1))];

    ajouterAInventaire(cleTiree, 1);
    logMessage("Un Coffre Maudit apparait, contenant une Cle de Donjon Instancie !");
}

// ------------------------------------------
// 9. ZONE DE PENALITE (mini-jeu de survie)
// ------------------------------------------
let etatZonePenalite = {
    active: false,
    tourActuel: 0,
    toursASurvivre: 6,
    pvAvantEntree: 0
};

function entreeZonePenalite() {
    logMessage("Vous ignorez votre quete. Le Systeme vous transfere de force vers la Zone de Penalite.");

    etatZonePenalite = {
        active: true,
        tourActuel: 0,
        toursASurvivre: 6,
        pvAvantEntree: player.pv
    };

    switchView("view-zone-penalite");
}

// Point d'entree utilise par le futur engine-combat.js lors du Cheat Death (mort en donjon)
function declencherCheatDeath(pvRestants) {
    logMessage("Le Systeme intervient in extremis. Vous echappez a la mort et etes transfere en Zone de Penalite.");
    etatZonePenalite = {
        active: true,
        tourActuel: 0,
        toursASurvivre: 6,
        pvAvantEntree: Math.max(1, pvRestants)
    };
    player.pv = etatZonePenalite.pvAvantEntree;
    switchView("view-zone-penalite");
}

function actionZonePenalite(choix) {
    if (!etatZonePenalite.active) return;

    const monstre = monstresData.find(m => m.id === "mille_pattes_desert");
    const jetEsquive = Math.random() * 20 + player.stats.agilite;

    if (choix === "esquiver") {
        if (jetEsquive > 15) {
            logMessage("Vous esquivez de justesse une attaque devastatrice.");
        } else {
            const degats = Math.floor(monstre.stats.attaque * 0.3);
            player.pv = Math.max(0, player.pv - degats);
            logMessage(`Le Mille-pattes vous touche. Vous perdez ${degats} PV.`);
        }
    } else if (choix === "soigner") {
        const objetSoin = player.inventaire.find(i => {
            const data = itemsData.find(it => it.id === i.id);
            return data && data.type === "consommable" && data.effet && data.effet.type === "soin_pv";
        });
        if (objetSoin) {
            utiliserObjet(objetSoin.id);
        } else {
            logMessage("Aucune potion disponible.");
        }
    }

    if (player.pv <= 0) {
        sortieZonePenalite(false);
        return;
    }

    etatZonePenalite.tourActuel += 1;
    if (etatZonePenalite.tourActuel >= etatZonePenalite.toursASurvivre) {
        sortieZonePenalite(true);
        return;
    }

    updateUI();
}

function sortieZonePenalite(succes) {
    etatZonePenalite.active = false;

    if (!succes) {
        logMessage("Vous succombez dans la Zone de Penalite. Votre carriere de chasseur s'acheve ici.");
        terminerPartie("mort");
        switchView("view-fin-partie");
        return;
    }

    ajouterMarqueur("zone_penalite_survecue");
    player.fatigue = Math.min(100, player.fatigue + 40);
    player.pv = Math.max(1, Math.floor(player.pv));
    logMessage("Vous survivez a la Zone de Penalite, epuise mais vivant.");

    sauvegarderPartie();
    switchView("view-hub");
    updateUI();
}

// ------------------------------------------
// 10. RETRAITE VOLONTAIRE (disponible depuis le Hub a partir d'un certain niveau)
// ------------------------------------------
const NIVEAU_MIN_RETRAITE = 15;

function actionPrendreRetraite() {
    if (player.niveau < NIVEAU_MIN_RETRAITE) {
        logMessage(`La retraite n'est possible qu'a partir du niveau ${NIVEAU_MIN_RETRAITE}.`);
        return;
    }
    logMessage("Vous raccrochez definitivement. Une carriere de chasseur s'acheve sur vos propres termes.");
    terminerPartie("retraite");
    switchView("view-fin-partie");
}

// ------------------------------------------
// 11. UTILITAIRES INVENTAIRE PARTAGES
// (version de base, engine-combat.js et engine-boutiques.js pourront l'etendre)
// ------------------------------------------
function ajouterAInventaire(idItem, quantite) {
    const donneesItem = itemsData.find(i => i.id === idItem);
    if (!donneesItem) {
        console.warn(`[SYSTEME] Item inconnu : ${idItem}`);
        return;
    }

    if (donneesItem.stackable) {
        const existant = player.inventaire.find(i => i.id === idItem);
        if (existant) {
            existant.quantite += quantite;
            return;
        }
    }

    if (player.inventaire.length >= 16) {
        logMessage("Votre sac est plein.");
        return;
    }

    player.inventaire.push({ id: idItem, quantite: quantite });
}

function utiliserObjet(idItem) {
    const donneesItem = itemsData.find(i => i.id === idItem);
    const slotInventaire = player.inventaire.find(i => i.id === idItem);
    if (!donneesItem || !slotInventaire) return;

    if (donneesItem.effet && donneesItem.effet.type === "soin_pv") {
        player.pv = Math.min(player.pvMax, player.pv + donneesItem.effet.valeur);
        logMessage(`Vous utilisez ${donneesItem.nom}. +${donneesItem.effet.valeur} PV.`);
    } else if (donneesItem.effet && donneesItem.effet.type === "soin_pm") {
        player.pm = Math.min(player.pmMax, player.pm + donneesItem.effet.valeur);
        logMessage(`Vous utilisez ${donneesItem.nom}. +${donneesItem.effet.valeur} PM.`);
    }

    slotInventaire.quantite -= 1;
    if (slotInventaire.quantite <= 0) {
        player.inventaire = player.inventaire.filter(i => i.id !== idItem);
    }

    sauvegarderPartie();
    updateUI();
    renderInventaire();
}

// ------------------------------------------
// 12. EQUIPEMENT
// ------------------------------------------
function equiperObjet(idItem) {
    const donneesItem = itemsData.find(i => i.id === idItem);
    if (!donneesItem) return;

    if (donneesItem.type === "arme_principale") player.equipement.arme = idItem;
    else if (donneesItem.type === "armure") player.equipement.armure = idItem;
    else if (donneesItem.type === "accessoire") player.equipement.accessoire = idItem;
    else return;

    logMessage(`${donneesItem.nom} equipe.`);
    sauvegarderPartie();
    updateUI();
    renderInventaire();
}

// ------------------------------------------
// 13. AFFICHAGE DE L'INVENTAIRE (modale)
// ------------------------------------------
function ouvrirInventaire() {
    const modale = document.getElementById("modal-inventaire");
    if (modale) modale.classList.add("actif");
    renderInventaire();
}

function fermerInventaire() {
    const modale = document.getElementById("modal-inventaire");
    if (modale) modale.classList.remove("actif");
}

function renderInventaire() {
    const grille = document.getElementById("bag-grid");
    if (!grille) return;
    grille.innerHTML = "";

    const tailleSac = 16;
    for (let i = 0; i < tailleSac; i++) {
        const slotHtml = document.createElement("div");

        if (i < player.inventaire.length) {
            const invItem = player.inventaire[i];
            const itemData = itemsData.find(d => d.id === invItem.id);
            if (!itemData) continue;

            slotHtml.className = `item-slot border-rang-${itemData.rang.toLowerCase()}`;
            slotHtml.onclick = () => afficherDetailObjet(itemData);

            const equipe = [player.equipement.arme, player.equipement.armure, player.equipement.accessoire].includes(itemData.id);

            slotHtml.innerHTML = `
                <img class="item-img" src="${itemData.image}" alt="${itemData.nom}">
                <span class="item-name rang-${itemData.rang.toLowerCase()}">(${itemData.rang}) ${itemData.nom}</span>
                ${itemData.stackable && invItem.quantite > 1 ? `<span class="item-stack">x${invItem.quantite}</span>` : ""}
                ${equipe ? `<span class="item-equipe">Equipe</span>` : ""}
            `;
        } else {
            slotHtml.className = "item-slot empty";
        }

        grille.appendChild(slotHtml);
    }
}

function afficherDetailObjet(itemData) {
    const zoneDetail = document.getElementById("item-details");
    if (!zoneDetail) return;

    const estEquipable = ["arme_principale", "armure", "accessoire"].includes(itemData.type);
    const estUtilisable = itemData.type === "consommable";

    zoneDetail.innerHTML = `
        <h4 class="rang-${itemData.rang.toLowerCase()}">(${itemData.rang}) ${itemData.nom}</h4>
        <p>${itemData.description}</p>
        ${estEquipable ? `<button onclick="equiperObjet('${itemData.id}')">Equiper</button>` : ""}
        ${estUtilisable ? `<button onclick="utiliserObjet('${itemData.id}')">Utiliser</button>` : ""}
    `;
}
