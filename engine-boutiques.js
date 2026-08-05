// ==========================================
// ENGINE-BOUTIQUES.JS
// Les 4 boutiques (Association, Guilde, Marche Noir, Systeme), gestion de guilde et QG du joueur
// Depend de engine-core.js, engine-hub.js (player, ajouterAInventaire, sauvegarderPartie, logMessage, ajouterMarqueur)
// Depend de data-items.js, data-guildes.js
// ==========================================

// ------------------------------------------
// 1. VALEUR DE REVENTE PAR RANG (les items n'ont pas de prix fixe individuel, valeur deduite du rang)
// ------------------------------------------
const VALEUR_VENTE_PAR_RANG = { E: 20, D: 60, C: 150, B: 400, A: 1000, S: 3000, special: 500 };
const VALEUR_ACHAT_MULTIPLICATEUR = 3; // acheter coute environ 3x la valeur de revente

function obtenirPrixAchat(item) {
    const base = VALEUR_VENTE_PAR_RANG[item.rang] || 50;
    return base * VALEUR_ACHAT_MULTIPLICATEUR;
}

function obtenirPrixVente(item) {
    return VALEUR_VENTE_PAR_RANG[item.rang] || 20;
}

// ------------------------------------------
// 2. BOUTIQUE DE L'ASSOCIATION (accessible a tous, stock lie au rang officiel)
// ------------------------------------------
function calculerStockAssociation() {
    const indexRangJoueur = ORDRE_RANGS.indexOf(player.rang || "E");
    return itemsData.filter(item => {
        const indexRangItem = ORDRE_RANGS.indexOf(item.rang);
        const estVendable = ["consommable", "materiau", "arme_principale", "armure", "accessoire"].includes(item.type);
        return estVendable && indexRangItem <= indexRangJoueur && item.rang !== "S";
    });
}

function ouvrirBoutiqueAssociation() {
    if (player.statutCriminel) {
        logMessage("Statut Criminel : l'acces a la Boutique de l'Association vous est refuse. Le Marche Noir reste ouvert.");
        return;
    }
    switchView("view-boutique-association");
    renderBoutique("association-liste", calculerStockAssociation(), "or");
}

// ------------------------------------------
// 3. BOUTIQUE DE GUILDE (contrats, salaire, recrutement)
// ------------------------------------------
function rejoindreGuilde(idGuilde) {
    const guilde = guildesData.find(g => g.id === idGuilde);
    if (!guilde) return;

    if (guilde.exigence) {
        if (guilde.exigence.niveauMin && player.niveau < guilde.exigence.niveauMin) {
            logMessage(`Niveau ${guilde.exigence.niveauMin} requis pour rejoindre ${guilde.nom}.`);
            return;
        }
        if (guilde.exigence.reputationMin && player.reputation < guilde.exigence.reputationMin) {
            logMessage(`Reputation ${guilde.exigence.reputationMin} requise pour rejoindre ${guilde.nom}.`);
            return;
        }
        if (guilde.exigence.karmaMin && player.karma < guilde.exigence.karmaMin) {
            logMessage(`${guilde.nom} exige un Karma positif.`);
            return;
        }
    }

    player.guildeActuelle = idGuilde;
    logMessage(`Vous rejoignez ${guilde.nom}.`);
    sauvegarderPartie();
}

function quitterGuilde() {
    player.guildeActuelle = null;
    logMessage("Vous quittez votre guilde.");
    sauvegarderPartie();
}

function collecterSalaireGuilde() {
    const guilde = guildesData.find(g => g.id === player.guildeActuelle);
    if (!guilde) return;

    const salaireNet = Math.floor(guilde.salaireBase * (1 - guilde.commission));
    player.or += salaireNet;
    logMessage(`Votre guilde vous verse ${salaireNet} Or (commission de ${Math.round(guilde.commission * 100)} pourcent déjà retenue).`);
}

function recruterAllie(nom, puissance, pvMax) {
    if (player.escouade.length >= 5) {
        logMessage("Votre escouade est au complet.");
        return;
    }
    player.escouade.push({ nom, puissance, pv: pvMax, pvMax, vivant: true });
    logMessage(`${nom} rejoint votre escouade.`);
    sauvegarderPartie();
}

// ------------------------------------------
// 4. LE QG DE GUILDE DU JOUEUR (money sink end-game)
// ------------------------------------------
function fonderGuildePersonnelle() {
    if (player.guildePersonnelle.fondee) {
        logMessage("Votre guilde existe déjà.");
        return;
    }
    if (ORDRE_RANGS.indexOf(player.rang) < ORDRE_RANGS.indexOf(qgGuildeJoueurData.permis.rangRequis)) {
        logMessage(`Rang ${qgGuildeJoueurData.permis.rangRequis} minimum requis pour fonder une guilde.`);
        return;
    }
    if (player.or < qgGuildeJoueurData.permis.cout) {
        logMessage("Or insuffisant pour le Permis de Guilde.");
        return;
    }

    player.or -= qgGuildeJoueurData.permis.cout;
    player.guildePersonnelle = { fondee: true, niveau: 1 };
    if (typeof declencherJalonArc === "function") declencherJalonArc("guilde_fondee");
    ajouterMarqueur("guilde_fondee");
    logMessage("Votre guilde est officiellement enregistree aupres de l'Association.");
    sauvegarderPartie();
}

function ameliorerQGGuildePersonnelle() {
    if (!player.guildePersonnelle.fondee) {
        logMessage("Vous devez d'abord fonder votre guilde.");
        return;
    }

    const niveauActuel = player.guildePersonnelle.niveau;
    const prochainPalier = qgGuildeJoueurData.paliers.find(p => p.niveau === niveauActuel + 1);
    if (!prochainPalier) {
        logMessage("Votre QG est déjà au niveau maximum.");
        return;
    }
    if (player.or < prochainPalier.cout) {
        logMessage(`Il vous manque de l'Or pour atteindre ${prochainPalier.nom}.`);
        return;
    }

    player.or -= prochainPalier.cout;
    player.guildePersonnelle.niveau = prochainPalier.niveau;
    logMessage(`Votre QG devient : ${prochainPalier.nom}.`);

    if (prochainPalier.niveau === 4) ajouterMarqueur("qg_gratte_ciel");

    sauvegarderPartie();
}

// ------------------------------------------
// 5. LE MARCHE NOIR (stock evolutif selon le Karma)
// ------------------------------------------
function calculerStockMarcheNoir() {
    const stockBase = ["faux_papiers_identite", "dissimulateur_mana"];
    const stockVIP = ["dague_empoisonnee", "dague_ombre", "crocs_jumeaux_argent"];

    let idsDisponibles = stockBase.slice();
    if (player.karma < -10) idsDisponibles = idsDisponibles.concat(stockVIP);
    if (player.karma < -40) idsDisponibles.push("dagues_monarque");

    return idsDisponibles
        .map(id => itemsData.find(i => i.id === id))
        .filter(Boolean);
}

function ouvrirMarcheNoir() {
    switchView("view-marche-noir");
    renderBoutique("marche-noir-liste", calculerStockMarcheNoir(), "or");
}

// ------------------------------------------
// 6. LA BOUTIQUE DU SYSTEME (Joueur du Systeme uniquement)
// ------------------------------------------
const VITRINE_LEGENDAIRE = ["elixir_vie", "dagues_monarque", "coeur_monarque", "pierre_runique_ombre", "cle_donjon_s"];

function calculerRotationSysteme() {
    if (player.rotationSysteme.jour !== player.jourActuel) {
        const pool = itemsData.filter(i => ["A", "B", "C"].includes(i.rang));
        const tirage = [];
        const copiePool = pool.slice();
        for (let i = 0; i < 3 && copiePool.length > 0; i++) {
            const index = Math.floor(Math.random() * copiePool.length);
            tirage.push(copiePool.splice(index, 1)[0].id);
        }
        player.rotationSysteme = { jour: player.jourActuel, items: tirage };
        sauvegarderPartie();
    }
    return player.rotationSysteme.items.map(id => itemsData.find(i => i.id === id)).filter(Boolean);
}

function ouvrirBoutiqueSysteme() {
    if (!player.eveilSysteme) {
        logMessage("Seul le Joueur du Système peut accéder a cette boutique.");
        return;
    }

    switchView("view-boutique-systeme");

    const vitrine = VITRINE_LEGENDAIRE.map(id => itemsData.find(i => i.id === id)).filter(Boolean);
    renderBoutique("systeme-vitrine", vitrine, "pierresEssence", true);

    const rotation = calculerRotationSysteme();
    renderBoutique("systeme-rotation", rotation, "or");
}

// ------------------------------------------
// 7. ACHAT / VENTE GENERIQUES
// ------------------------------------------
function acheterObjet(idItem, monnaie) {
    const item = itemsData.find(i => i.id === idItem);
    if (!item) return;

    const prix = obtenirPrixAchat(item);
    const soldeActuel = monnaie === "pierresEssence" ? player.pierresEssence : player.or;

    if (soldeActuel < prix) {
        logMessage("Fonds insuffisants.");
        return;
    }

    if (monnaie === "pierresEssence") player.pierresEssence -= prix;
    else player.or -= prix;

    ajouterAInventaire(idItem, 1);
    logMessage(`Achat : ${item.nom} pour ${prix} ${monnaie === "pierresEssence" ? "Pierres d'Essence" : "Or"}.`);
    sauvegarderPartie();
    updateUI();
}

function vendreObjet(idItem) {
    const item = itemsData.find(i => i.id === idItem);
    const slot = player.inventaire.find(i => i.id === idItem);
    if (!item || !slot) return;

    const prix = obtenirPrixVente(item);
    player.or += prix;

    slot.quantite -= 1;
    if (slot.quantite <= 0) player.inventaire = player.inventaire.filter(i => i.id !== idItem);

    logMessage(`Vente : ${item.nom} pour ${prix} Or.`);
    sauvegarderPartie();
    updateUI();
}

// ------------------------------------------
// 8. AFFICHAGE GENERIQUE D'UNE BOUTIQUE
// ------------------------------------------
function renderBoutique(idConteneur, listeItems, monnaie, achatBloqueParDefaut) {
    const conteneur = document.getElementById(idConteneur);
    if (!conteneur) return;
    conteneur.innerHTML = "";

    if (listeItems.length === 0) {
        conteneur.innerHTML = "<p>Aucun objet disponible pour le moment.</p>";
        return;
    }

    listeItems.forEach(item => {
        const bloc = document.createElement("div");
        bloc.className = `boutique-item border-rang-${item.rang.toLowerCase()}`;

        const prix = obtenirPrixAchat(item);
        bloc.innerHTML = `
            <span class="item-name rang-${item.rang.toLowerCase()}">(${item.rang}) ${item.nom}</span>
            <p>${item.description}</p>
            <span class="item-prix">${prix} ${monnaie === "pierresEssence" ? "Pierres d'Essence" : "Or"}</span>
        `;

        const bouton = document.createElement("button");
        bouton.textContent = "Acheter";
        if (achatBloqueParDefaut) {
            bouton.disabled = true;
            bouton.title = "Objet de la Vitrine Legendaire, prix eleve";
        }
        bouton.onclick = () => acheterObjet(item.id, monnaie);

        bloc.appendChild(bouton);
        conteneur.appendChild(bloc);
    });
}
