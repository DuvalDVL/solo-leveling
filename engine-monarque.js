// ==========================================
// ENGINE-MONARQUE.JS
// Quete d'Ascension de Monarque, declenchee au niveau 10 (Phase 3 uniquement)
// Choix guide : 2 a 3 voies proposees selon la classe, les stats et le Karma du joueur
// Depend de engine-core.js, engine-hub.js, engine-combat.js (player, afficherEcranResultat, demarrerCombat, ajouterMarqueur)
// ==========================================

const NIVEAU_MIN_ASCENSION = 10;

const MONARQUES_DATA = {
    ombres: { nom: "Monarque des Ombres", heritage: "Ashborn", description: "Extraction d'Ombre : chaque ennemi vaincu peut etre ressuscite comme allie immortel." },
    flammes_blanches: { nom: "Monarque des Flammes Blanches", heritage: "Baran", description: "Enfer Blanc : degats de zone colossaux, Brulure Inextinguible sur les boss." },
    crocs: { nom: "Monarque des Crocs", heritage: "Tarnak", description: "Transformation Bestiale : attaques multiples par tour, Saignement cumulable." },
    givre: { nom: "Monarque du Givre", heritage: "Sillad", description: "Zero Absolu : chance de geler totalement l'ennemi ou de briser son armure." },
    corps_de_fer: { nom: "Monarque du Corps de Fer", heritage: "Legia", description: "Peau de Titan : immunite aux alterations d'etat, renvoi d'une partie des degats subis." },
    fleaux: { nom: "Monarque des Fleaux", heritage: "Querehsha", description: "Nuage Toxique : Poison Mortel cumulatif, vol de vie massif sur la duree." }
};

// ------------------------------------------
// 1. DETERMINATION DES VOIES PROPOSEES (choix guide)
// ------------------------------------------
const VOIES_NATURELLES_PAR_CLASSE = {
    guerrier: ["corps_de_fer", "crocs"],
    assassin: ["crocs", "givre"],
    mage: ["flammes_blanches", "fleaux"],
    tank: ["corps_de_fer", "givre"],
    ranger: ["givre", "fleaux"]
};

function determinerVoiesProposees() {
    let voies = VOIES_NATURELLES_PAR_CLASSE[player.classe] ? VOIES_NATURELLES_PAR_CLASSE[player.classe].slice() : ["corps_de_fer", "crocs"];

    // Un Karma tres negatif ouvre systematiquement la Voie des Ombres, quelle que soit la classe
    if (player.karma <= -15 && !voies.includes("ombres")) {
        voies.push("ombres");
    }

    return voies.slice(0, 3);
}

// ------------------------------------------
// 2. DECLENCHEMENT (verifie chaque jour depuis passerJournee)
// ------------------------------------------
function verifierEveilMonarque() {
    if (!player.eveilSysteme || player.voieMonarque || player.queteMonarqueDeclenchee) return;
    if (player.niveau < NIVEAU_MIN_ASCENSION) return;

    player.queteMonarqueDeclenchee = true;
    player.voieMonarqueProposees = determinerVoiesProposees();
    sauvegarderPartie();
    declencherAppelDuMonarque();
}

const TEXTES_APPEL_MONARQUE = [
    "Une presence immense frappe soudain a la porte de votre conscience. Ce n'est plus le Systeme qui vous parle, cette fois.",
    "Des visions fragmentaires vous assaillent : des tronees, des ombres, des flammes, des crocs. Un choix approche.",
    "Le Systeme affiche un message inedit : UNE VOIE D'ASCENSION EST DISPONIBLE."
];

function declencherAppelDuMonarque() {
    switchView("view-appel-monarque");
    afficherEtapeAppelMonarque(0);
}

function afficherEtapeAppelMonarque(index) {
    if (index >= TEXTES_APPEL_MONARQUE.length) {
        afficherChoixVoieMonarque();
        return;
    }
    afficherEcranResultat(TEXTES_APPEL_MONARQUE[index], () => afficherEtapeAppelMonarque(index + 1));
}

// ------------------------------------------
// 3. CHOIX DE LA VOIE
// ------------------------------------------
function afficherChoixVoieMonarque() {
    switchView("view-appel-monarque");
    const zoneTexte = document.getElementById("appel-monarque-texte");
    if (zoneTexte) zoneTexte.textContent = "Choisissez la voie que vous allez embrasser. Ce choix est definitif.";

    const zoneChoix = document.getElementById("appel-monarque-choix");
    if (zoneChoix) {
        zoneChoix.innerHTML = "";
        player.voieMonarqueProposees.forEach(idVoie => {
            const voie = MONARQUES_DATA[idVoie];
            const bouton = document.createElement("button");
            bouton.textContent = `${voie.nom} (${voie.heritage}) - ${voie.description}`;
            bouton.onclick = () => lancerEpreuveAscension(idVoie);
            zoneChoix.appendChild(bouton);
        });
    }
}

// ------------------------------------------
// 4. EPREUVE DE L'ASCENSION (combat symbolique)
// ------------------------------------------
function lancerEpreuveAscension(idVoie) {
    afficherEcranResultat("Une manifestation de votre propre pouvoir se dresse devant vous. Pour ascensionner, vous devez la vaincre.", () => {
        combatTermineCallback = () => finaliserAscensionMonarque(idVoie);
        demarrerCombat("liche_ancestrale", { position: "avant_garde", contexte: "ascension_monarque" });
        etatCombat.fuitePossible = false;
    });
}

function finaliserAscensionMonarque(idVoie) {
    const voie = MONARQUES_DATA[idVoie];
    player.voieMonarque = idVoie;

    // Bonus de stats a l'Ascension
    Object.keys(player.stats).forEach(stat => {
        if (stat !== "pointsLibres") player.stats[stat] = Math.floor(player.stats[stat] * 1.2);
    });
    recalculerStatsDerivees();
    player.pv = player.pvMax;
    player.pm = player.pmMax;

    if (idVoie === "ombres") ajouterAInventaire("pierre_runique_ombre", 1);

    ajouterMarqueur("ascension_monarque");
    logMessage(`Ascension complete. Vous etes desormais le ${voie.nom}.`);
    sauvegarderPartie();

    afficherEcranResultat(`Vous avez ascensionne en tant que ${voie.nom}. Votre puissance n'a plus rien d'humain.`, () => {
        switchView("view-hub");
        updateUI();
    });
}
