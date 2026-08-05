// ==========================================
// ENGINE-ARCS.JS
// Pilotage des arcs narratifs multi-jours : progression des arcs en cours, declenchement aleatoire quotidien,
// declenchement par jalon (appele depuis les fonctions concernees : fondation de guilde, etc.)
// Depend de engine-core.js, engine-hub.js, engine-donjon.js (player, afficherEcranResultat, demarrerCombat)
// Depend de data-arcs.js
// ==========================================

// ------------------------------------------
// 1. VERIFICATION QUOTIDIENNE (appelee depuis passerJournee)
// ------------------------------------------
function verifierArcsNarratifs() {
    // Progression des arcs deja en cours
    for (let i = player.arcsEnCours.length - 1; i >= 0; i--) {
        const suivi = player.arcsEnCours[i];
        if (player.jourActuel >= suivi.jourProchaineEtape) {
            declencherEtapeArc(suivi);
            return; // un seul evenement d'arc a la fois pour ne pas surcharger la journee
        }
    }

    // Declenchement aleatoire d'un nouvel arc si aucun n'est en cours
    if (player.arcsEnCours.length > 0) return;

    const candidats = arcsNarratifsData.filter(arc =>
        arc.declencheur === "aleatoire" &&
        !player.arcsTermines.includes(arc.id) &&
        (!arc.niveauMin || player.niveau >= arc.niveauMin)
    );

    for (const arc of candidats) {
        if (Math.random() < (arc.chanceParJour || 0.02)) {
            demarrerArc(arc.id);
            return;
        }
    }
}

// ------------------------------------------
// 2. DECLENCHEMENT PAR JALON (appele explicitement depuis d'autres fichiers)
// ------------------------------------------
function declencherJalonArc(idJalon) {
    const arc = arcsNarratifsData.find(a => a.declencheur === "jalon" && a.jalon === idJalon && !player.arcsTermines.includes(a.id));
    if (!arc) return;
    if (player.arcsEnCours.some(s => s.id === arc.id)) return;
    demarrerArc(arc.id);
}

function demarrerArc(idArc) {
    player.arcsEnCours.push({ id: idArc, etape: 0, jourProchaineEtape: player.jourActuel });
    sauvegarderPartie();
}

// ------------------------------------------
// 3. AFFICHAGE ET RESOLUTION D'UNE ETAPE
// ------------------------------------------
function declencherEtapeArc(suivi) {
    const arc = arcsNarratifsData.find(a => a.id === suivi.id);
    if (!arc) { retirerArc(suivi.id); return; }
    const etape = arc.etapes[suivi.etape];
    if (!etape) { terminerArc(suivi.id); return; }

    if (etape.choix) {
        afficherChoixEtapeArc(etape, suivi);
    } else {
        afficherEcranResultat(etape.texte, () => avancerEtapeArc(suivi));
    }
}

function afficherChoixEtapeArc(etape, suivi) {
    switchView("view-arc-narratif");
    const zoneTexte = document.getElementById("arc-texte");
    if (zoneTexte) zoneTexte.textContent = etape.texte;

    const zoneChoix = document.getElementById("arc-choix");
    if (zoneChoix) {
        zoneChoix.innerHTML = "";
        etape.choix.forEach(choix => {
            const bouton = document.createElement("button");
            bouton.textContent = choix.texte;
            bouton.onclick = () => resoudreChoixArc(choix, suivi);
            zoneChoix.appendChild(bouton);
        });
    }
}

function resoudreChoixArc(choix, suivi) {
    if (choix.typeAction === "combat") {
        combatTermineCallback = (victoire) => {
            if (victoire) avancerEtapeArc(suivi);
        };
        demarrerCombat(choix.monstre_id, { position: "avant_garde", contexte: "arc_narratif" });
        return;
    }

    appliquerEffetArc(choix.effet);
    afficherEcranResultat(choix.effet && choix.effet.msg ? choix.effet.msg : "Vous continuez votre chemin.", () => avancerEtapeArc(suivi));
}

function appliquerEffetArc(effet) {
    if (!effet) return;
    if (effet.or) player.or += effet.or;
    if (effet.karma) player.karma += effet.karma;
    if (effet.pv) player.pv = Math.max(0, player.pv + effet.pv);
    sauvegarderPartie();
}

function avancerEtapeArc(suivi) {
    const arc = arcsNarratifsData.find(a => a.id === suivi.id);
    const etapeActuelle = arc.etapes[suivi.etape];
    suivi.etape += 1;

    if (suivi.etape >= arc.etapes.length) {
        terminerArc(suivi.id);
    } else {
        suivi.jourProchaineEtape = player.jourActuel + (etapeActuelle.delaiProchaineEtape || 1);
        sauvegarderPartie();
    }

    switchView("view-hub");
    updateUI();
}

function terminerArc(idArc) {
    retirerArc(idArc);
    if (!player.arcsTermines.includes(idArc)) player.arcsTermines.push(idArc);
    sauvegarderPartie();
}

function retirerArc(idArc) {
    player.arcsEnCours = player.arcsEnCours.filter(s => s.id !== idArc);
}
