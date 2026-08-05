// ==========================================
// ENGINE-COMBAT.JS
// Combat tour par tour : actions de classe, statuts, positionnement, allies, Analyser, Double Eveil, Trahison
// Depend de engine-core.js et engine-hub.js (player, ajouterAInventaire, declencherCheatDeath, ajouterMarqueur, terminerPartie, logMessage)
// Depend de data-monstres.js et data-items.js
// ==========================================

// ------------------------------------------
// 1. ETAT DE COMBAT
// ------------------------------------------
// Callback optionnel fixe par engine-donjon.js avant demarrerCombat, appele a l'issue du combat (victoire uniquement)
let combatTermineCallback = null;

let etatCombat = {
    actif: false,
    monstre: null,
    statutsMonstre: [],       // [{ type, duree }]
    statutsJoueur: [],
    position: "avant_garde",  // "avant_garde" ou "arriere_garde"
    allies: [],                // [{ nom, pv, pvMax, puissance, vivant }]
    prochainCoupCritique: false,
    ordreTactique: null,       // "defense_absolue" ou "assaut_suicidaire"
    fuitePossible: true,
    contexte: "donjon"         // "donjon", "boss", "instancie"
};

// ------------------------------------------
// 2. DEMARRAGE D'UN COMBAT
// Appele par engine-donjon.js avec l'id du monstre et le contexte (boss = fuite bloquee)
// ------------------------------------------
function demarrerCombat(idMonstre, options = {}) {
    const modele = monstresData.find(m => m.id === idMonstre);
    if (!modele) {
        console.error(`[COMBAT] Monstre introuvable : ${idMonstre}`);
        return;
    }

    etatCombat = {
        actif: true,
        monstre: JSON.parse(JSON.stringify(modele)),
        statutsMonstre: [],
        statutsJoueur: [],
        position: options.position || "avant_garde",
        allies: options.allies || [],
        prochainCoupCritique: false,
        ordreTactique: null,
        fuitePossible: modele.type !== "boss" && modele.type !== "boss_final",
        contexte: options.contexte || "donjon"
    };

    switchView("view-combat");
    logCombat(`Un ${etatCombat.monstre.nom} (Rang ${etatCombat.monstre.rang}) surgit devant vous.`, "info");
    genererBoutonsAction();
    mettreAJourInterfaceCombat();
}

// ------------------------------------------
// 3. ACTIONS DISPONIBLES SELON LA CLASSE ET L'ARME EQUIPEE
// ------------------------------------------
const ACTION_SIGNATURE_PAR_CLASSE = {
    guerrier: { id: "lame_lourde", statPrincipale: "force", multiplicateur: 2.2, texteDefaut: "Frapper lourdement" },
    assassin: { id: "frappe_furtive", statPrincipale: "agilite", multiplicateur: 2.0, texteDefaut: "Poignarder maladroitement", critiqueBonus: 0.2 },
    mage: { id: "sortilege", statPrincipale: "intelligence", multiplicateur: 2.6, texteDefaut: "Incanter un sort", coutPM: 20 },
    tank: { id: "posture_inebranlable", statPrincipale: "vitalite", multiplicateur: 1.5, texteDefaut: "Se mettre en garde", riposte: true },
    ranger: { id: "tir_precision", statPrincipale: "perception", multiplicateur: 2.1, texteDefaut: "Decocher une fleche", ignoreArmure: 0.3 }
};

function genererBoutonsAction() {
    const zoneActions = document.getElementById("combat-actions");
    if (!zoneActions) return;
    zoneActions.innerHTML = "";

    const actionClasse = ACTION_SIGNATURE_PAR_CLASSE[player.classe] || ACTION_SIGNATURE_PAR_CLASSE.guerrier;
    const arme = itemsData.find(i => i.id === player.equipement.arme);
    const texteBouton = arme && arme.competence_texte ? arme.competence_texte : actionClasse.texteDefaut;

    ajouterBoutonAction(zoneActions, texteBouton, () => resoudreActionSignature());
    ajouterBoutonAction(zoneActions, "Defense", () => resoudreDefense());
    ajouterBoutonAction(zoneActions, "Analyser / Observer", () => resoudreAnalyse());

    player.competencesDebloquees.forEach(idCompetence => {
        const pierre = itemsData.find(i => i.type === "pierre_runique" && i.competence && i.competence.id === idCompetence);
        if (pierre) {
            ajouterBoutonAction(zoneActions, pierre.competence.id, () => resoudreCompetenceApprise(pierre));
        }
    });

    if (etatCombat.fuitePossible) {
        ajouterBoutonAction(zoneActions, "Fuir / Trahir", () => resoudreFuiteOuTrahison());
    }
}

function ajouterBoutonAction(conteneur, texte, callback) {
    const bouton = document.createElement("button");
    bouton.textContent = texte;
    bouton.onclick = callback;
    conteneur.appendChild(bouton);
}

// ------------------------------------------
// 4. RESOLUTION DES ACTIONS DU JOUEUR
// ------------------------------------------
function resoudreActionSignature() {
    if (statutBloqueLeTour(etatCombat.statutsJoueur)) {
        logCombat("Vous etes incapable d'agir ce tour-ci.", "statut");
        finTourJoueur();
        return;
    }

    const actionClasse = ACTION_SIGNATURE_PAR_CLASSE[player.classe] || ACTION_SIGNATURE_PAR_CLASSE.guerrier;

    if (actionClasse.coutPM && player.pm < actionClasse.coutPM) {
        logCombat("Mana insuffisant pour lancer ce sort.", "info");
        return;
    }
    if (actionClasse.coutPM) player.pm -= actionClasse.coutPM;

    const { degats, critique } = calculerDegatsJoueur(actionClasse);
    appliquerDegatsAuMonstre(degats, critique);

    const arme = itemsData.find(i => i.id === player.equipement.arme);
    if (arme && arme.statut_applique && Math.random() < arme.statut_applique.chance) {
        appliquerStatut(etatCombat.statutsMonstre, arme.statut_applique.type, arme.statut_applique.duree);
        logCombat(`${etatCombat.monstre.nom} est affecte par ${arme.statut_applique.type}.`, "statut");
    }

    finTourJoueur();
}

function calculerDegatsJoueur(actionClasse) {
    const armeStats = obtenirStatsArmeEquipee();
    const valeurStat = player.stats[actionClasse.statPrincipale] + (armeStats[actionClasse.statPrincipale] || 0);

    let degatsBase = valeurStat * actionClasse.multiplicateur;

    if (actionClasse.ignoreArmure) {
        degatsBase -= etatCombat.monstre.stats.defense * (1 - actionClasse.ignoreArmure);
    } else {
        degatsBase -= etatCombat.monstre.stats.defense * 0.6;
    }

    // Positionnement : degats melee reduits de moitie en arriere-garde, sauf Mage/Ranger (distance)
    const classeADistance = ["mage", "ranger"].includes(player.classe);
    if (etatCombat.position === "arriere_garde" && !classeADistance) {
        degatsBase *= 0.5;
    }

    let critique = etatCombat.prochainCoupCritique;
    etatCombat.prochainCoupCritique = false;

    const chanceCritiqueBase = 0.1 + (actionClasse.critiqueBonus || 0);
    if (!critique && Math.random() < chanceCritiqueBase) critique = true;

    if (critique) degatsBase *= 2;

    return { degats: Math.max(1, Math.floor(degatsBase)), critique };
}

function obtenirStatsArmeEquipee() {
    const arme = itemsData.find(i => i.id === player.equipement.arme);
    return (arme && arme.stats) ? arme.stats : {};
}

function appliquerDegatsAuMonstre(degats, critique) {
    etatCombat.monstre.stats.pv -= degats;
    logCombat(
        critique ? `Coup critique ! Vous infligez ${degats} dégâts.` : `Vous infligez ${degats} dégâts.`,
        critique ? "critique" : "degats"
    );
}

function resoudreDefense() {
    appliquerStatut(etatCombat.statutsJoueur, "defense", 1);
    logCombat("Vous vous mettez en garde, reduisant les dégâts du prochain tour.", "info");
    finTourJoueur();
}

// ------------------------------------------
// 5. ANALYSER / OBSERVER (mecanique de Perception)
// Resolution cachee : aucun pourcentage affiche, retour narratif uniquement
// ------------------------------------------
function resoudreAnalyse() {
    const jet = Math.random() * 20 + player.stats.perception;

    if (jet > 30) {
        logCombat("Vous repérez une faille structurelle. Le decor s'effondre sur le monstre !", "critique");
        etatCombat.monstre.stats.pv = 0;
        player.xp += 50;
        player.stats.perception += 1;
    } else if (jet > 15) {
        logCombat("Vous detectez un angle mort. Votre prochaine attaque sera un coup critique garanti.", "info");
        etatCombat.prochainCoupCritique = true;
    } else if (jet < 5) {
        logCombat("Trop concentre, vous vous exposez et encaissez un coup en pleine face.", "statut");
        player.pv = Math.max(0, player.pv - 15);
        appliquerStatut(etatCombat.statutsJoueur, "vulnerable", 1);
    } else {
        logCombat("Vous n'observez rien d'exploitable.", "info");
    }

    finTourJoueur();
}

// ------------------------------------------
// 6. COMPETENCES DE PIERRES RUNIQUES
// ------------------------------------------
function resoudreCompetenceApprise(pierre) {
    const id = pierre.competence.id;

    if (id === "sprint") {
        appliquerStatut(etatCombat.statutsJoueur, "esquive_renforcee", 1);
        player.fatigue = Math.min(100, player.fatigue + (pierre.competence.cout.fatigue || 15));
        logCombat("Vous accelerez soudainement, votre esquive est renforcee ce tour.", "info");
    } else if (id === "camouflage") {
        player.pm -= pierre.competence.cout.pm || 0;
        etatCombat.prochainCoupCritique = true;
        logCombat("Vous vous fondez dans l'ombre. Votre prochain coup sera critique.", "info");
    } else if (id === "coup_lourd") {
        const coutPM = Math.floor(player.pmMax * (pierre.competence.cout.pmPourcent || 0.3));
        if (player.pm < coutPM) {
            logCombat("Mana insuffisant pour ce Coup Lourd.", "info");
            return;
        }
        player.pm -= coutPM;
        const degats = Math.floor(player.stats.force * 3);
        etatCombat.monstre.stats.pv -= degats;
        etatCombat.monstre.stats.defense = Math.max(0, etatCombat.monstre.stats.defense - 10);
        logCombat(`Coup Lourd ! ${degats} dégâts et armure de l'ennemi endommagee.`, "critique");
    } else if (id === "soin_groupe") {
        player.pm -= pierre.competence.cout.pm || 40;
        player.pv = Math.min(player.pvMax, player.pv + Math.floor(player.pvMax * 0.3));
        etatCombat.allies.forEach(allie => { allie.pv = Math.min(allie.pvMax, allie.pv + Math.floor(allie.pvMax * 0.3)); });
        logCombat("Une vague de soin restaure votre groupe.", "soin");
    } else if (id === "extraction_ombre") {
        logCombat("Réservée a l'Ascension du Monarque des Ombres, non disponible avant l'Endgame.", "info");
        return;
    }

    finTourJoueur();
}

// ------------------------------------------
// 7. FUITE ET TRAHISON
// ------------------------------------------
function resoudreFuiteOuTrahison() {
    if (etatCombat.allies.length > 0) {
        logCombat("Vous fermez la porte et abandonnez votre escouade a son sort.", "statut");
        player.karma -= 20;
        if (!player.marqueurs.includes("devenu_renegat") && player.karma < -20) ajouterMarqueur("devenu_renegat");
    } else {
        logCombat("Vous fuyez le combat.", "info");
        player.karma -= 5;
    }

    etatCombat.actif = false;
    switchView("view-hub");
    updateUI();
}

// ------------------------------------------
// 8. ORDRES TACTIQUES (si le joueur dirige une escouade)
// ------------------------------------------
function donnerOrdreTactique(type) {
    if (etatCombat.allies.length === 0) {
        logCombat("Aucune escouade a diriger pour l'instant.", "info");
        return;
    }
    etatCombat.ordreTactique = type;
    logCombat(type === "defense_absolue"
        ? "Ordre donne : Défense Absolue. Vos allies encaissent, dégâts de zone reduits."
        : "Ordre donne : Assaut Suicidaire. Vos allies doublent leurs dégâts mais perdent toute esquive.", "info");
}

// ------------------------------------------
// 9. PHASE DES ALLIES (resolution automatique groupee)
// ------------------------------------------
function resoudrePhaseAllies() {
    const alliesVivants = etatCombat.allies.filter(a => a.vivant);
    if (alliesVivants.length === 0) return;

    let degatsTotal = alliesVivants.reduce((total, allie) => total + allie.puissance, 0);
    if (etatCombat.ordreTactique === "assaut_suicidaire") degatsTotal *= 2;
    if (etatCombat.ordreTactique === "defense_absolue") degatsTotal = 0;

    if (degatsTotal > 0) {
        etatCombat.monstre.stats.pv -= degatsTotal;
        logCombat(`Votre escouade lance un assaut coordonne et inflige ${degatsTotal} dégâts.`, "degats");
    }
}

// ------------------------------------------
// 10. FIN DE TOUR : STATUTS, RIPOSTE, VERIFICATION DE VICTOIRE/DEFAITE
// ------------------------------------------
function finTourJoueur() {
    resoudrePhaseAllies();

    if (etatCombat.monstre.stats.pv <= 0) {
        remporterCombat();
        return;
    }

    appliquerStatutsDeDegats(etatCombat.statutsMonstre, etatCombat.monstre, `${etatCombat.monstre.nom}`);
    if (etatCombat.monstre.stats.pv <= 0) {
        remporterCombat();
        return;
    }

    resoudreRiposteEnnemie();
    appliquerStatutsDeDegats(etatCombat.statutsJoueur, player, "Vous");

    if (player.pv <= 0) {
        gererMortPotentielle();
        return;
    }

    reduireDureeStatuts(etatCombat.statutsJoueur);
    reduireDureeStatuts(etatCombat.statutsMonstre);
    genererBoutonsAction();
    mettreAJourInterfaceCombat();
    updateUI();
}

function resoudreRiposteEnnemie() {
    if (statutBloqueLeTour(etatCombat.statutsMonstre)) {
        logCombat(`${etatCombat.monstre.nom} est incapable d'agir.`, "statut");
        return;
    }

    let degats = Math.max(1, etatCombat.monstre.stats.attaque - Math.floor(player.stats.vitalite / 2));

    if (etatCombat.position === "arriere_garde" && etatCombat.allies.some(a => a.vivant)) {
        degats = Math.floor(degats * 0.2);
        logCombat("Vos allies en première ligne absorbent l'essentiel du choc.", "info");
    } else if (etatCombat.position === "avant_garde") {
        degats = Math.floor(degats * (etatCombat.allies.some(a => a.vivant) ? 0.8 : 1));
    }

    if (statutPresent(etatCombat.statutsJoueur, "defense")) degats = Math.floor(degats * 0.5);

    player.pv = Math.max(0, player.pv - degats);
    logCombat(`${etatCombat.monstre.nom} contre-attaque et inflige ${degats} dégâts.`, "degats");

    // Statut applique par le monstre si defini
    if (etatCombat.monstre.statutInflige && Math.random() < etatCombat.monstre.statutInflige.chance) {
        appliquerStatut(etatCombat.statutsJoueur, etatCombat.monstre.statutInflige.type, etatCombat.monstre.statutInflige.duree);
        logCombat(`Vous etes affecte par ${etatCombat.monstre.statutInflige.type}.`, "statut");
    }
}

// ------------------------------------------
// 11. GESTION DES STATUTS ALTERES
// ------------------------------------------
function appliquerStatut(liste, type, duree) {
    const existant = liste.find(s => s.type === type);
    if (existant) {
        existant.duree = Math.max(existant.duree, duree);
    } else {
        liste.push({ type, duree });
    }
}

function statutPresent(liste, type) {
    return liste.some(s => s.type === type);
}

function statutBloqueLeTour(liste) {
    return liste.some(s => s.type === "etourdissement" || s.type === "gel");
}

function appliquerStatutsDeDegats(liste, cible, nomAffiche) {
    liste.forEach(statut => {
        if (statut.type === "brulure" || statut.type === "poison" || statut.type === "saignement" || statut.type === "saignement_mortel") {
            const degatsStatut = statut.type === "saignement_mortel" ? 40 : 15;
            cible.stats ? (cible.stats.pv -= degatsStatut) : (cible.pv = Math.max(0, cible.pv - degatsStatut));
            logCombat(`${nomAffiche} subit ${degatsStatut} dégâts de ${statut.type}.`, "statut");
        }
        if (statut.type === "confusion" && Math.random() < 0.5) {
            const autoDegats = Math.floor((cible.stats ? cible.stats.attaque : 20) * 0.5);
            cible.stats ? (cible.stats.pv -= autoDegats) : (cible.pv = Math.max(0, cible.pv - autoDegats));
            logCombat(`${nomAffiche}, confus, s'attaque soi-même pour ${autoDegats} dégâts.`, "statut");
        }
    });
}

function reduireDureeStatuts(liste) {
    for (let i = liste.length - 1; i >= 0; i--) {
        liste[i].duree -= 1;
        if (liste[i].duree <= 0) liste.splice(i, 1);
    }
}

// ------------------------------------------
// 12. GESTION DE LA MORT POTENTIELLE : DOUBLE EVEIL ET CHEAT DEATH
// ------------------------------------------
const CHANCE_DOUBLE_EVEIL = 0.03;
const CHANCE_CHEAT_DEATH = 0.05;

function gererMortPotentielle() {
    if (Math.random() < CHANCE_DOUBLE_EVEIL) {
        declencherDoubleEveil();
        return;
    }

    if (etatCombat.contexte !== "zone_penalite" && Math.random() < CHANCE_CHEAT_DEATH) {
        etatCombat.actif = false;
        declencherCheatDeath(1);
        return;
    }

    logCombat("Le coup est fatal.", "degats");
    terminerPartie("mort");
    switchView("view-fin-partie");
}

function declencherDoubleEveil() {
    logCombat("ANOMALIE DETECTEE : Double Éveil en cours...", "critique");

    player.pv = player.pvMax;
    player.pm = player.pmMax;

    const ordreRangs = ["E", "D", "C", "B", "A", "S"];
    const indexActuel = ordreRangs.indexOf(player.rang);
    if (indexActuel >= 0 && indexActuel < ordreRangs.length - 1) {
        player.rang = ordreRangs[indexActuel + 1];
    }

    Object.keys(player.stats).forEach(stat => {
        if (stat !== "pointsLibres") player.stats[stat] = Math.floor(player.stats[stat] * 1.3);
    });
    recalculerStatsDerivees();

    etatCombat.monstre.stats.pv = 0;
    ajouterMarqueur("double_eveil");

    logCombat("Vos statistiques explosent. Le monstre est pulverise instantanement.", "critique");
    remporterCombat();
}

// ------------------------------------------
// 13. VICTOIRE ET BUTIN
// ------------------------------------------
function remporterCombat() {
    etatCombat.actif = false;
    logCombat(`${etatCombat.monstre.nom} est vaincu.`, "info");

    const xpGagne = 20 * (["E", "D", "C", "B", "A", "S"].indexOf(etatCombat.monstre.rang) + 1);
    gainerXP(xpGagne);

    (etatCombat.monstre.loot || []).forEach(entree => {
        if (Math.random() < entree.chance) {
            if (entree.item === "or") {
                player.or += entree.quantite;
            } else {
                ajouterAInventaire(entree.item, entree.quantite);
            }
        }
    });

    if (etatCombat.monstre.type === "boss") player.donjonsNettoyes += 0; // le comptage complet du donjon reste gere par engine-donjon.js
    if (etatCombat.monstre.rang === "S" && etatCombat.monstre.type !== "boss_final") ajouterMarqueur("boss_s_vaincu");

    sauvegarderPartie();

    if (typeof combatTermineCallback === "function") {
        const callback = combatTermineCallback;
        combatTermineCallback = null;
        callback(true);
    } else {
        switchView("view-hub");
    }
    updateUI();
}

// ------------------------------------------
// 14. EXPERIENCE ET NIVEAU
// ------------------------------------------
function gainerXP(quantite) {
    player.xp += quantite;
    while (player.xp >= player.xpMax) {
        player.xp -= player.xpMax;
        monterNiveau();
    }
}

function monterNiveau() {
    player.niveau += 1;
    player.xpMax = Math.floor(player.xpMax * 1.15);

    if (player.phase === 3) {
        player.stats.pointsLibres += 3;
    } else {
        const statPrincipale = STAT_PRINCIPALE_PAR_CLASSE[player.classe] || "force";
        player.stats[statPrincipale] += 1;
    }

    recalculerStatsDerivees();
    player.pv = player.pvMax;
    player.pm = player.pmMax;

    logMessage(`Niveau ${player.niveau} atteint.`);
}

// ------------------------------------------
// 15. INTERFACE ET JOURNAL DE COMBAT
// ------------------------------------------
function mettreAJourInterfaceCombat() {
    const nomEnnemi = document.getElementById("enemy-name");
    if (nomEnnemi) nomEnnemi.textContent = `(${etatCombat.monstre.rang}) ${etatCombat.monstre.nom} - PV : ${Math.max(0, etatCombat.monstre.stats.pv)}`;
}

// Journal de combat colore : type = "degats" (rouge), "soin" (vert), "statut" (jaune/orange), "critique" (violet), "info" (bleu)
function logCombat(message, type) {
    console.log(`[COMBAT] ${message}`);
    const zoneLog = document.getElementById("combat-log");
    if (!zoneLog) return;

    const ligne = document.createElement("p");
    ligne.className = `log-text log-${type || "info"}`;
    ligne.textContent = `> ${message}`;
    zoneLog.appendChild(ligne);
    zoneLog.scrollTop = zoneLog.scrollHeight;
}

// ------------------------------------------
// 16. POSITIONNEMENT (appele avant l'entree en combat de groupe)
// ------------------------------------------
function choisirPositionnement(position) {
    if (position !== "avant_garde" && position !== "arriere_garde") return;
    etatCombat.position = position;
    logCombat(position === "avant_garde"
        ? "Vous prenez la ligne de front."
        : "Vous restez en retrait, protège par vos allies.", "info");
}
