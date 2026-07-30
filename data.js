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
        niveau: 1,
        xp: 0,
        xpSuivant: 100,
        reputation: 10,
        or: 300,
        doubleEveille: false,
        timers: {
            loyerJours: 7,
            montantLoyer: 250
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
            "Le réveil sonne. Vous vous levez, le corps trempé de sueurs. Vos muscles brûlent d'une chaleur anormale.",
            "En voulant éteindre votre réveil, votre main s'abat sur la table de nuit et la pulvérise sous votre force.",
            "Sur les forums des Éveillés, les résultats pointent vers un éveil de type Combattant/Guerrier.",
            "Au Centre de l'Association, l'examinateur valide votre licence de Chasseur de rang E."
        ],
        "Assassin": [
            "Le réveil sonne. Le monde autour de vous semble soudainement fonctionner au ralenti.",
            "Une mouche bourdonne ; d'un mouvement machinal et fulgurant, vous l'attrapez entre deux doigts.",
            "Vos réflexes sont terrifiants. Les articles en ligne évoquent un éveil d'assassin.",
            "Au Centre d'Évaluation, vos esquives fantomatiques valident votre licence d'Assassin de rang E."
        ],
        "Mage": [
            "Le réveil crépite et s'éteint dans une gerbe d'étincelles bleutées. Votre peau picote.",
            "Votre verre d'eau lévite de quelques centimètres, attiré par une étrange aura de mana.",
            "Les circuits de mana de votre corps semblent s'être ouverts durant la nuit.",
            "L'orbe magique de l'Association s'illumine aveuglément. Vous êtes enregistré comme Mage."
        ],
        "Ranger": [
            "Le réveil sonne, mais vous entendez distinctement les battements de cœur des passants à l'extérieur.",
            "Vous regardez par la fenêtre et lisez un panneau publicitaire à plus de 500 mètres avec une netteté absolue.",
            "Votre ouïe et votre vision ont muté de manière spectaculaire.",
            "Au stand de tir de l'Association, vous touchez 100% des cibles mobiles. Licence de Ranger validée."
        ],
        "Tank": [
            "Le réveil sonne. Vous vous levez avec une sensation de lourdeur métallique dans les os.",
            "Vous vous cognez violemment le pied contre le lit : c'est le cadre en fer qui se tord, vous ne sentez rien.",
            "Votre densité corporelle a radicalement changé.",
            "La presse hydraulique de l'Association cède face à votre résistance. Licence de Tank validée."
        ]
    },

    objets: {
        "item_vetement_sport": { id: "item_vetement_sport", nom: "Vêtements de Sport Renforcés", type: "armure", slot: "torse", rarete: "gris", prix: 200, bonusStats: { vitalite: 1, agilite: 1 } },
        "item_bandage_01": { id: "item_bandage_01", nom: "Bandage de Fortune", type: "consommable", rarete: "gris", prix: 50, effet: { soinPv: 25 } },
        "item_potion_mineure": { id: "item_potion_mineure", nom: "Potion de Soin Mineure", type: "consommable", rarete: "vert", prix: 200, effet: { soinPvPourcentage: 30 } },
        "item_potion_mana": { id: "item_potion_mana", nom: "Potion de Mana", type: "consommable", rarete: "vert", prix: 250, effet: { soinPm: 30 } },
        "item_dague_emoussee": { id: "item_dague_emoussee", nom: "Dague Émoussée", type: "arme", slot: "mains", rarete: "gris", prix: 300, bonusStats: { agilite: 2 } },
        "item_epee_fer": { id: "item_epee_fer", nom: "Épée Longue en Fer", type: "arme", slot: "mains", rarete: "gris", prix: 450, bonusStats: { force: 3 } },
        "item_arc_chasseur": { id: "item_arc_chasseur", nom: "Arc de Chasseur Novice", type: "arme", slot: "mains", rarete: "gris", prix: 400, bonusStats: { perception: 2, agilite: 1 } },
        "item_cle_systeme": { id: "item_cle_systeme", nom: "Clé du Donjon Instantané", type: "special", rarete: "or", prix: 1000, effet: { description: "Ouvre une dimension de donjon personnel." } }
    },

    boutiques: [
        { id: "shop_civil", nom: "Épicerie de Quartier", requis: { type: "aucun" }, articles: ["item_bandage_01", "item_vetement_sport"] },
        { id: "shop_assoc_e", nom: "Boutique Association - Rang E", requis: { type: "rang", valeur: "E", message: "Requiert une licence de Chasseur" }, articles: ["item_potion_mineure", "item_potion_mana", "item_dague_emoussee", "item_arc_chasseur"] },
        { id: "shop_systeme", nom: "Boutique Secrète du Système", requis: { type: "systeme", message: "Accès refusé. Réservé au Joueur du Système." }, articles: ["item_potion_mineure", "item_cle_systeme", "item_epee_fer"] }
    ],

    monstres: {
        "mob_gobelin": { nom: "Gobelin Éclaireur", rang: "E", stats: { pv: 40, pvMax: 40, force: 7, agilite: 8 }, recompenses: { xp: 25, orMin: 80, orMax: 150 }, description: "Un humanoïde vicieux armé d'un couteau rouillé." },
        "mob_loup_feroce": { nom: "Loup des Cavernes", rang: "E", stats: { pv: 60, pvMax: 60, force: 10, agilite: 14 }, recompenses: { xp: 40, orMin: 120, orMax: 200 }, description: "Une bête sauvage aux yeux luisants." },
        "mob_golem_boue": { nom: "Golem de Boue", rang: "D", stats: { pv: 120, pvMax: 120, force: 15, agilite: 4 }, recompenses: { xp: 80, orMin: 250, orMax: 400 }, description: "Un monstre lent mais incroyablement résistant." },
        "mob_statue_dieu": { nom: "La Statue de Dieu (Temple de Carthenon)", rang: "RED", stats: { pv: 9999, pvMax: 9999, force: 300, agilite: 250 }, recompenses: { xp: 500, orMin: 2000, orMax: 5000 }, description: "Une immense entité de pierre omnisciente au sourire énigmatique. Sa puissance est écrasante." }
    },

    evenementsCivils: [
        {
            titre: "Le Vol à la Tire dans le Métro",
            texte: "Un homme bouscule violemment une passagère et s'enfuit avec son sac vers vous.",
            choix: [
                { texte: "Plaquer le voleur au sol (Force).", gainStat: "force", valeur: 1, resultat: "Vous le stoppez net avec une brutalité étonnante.", affinite: "Guerrier" },
                { texte: "Faire un croc-en-jambe parfait (Réflexe).", gainStat: "reflexe", valeur: 1, resultat: "Votre timing est millimétré, il s'écrase par terre.", affinite: "Assassin" },
                { texte: "Crier pour alerter la sécurité (Intelligence).", gainStat: "intelligence", valeur: 1, resultat: "Vous anticipez sa trajectoire et alertez les bons agents.", affinite: "Mage" }
            ]
        },
        {
            titre: "L'Incident sur le Chantier",
            texte: "Un bloc de béton instable menace de s'effondrer sur des passants.",
            choix: [
                { texte: "Retenir le bloc à mains nues (Vitalité).", gainStat: "vitalite", valeur: 1, resultat: "Vos muscles se contractent violemment, retenant la masse.", affinite: "Tank" },
                { texte: "Pousser les civils in extremis (Agilité).", gainStat: "agilite", valeur: 1, resultat: "Vous plongez et sauvez les passants à la dernière seconde.", affinite: "Ranger" },
                { texte: "Calculer l'angle et caler une poutre (Perception).", gainStat: "perception", valeur: 1, resultat: "Vous déviez la chute avec une simple poutre de métal.", affinite: "Mage" }
            ]
        },
        {
            titre: "Agression Nocturne",
            texte: "En rentrant tard, vous entendez des bruits de lutte étouffés dans une ruelle.",
            choix: [
                { texte: "Frapper le premier avec violence (Force).", gainStat: "force", valeur: 1, resultat: "Vous mettez les agresseurs K.O avec une force brute.", affinite: "Guerrier" },
                { texte: "Analyser l'ombre et attaquer de loin (Perception).", gainStat: "perception", valeur: 1, resultat: "Vous jetez un projectile depuis l'ombre et les faites fuir.", affinite: "Ranger" },
                { texte: "S'interposer pour encaisser les coups (Vitalité).", gainStat: "vitalite", valeur: 1, resultat: "Ils s'épuisent à vous frapper et finissent par fuir.", affinite: "Tank" }
            ]
        }
    ],

    donjonsStandards: [
        { 
            id: "dungeon_e1", 
            nom: "Portail Mineur (Ruines Enfouies)", 
            rang: "E", 
            monstreId: "mob_gobelin",
            etapes: [
                { type: "texte", texte: "Vous rejoignez une petite équipe de Chasseurs de bas étage. L'air est humide et empeste la vase." },
                { type: "interactif", texte: "Un mécanisme de fléchettes murales s'enclenche soudainement !", choix: [
                    { texte: "Esquiver par une roulade (Agilité)", stat: "agilite", diff: 6, succes: "Esquive parfaite ! Votre agilité vous sauve.", echec: "Touché à l'épaule ! -15 PV.", degats: 15 },
                    { texte: "Encaisser de dos avec le sac (Vitalité)", stat: "vitalite", diff: 5, succes: "Le sac encaisse l'essentiel des dégâts.", echec: "Une flèche pénètre la chair. -20 PV.", degats: 20 }
                ]},
                { type: "texte", texte: "Le chemin se dégage, mais un monstre rôde plus loin..." }
            ]
        },
        { 
            id: "dungeon_e2", 
            nom: "Portail Mineur (Caverne Sombre)", 
            rang: "E", 
            monstreId: "mob_loup_feroce",
            etapes: [
                { type: "texte", texte: "La galerie rocheuse est jonchée d'os brisés. Un cadavre d'aventurier gît près d'un coffre entrouvert." },
                { type: "interactif", texte: "Le coffre est lourdement coincé sous un éboulis de pierres.", choix: [
                    { texte: "Forcer et soulever les pierres (Force)", stat: "force", diff: 7, succes: "Vous dégagez le coffre et empochez 150 Or !", echec: "Une pierre glisse sur vos doigts. -10 PV.", degats: 10, lootOr: 150 },
                    { texte: "Fouiller avec une tige de fer (Perception)", stat: "perception", diff: 6, succes: "Vous récupérez adroitement 100 Or.", echec: "Rien d'accessible dans les décombres.", degats: 0, lootOr: 100 }
                ]},
                { type: "texte", texte: "Des bruits de grognements résonnent dans les échos de la caverne..." }
            ]
        },
        { 
            id: "dungeon_d1", 
            nom: "Portail Intermédiaire (Marais Brumeux)", 
            rang: "D", 
            monstreId: "mob_golem_boue",
            etapes: [
                { type: "texte", texte: "Le portail vous recrache dans un bourbier toxique. La visibilité est presque nulle." },
                { type: "interactif", texte: "Une nappe de gaz toxique s'élève soudainement du sol.", choix: [
                    { texte: "Courir pour sortir de la zone (Réflexe)", stat: "reflexe", diff: 8, succes: "Vous retenez votre souffle et sprintez in extremis.", echec: "Vous inhalez du gaz toxique. -25 PV.", degats: 25 },
                    { texte: "Créer un courant d'air avec un objet (Intelligence)", stat: "intelligence", diff: 7, succes: "Vous dissipez astucieusement le nuage.", echec: "Vos efforts sont vains. Le gaz brûle vos poumons. -20 PV.", degats: 20 }
                ]},
                { type: "texte", texte: "La brume se lève lentement. Une énorme masse d'argile se met en mouvement." }
            ]
        }
    ]
};
