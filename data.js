const GAME_DATA = {
    metiers: {
        "Ouvrier": { force: 2, vitalite: 2, agilite: 0, intelligence: 0, perception: 0, reflexe: 0, or: 100 },
        "Employé de Bureau": { force: 0, vitalite: 0, agilite: 0, intelligence: 2, perception: 1, reflexe: 1, or: 300 },
        "Livreur": { force: 0, vitalite: 1, agilite: 2, intelligence: 0, perception: 1, reflexe: 0, or: 150 },
        "Étudiant": { force: 0, vitalite: 0, agilite: 1, intelligence: 2, perception: 0, reflexe: 1, or: 50 }
    },

    joueurTemplate: {
        nom: "Sung",
        metierCivil: "Ouvrier",
        classe: "Aucune",
        rangLicence: "E",
        reputation: 10,
        niveau: 1,
        or: 300,
        timers: {
            loyerJours: 7,
            montantLoyer: 250 // Réduit pour l'équilibrage
        },
        statsActuelles: {
            pvActuels: 100,
            pmActuels: 50,
            fatigue: 0
        },
        statsMax: {
            pvMax: 100,
            pmMax: 50,
            force: 5,
            agilite: 5,
            vitalite: 5,
            intelligence: 5,
            perception: 5,
            reflexe: 5
        },
        equipement: { tete: null, torse: "item_vetement_sport", mains: null, accessoire: null },
        inventaire: ["item_bandage_01", "item_potion_mineure", "item_dague_emoussee"]
    },

    sequencesEveil: {
        "Guerrier": [
            "Le réveil sonne. Vous ouvrez les yeux, le corps trempé de sueurs froides. Vos muscles brûlent d'une chaleur anormale, comme si vous aviez couru un marathon en dormant.",
            "En voulant éteindre votre réveil, votre main s'abat sur la table de nuit. Un énorme *CRAC* retentit. Le réveil est pulvérisé et le bois massif de la table s'est fendu en deux sous votre force.",
            "Paniqué, vous prenez votre téléphone et tapez : *'Force surhumaine soudaine, muscles brûlants, hallucination ?'* Les résultats du forum des Éveillés sont unanimes : c'est le Protocole.",
            "Vous vous rendez au Centre de l'Association des Chasseurs. Après avoir pulvérisé la machine de test de frappe, l'examinateur vous tend un badge. Vous êtes un Chasseur de type Combattant."
        ],
        "Assassin": [
            "Le réveil sonne, mais vous l'aviez entendu s'enclencher une fraction de seconde avant. Le monde autour de vous semble bouger au ralenti.",
            "Une mouche vole dans la pièce. Son bourdonnement vous agresse les oreilles. D'un mouvement sec, sans même regarder, vous l'attrapez entre votre pouce et votre index. Vos réflexes sont terrifiants.",
            "Vous faites une recherche vocale : *'Perception ralentie du temps, réflexes anormaux'*... Les forums parlent d'un type d'Éveil spécifique et mortel.",
            "Au Centre d'Évaluation, vous parvenez à esquiver les lasers d'exercice avec une aisance fantomatique. Vous ressortez avec une licence de Chasseur de type Assassin."
        ],
        "Mage": [
            "Le réveil crépite avant même de sonner. Vous vous levez avec une migraine terrible, sentant des picotements électriques à la surface de votre peau.",
            "En voulant attraper votre verre d'eau, celui-ci glisse sur la table, lévitant à quelques centimètres de la surface, poussé par une aura bleutée émanant de votre main.",
            "Vous cherchez sur le net : *'Télékinésie involontaire, électricité statique permanente'*... Les articles spécialisés parlent de l'ouverture des circuits de Mana.",
            "À l'Association, l'orbe de mesure magique s'illumine d'un éclat aveuglant à votre contact. L'examinateur, impressionné, vous enregistre en tant que Mage."
        ],
        "Ranger": [
            "Le réveil sonne. Mais vous entendez aussi les battements de cœur de votre voisin du dessus, et le bruit des voitures à trois pâtés de maisons. Vos sens sont en surchauffe.",
            "Vous regardez par la fenêtre. À plus de 500 mètres, vous arrivez à lire parfaitement les petits caractères sur un panneau publicitaire, avec une netteté absolue.",
            "Vous tapez frénétiquement : *'Ouïe absolue, vision télescopique soudaine'*... Tout pointe vers un Éveil lié à l'acuité sensorielle.",
            "Au stand de tir du Centre d'Évaluation, vous touchez 100% des cibles en mouvement dans l'obscurité totale. Vous êtes certifié Chasseur de type Ranger."
        ],
        "Tank": [
            "Le réveil sonne. Vous vous levez d'un bond, mais vous vous sentez incroyablement lourd. Comme si vos os étaient faits de tungstène.",
            "Dans votre précipitation, vous vous cognez violemment le petit orteil contre le pied métallique du lit. Au lieu de hurler de douleur, c'est le métal du lit qui se tord sous l'impact. Vous n'avez rien senti.",
            "Vous cherchez : *'Densité osseuse anormale, invulnérabilité soudaine'*... Le diagnostic des forums d'Éveillés est clair.",
            "À l'Association, la presse hydraulique de test ne parvient même pas à vous faire reculer d'un pas. Vous recevez votre licence de Chasseur de type Tank."
        ]
    },

    objets: {
        "item_vetement_sport": { id: "item_vetement_sport", nom: "Vêtements de Sport Renforcés", type: "armure", slot: "torse", rarete: "gris", prix: 200, bonusStats: { vitalite: 1, agilite: 1 } },
        "item_bandage_01": { id: "item_bandage_01", nom: "Bandage de Fortune", type: "consommable", rarete: "gris", prix: 50, effet: { soinPv: 25 } },
        "item_potion_mineure": { id: "item_potion_mineure", nom: "Potion de Soin Mineure", type: "consommable", rarete: "vert", prix: 200, effet: { soinPvPourcentage: 30 } },
        "item_potion_mana": { id: "item_potion_mana", nom: "Potion de Mana", type: "consommable", rarete: "vert", prix: 250, effet: { soinPm: 30 } },
        "item_dague_emoussee": { id: "item_dague_emoussee", nom: "Dague Émoussée", type: "arme", slot: "mains", rarete: "gris", prix: 300, bonusStats: { agilite: 2 } },
        "item_epee_fer": { id: "item_epee_fer", nom: "Épée Longue en Fer", type: "arme", slot: "mains", rarete: "gris", prix: 450, bonusStats: { force: 3 } }
    },

    boutiques: [
        { id: "shop_civil", nom: "Épicerie de Quartier", requis: { type: "aucun" }, articles: ["item_bandage_01", "item_vetement_sport"] },
        { id: "shop_assoc_e", nom: "Boutique Association - Rang E", requis: { type: "rang", valeur: "E", message: "Requiert une licence de Chasseur" }, articles: ["item_potion_mineure", "item_potion_mana", "item_dague_emoussee"] },
        { id: "shop_assoc_d", nom: "Boutique Association - Rang D", requis: { type: "rang", valeur: "D", message: "Rang insuffisant (Requis: Rang D)" }, articles: ["item_epee_fer"] },
        { id: "shop_noir", nom: "Marché Noir Clandestin", requis: { type: "reputation", valeur: 25, message: "Réputation insuffisante (Requis: 25)" }, articles: ["item_potion_mineure", "item_epee_fer"] }
    ],

    monstres: {
        "mob_gobelin": { nom: "Gobelin Éclaireur", rang: "E", stats: { pv: 40, pvMax: 40, force: 7, agilite: 8 }, recompenses: { xp: 20, orMin: 80, orMax: 150 }, description: "Un humanoïde vicieux armé d'un couteau rouillé." },
        "mob_loup_feroce": { nom: "Loup des Cavernes", rang: "E", stats: { pv: 60, pvMax: 60, force: 10, agilite: 14 }, recompenses: { xp: 35, orMin: 120, orMax: 200 }, description: "Une bête sauvage aux yeux luisants bavant de salive toxique." },
        "mob_orc": { nom: "Haut-Orc des Cavernes", rang: "D", stats: { pv: 120, pvMax: 120, force: 18, agilite: 10 }, recompenses: { xp: 80, orMin: 250, orMax: 400 }, description: "Un colosse musclé brandissant une lourde massue." }
    },

    evenementsCivils: [
        {
            titre: "Le Vol à la Tire dans le Métro",
            texte: "Un homme bouscule violemment une passagère et s'enfuit avec son sac vers vous.",
            choix: [
                { texte: "Plaquer le voleur au sol.", gainStat: "force", valeur: 1, resultat: "Vous le stoppez net avec une brutalité étonnante.", affinite: "Guerrier" },
                { texte: "Faire un croc-en-jambe parfait.", gainStat: "reflexe", valeur: 1, resultat: "Votre timing est millimétré, il s'écrase par terre.", affinite: "Assassin" },
                { texte: "Crier pour alerter la sécurité.", gainStat: "intelligence", valeur: 1, resultat: "Vous anticipez sa trajectoire et alertez les bons agents.", affinite: "Mage" }
            ]
        },
        {
            titre: "L'Incident sur le Chantier",
            texte: "Un bloc de béton instable menace de s'effondrer sur des passants.",
            choix: [
                { texte: "Retenir le bloc à mains nues.", gainStat: "force", valeur: 1, resultat: "Vos muscles se contractent violemment, retenant la masse.", affinite: "Tank" },
                { texte: "Pousser les civils in extremis.", gainStat: "agilite", valeur: 1, resultat: "Vous plongez et sauvez les passants à la dernière seconde.", affinite: "Ranger" },
                { texte: "Calculer l'angle et caler une poutre.", gainStat: "perception", valeur: 1, resultat: "Vous déviez la chute avec une simple poutre de métal.", affinite: "Mage" }
            ]
        },
        {
            titre: "Agression Nocturne",
            texte: "En rentrant tard, vous entendez des bruits de lutte étouffés dans une ruelle.",
            choix: [
                { texte: "Frapper le premier avec violence.", gainStat: "force", valeur: 1, resultat: "Vous mettez les agresseurs K.O avec une force brute.", affinite: "Guerrier" },
                { texte: "Analyser l'ombre et attaquer par derrière.", gainStat: "perception", valeur: 1, resultat: "Vous les surprenez un par un dans le noir.", affinite: "Assassin" },
                { texte: "S'interposer pour encaisser les coups.", gainStat: "vitalite", valeur: 1, resultat: "Ils s'épuisent à vous frapper et finissent par fuir.", affinite: "Tank" }
            ]
        }
    ],

    donjons: [
        { 
            id: "dungeon_e1", 
            nom: "Portail Mineur (Ruines Enfouies)", 
            rang: "E", 
            monstreId: "mob_gobelin",
            etapes: [
                { type: "texte", texte: "Vous rejoignez une petite équipe de 3 Chasseurs précaires. L'atmosphère est lourde et sent la moisissure." },
                { type: "interactif", texte: "Un piège à fléchettes s'active brusquement dans le couloir !", choix: [
                    { texte: "Plonger sur le côté (Agilité)", stat: "agilite", diff: 6, succes: "Vous esquivez de justesse ! Vous gagnez en assurance.", echec: "Vous êtes touché. Vous perdez 15 PV.", degats: 15 },
                    { texte: "Se protéger le visage (Vitalité)", stat: "vitalite", diff: 5, succes: "Les flèches rebondissent presque sur vos avant-bras.", echec: "Une flèche s'enfonce dans votre épaule. Vous perdez 20 PV.", degats: 20 }
                ]},
                { type: "texte", texte: "Isolé après le piège, vous apercevez une silhouette menaçante s'approcher..." }
            ]
        },
        { 
            id: "dungeon_e2", 
            nom: "Portail Mineur (Forêt Sombre)", 
            rang: "E", 
            monstreId: "mob_loup_feroce",
            etapes: [
                { type: "texte", texte: "La forêt est silencieuse. Trop silencieuse. Vous trouvez le cadavre d'un ancien chasseur." },
                { type: "interactif", texte: "Son sac semble intact, mais il est bloqué sous un lourd rocher.", choix: [
                    { texte: "Soulever le rocher (Force)", stat: "force", diff: 7, succes: "Vous libérez le sac et trouvez 150 Or !", echec: "Le rocher vous échappe et écrase vos doigts. Vous perdez 10 PV.", degats: 10, lootOr: 150 },
                    { texte: "Fouiller délicatement avec un bâton (Perception)", stat: "perception", diff: 6, succes: "Vous réussissez à extraire quelques pièces (100 Or) sans prendre de risque.", echec: "Le sac se déchire, vous ne trouvez rien.", degats: 0, lootOr: 100 }
                ]},
                { type: "texte", texte: "L'odeur du sang du chasseur a attiré un prédateur de la forêt..." }
            ]
        }
    ]
};
