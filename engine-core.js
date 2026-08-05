// ==========================================
// ENGINE-CORE.JS
// Etat du joueur, sauvegarde, ecran titre, marqueurs d'evenements rares, fin de partie et Pantheon
// ==========================================

// ------------------------------------------
// 0. CLES DE STOCKAGE
// ------------------------------------------
const SAVE_KEY = "soloHunterSave";
const PANTHEON_KEY = "soloHunterPantheon";

// ------------------------------------------
// 1. ETAT DU JOUEUR (structure par defaut d'une nouvelle partie)
// ------------------------------------------
function creerNouveauJoueur() {
    return {
        nom: "Chasseur",
        metier: null,
        classe: null,
        phase: 1,           // 1 = passe civil, 2 = chasseur faible, 3 = joueur du systeme
        eveilSysteme: false,
        rang: null,          // attribue a la fin de la phase 1 (rang E)
        niveau: 1,
        xp: 0,
        xpMax: 100,
        pv: 100,
        pvMax: 100,
        pm: 50,
        pmMax: 50,
        or: 0,
        pierresEssence: 0,
        fatigue: 0,
        loyerJoursRestants: 7,
        loyerCout: 250,
        karma: 0,
        reputation: 0,
        jourActuel: 1,
        donjonsNettoyes: 0,
        queteQuotidienneEffectuee: false,
        compteurQuetes: 0,
        stats: { force: 0, agilite: 0, intelligence: 0, perception: 0, vitalite: 0, pointsLibres: 0 },
        affinitesClasse: { guerrier: 0, assassin: 0, mage: 0, tank: 0, ranger: 0 },
        entrainements: { force: 0, agilite: 0, intelligence: 0, perception: 0, vitalite: 0 },
        inventaire: [],
        equipement: { arme: null, armure: null, accessoire: null },
        competencesDebloquees: [],
        guildeActuelle: null,
        qgGuildeNiveau: 0,
        voieMonarque: null,
        dissimulateurActif: false,
        marqueurs: [],       // evenements rares obtenus, pour le score et le Pantheon
        dateDebutPartie: Date.now(),
        enVie: true
    };
}

let player = creerNouveauJoueur();

// ------------------------------------------
// 2. ECRAN TITRE
// ------------------------------------------
function initEcranTitre() {
    const sauvegardeExiste = localStorage.getItem(SAVE_KEY) !== null;

    const boutonContinuer = document.getElementById("btn-continuer");
    if (boutonContinuer) {
        boutonContinuer.disabled = !sauvegardeExiste;
        boutonContinuer.classList.toggle("bouton-desactive", !sauvegardeExiste);
    }

    switchView("view-titre");
}

function actionContinuerPartie() {
    if (!chargerPartie()) {
        logMessage("Aucune sauvegarde valide trouvee.");
        return;
    }
    switchView(vueSelonPhase());
    updateUI();
}

function actionNouvellePartie(confirmationDejaDonnee) {
    const sauvegardeExiste = localStorage.getItem(SAVE_KEY) !== null;
    if (sauvegardeExiste && !confirmationDejaDonnee) {
        // L'UI doit demander confirmation avant de rappeler cette fonction avec confirmationDejaDonnee = true
        return "confirmation_requise";
    }
    player = creerNouveauJoueur();
    sauvegarderPartie();
    switchView("view-creation-personnage");
}

function actionVoirRegles() {
    switchView("view-regles");
}

function actionVoirPantheon() {
    const pantheon = chargerPantheon();
    renderPantheon(pantheon);
    switchView("view-pantheon");
}

function vueSelonPhase() {
    if (player.phase === 1) return "view-phase-civile";
    return "view-hub";
}

// ------------------------------------------
// 3. SAUVEGARDE ET CHARGEMENT (partie active)
// ------------------------------------------
function sauvegarderPartie() {
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(player));
        return true;
    } catch (erreur) {
        console.error("[SYSTEME] Echec de sauvegarde :", erreur);
        return false;
    }
}

function chargerPartie() {
    const donnees = localStorage.getItem(SAVE_KEY);
    if (!donnees) return false;
    try {
        player = JSON.parse(donnees);
        return true;
    } catch (erreur) {
        console.error("[SYSTEME] Sauvegarde corrompue :", erreur);
        return false;
    }
}

function supprimerSauvegardeActive() {
    localStorage.removeItem(SAVE_KEY);
}

// Alias conserves pour compatibilite avec l'ancien script.js le temps de la migration
function saveGame() { sauvegarderPartie(); }
function loadGame() { return chargerPartie(); }

// ------------------------------------------
// 4. MARQUEURS D'EVENEMENTS RARES
// ------------------------------------------
const CATALOGUE_MARQUEURS = {
    joueur_systeme: { libelle: "Eveil du Joueur du Systeme", bonusScore: 1000 },
    double_eveil: { libelle: "Double Eveil declenche", bonusScore: 800 },
    portail_rouge_survecu: { libelle: "Portail Rouge survecu", bonusScore: 400 },
    ascension_monarque: { libelle: "Ascension de Monarque", bonusScore: 5000 },
    guilde_fondee: { libelle: "Guilde personnelle fondee", bonusScore: 500 },
    qg_gratte_ciel: { libelle: "QG de Guilde au niveau Gratte-ciel de Maitre", bonusScore: 2000 },
    boss_s_vaincu: { libelle: "Boss de rang S vaincu", bonusScore: 1500 },
    devenu_renegat: { libelle: "Statut Criminel atteint", bonusScore: 300 },
    zone_penalite_survecue: { libelle: "Zone de Penalite survecue", bonusScore: 100 },
    retraite_reussie: { libelle: "Retraite volontaire reussie", bonusScore: 1000 }
};

function ajouterMarqueur(idMarqueur) {
    if (!CATALOGUE_MARQUEURS[idMarqueur]) {
        console.warn(`[SYSTEME] Marqueur inconnu : ${idMarqueur}`);
        return;
    }
    if (!player.marqueurs.includes(idMarqueur)) {
        player.marqueurs.push(idMarqueur);
        logMessage(`Fait marquant : ${CATALOGUE_MARQUEURS[idMarqueur].libelle}`);
        sauvegarderPartie();
    }
}

// ------------------------------------------
// 5. FIN DE PARTIE ET CALCUL DU SCORE
// ------------------------------------------
const VALEUR_RANG = { E: 1, D: 2, C: 3, B: 4, A: 5, S: 6 };

function calculerScoreFinal() {
    let score = 0;
    const decomposition = [];

    const pointsNiveau = player.niveau * 100;
    score += pointsNiveau;
    decomposition.push({ libelle: "Niveau", valeur: pointsNiveau });

    const pointsRang = (VALEUR_RANG[player.rang] || 0) * 500;
    score += pointsRang;
    decomposition.push({ libelle: "Rang officiel", valeur: pointsRang });

    const pointsReputation = player.reputation * 2;
    score += pointsReputation;
    decomposition.push({ libelle: "Reputation", valeur: pointsReputation });

    const pointsPierres = player.pierresEssence * 300;
    score += pointsPierres;
    decomposition.push({ libelle: "Pierres d'Essence", valeur: pointsPierres });

    const pointsDonjons = player.donjonsNettoyes * 150;
    score += pointsDonjons;
    decomposition.push({ libelle: "Donjons nettoyes", valeur: pointsDonjons });

    const pointsJours = player.jourActuel * 5;
    score += pointsJours;
    decomposition.push({ libelle: "Jours survecus", valeur: pointsJours });

    let pointsMarqueurs = 0;
    player.marqueurs.forEach(id => {
        if (CATALOGUE_MARQUEURS[id]) pointsMarqueurs += CATALOGUE_MARQUEURS[id].bonusScore;
    });
    score += pointsMarqueurs;
    decomposition.push({ libelle: "Faits marquants", valeur: pointsMarqueurs });

    return { score, decomposition };
}

function statutKarmaFinal() {
    if (player.karma > 20) return "Heros";
    if (player.karma < -20) return "Renegat";
    return "Neutre";
}

function terminerPartie(cause) {
    // cause attendue : "mort" ou "retraite"
    if (cause === "retraite") ajouterMarqueur("retraite_reussie");
    if (statutKarmaFinal() === "Renegat" && !player.marqueurs.includes("devenu_renegat")) {
        ajouterMarqueur("devenu_renegat");
    }

    const { score, decomposition } = calculerScoreFinal();

    const entreePantheon = {
        nom: player.nom,
        classeFinale: player.voieMonarque ? `Monarque (${player.voieMonarque})` : player.classe,
        rangFinal: player.rang,
        niveauFinal: player.niveau,
        karmaFinal: statutKarmaFinal(),
        cause: cause,
        dateFin: Date.now(),
        score: score,
        decomposition: decomposition,
        marqueurs: player.marqueurs.slice()
    };

    const pantheon = chargerPantheon();
    pantheon.push(entreePantheon);
    sauvegarderPantheon(pantheon);

    player.enVie = false;
    supprimerSauvegardeActive();

    return entreePantheon;
}

// ------------------------------------------
// 6. PANTHEON (historique persistant, cle distincte de la sauvegarde active)
// ------------------------------------------
function chargerPantheon() {
    const donnees = localStorage.getItem(PANTHEON_KEY);
    if (!donnees) return [];
    try {
        return JSON.parse(donnees);
    } catch (erreur) {
        console.error("[SYSTEME] Pantheon corrompu :", erreur);
        return [];
    }
}

function sauvegarderPantheon(pantheon) {
    try {
        localStorage.setItem(PANTHEON_KEY, JSON.stringify(pantheon));
        return true;
    } catch (erreur) {
        console.error("[SYSTEME] Echec de sauvegarde du Pantheon :", erreur);
        return false;
    }
}

function renderPantheon(pantheon) {
    const conteneur = document.getElementById("pantheon-liste");
    if (!conteneur) return;

    conteneur.innerHTML = "";

    if (pantheon.length === 0) {
        conteneur.innerHTML = "<p>Aucune partie achevee pour l'instant. Le Pantheon attend son premier chasseur.</p>";
        return;
    }

    const classement = pantheon.slice().sort((a, b) => b.score - a.score);

    classement.forEach(entree => {
        const bloc = document.createElement("div");
        bloc.className = "pantheon-entree";

        const causeTexte = entree.cause === "retraite" ? "Retraite" : "Mort au combat";
        const marqueursTexte = entree.marqueurs
            .map(id => CATALOGUE_MARQUEURS[id] ? CATALOGUE_MARQUEURS[id].libelle : id)
            .join(", ");

        bloc.innerHTML = `
            <h4>${entree.nom} - ${entree.classeFinale || "Sans classe"}</h4>
            <p>Rang ${entree.rangFinal || "E"} - Niveau ${entree.niveauFinal} - Karma ${entree.karmaFinal}</p>
            <p>${causeTexte} - Score : ${entree.score}</p>
            <p class="pantheon-marqueurs">${marqueursTexte || "Aucun fait marquant enregistre"}</p>
        `;
        conteneur.appendChild(bloc);
    });
}

// ------------------------------------------
// 7. GESTION DES VUES
// ------------------------------------------
function switchView(viewId) {
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    const cible = document.getElementById(viewId);
    if (cible) cible.classList.add("active");
}

// ------------------------------------------
// 8. MISE A JOUR DE L'INTERFACE (base commune, etendue par les autres fichiers engine)
// ------------------------------------------
function updateUI() {
    const champRang = document.getElementById("ui-rang");
    if (champRang) {
        champRang.textContent = player.rang || "?";
        champRang.className = `value rang-${(player.rang || "e").toLowerCase()}`;
    }

    setTexteSiExiste("ui-classe", player.voieMonarque ? `Monarque (${player.voieMonarque})` : (player.classe || "Non eveille"));
    setTexteSiExiste("ui-niveau", player.niveau);
    setTexteSiExiste("ui-xp", `${player.xp}/${player.xpMax}`);
    setTexteSiExiste("ui-pv", `${player.pv}/${player.pvMax}`);
    setTexteSiExiste("ui-pm", `${player.pm}/${player.pmMax}`);
    setTexteSiExiste("ui-or", player.or);
    setTexteSiExiste("ui-pierres-essence", player.pierresEssence);
    setTexteSiExiste("ui-loyer", `${player.loyerJoursRestants}j`);
    setTexteSiExiste("ui-fatigue", `${player.fatigue}/100`);
    setTexteSiExiste("ui-jour", player.jourActuel);
    setTexteSiExiste("ui-karma", statutKarmaFinal());
    setTexteSiExiste("ui-reputation", player.reputation);

    setTexteSiExiste("stat-force", player.stats.force);
    setTexteSiExiste("stat-agilite", player.stats.agilite);
    setTexteSiExiste("stat-intelligence", player.stats.intelligence);
    setTexteSiExiste("stat-perception", player.stats.perception);
    setTexteSiExiste("stat-vitalite", player.stats.vitalite);
    setTexteSiExiste("stat-points-libres", player.stats.pointsLibres);
}

function setTexteSiExiste(idElement, valeur) {
    const element = document.getElementById(idElement);
    if (element) element.textContent = valeur;
}

// ------------------------------------------
// 9. JOURNAL DE MESSAGES (log simple, complete par engine-combat.js pour le journal de combat)
// ------------------------------------------
function logMessage(message) {
    console.log(`[SYSTEME] ${message}`);
    const zoneLog = document.getElementById("log-general");
    if (zoneLog) {
        const ligne = document.createElement("p");
        ligne.textContent = `> ${message}`;
        zoneLog.appendChild(ligne);
        zoneLog.scrollTop = zoneLog.scrollHeight;
    }
}

// ------------------------------------------
// 10. LANCEMENT
// ------------------------------------------
window.onload = initEcranTitre;
