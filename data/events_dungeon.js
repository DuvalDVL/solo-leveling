const DUNGEON_EVENTS = {
    standard: [
        {
            id: "goblin_ambush",
            title: "Embuscade de Gobelins",
            text: "Vous pénétrez dans une vaste salle humide. Des dizaines de petits yeux brillent dans l'obscurité : une meute de gobelins vous a repéré.",
            choices: [
                {
                    text: "Attaquer de front (Force)",
                    type: "action",
                    statCheck: "strength",
                    difficulty: 20,
                    success: { text: "Vous foncez dans le tas et taillez vos ennemis en pièces sans broncher.", effect: { fatigue: 10 } },
                    failure: { text: "Vous manquez de puissance, les gobelins vous submergent un instant.", effect: { hp: -25, fatigue: 15 } }
                },
                {
                    text: "Esquiver et fuir vers la sortie (Agilité)",
                    type: "action",
                    statCheck: "agility",
                    difficulty: 25,
                    success: { text: "Grâce à vos réflexes fulgurants, vous esquivez les projectiles et passez outre.", effect: { fatigue: 5 } },
                    failure: { text: "Un projectile empoisonné vous atteint à la jambe.", effect: { hp: -15, fatigue: 10 } }
                }
            ]
        },
        {
            id: "mana_crystal_vein",
            title: "Filon de Cristaux de Mana",
            text: "Les parois de la galerie scintillent d'une lueur bleue éclatante. Un gisement de cristaux purs est à portée de main, mais l'endroit semble instable.",
            choices: [
                {
                    text: "Extraire les cristaux prudemment (Perception)",
                    type: "action",
                    statCheck: "perception",
                    difficulty: 15,
                    success: { text: "Vous récoltez des cristaux d'excellente qualité !", effect: { money: 25000, fatigue: 10 } },
                    failure: { text: "Un faux mouvement provoque un éboulement léger. Vous repartez les mains vides.", effect: { hp: -10, fatigue: 15 } }
                },
                {
                    text: "Ignorer le filon et sécuriser le chemin",
                    type: "action",
                    effect: { morale: 2 },
                    successText: "Vous préférez ne pas gaspiller vos forces ici."
                }
            ]
        },
        {
            id: "magic_trap",
            title: "Piège Runique",
            text: "Votre pied déclenche une plaque gravée au sol. Des volutes d'énergie magique sombre s'apprêtent à exploser autour de vous.",
            choices: [
                {
                    text: "Tenter de désamorcer ou sauter hors de la zone (Agilité / Intelligence)",
                    type: "action",
                    statCheck: "agility",
                    difficulty: 30,
                    success: { text: "Un bond en arrière salvateur vous évite l'explosion de plein fouet.", effect: { fatigue: 5 } },
                    failure: { text: "L'onde de choc magique vous souffle violemment contre le mur.", effect: { hp: -35, morale: -10 } }
                }
            ]
        }
    ],
    rogue_hunters: [
        {
            id: "traitor_encounter",
            title: "Des confrères... ou des prédateurs ?",
            text: "Au détour d'un couloir, vous croisez un groupe de chasseurs armés. Leur regard insistant et leurs armes tachées de sang frais ne laissent aucun doute sur leurs intentions.",
            choices: [
                {
                    text: "Les attaquer par surprise avant qu'ils n'agissent (Agilité / Karma -)",
                    type: "action",
                    statCheck: "strength",
                    difficulty: 40,
                    success: { text: "Vous éliminez les pillards de donjon et récupérez leur butin illégal.", effect: { money: 50000, karma: -15, reputation: 2 } },
                    failure: { text: "Ils étaient mieux préparés que prévu. Vous encaissez de graves blessures en fuyant.", effect: { hp: -50, fatigue: 20, karma: 10 } }
                },
                {
                    text: "Leur céder une partie de votre argent pour éviter le combat",
                    type: "action",
                    effect: { money: -20000, morale: -10 },
                    successText: "Ils acceptent l'offrande et vous laissent la vie sauve. Quelle humiliation."
                }
            ]
        }
    ],
    intelligent_monsters: [
        {
            id: "frost_elf_negotiation",
            title: "L'Avant-Garde des Elfes des Glaces",
            text: "Un groupe de créatures humanoïdes à la peau diaphane vous bloque la route. Leur chef lève la main, exigeant un tribut magique en échange d'un passage sûr.",
            choices: [
                {
                    text: "Payer le tribut en cristaux (Perdre de l'argent ou des ressources)",
                    type: "action",
                    effect: { money: -15000 },
                    successText: "Le chef s'incline légèrement et vous laisse traverser sans verser le sang."
                },
                {
                    text: "Refuser et provoquer un combat d'élite",
                    type: "action",
                    statCheck: "strength",
                    difficulty: 50,
                    success: { text: "Vous triomphez de leur chef dans un duel glacial, récupérant un artefact rare !", effect: { money: 80000, karma: 5 } },
                    failure: { text: "La magie des glaces vous submerge. Vous fuyez de justesse, au bord de l'asphyxie.", effect: { hp: -60, fatigue: 30 } }
                }
            ]
        }
    ]
};
