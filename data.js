// data.js - Partie 1 : Configuration, Métiers, Classes, Objets et Guildes

const GAME_DATA = {
    jobs: {
        ouvrier: { name: "Ouvrier", bonus: { force: 3, agilite: 1, intelligence: 1, vitalite: 2, perception: 1 }, gold: 100 },
        employe: { name: "Employé", bonus: { force: 1, agilite: 1, intelligence: 3, vitalite: 1, perception: 2 }, gold: 120 },
        livreur: { name: "Livreur", bonus: { force: 1, agilite: 3, intelligence: 1, vitalite: 1, perception: 2 }, gold: 90 },
        etudiant: { name: "Étudiant", bonus: { force: 1, agilite: 2, intelligence: 2, vitalite: 1, perception: 2 }, gold: 80 }
    },

    classes: {
        guerrier: { name: "Guerrier", statKey: "force", position: "avant-garde", desc: "Protecteur offensif axé sur la force brute." },
        assassin: { name: "Assassin", statKey: "agilite", position: "flexible", desc: "DPS physique rapide, esquive et critiques." },
        mage: { name: "Mage", statKey: "intelligence", position: "arriere-garde", desc: "DPS magique de zone, gestion des points de mana." },
        tank: { name: "Tank", statKey: "vitalite", position: "avant-garde", desc: "Gardien résistant protégeant l'équipe." },
        ranger: { name: "Ranger", statKey: "perception", position: "arriere-garde", desc: "Traqueur à distance, analyse des faiblesses." },
        joueur_systeme: { name: "Joueur du Système", statKey: "libre", position: "flexible", desc: "Classe secrète évolutive avec points libres." }
    },

    items: {
        potions: [
            { id: "potion_soin_e", name: "Potion de Soin (E)", type: "consumable", rank: "E", effect: { hp: 50 }, price: 50 },
            { id: "potion_soin_d", name: "Potion de Soin (D)", type: "consumable", rank: "D", effect: { hp: 120 }, price: 150 },
            { id: "potion_soin_c", name: "Potion de Soin (C)", type: "consumable", rank: "C", effect: { hp: 300 }, price: 400 },
            { id: "potion_mana_e", name: "Potion de Mana (E)", type: "consumable", rank: "E", effect: { mp: 40 }, price: 60 },
            { id: "potion_mana_c", name: "Potion de Mana (C)", type: "consumable", rank: "C", effect: { mp: 150 }, price: 450 },
            { id: "bandages", name: "Bandages Médicaux", type: "consumable", rank: "E", effect: { cure: "saignement" }, price: 30 },
            { id: "antidote", name: "Antidote Universel", type: "consumable", rank: "E", effect: { cure: "poison" }, price: 40 },
            { id: "cristal_teleport", name: "Cristal de Téléportation", type: "consumable", rank: "A", effect: { escape: true }, price: 5000 }
        ],
        materials: [
            { id: "noyau_e", name: "Noyau Magique (E)", type: "material", rank: "E", price: 25 },
            { id: "noyau_d", name: "Noyau Magique (D)", type: "material", rank: "D", price: 80 },
            { id: "noyau_c", name: "Noyau Magique (C)", type: "material", rank: "C", price: 250 },
            { id: "cadavre_monstre", name: "Cadavre de Monstre", type: "material", rank: "E", price: 40 },
            { id: "pierre_essence", name: "Pierre d'Essence", type: "currency", rank: "S", price: 10000 }
        ],
        keys: [
            { id: "cle_e", name: "Clé de Donjon (E)", type: "key", rank: "E" },
            { id: "cle_d", name: "Clé de Donjon (D)", type: "key", rank: "D" },
            { id: "cle_c", name: "Clé de Donjon (C)", type: "key", rank: "C" },
            { id: "cle_b", name: "Clé de Donjon (B)", type: "key", rank: "B" },
            { id: "cle_a", name: "Clé de Donjon (A)", type: "key", rank: "A" },
            { id: "cle_s", name: "La Clé S (Héritage)", type: "key", rank: "S", unique: true }
        ],
        special: [
            { id: "faux_papiers", name: "Faux Papiers d'Identité", type: "special", price: 15000 },
            { id: "dissimulateur", name: "Dissimulateur de Mana", type: "special", price: 50000 },
            { id: "elixir_vie", name: "Élixir de Vie", type: "legendary", price: 1000000, effect: { curePermanent: true, vitalite: 10 } }
        ]
    },

    guilds: {
        mineures: [
            { id: "chiens_de_garde", name: "Les Chiens de Garde", rankMax: "C", commission: 0.40, desc: "Contrats précaires, recrute tout le monde." },
            { id: "bouclier_argent", name: "Le Bouclier d'Argent", rankMax: "C", salary: 100, desc: "Guilde défensive, protège ses membres." },
            { id: "charognards", name: "Les Charognards", rankMax: "C", bonusLoot: 1.5, desc: "Spécialisés dans l'excavation et les cadavres." }
        ],
        canoniques: [
            { id: "faucheurs", name: "La Guilde des Faucheurs (Reapers)", rankMin: "B", salary: 1000, penaltyEscape: true, desc: "Salaire énorme, mortalité élevée." },
            { id: "tigre_blanc", name: "La Guilde du Tigre Blanc (Baekho)", rankMin: "B", bonusStat: "force", desc: "Axée sur la force brute et le corps-à-corps." },
            { id: "chasseurs", name: "La Guilde des Chasseurs (Hunters)", rankMin: "A", bonusStat: "all", desc: "L'élite absolue." }
        ]
    }

    // data.js - Partie 2 : Bestiaire, Personnages Canoniques et Événements

GAME_DATA.bestiary = {
    // Rangs E et D
    limon_e: { name: "Limon / Gelée", rank: "E", hp: 40, attack: 12, defense: 5, exp: 15, gold: 10, loot: "noyau_e" },
    gobelin_e: { name: "Gobelin Éclaireur", rank: "E", hp: 60, attack: 18, defense: 8, evasion: 0.2, exp: 25, gold: 15, loot: "noyau_e" },
    loup_e: { name: "Loup à Crocs d'Acier", rank: "E", hp: 55, attack: 22, defense: 6, special: "saignement", exp: 30, gold: 18, loot: "cadavre_monstre" },
    boss_gobelin_e: { name: "Chef Gobelin", rank: "E", hp: 180, attack: 35, defense: 12, isBoss: true, special: "renforts", exp: 100, gold: 100, loot: "noyau_e" },
    
    macaque_d: { name: "Macaque Enragé", rank: "D", hp: 90, attack: 28, defense: 10, evasion: 0.35, exp: 50, gold: 30, loot: "noyau_d" },
    araignee_d: { name: "Araignée des Cavernes", rank: "D", hp: 110, attack: 32, defense: 15, special: "etourdissement", exp: 65, gold: 40, loot: "noyau_d" },
    golem_d: { name: "Golem de Pierre", rank: "D", hp: 200, attack: 25, defense: 40, vulnMagie: true, exp: 80, gold: 50, loot: "noyau_d" },
    boss_araignee_d: { name: "Reine Araignée", rank: "D", hp: 350, attack: 48, defense: 20, isBoss: true, special: "poison", exp: 250, gold: 200, loot: "noyau_d" },

    // Rangs C et B
    homme_lezard_c: { name: "Homme-Lézard", rank: "C", hp: 250, attack: 55, defense: 30, special: "etourdissement", exp: 150, gold: 100, loot: "noyau_c" },
    vampire_c: { name: "Vampire Mineur", rank: "C", hp: 220, attack: 60, defense: 25, special: "vol_de_vie", exp: 180, gold: 120, loot: "noyau_c" },
    orc_c: { name: "Orc du Désert", rank: "C", hp: 300, attack: 70, defense: 35, ignoreArmor: 0.2, exp: 200, gold: 150, loot: "noyau_c" },
    boss_orc_c: { name: "Chef de Tribu Orc", rank: "C", hp: 700, attack: 90, defense: 45, isBoss: true, special: "cri_guerre", exp: 600, gold: 500, loot: "noyau_c" },

    haut_orc_b: { name: "Haut Orc", rank: "B", hp: 500, attack: 110, defense: 60, exp: 400, gold: 300, loot: "noyau_c" },
    yeti_b: { name: "Yéti des Glaces", rank: "B", hp: 650, attack: 95, defense: 70, special: "gel", exp: 450, gold: 350, loot: "noyau_c" },
    assassin_ombre_b: { name: "Assassin de l'Ombre", rank: "B", hp: 400, attack: 130, defense: 40, targetBack: true, exp: 500, gold: 400, loot: "noyau_c" },
    boss_chamane_b: { name: "Chamane Haut Orc", rank: "B", hp: 1200, attack: 120, defense: 55, isBoss: true, special: "brulure_et_soin", exp: 1200, gold: 1000, loot: "noyau_c" },

    // Rangs A et S
    chevalier_mort_a: { name: "Chevalier de la Mort", rank: "A", hp: 1500, attack: 200, defense: 120, immuniteEtat: true, exp: 2000, gold: 1500, loot: "pierre_essence" },
    wyverne_a: { name: "Wyverne", rank: "A", hp: 1300, attack: 220, defense: 90, vol: true, exp: 2200, gold: 1800, loot: "pierre_essence" },
    boss_liche_a: { name: "Liche Ancestrale", rank: "A", hp: 3000, attack: 250, defense: 100, isBoss: true, special: "confusion", exp: 5000, gold: 4000, loot: "pierre_essence" },

    dragon_s: { name: "Dragon de Feu", rank: "S", hp: 8000, attack: 500, defense: 300, isBoss: true, special: "souffle_destruction", exp: 20000, gold: 15000, loot: "pierre_essence" },
    architecte_s: { name: "L'Architecte", rank: "S", hp: 12000, attack: 600, defense: 400, isBoss: true, special: "statues_incassables", exp: 50000, gold: 30000, loot: "pierre_essence" }
};

GAME_DATA.characters = {
    go_geon_hee: { name: "Go Geon-Hee", role: "Président de l'Association", type: "npc", desc: "Apparaît si la réputation est maximale." },
    woo_jin_chul: { name: "Woo Jin-Chul", role: "Chef de la Surveillance", type: "npc", desc: "Inspecte le joueur de manière aléatoire." },
    choi_jong_in: { name: "Choi Jong-In", role: "Maître des Chasseurs", type: "npc", desc: "L'Arme Ultime, mentor potentiel pour les mages/rangers." },
    baek_yoon_ho: { name: "Baek Yoon-Ho", role: "Maître du Tigre Blanc", type: "npc", desc: "Spécialiste de la force et du combat rapproché." },
    cha_hae_in: { name: "Cha Hae-In", role: "Vice-Maître des Chasseurs", type: "npc", desc: "Offre un entraînement d'agilité extrême." },
    yoo_jinho: { name: "Yoo Jinho", role: "L'héritier financier", type: "npc", desc: "Propose d'injecter de l'or dans votre guilde." },
    kang_tae_shik: { name: "Kang Tae-Shik", role: "Inspecteur Psychopathe", type: "enemy_human", desc: "Rencontre traîtresse en donjon." },
    hwang_dong_su: { name: "Hwang Dong-Su", role: "Renégat de haut rang", type: "enemy_human", desc: "Déclenche une vendetta si vous attaquez ses intérêts." }
};

GAME_DATA.events = {
    phase1: [
        { id: "p1_1", title: "Un colis difficile", desc: "En tant que livreur, un client refuse de signer pour un paquet suspect qui émet un léger bourdonnement.", choices: [
            { text: "Forcer la signature et partir vite", stat: "agilite", bonus: 1, karma: 0 },
            { text: "Ouvrir le colis par curiosité", stat: "perception", bonus: 1, karma: -1 },
            { text: "Ignorer et rendre le colis à l'entrepôt", stat: "vitalite", bonus: 1, karma: 1 }
        ]},
        { id: "p1_2", title: "Heure supplémentaire", desc: "Votre supérieur vous demande de rester tard pour boucler un bilan comptable complexe.", choices: [
            { text: "Accepter et travailler toute la nuit", stat: "intelligence", bonus: 1, karma: 0 },
            { text: "Refuser et aller s'entraîner à la salle", stat: "force", bonus: 1, karma: 0 },
            { text: "Faire semblant de travailler et partir en douce", stat: "agilite", bonus: 1, karma: -1 }
        ]}
    ]

    
