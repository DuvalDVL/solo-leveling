// data.js - Base de données du Solo Leveling RPG

// ==========================================
// 1. PHASE 1 : ÉVÉNEMENTS CIVILS (Tutoriel)
// ==========================================
const civilEvents = [
    {
        id: "agression_ruelle",
        title: "Agression dans une ruelle",
        description: "En rentrant tard le soir, trois voyous vous barrent la route et exigent votre portefeuille.",
        choices: [
            { text: "Foncer dans le tas avec les poings.", stats: { str: 2, vit: 1 }, affinity: "guerrier" },
            { text: "Esquiver leur assaut et fuir rapidement.", stats: { agi: 3 }, affinity: "assassin" },
            { text: "Analyser leur posture pour repérer le chef.", stats: { per: 2, agi: 1 }, affinity: "ranger" },
            { text: "Encaisser les coups pour protéger vos affaires.", stats: { vit: 3 }, affinity: "tank" }
        ]
    },
    {
        id: "accident_voiture",
        title: "L'accident",
        description: "Une voiture grille un feu rouge et fonce droit sur un passant aveugle.",
        choices: [
            { text: "Pousser le passant et encaisser le choc.", stats: { vit: 3, str: 1 }, affinity: "tank" },
            { text: "Plonger, attraper le passant et rouler au sol.", stats: { agi: 2, per: 1 }, affinity: "assassin" },
            { text: "Hurler un avertissement calculé au millimètre.", stats: { int: 3 }, affinity: "mage" },
            { text: "Lancer un projectile pour briser le pare-brise.", stats: { per: 2, str: 1 }, affinity: "ranger" }
        ]
    },
    {
        id: "bibliotheque_etrange",
        title: "Le vieux grimoire",
        description: "Vous trouvez un livre ancien brillant d'une faible lueur bleue dans une brocante.",
        choices: [
            { text: "L'étudier pour comprendre son mécanisme.", stats: { int: 3 }, affinity: "mage" },
            { text: "Déchiffrer les symboles minuscules sur la tranche.", stats: { per: 3 }, affinity: "ranger" },
            { text: "Essayer de le déchirer pour voir s'il est magique.", stats: { str: 3 }, affinity: "guerrier" },
            { text: "Le revendre immédiatement au plus offrant.", stats: { int: 1, per: 1 }, affinity: "assassin" }
        ]
    },
    {
        id: "chien_errant",
        title: "La bête féroce",
        description: "Un énorme chien enragé terrorise un parc pour enfants.",
        choices: [
            { text: "Prendre un bâton et le frapper violemment.", stats: { str: 3 }, affinity: "guerrier" },
            { text: "Faire barrage de votre corps devant les enfants.", stats: { vit: 3 }, affinity: "tank" },
            { text: "L'apaiser en contrôlant votre énergie et votre voix.", stats: { int: 2, per: 1 }, affinity: "mage" },
            { text: "Viser ses yeux avec des cailloux acérés.", stats: { per: 3 }, affinity: "ranger" }
        ]
    },
    {
        id: "travail_epuisant",
        title: "Épuisement professionnel",
        description: "Vous enchaînez 48h de travail sans dormir. Votre corps lâche.",
        choices: [
            { text: "Tenir bon par la pure force de la volonté.", stats: { vit: 2, str: 1 }, affinity: "tank" },
            { text: "Optimiser les tâches pour finir plus vite.", stats: { int: 3 }, affinity: "mage" },
            { text: "Boire des énergisants et courir dans tous les sens.", stats: { agi: 3 }, affinity: "assassin" },
            { text: "Repérer les erreurs des autres pour vous décharger.", stats: { per: 3 }, affinity: "ranger" }
        ]
    }
];

// ==========================================
// 2. DONNÉES DES CLASSES
// ==========================================
const classesData = {
    guerrier: {
        name: "Guerrier",
        mainStat: "str",
        position: "Avant-Garde",
        awakeningText: "En ouvrant une porte, la poignée vous reste dans la main. L'acier s'est écrasé comme du plastique sous vos doigts. Votre sang bouillonne d'une puissance physique incontrôlable. Vous vous sentez plus fort que jamais.",
        signatureMove: "Lame Lourde"
    },
    assassin: {
        name: "Assassin",
        mainStat: "agi",
        position: "Flexible",
        awakeningText: "Le monde semble soudain fonctionner au ralenti. Vous rattrapez un verre qui tombe avant même d'avoir consciemment pensé à bouger. Vos réflexes sont fulgurants, la furtivité est désormais votre seconde nature.",
        signatureMove: "Frappe Furtive"
    },
    mage: {
        name: "Mage",
        mainStat: "int",
        position: "Arrière-Garde",
        awakeningText: "Un bourdonnement emplit votre crâne. L'air vibre autour de vous. Vous pouvez sentir l'énergie bleue du mana circuler dans l'atmosphère, prête à se plier à la volonté de votre esprit.",
        signatureMove: "Sortilège"
    },
    tank: {
        name: "Tank",
        mainStat: "vit",
        position: "Avant-Garde",
        awakeningText: "Votre corps est devenu aussi dense que l'osmium. En vous cognant contre un meuble, celui-ci explose en éclats de bois. Vous êtes devenu un mur vivant, conçu pour encaisser l'impossible.",
        signatureMove: "Posture Inébranlable"
    },
    ranger: {
        name: "Ranger",
        mainStat: "per",
        position: "Arrière-Garde",
        awakeningText: "En vous réveillant, vous percevez les battements de votre cœur, les ailes des oiseaux dehors et entendez les conversations discrètes des passants dans la rue. Vos sens semblent décuplés, ciblant le monde entier.",
        signatureMove: "Tir de Précision"
    },
    joueur: {
        name: "Joueur du Système",
        mainStat: "all",
        position: "Flexible",
        awakeningText: "[ BIENVENUE, JOUEUR. ] Les mots flottent dans l'air devant vos yeux sous forme holographique. Vous n'avez pas de limite. Vous n'avez pas de classe définie. Le Système vous appartient.",
        signatureMove: "Attaque Basique"
    }
};

// ==========================================
// 3. LES DONJONS SPÉCIAUX (PHASE 2)
// ==========================================
const specialDungeons = [
    {
        id: "temple_carthenon",
        chance: 50,
        title: "Le Temple de Carthénon",
        description: "Les portes du boss se referment. D'immenses statues de pierre bordent la salle. Au centre, une statue d'un Dieu géant vous observe. Ses yeux s'illuminent de rouge. [ PREMIER COMMANDEMENT : VÉNÉREZ LE SEIGNEUR ]",
        choices: [
            { text: "Se prosterner immédiatement au sol.", action: "survive", next: "commandement_2" },
            { text: "Courir vers la porte pour fuir.", action: "death", reason: "Un rayon laser jaillit des yeux de la statue géante et vous vaporise instantanément." },
            { text: "Attaquer les petites statues.", action: "death", reason: "Une statue à six bras vous écrase avec sa masse géante." }
        ]
    },
    {
        id: "abime_oublie",
        chance: 25,
        title: "L'Abîme Oublié",
        description: "Le sol s'effondre sous vos pieds. Vous tombez dans des ténèbres absolues. Le froid pénètre vos os et des murmures incessants attaquent votre esprit.",
        choices: [
            { text: "Fermer les yeux et bloquer les murmures (Jet d'INT).", action: "stat_check", stat: "int", target: 12 },
            { text: "Taper les murs à l'aveugle pour trouver une faille (Jet de FOR).", action: "stat_check", stat: "str", target: 14 }
        ]
    },
    {
        id: "labyrinthe_illusions",
        chance: 25,
        title: "Le Labyrinthe des Illusions",
        description: "Vous êtes entouré de miroirs. Chaque reflet vous montre une version terrifiante de vous-même. Les miroirs commencent à se refermer sur vous.",
        choices: [
            { text: "Briser les miroirs d'un coup précis (Jet de PER).", action: "stat_check", stat: "per", target: 13 },
            { text: "Esquiver les bris de glace pendant qu'ils s'effondrent (Jet d'AGI).", action: "stat_check", stat: "agi", target: 12 }
        ]
    }
];

// ==========================================
// 4. LE BESTIAIRE
// ==========================================
const bestiary = {
    E: [
        { name: "Limon Bleu", hp: 30, maxHp: 30, attack: 5, defense: 2, status: "Normal", special: null },
        { name: "Gobelin Éclaireur", hp: 40, maxHp: 40, attack: 8, defense: 1, status: "Normal", special: "Esquive" },
        { name: "Loup à Crocs d'Acier", hp: 50, maxHp: 50, attack: 12, defense: 3, status: "Normal", special: "Saignement" }
    ],
    D: [
        { name: "Macaque Enragé", hp: 80, maxHp: 80, attack: 18, defense: 5, status: "Normal", special: "Agilité accrue" },
        { name: "Araignée des Cavernes", hp: 90, maxHp: 90, attack: 15, defense: 4, status: "Normal", special: "Étourdissement" },
        { name: "Golem de Pierre", hp: 150, maxHp: 150, attack: 10, defense: 15, status: "Normal", special: "Résistance Physique" }
    ],
    C: [
        { name: "Homme-Lézard", hp: 200, maxHp: 200, attack: 30, defense: 10, status: "Normal", special: "Étourdissement" },
        { name: "Vampire Mineur", hp: 180, maxHp: 180, attack: 25, defense: 8, status: "Normal", special: "Vol de Vie" },
        { name: "Orc du Désert", hp: 250, maxHp: 250, attack: 40, defense: 5, status: "Normal", special: "Brise-Armure" }
    ],
    B: [
        { name: "Haut Orc", hp: 400, maxHp: 400, attack: 60, defense: 25, status: "Normal", special: "Parade Parfaite" },
        { name: "Yéti des Glaces", hp: 450, maxHp: 450, attack: 55, defense: 20, status: "Normal", special: "Gel" },
        { name: "Assassin de l'Ombre", hp: 300, maxHp: 300, attack: 80, defense: 10, status: "Normal", special: "Frappe Arrière-Garde" }
    ],
    A: [
        { name: "Chevalier de la Mort", hp: 800, maxHp: 800, attack: 120, defense: 60, status: "Normal", special: "Immunité" },
        { name: "Wyverne", hp: 750, maxHp: 750, attack: 140, defense: 40, status: "Normal", special: "Volante" }
    ],
    S: [
        { name: "Dragon de Feu", hp: 3000, maxHp: 3000, attack: 300, defense: 100, status: "Normal", special: "Souffle de Destruction (Zone + Brûlure)" },
        { name: "Géant Cuirassé", hp: 4000, maxHp: 4000, attack: 250, defense: 200, status: "Normal", special: "Rebond Physique" }
    ]
};

// ==========================================
// 5. INVENTAIRE ET OBJETS
// ==========================================
const itemsDatabase = {
    // Consommables
    "potion_e": { id: "potion_e", name: "Potion de Soin (E)", type: "consumable", value: 50, price: 100, stackable: true },
    "potion_mana_e": { id: "potion_mana_e", name: "Potion de Mana (E)", type: "consumable", value: 30, price: 120, stackable: true },
    "bandage": { id: "bandage", name: "Bandages Médicaux", type: "consumable", effect: "cure_bleed", price: 50, stackable: true },
    "antidote": { id: "antidote", name: "Antidote Universel", type: "consumable", effect: "cure_poison", price: 80, stackable: true },
    "elixir_vie": { id: "elixir_vie", name: "Élixir de Vie", type: "legendary", effect: "max_heal", price: 500000, stackable: false },
    
    // Matériaux
    "noyau_e": { id: "noyau_e", name: "Noyau Magique (E)", type: "material", price: 50, stackable: true },
    "cadavre": { id: "cadavre", name: "Cadavre de Monstre", type: "material", price: 30, stackable: true },
    "pierre_essence": { id: "pierre_essence", name: "Pierre d'Essence", type: "currency", price: 0, stackable: true }, // Monnaie Endgame

    // Objets de Progression & Quêtes
    "cle_s": { id: "cle_s", name: "Clé S (Héritage)", type: "quest", price: 0, stackable: false },
    "dissimulateur": { id: "dissimulateur", name: "Dissimulateur de Mana", type: "tool", price: 5000, stackable: false },
    
    // Équipement Guerrier (Force)
    "epee_rouillee": { id: "epee_rouillee", name: "Épée Rouillée (E)", type: "weapon", class: "guerrier", mult: 1.2, price: 200 },
    // Équipement Assassin (Agilité)
    "dague_emoussee": { id: "dague_emoussee", name: "Dague Émoussée (E)", type: "weapon", class: "assassin", mult: 1.2, price: 200 },
    // Équipement Mage (Intelligence)
    "baton_bois": { id: "baton_bois", name: "Bâton en Bois (E)", type: "weapon", class: "mage", mult: 1.2, price: 200 },
    // Équipement Ranger (Perception)
    "arc_chasse": { id: "arc_chasse", name: "Arc de Chasse (E)", type: "weapon", class: "ranger", mult: 1.2, price: 200 },
    // Équipement Tank (Vitalité)
    "bouclier_bois": { id: "bouclier_bois", name: "Bouclier en Bois (E)", type: "weapon", class: "tank", mult: 1.2, price: 200 }
};
