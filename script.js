// CIBLAGE DES ÉCRANS
const screenHome = document.getElementById('screen-home');
const screenHistory = document.getElementById('screen-history');
const screenHelp = document.getElementById('screen-help');

// CIBLAGE DES BOUTONS DU MENU PRINCIPAL
const btnNewGame = document.getElementById('btn-new-game');
const btnHistory = document.getElementById('btn-history');
const btnHelp = document.getElementById('btn-help');

// CIBLAGE DES BOUTONS DE RETOUR
const btnsBack = document.querySelectorAll('.btn-back');

// FONCTION POUR CHANGER D'ÉCRAN
function switchScreen(screenToHide, screenToShow) {
    screenToHide.classList.remove('active');
    screenToHide.classList.add('hidden');
    
    // Petit délai pour laisser l'animation de fondu se faire
    setTimeout(() => {
        screenToShow.classList.remove('hidden');
        screenToShow.classList.add('active');
    }, 300);
}

// ÉVÉNEMENTS DES BOUTONS
btnHistory.addEventListener('click', () => {
    switchScreen(screenHome, screenHistory);
});

btnHelp.addEventListener('click', () => {
    switchScreen(screenHome, screenHelp);
});

// GESTION DE TOUS LES BOUTONS "RETOUR"
btnsBack.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Trouve l'écran parent du bouton cliqué pour le masquer
        const currentScreen = e.target.closest('.screen');
        switchScreen(currentScreen, screenHome);
    });
});

// LANCEMENT D'UNE NOUVELLE PARTIE (À développer plus tard)
btnNewGame.addEventListener('click', () => {
    console.log("Initialisation de la Phase 1...");
    // Ici on masquera le menu pour afficher l'interface de création de perso
});
