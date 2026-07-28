const CIVIL_EVENTS = [
    {
        id: "traffic",
        title: "L'accident",
        text: "Un véhicule fonce sur un piéton. Que faites-vous ?",
        choices: [
            { text: "Le sauver (Agilité requise)", effect: { fatigue: 20, morale: 10, agility: 2 } },
            { text: "Détourner le regard", effect: { morale: -5, karma: -2 } }
        ]
    },
    {
        id: "rent",
        title: "Fin de mois difficile",
        text: "Le propriétaire exige le loyer.",
        choices: [
            { text: "Travailler de nuit (Fatigue +, Argent +)", effect: { fatigue: 25, money: 2000 } },
            { text: "Supplier pour un délai (Moral -)", effect: { morale: -10 } }
        ]
    },
    {
        id: "fight",
        title: "Agression",
        text: "Des voyous vous encerclent.",
        choices: [
            { text: "Se battre (Force +)", effect: { hp: -20, strength: 3 } },
            { text: "Fuir (Agilité +)", effect: { fatigue: 15, agility: 2 } }
        ]
    }
];
