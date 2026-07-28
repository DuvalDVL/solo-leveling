const CIVIL_EVENTS = [
    {
        id: "traffic",
        title: "L'accident",
        text: "En rentrant chez vous, un véhicule perd le contrôle et fonce sur un piéton. Que faites-vous ?",
        choices: [
            { text: "Plonger pour le sauver (Agilité requise)", effect: { fatigue: 20, morale: 10, agility: 2 }, resultText: "Vous le sauvez de justesse ! Vous encaissez quelques égratignures, mais votre corps s'habitue à l'effort. (+10 Moral, +2 Agilité)" },
            { text: "Détourner le regard", effect: { morale: -5, karma: -2 }, resultText: "Vous tracez votre route. Les cris résonnent derrière vous, vous laissant un goût amer. (-5 Moral, Baisse de Karma)" }
        ]
    },
    {
        id: "rent",
        title: "Fin de mois difficile",
        text: "Votre propriétaire tambourine à la porte. Le loyer est en retard.",
        choices: [
            { text: "Faire des heures supplémentaires (Fatigue ++, Argent +)", effect: { fatigue: 30, money: 2000, strength: 1 }, resultText: "Vous enchaînez le travail physique jusqu'à l'épuisement. Vous avez l'argent, mais vous êtes vidé. (+2000 ₩, +30 Fatigue, +1 Force)" },
            { text: "Supplier pour un délai", effect: { morale: -10 }, resultText: "Il accepte en vous humiliant publiquement. Votre fierté en prend un coup. (-10 Moral)" }
        ]
    },
    {
        id: "fight",
        title: "Agression",
        text: "Des voyous vous encerclent dans une ruelle sombre.",
        choices: [
            { text: "Se battre pour s'échapper", effect: { hp: -20, strength: 3, morale: 5 }, resultText: "Vous en mettez un à terre avec force, les autres s'enfuient. Vous êtes blessé, mais confiant ! (-20 PV, +3 Force, +5 Moral)" },
            { text: "Fuir immédiatement", effect: { fatigue: 15, agility: 2 }, resultText: "Vos jambes s'activent toutes seules. Vous les semez au prix d'un bel effort cardio. (+2 Agilité, +15 Fatigue)" }
        ]
    }
    // Note : Tu peux en ajouter d'autres ici pour varier les 10 tours avant l'éveil.
];
