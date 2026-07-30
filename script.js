// --- VARIABLES D'ÉTAT DU JEU ---
let gameState = {
    player: null,
    currentEventIndex: 0
};

// --- CIBLAGE DES ÉCRANS ---
const screenHome = document.getElementById('screen-home');
const screenHistory = document.getElementById('screen-history');
const screenHelp = document.getElementById('screen-help');
const screenGame = document.getElementById('screen-game');

// --- CIBLAGE DES BOUTONS DU MENU ---
const btnNewGame = document.getElementById('btn-new-game');
const btnHistory = document.getElementById('btn-history');
const btnHelp = document.getElementById('btn-help');
const btnsBack = document.querySelectorAll('.btn-back');

// --- CIBLAGE DES ÉLÉMENTS DE JEU ---
const hudRang = document.getElementById('hud-rang');
const hudLvl = document.getElementById('hud-lvl');
const hudPv = document.getElementById('hud-pv');
const hudPvMax = document.getElementById('hud-pvmax');
const hudOr = document.getElementById('hud-or');
const eventTitle = document.getElementById('event-title');
const eventText = document.getElementById('event-text');
const eventChoices = document.getElementById('event-choices');

// --- FONCTION DE TRANSITION D'ÉCRAN ---
function switchScreen(screenToHide, screenToShow) {
    screenToHide.classList.remove('active');
    screenToHide.classList.add('hidden');
    
    setTimeout(() => {
        screenToShow.classList.remove('hidden');
        screenToShow.classList.add('active');
    }, 300);
}

// --- NAVIGATION MENU ---
btnHistory.addEventListener('click', () => switchScreen(screenHome, screenHistory));
btnHelp.addEventListener('click', () => switchScreen(screenHome, screenHelp));

btnsBack.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const currentScreen = e.target.closest('.screen');
        switchScreen(currentScreen, screenHome);
    });
});

// --- LANCEMENT D'UNE NOUVELLE PARTIE ---
btnNewGame.addEventListener('click', () => {
    // Copie profonde du template joueur pour éviter de modifier le fichier data d'origine
    gameState.player = JSON.parse(JSON.stringify(GAME_DATA.joueurTemplate));
    gameState.currentEventIndex = 0;

    // Basculer vers l'écran de jeu
    switchScreen(screenHome, screenGame);

    // Mettre à jour le HUD et charger le premier événement
    updateHUD();
    loadEvent();
});

// --- MISE À JOUR DU HUD ---
function updateHUD() {
    if (!gameState.player) return;
    hudRang.textContent = gameState.player.niveau >= 10 ? 'D' : 'E';
    hudLvl.textContent = gameState.player.niveau;
    hudPv.textContent = gameState.player.statsActuelles.pvActuels;
    hudPvMax.textContent = gameState.player.statsMax.pvMax;
    hudOr.textContent = gameState.player.or;
}

// --- CHARGEMENT D'UN ÉVÉNEMENT ---
function loadEvent() {
    const events = GAME_DATA.evenementsCivils;
    
    // Si tous les événements civils de la Phase 1 sont passés
    if (gameState.currentEventIndex >= events.length) {
        eventTitle.textContent = "[ PHASE 1 TERMINÉE ]";
        eventText.textContent = "Vos choix ont façonné votre profil. Le portail d'un donjon de bas rang s'ouvre devant vous... La Phase 2 commence.";
        eventChoices.innerHTML = `<button class="hologram-btn primary" onclick="location.reload()">Terminer la session test</button>`;
        return;
    }

    const currentEvt = events[gameState.currentEventIndex];
    
    // Affichage des textes
    eventTitle.textContent = `[ ${currentEvt.titre.toUpperCase()} ]`;
    eventText.textContent = currentEvt.texte;

    // Génération des boutons de choix
    eventChoices.innerHTML = "";
    currentEvt.choix.forEach((choixData) => {
        const btn = document.createElement('button');
        btn.className = "hologram-btn choice-btn";
        btn.textContent = choixData.texte;
        
        // Action au clic sur un choix
        btn.addEventListener('click', () => {
            applyChoiceEffect(choixData);
        });

        eventChoices.appendChild(btn);
    });
}

// --- APPLICATION DES EFFETS DE CHOIX ---
function applyChoiceEffect(choixData) {
    // Augmente la stat correspondante chez le joueur
    const statCible = choixData.gainStat;
    if (gameState.player.statsMax[statCible] !== undefined) {
        gameState.player.statsMax[statCible] += choixData.valeurGain;
    }

    // Feedback visuel rapide dans le texte
    eventText.innerHTML += `<br><br><span style="color: var(--neon-blue);">[SYSTÈMES] : +${choixData.valeurGain} en ${statCible.toUpperCase()} enregistré. Affinité détectée : ${choixData.affiniteClasse}.</span>`;
    
    // Désactiver les choix le temps de passer au suivant
    eventChoices.innerHTML = "";
    
    setTimeout(() => {
        gameState.currentEventIndex++;
        loadEvent();
    }, 1500); // Pause de 1.5s pour laisser lire le retour du système
}
