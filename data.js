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
            montantLoyer: 400
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

    textesEveil: {
        "Guerrier": "Une chaleur incandescente envahit vos muscles. L'aura rouge de la puissance physique brute émane de votre corps. Le Système vous reconnaît comme un combattant de mêlée redoutable.",
        "Assassin": "Le monde semble ralentir. Les ombres s'étirent et s'enroulent autour de vos bras. Vous percevez chaque faille dans votre environnement avec une clarté mortelle.",
        "Mage": "L'air crépite autour de vous. Une énergie bleutée et électrique remplit votre esprit, ouvrant votre conscience à des flux de mana insoupçonnés.",
        "Ranger": "Vos sens s'aiguisent drastiquement. Vous entendez le battement d'ailes d'une mouche à l'autre bout de la pièce. Une précision implacable guide désormais votre regard.",
        "Tank": "Votre peau se durcit un instant, prenant la texture de l'acier avant de redevenir normale. Vous vous sentez inébranlable, tel un rempart vivant face au danger."
    },

    objets: {
        "item_vetement_sport": { id: "item_vetement_sport", nom: "Vêtements de Sport Renforcés", type: "armure", slot: "torse", rarete: "gris", prix: 200, bonusStats: { vitalite: 1, agilite: 1 } },
        "item_bandage_01": { id: "item_bandage_01", nom: "Bandage de Fortune", type: "consommable", rarete: "gris", prix: 50, effet: { soinPv: 25 } },
        "item_potion_mineure": { id: "item_potion_mineure", nom: "Potion de Soin Mineure", type: "consommable", rarete: "vert", prix: 250, effet: { soinPvPourcentage: 30 } },
        "item_potion_mana": { id: "item_potion_mana", nom: "Potion de Mana", type: "consommable", rarete: "vert", prix: 300, effet: { soinPm: 30 } },
        "item_dague_emoussee": { id: "item_dague_emoussee", nom: "Dague Émoussée", type: "arme", slot: "mains", rarete: "gris", prix: 300, bonusStats: { agilite: 2 } },
        "item_epee_fer": { id: "item_epee_fer", nom: "Épée Longue en Fer", type: "arme", slot: "mains", rarete: "gris", prix: 450, bonusStats: { force: 3 } }
    },

    boutiques: [
        { id: "shop_civil", nom: "Épicerie de Quartier", requis: { type: "aucun" }, articles: ["item_bandage_01", "item_vetement_sport"] },
        { id: "shop_assoc_e", nom: "Boutique Association - Rang E", requis: { type: "rang", valeur: "E", message: "Requiert une licence de Chasseur" }, articles: ["item_potion_mineure", "item_potion_mana", "item_dague_emoussee"] },
        { id: "shop_assoc_d", nom: "Boutique Association - Rang D", requis: { type: "rang", valeur: "D", message: "Rang de Chasseur insuffisant (Requis: Rang D)" }, articles: ["item_epee_fer"] },
        { id: "shop_noir", nom: "Marché Noir Clandestin", requis: { type: "reputation", valeur: 25, message: "Réputation insuffisante (Requis: 25)" }, articles: ["item_potion_mineure", "item_epee_fer"] }
    ],

    monstres: {
        "mob_gobelin": { nom: "Gobelin Éclaireur", rang: "E", stats: { pv: 40, pvMax: 40, force: 7, agilite: 8 }, recompenses: { xp: 20, orMin: 50, orMax: 90 }, description: "Un humanoïde vicieux armé d'un couteau rouillé." },
        "mob_loup_feroce": { nom: "Loup Féroce des Cavernes", rang: "E", stats: { pv: 60, pvMax: 60, force: 10, agilite: 14 }, recompenses: { xp: 35, orMin: 80, orMax: 130 }, description: "Une bête sauvage aux yeux luisants bavant de salive toxique." },
        "mob_orc": { nom: "Haut-Orc des Cavernes", rang: "D", stats: { pv: 120, pvMax: 120, force: 18, agilite: 10 }, recompenses: { xp: 80, orMin: 200, orMax: 400 }, description: "Un colosse musclé brandissant une lourde massue en pierre cloutée." }
    },

    evenementsCivils: [
        {
            titre: "Le Vol à la Tire dans le Métro",
            texte: "Un homme bouscule violemment une passagère et s'enfuit avec son sac vers vous.",
            choix: [
                { texte: "Plaquer le voleur au sol.", gainStat: "reflexe", valeur: 1, resultat: "Vous anticipez sa trajectoire et le plaquez net au sol.", affinite: "Assassin" },
                { texte: "Crier pour alerter la sécurité.", gainStat: "intelligence", valeur: 1, resultat: "Votre intervention vocale mobilise les agents à temps.", affinite: "Mage" }
            ]
        },
        {
            titre: "L'Incident sur le Chantier",
            texte: "Un bloc de béton instable menace de s'effondrer sur des passants.",
            choix: [
                { texte: "Retenir le bloc à mains nues.", gainStat: "force", valeur: 1, resultat: "Vos muscles se contractent violemment, retenant la masse de béton in extremis.", affinite: "Guerrier" },
                { texte: "Encaisser pour protéger un civil.", gainStat: "vitalite", valeur: 1, resultat: "Le choc vous brise le souffle mais le passant est sain et sauf.", affinite: "Tank" }
            ]
        },
        {
            titre: "Agression Nocturne",
            texte: "En rentrant tard, vous entendez des bruits de lutte étouffés dans une ruelle.",
            choix: [
                { texte: "Intervenir directement et frapper.", gainStat: "force", valeur: 1, resultat: "Vous mettez les agresseurs en fuite par pure force brute.", affinite: "Guerrier" },
                { texte: "Analyser l'angle d'attaque avant d'agir.", gainStat: "perception", valeur: 1, resultat: "Vous évaluez parfaitement la situation pour intervenir sans risque.", affinite: "Ranger" }
            ]
        },
        {
            titre: "Colis Suspect",
            texte: "Un client pressé demande le transport express d'une caisse lourde et étrange.",
            choix: [
                { texte: "Gérer l'équilibre en courant agilement.", gainStat: "agilite", valeur: 1, resultat: "Vous slalomez entre les obstacles avec une aisance déconcertante.", affinite: "Assassin" },
                { texte: "Anticiper les raccourcis du quartier.", gainStat: "perception", valeur: 1, resultat: "Vous choisissez le raccourci parfait pour arriver en avance.", affinite: "Ranger" }
            ]
        },
        {
            titre: "Incendie dans l'Immeuble",
            texte: "De la fumée s'échappe de l'appartement voisin. La porte est bloquée.",
            choix: [
                { texte: "Défoncer la porte à coups d'épaule.", gainStat: "vitalite", valeur: 1, resultat: "Vous encaissez les dégâts de la porte et entrez dans le brasier.", affinite: "Tank" },
                { texte: "Utiliser l'extincteur et la physique du feu.", gainStat: "intelligence", valeur: 1, resultat: "Vous étouffez les flammes à la source avec méthode.", affinite: "Mage" }
            ]
        },
        {
            titre: "Bagarre de Bar",
            texte: "Des ivrognes commencent à casser des bouteilles et menacent le barman.",
            choix: [
                { texte: "Esquiver les bouteilles et les désarmer.", gainStat: "reflexe", valeur: 1, resultat: "Vos mains bougent plus vite que leur regard alcoolisé.", affinite: "Assassin" },
                { texte: "Lancer une chaise pour les déséquilibrer de loin.", gainStat: "perception", valeur: 1, resultat: "Votre tir fait mouche et les neutralise.", affinite: "Ranger" }
            ]
        }
    ],

    donjons: [
        { 
            id: "dungeon_e1", 
            nom: "Portail de Rang E (Ruines Enfouies)", 
            rang: "E", 
            monstreId: "mob_gobelin",
            etapes: [
                "Vous rejoignez une petite équipe de 3 autres Chasseurs précaires. Le chef d'équipe, un Tank de rang D, prend la ligne de front.",
                "Un piège magique s'active ! L'équipe s'éparpille. Vous vous retrouvez isolé dans une salle annexe..."
            ]
        },
        { 
            id: "dungeon_e2", 
            nom: "Portail de Rang E (Forêt Sombre)", 
            rang: "E", 
            monstreId: "mob_loup_feroce",
            etapes: [
                "Vous entrez seul dans ce portail mineur. La forêt artificielle est dense et l'odeur du sang frais flotte dans l'air.",
                "Vous repérez des traces fraîches sur le sol et entendez un grognement sourd dans votre dos..."
            ]
        }
    ]
};
