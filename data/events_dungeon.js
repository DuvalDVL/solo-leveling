const DUNGEON_EVENTS = {
    standard: [
        {
            title: "Gobelins", text: "Une meute de gobelins vous attaque.",
            choices: [
                { text: "Frapper fort", statCheck: "strength", diff: 15, win: { text: "Victoire !", effect: { fatigue: 5 } }, lose: { text: "Battu...", effect: { hp: -20 } } }
            ]
        }
    ]
};
