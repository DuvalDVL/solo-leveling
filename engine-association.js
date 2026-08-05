// ==========================================
// ENGINE-ASSOCIATION.JS
// Surveillance de l'Association : controles de routine, controles declenches par des temoins,
// escalade vers le statut Criminel et la Voie du Renegat
// Depend de engine-core.js, engine-hub.js (player, sauvegarderPartie, ajouterMarqueur, logMessage, afficherEcranResultat)
// Depend de data-personnages.js, data-monstres.js, data-items.js
// ==========================================

// ------------------------------------------
// 1. VERIFICATION QUOTIDIENNE (appelee depuis passerJournee)
// Combine deux declencheurs : controle de routine (lie au niveau) et controle lie aux temoins (suspicionAssociation)
// ------------------------------------------
function verifierControleAssociation() {
    if (!player.eveilSysteme) return; // l'inspection cible surtout les progressions rapides du Systeme
    if (player.jourActuel - player.derniereVisiteAssociationJour < 3) return; // pas plus d'une visite tous les 3 jours minimum

    const chanceRoutine = Math.min(0.15, 0.01 + player.niveau * 0.004);
    const chanceTemoins = Math.min(0.5, player.suspicionAssociation * 0.08);
    const chanceTotale = Math.min(0.6, chanceRoutine + chanceTemoins);

    if (Math.random() < chanceTotale) {
        player.derniereVisiteAssociationJour = player.jourActuel;
        declencherControleAssociation();
    }
}

// ------------------------------------------
// 2. LE CONTROLE : L'INSPECTEUR SE PRESENTE
// ------------------------------------------
function declencherControleAssociation() {
    const inspecteur = personnagesData.find(p => p.id === "woo_jin_chul");
    const texte = (inspecteur ? inspecteur.description + " " : "")
        + "Un membre de la Division de Surveillance vous aborde et exige de scanner votre puissance.";

    switchView("view-controle-association");
    const zoneTexte = document.getElementById("controle-texte");
    if (zoneTexte) zoneTexte.textContent = texte;

    const possedeDissimulateur = player.inventaire.some(i => i.id === "dissimulateur_mana");
    const zoneChoix = document.getElementById("controle-choix");
    if (zoneChoix) {
        zoneChoix.innerHTML = "";

        if (possedeDissimulateur) {
            ajouterChoixControle(zoneChoix, "Presenter le Dissimulateur de Mana", () => resoudreControleAssociation("dissimulateur"));
        }
        ajouterChoixControle(zoneChoix, "Subir le test de puissance", () => resoudreControleAssociation("test"));
        ajouterChoixControle(zoneChoix, "Refuser et prendre la fuite", () => resoudreControleAssociation("fuite"));
    }
}

function ajouterChoixControle(conteneur, texte, callback) {
    const bouton = document.createElement("button");
    bouton.textContent = texte;
    bouton.onclick = callback;
    conteneur.appendChild(bouton);
}

// ------------------------------------------
// 3. RESOLUTION DU CONTROLE
// ------------------------------------------
function resoudreControleAssociation(choix) {
    if (choix === "dissimulateur") {
        player.suspicionAssociation = Math.max(0, player.suspicionAssociation - 2);
        afficherEcranResultat("Le Dissimulateur de Mana masque votre veritable niveau. L'inspecteur repart sans incident.", () => {
            switchView("view-hub");
            updateUI();
        });
        sauvegarderPartie();
        return;
    }

    if (choix === "test") {
        // Reussite basee sur le Karma : un Chasseur au comportement exemplaire attire moins l'attention
        const chanceReussite = Math.max(0.2, Math.min(0.85, 0.6 + player.karma / 100));
        if (Math.random() < chanceReussite) {
            player.suspicionAssociation = Math.max(0, player.suspicionAssociation - 1);
            afficherEcranResultat("Le test se deroule sans anicroche. Votre dossier reste vierge.", () => {
                switchView("view-hub");
                updateUI();
            });
        } else {
            escaladerSuspicion(2);
            afficherEcranResultat("Le scan revele une puissance suspecte pour votre rang officiel. Votre dossier est signale a l'Association.", () => {
                switchView("view-hub");
                updateUI();
            });
        }
        sauvegarderPartie();
        return;
    }

    if (choix === "fuite") {
        escaladerSuspicion(3);
        player.karma -= 5;
        afficherEcranResultat("Vous refusez le controle et disparaissez dans la foule. Une fuite qui n'est jamais passee inapercue.", () => {
            switchView("view-hub");
            updateUI();
        });
        sauvegarderPartie();
        return;
    }
}

// ------------------------------------------
// 4. ESCALADE VERS LE STATUT CRIMINEL ET LA VOIE DU RENEGAT
// ------------------------------------------
const SEUIL_STATUT_CRIMINEL = 6;

function escaladerSuspicion(valeur) {
    player.suspicionAssociation += valeur;

    if (!player.statutCriminel && player.suspicionAssociation >= SEUIL_STATUT_CRIMINEL) {
        player.statutCriminel = true;
        logMessage("L'Association vous declare officiellement Criminel. L'acces au Hub officiel vous est desormais ferme.");
    }
}

// Declenche une traque : l'Association envoie une escouade apres le joueur
function declencherTraqueAssociation() {
    const cibles = ["equipe_association", "inspecteur_elite"];
    const idMonstre = cibles[Math.floor(Math.random() * cibles.length)];

    logMessage("Une escouade de la Division de Surveillance vous a localise.");
    switchView("view-hub");

    combatTermineCallback = (victoire) => {
        if (victoire) {
            player.suspicionAssociation = Math.max(0, player.suspicionAssociation - 4);
            logMessage("L'escouade est neutralisee. La pression retombe, pour un temps.");
        }
        switchView("view-hub");
        updateUI();
    };
    demarrerCombat(idMonstre, { position: "avant_garde", contexte: "traque_association" });
}

// Si le joueur est deja Criminel, l'Association peut envoyer une escouade au lieu d'un simple controle
function verifierTraqueAssociation() {
    if (!player.statutCriminel) return;
    if (player.jourActuel - player.derniereVisiteAssociationJour < 4) return;

    const chanceTraque = Math.min(0.4, 0.1 + Math.abs(Math.min(0, player.karma)) / 200);
    if (Math.random() < chanceTraque) {
        player.derniereVisiteAssociationJour = player.jourActuel;
        declencherTraqueAssociation();
    }
}
