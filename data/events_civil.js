/**
 * Banque de données des événements civils et de la vie quotidienne.
 * Utilisé pendant la phase pré-éveil ou lors des actions en Ville entre deux raids.
 */

const CIVIL_EVENTS = [
    {
        id: "traffic_accident",
        title: "Un accident inattendu",
        text: "En vous rendant quelque part, un véhicule perd le contrôle et fonce droit sur un piéton inattentif.",
        choices: [
            {
                text: "Plonger pour le pousser hors du danger (Agilité/Vitalité requise)",
                effect: { fatigue: +20, morale: +10, karma: +5 },
                resultText: "Vous le sauvez de justesse mais encaissez de violentes éraflures. Votre bravoure vous honore."
            },
            {
                text: "Crier de toutes vos forces pour l'avertir",
                effect: { fatigue: +5, morale: +2 },
                resultText: "Le piéton sursaute et s'en sort de justesse. Vous repartez discrètement."
            },
            {
                text: "Détourner le regard et continuer votre chemin",
                effect: { morale: -5, karma: -2 },
                resultText: "Vous préférez ne pas vous attirer d'ennuis. La culpabilité vous pèse légèrement."
            }
        ]
    },
    {
        id: "rent_due",
        title: "La pression du propriétaire",
        text: "Votre propriétaire frappe vigoureusement à votre porte, exigeant le loyer en retard sous peine d'expulsion immédiate.",
        choices: [
            {
                text: "Payer immédiatement en piochant dans vos maigres économies (Coût: 5000 ₩)",
                effect: { money: -5000, morale: -5 },
                resultText: "Vous payez, mais votre compte bancaire fait désormais grimacer."
            },
            {
                text: "Supplier pour obtenir un délai supplémentaire",
                effect: { morale: -10, reputation: -2 },
                resultText: "Il accepte en vous crachant presque au visage. Votre dignité en prend un coup."
            },
            {
                text: "Accepter un travail de nuit épuisant pour régler la dette",
                effect: { fatigue: +30, money: +3000 },
                resultText: "Vous enchaînez 48h sans sommeil. Vous avez l'argent, mais votre corps est au bout du rouleau."
            }
        ]
    },
    {
        id: "mysterious_peddler",
        title: "Le colporteur louche",
        text: "Dans une ruelle sombre, un homme encapuchonné vous propose un mystérieux éclat brillant, jurant qu'il s'agit d'un fragment magique.",
        choices: [
            {
                text: "L'acheter pour voir (Coût: 10000 ₩)",
                effect: { money: -10000, perception: +5, karma: +2 },
                resultText: "L'objet s'avère être un véritable résidu de mana bas de gamme. Votre perception s'affine."
            },
            {
                text: "Le menacer pour le lui prendre de force",
                effect: { karma: -10, strength: +2, reputation: -5 },
                resultText: "L'homme prend peur et s'enfuit en lâchant le fragment. Vous repartez avec, mais votre conscience s'assombrit."
            },
            {
                text: "Ignorer et passer votre chemin",
                effect: {},
                resultText: "Vous préférez ne pas prendre de risques avec les escrocs de rue."
            }
        ]
    },
    {
        id: "street_fight",
        title: "Agression en ville",
        text: "Deux individus mal intentionnés co coin d'une rue vous bloquent le passage et exigent le contenu de vos poches.",
        choices: [
            {
                text: "Fuir en courant à toute vitesse (Agilité)",
                effect: { fatigue: +15, agility: +2 },
                resultText: "Vous détalez à travers les ruelles et les semez. Votre agilité s'améliore par la force des choses."
            },
            {
                text: "Les affronter de front",
                effect: { hp: -20, strength: +3, fatigue: +10 },
                resultText: "Vous vous en sortez avec quelques bleus mais parvenez à les mettre en fuite. Votre corps encaisse mieux les chocs."
            },
            {
                text: "Leur donner l'argent sans broncher",
                effect: { money: -8000, morale: -15 },
                resultText: "Vous perdez vos économies mais rentrez sain et sauf. La frustration est immense."
            }
        ]
    },
    {
        id: "social_media_rumor",
        title: "Bad buzz sur le Net",
        text: "Une rumeur infondée circule sur les réseaux sociaux au sujet de vos récentes activités, ternissant votre image publique.",
        choices: [
            {
                text: "Ignorer complètement les critiques",
                effect: { morale: -5 },
                resultText: "L'orage finit par passer, mais cela laisse des traces sur votre moral."
            },
            {
                text: "Engager une agence de communication pour étouffer l'affaire (Coût: 15000 ₩)",
                effect: { money: -15000, reputation: +5 },
                resultText: "L'agence nettoie votre réputation en un rien de temps. Vos affaires reprennent."
            },
            {
                text: "Répondre publiquement de manière agressive",
                effect: { reputation: -10, karma: -3 },
                resultText: "Votre coup de sang enflamme la toile. Vous gagnez en notoriété, mais pas pour les bonnes raisons."
            }
        ]
    }
    // D'autres événements peuvent être facilement ajoutés ici pour atteindre ou dépasser les 20 souhaits.
];
