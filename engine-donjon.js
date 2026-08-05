// ==========================================
// ENGINE-DONJON.JS
// Generation procedurale des portails, exploration de salles, Salle du Boss, Portail Rouge, Double Donjon (declencheur Phase 3)
// Depend de engine-core.js, engine-hub.js, engine-combat.js
// Depend de data-monstres.js, data-evenements-donjon.js, data-items.js
// ==========================================

// ------------------------------------------
// 1. ETAT DU DONJON EN COURS
// ------------------------------------------
let currentDonjon = {
    actif: false,
    id: null,
    nom: "",
    rang: "E",
    theme: "tous",
    rouge: false,
    instancie: false,
    salleActuelle: 1,
    sallesTotales: 3,
    typeSpecial: null   // "double_donjon" pour l'evenement scenarise de la Phase 2
};

const ORDRE_RANGS = ["E", "D", "C", "B", "A", "S"];
const THEMES_DISPONIBLES = ["grotte", "foret", "ruines", "temple"];

// Seuil aleatoire (4 ou 5 donjons nettoyes en Phase 2) avant le declenchement du Double Donjon
let seuilDoubleDonjon = null;

// ------------------------------------------
// 2. GENERATION DES PORTAILS PROPOSES AU HUB
// ------------------------------------------
function genererPortails() {
    // Declenchement prioritaire du Double Donjon si le seuil Phase 2 est atteint
    if (player.phase === 2 && doubleDonjonDoitSeDeclencher()) {
        return [{ id: "double_donjon", nom: "Portail Instable", rang: player.rang, theme: "temple", rouge: false, special: "double_donjon" }];
    }

    const nombrePortails = 2 + Math.floor(Math.random() * 2); // 2 ou 3
    const portails = [];

    for (let i = 0; i < nombrePortails; i++) {
        const rangPortail = tirerRangPortail();
        const theme = THEMES_DISPONIBLES[Math.floor(Math.random() * THEMES_DISPONIBLES.length)];
        const rouge = Math.random() < 0.02;

        portails.push({
            id: `portail_${Date.now()}_${i}`,
            nom: genererNomPortail(theme, rangPortail),
            rang: rangPortail,
            theme: theme,
            rouge: rouge
        });
    }

    return portails;
}

function doubleDonjonDoitSeDeclencher() {
    if (seuilDoubleDonjon === null) {
        seuilDoubleDonjon = 4 + Math.floor(Math.random() * 2); // 4 ou 5
    }
    return player.donjonsNettoyes >= seuilDoubleDonjon && !player.eveilSysteme;
}

function tirerRangPortail() {
    const indexRangJoueur = ORDRE_RANGS.indexOf(player.rang || "E");
    const optionsIndex = [indexRangJoueur];
    if (indexRangJoueur > 0) optionsIndex.push(indexRangJoueur - 1);
    if (Math.random() < 0.1 && indexRangJoueur < ORDRE_RANGS.length - 1) optionsIndex.push(indexRangJoueur + 1);

    const choix = optionsIndex[Math.floor(Math.random() * optionsIndex.length)];
    return ORDRE_RANGS[Math.max(0, choix)];
}

const NOMS_PORTAILS = {
    grotte: ["Caverne Suintante", "Gouffre Oublie", "Abysses de Pierre"],
    foret: ["Bois Corrompu", "Foret Silencieuse", "Sous-bois Maudit"],
    ruines: ["Ruines Effondrees", "Cite Ensevelie", "Vestiges Antiques"],
    temple: ["Temple Scelle", "Sanctuaire Perdu", "Crypte du Silence"]
};

function genererNomPortail(theme, rang) {
    const liste = NOMS_PORTAILS[theme] || ["Portail Inconnu"];
    const nom = liste[Math.floor(Math.random() * liste.length)];
    return `${nom} (Rang ${rang})`;
}

// ------------------------------------------
// 3. ENTREE DANS UN DONJON
// ------------------------------------------
let positionSelectionnee = "avant_garde";

function choisirPositionAvantEntree(position) {
    positionSelectionnee = position;
    const boutonAvant = document.getElementById("btn-position-avant");
    const boutonArriere = document.getElementById("btn-position-arriere");
    if (boutonAvant) boutonAvant.classList.toggle("actif", position === "avant_garde");
    if (boutonArriere) boutonArriere.classList.toggle("actif", position === "arriere_garde");
}

function afficherMenuPortails() {
    switchView("view-portails");
    const portails = genererPortails();
    const conteneur = document.getElementById("portails-liste");
    if (!conteneur) return;
    conteneur.innerHTML = "";

    portails.forEach(portail => {
        const bloc = document.createElement("div");
        bloc.className = `portail-carte${portail.rouge ? " portail-rouge" : ""}`;
        bloc.innerHTML = `
            <h4>${portail.nom}</h4>
            <p>${portail.special === "double_donjon" ? "Une anomalie instable et inconnue." : `Environnement : ${portail.theme}`}</p>
        `;
        const bouton = document.createElement("button");
        bouton.textContent = portail.special === "double_donjon" ? "Entrer (danger inconnu)" : "Entrer dans le portail";
        bouton.onclick = () => demarrerDonjon(portail, positionSelectionnee);
        bloc.appendChild(bouton);
        conteneur.appendChild(bloc);
    });
}

function demarrerDonjon(portail, positionChoisie) {
    if (portail.special === "double_donjon") {
        demarrerDoubleDonjon();
        return;
    }

    currentDonjon = {
        actif: true,
        id: portail.id,
        nom: portail.nom,
        rang: portail.rang,
        theme: portail.theme,
        rouge: portail.rouge,
        instancie: false,
        salleActuelle: 1,
        sallesTotales: portail.rang === "S" ? 5 : (3 + Math.floor(Math.random() * 2)),
        typeSpecial: null
    };

    choisirPositionnement(positionChoisie || "avant_garde");

    switchView("view-donjon");
    logMessage(`Ouverture du portail : ${portail.nom}${portail.rouge ? " -- PORTAIL ROUGE, la fuite est impossible" : ""}.`);

    if (portail.rouge) etatCombat.fuitePossible = false;

    chargerSalleDonjon();
}

// Cle de donjon instancie : exploration solo, loot exclusif
function demarrerDonjonInstancie(idCle) {
    const cle = itemsData.find(i => i.id === idCle);
    if (!cle) return;

    const slot = player.inventaire.find(i => i.id === idCle);
    if (!slot) {
        logMessage("Vous ne possedez pas cette cle.");
        return;
    }

    const rangDonjon = cle.effet && cle.effet.rang ? cle.effet.rang : "E";

    slot.quantite -= 1;
    if (slot.quantite <= 0) player.inventaire = player.inventaire.filter(i => i.id !== idCle);

    currentDonjon = {
        actif: true,
        id: `instancie_${idCle}`,
        nom: `Donjon Instancie (Rang ${rangDonjon})`,
        rang: rangDonjon,
        theme: "tous",
        rouge: false,
        instancie: true,
        salleActuelle: 1,
        sallesTotales: 3,
        typeSpecial: null
    };

    switchView("view-donjon");
    logMessage("Vous penetrez seul dans le Donjon Instancie.");
    chargerSalleDonjon();
}

// ------------------------------------------
// 4. CHARGEMENT DES SALLES
// ------------------------------------------
function chargerSalleDonjon() {
    if (currentDonjon.salleActuelle > currentDonjon.sallesTotales) {
        chargerSalleBoss();
        return;
    }

    logMessage(`--- Salle ${currentDonjon.salleActuelle} / ${currentDonjon.sallesTotales} ---`);

    const evenementsEligibles = filtrerEvenementsDonjon();
    if (evenementsEligibles.length === 0) {
        lancerCombatDeSalle();
        return;
    }

    const evenement = evenementsEligibles[Math.floor(Math.random() * evenementsEligibles.length)];
    afficherEvenementDonjon(evenement);
}

function filtrerEvenementsDonjon() {
    const rangIndexPortail = ORDRE_RANGS.indexOf(currentDonjon.rang);
    return donjonEvenementsData.filter(evt => {
        const rangIndexRequis = ORDRE_RANGS.indexOf(evt.rangMin);
        const rangOk = rangIndexRequis <= rangIndexPortail;
        const themeOk = evt.theme === "tous" || evt.theme === "donjon" || evt.theme === currentDonjon.theme;
        return rangOk && themeOk;
    });
}

function afficherEvenementDonjon(evenement) {
    const zoneTexte = document.getElementById("donjon-texte");
    if (zoneTexte) zoneTexte.textContent = evenement.texte;

    const zoneChoix = document.getElementById("donjon-choix");
    if (!zoneChoix) return;
    zoneChoix.innerHTML = "";

    evenement.choix.forEach(choix => {
        const bouton = document.createElement("button");
        bouton.textContent = choix.texte;
        bouton.onclick = () => resoudreChoixDonjon(choix);
        zoneChoix.appendChild(bouton);
    });
}

function resoudreChoixDonjon(choix) {
    if (choix.typeAction === "combat") {
        combatTermineCallback = (victoire) => {
            if (victoire) avancerSalleSuivante();
        };
        demarrerCombat(choix.monstre_id, { position: etatCombat.position, contexte: "donjon" });
        return;
    }

    if (choix.typeAction === "jet_perception") {
        resoudreJetPerceptionDonjon(choix);
        return;
    }

    appliquerEffetDonjon(choix.effet);
    verifierMortHorsCombat();
}

function resoudreJetPerceptionDonjon(choix) {
    const jet = Math.random() * 20 + player.stats.perception;
    let resultat;

    if (jet > 25) resultat = choix.succes_critique;
    else if (jet > 12) resultat = choix.succes;
    else if (jet < 4) resultat = choix.echec_critique;
    else resultat = choix.echec;

    if (!resultat) resultat = choix.echec;

    logMessage(resultat.texte);
    appliquerEffetDonjon(resultat);
    verifierMortHorsCombat();
}

function appliquerEffetDonjon(effet) {
    if (!effet) {
        avancerSalleSuivante();
        return;
    }

    if (effet.pv) player.pv = Math.max(0, player.pv + effet.pv);
    if (effet.pm) player.pm = Math.max(0, player.pm + effet.pm);
    if (effet.or) player.or += effet.or;
    if (effet.xp) gainerXP(effet.xp);
    if (effet.fatigue) player.fatigue = Math.min(100, player.fatigue + effet.fatigue);
    if (effet.item_gagne) ajouterAInventaire(effet.item_gagne, 1);
    if (effet.statut) appliquerStatut(etatCombat.statutsJoueur, effet.statut, 2);

    const statsPossibles = ["force", "agilite", "intelligence", "perception", "vitalite"];
    statsPossibles.forEach(stat => {
        if (effet[stat]) player.stats[stat] += effet[stat];
    });
    if (effet.stats_all) statsPossibles.forEach(stat => { player.stats[stat] += effet.stats_all; });

    recalculerStatsDerivees();

    if (effet.msg && !effet.texte) logMessage(effet.msg);

    avancerSalleSuivante();
}

function verifierMortHorsCombat() {
    if (player.pv <= 0) {
        gererMortPotentielle();
    }
}

function avancerSalleSuivante() {
    currentDonjon.salleActuelle += 1;
    sauvegarderPartie();
    setTimeout(chargerSalleDonjon, 800);
}

function lancerCombatDeSalle() {
    const candidats = monstresData.filter(m => m.rang === currentDonjon.rang && m.type === "mob" &&
        (m.theme === "tous" || m.theme === currentDonjon.theme));
    const pool = candidats.length > 0 ? candidats : monstresData.filter(m => m.rang === currentDonjon.rang && m.type === "mob");
    const monstre = pool[Math.floor(Math.random() * pool.length)] || monstresData[0];

    combatTermineCallback = (victoire) => { if (victoire) avancerSalleSuivante(); };
    demarrerCombat(monstre.id, { position: etatCombat.position, contexte: "donjon" });
}

// ------------------------------------------
// 5. SALLE DU BOSS
// ------------------------------------------
function chargerSalleBoss() {
    logMessage("--- SALLE DU BOSS ---");

    const bossCandidats = monstresData.filter(m => m.rang === currentDonjon.rang && m.type === "boss");
    const boss = bossCandidats[Math.floor(Math.random() * bossCandidats.length)] || monstresData.find(m => m.type === "boss");

    combatTermineCallback = (victoire) => { if (victoire) cloturerDonjon(); };
    demarrerCombat(boss.id, { position: etatCombat.position, contexte: "boss" });
}

function cloturerDonjon() {
    logMessage(`Le portail ${currentDonjon.nom} se referme. Portail nettoye.`);

    player.donjonsNettoyes += 1;
    player.reputation += currentDonjon.rang === "S" ? 100 : 20;
    ajouterAInventaire("pierre_essence", 1);

    if (currentDonjon.rouge) ajouterMarqueur("portail_rouge_survecu");

    currentDonjon.actif = false;
    sauvegarderPartie();
    switchView("view-hub");
    updateUI();
}

// ------------------------------------------
// 6. LE DOUBLE DONJON (declencheur scenarise de la Phase 3)
// ------------------------------------------
const ETAPES_DOUBLE_DONJON = [
    "Le portail que vous franchissez se referme brutalement derriere vous. Quelque chose ne va pas.",
    "Vous errez dans le Temple de Carthenon, un lieu qui ne devrait pas exister a ce rang.",
    "Des chasseurs bien plus experimentes que vous gisent, vaincus, autour d'un autel noir.",
    "Une entite ancienne se dresse devant vous. La fuite est impossible."
];

function demarrerDoubleDonjon() {
    currentDonjon = {
        actif: true,
        id: "double_donjon",
        nom: "Temple de Carthenon",
        rang: player.rang,
        theme: "temple",
        rouge: false,
        instancie: false,
        salleActuelle: 1,
        sallesTotales: 1,
        typeSpecial: "double_donjon"
    };

    switchView("view-donjon");
    afficherEtapeDoubleDonjon(0);
}

function afficherEtapeDoubleDonjon(index) {
    if (index >= ETAPES_DOUBLE_DONJON.length) {
        lancerCombatDoubleDonjon();
        return;
    }

    logMessage(ETAPES_DOUBLE_DONJON[index]);
    const boutonSuivant = document.getElementById("donjon-suivant-etape");
    if (boutonSuivant) {
        boutonSuivant.onclick = () => afficherEtapeDoubleDonjon(index + 1);
    } else {
        setTimeout(() => afficherEtapeDoubleDonjon(index + 1), 1500);
    }
}

function lancerCombatDoubleDonjon() {
    const rangIndexJoueur = ORDRE_RANGS.indexOf(player.rang || "E");
    const rangEntite = ORDRE_RANGS[Math.min(ORDRE_RANGS.length - 1, rangIndexJoueur + 2)];
    const candidats = monstresData.filter(m => m.rang === rangEntite && (m.type === "boss" || m.type === "mob"));
    const entite = candidats[Math.floor(Math.random() * candidats.length)] || monstresData.find(m => m.type === "boss");

    // Ce combat est scenarise : quelle que soit l'issue, il mene a l'Eveil du Systeme
    combatTermineCallback = () => {
        declencherEveilSysteme();
    };

    demarrerCombat(entite.id, { position: "avant_garde", contexte: "double_donjon" });
    etatCombat.fuitePossible = false;
}

function declencherEveilSysteme() {
    player.phase = 3;
    player.eveilSysteme = true;
    player.pv = player.pvMax;
    player.pm = player.pmMax;

    ajouterMarqueur("joueur_systeme");
    logMessage("Vous vous reveillez a l'hopital. Une interface bleutee flotte devant vos yeux. Le Systeme vous reconnait comme son Joueur.");

    currentDonjon.actif = false;
    sauvegarderPartie();
    switchView("view-hub");
    updateUI();
}
