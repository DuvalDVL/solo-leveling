// ==========================================
// BASE DE DONNÉES DU JEU (data.js)
// ==========================================

const gameData = {
    // ------------------------------------------
    // 1. LES OBJETS & ÉQUIPEMENTS
    // ------------------------------------------
    items: [
        {
            id: "potion_soin_e",
            nom: "Potion de Soin Basique",
            type: "consommable",
            rang: "E",
            image: "assets/items/consommables/potion_soin_e.png",
            stackable: true,
            description: "Restaure 50 PV.",
            effet: { type: "soin_pv", valeur: 50 }
        },
        {
            id: "dague_emoussee",
            nom: "Dague Émoussée",
            type: "arme_principale",
            rang: "E",
            image: "assets/items/armes/dague_emoussee.png",
            stackable: false,
            description: "Une arme de fortune. Bonus : +2 Agilité.",
            stats: { agilite: 2, force: 1 },
            competence_texte: "Poignarder maladroitement"
        },
        {
            id: "epee_flamboyante_b",
            nom: "Épée Longue du Brasier",
            type: "arme_principale",
            rang: "B",
            image: "assets/items/armes/epee_flamboyante.png",
            stackable: false,
            description: "Lame imprégnée de magie. Inflige Brûlure.",
            stats: { force: 25, intelligence: 10 },
            competence_texte: "Trancher avec des flammes",
            statut_applique: { type: "brulure", chance: 0.3, duree: 3 }
        },
        {
            id: "anneau_dissimulation",
            nom: "Anneau de Dissimulation",
            type: "accessoire",
            rang: "C",
            image: "assets/items/accessoires/anneau_dissimulation.png",
            stackable: false,
            description: "Masque le véritable niveau de mana de son porteur (Illégal).",
            stats: { intelligence: 5 },
            special: "masque_mana"
        },
        {
            id: "cle_donjon_s",
            nom: "Clé du Temple Oublié",
            type: "special",
            rang: "S",
            image: "assets/items/special/cle_temple.png",
            stackable: false,
            description: "Une clé vibrant d'une énergie cosmique terrifiante.",
            effet: { type: "ouvre_donjon", rang: "S", cible: "temple_monarque" }
        }
    ],

    // ------------------------------------------
    // 2. LE BESTIAIRE
    // ------------------------------------------
    monstres: [
        {
            id: "limon_acide",
            nom: "Limon Acide",
            rang: "E",
            type: "mob",
            stats: { pv: 30, attaque: 5, defense: 2 },
            comportement: "agressif",
            loot: [
                { item: "cristal_mana_e", chance: 0.8, quantite: 1 }
            ]
        },
        {
            id: "chef_hobgobelin",
            nom: "Chef Hobgobelin",
            rang: "D",
            type: "boss",
            stats: { pv: 150, attaque: 15, defense: 10 },
            comportement: "tactique", // Peut bloquer ou appeler des renforts
            loot: [
                { item: "cristal_mana_d", chance: 1, quantite: 3 },
                { item: "dague_emoussee", chance: 0.5, quantite: 1 }
            ]
        },
        {
            id: "chevalier_ombre",
            nom: "Chevalier d'Ombre",
            rang: "B",
            type: "mob",
            stats: { pv: 500, attaque: 45, defense: 40 },
            comportement: "lourd", // Attaques lentes mais dévastatrices
            loot: [
                { item: "pierre_essence", chance: 0.1, quantite: 1 },
                { item: "epee_flamboyante_b", chance: 0.05, quantite: 1 }
            ]
        }
    ],

    // ------------------------------------------
    // 3. LES ÉVÉNEMENTS (Phase 1 & Donjons)
    // ------------------------------------------
    evenements: {
        phase1: [
            // Réservoir des 30 événements avant l'Éveil
            {
                id: "p1_rencontre_voyou",
                texte: "En rentrant chez vous, des voyous vous demandent votre argent.",
                choix: [
                    { texte: "Donner 50 Or", effet: { or: -50, karma: 0, msg: "Vous évitez les ennuis." } },
                    { texte: "Vous défendre", condition: { stat: "force", min: 3 }, effet: { or: 20, pv: -10, msg: "Vous gagnez, mais subissez des coups." } }
                ]
            },
            {
                id: "p1_chat_perdu",
                texte: "Vous trouvez un chat coincé dans un arbre.",
                choix: [
                    { texte: "L'aider", effet: { karma: +5, agilite: +1, fatigue: 10, msg: "Le propriétaire vous remercie. Vous gagnez en agilité." } },
                    { texte: "Ignorer", effet: { karma: -2, msg: "Vous passez votre chemin." } }
                ]
            }
            // ... (à remplir jusqu'à 30)
        ],
        donjon: [
            // Réservoir des 70 événements de donjon
            {
                id: "d_piege_lames",
                texte: "Le couloir est tapissé de dalles suspectes.",
                rangMin: "E",
                theme: "tous",
                type: "interaction",
                choix: [
                    { 
                        texte: "Utiliser Perception (Jet)", 
                        typeAction: "jet_perception", 
                        succes: { texte: "Vous désamorcez le piège.", xp: 10, fatigue: 5 },
                        echec: { texte: "Vous déclenchez les lames !", pv: -20, statut: "saignement" }
                    }
                ]
            },
            {
                id: "d_autel_sanglant",
                texte: "Un autel ancien dégage une odeur de fer et de mort.",
                rangMin: "C",
                theme: "temple",
                type: "interaction",
                choix: [
                    { texte: "Offrir de son sang (-50 PV)", effet: { pv: -50, item_gagne: "pierre_essence" } },
                    { texte: "Détruire l'autel", typeAction: "combat", monstre_id: "chevalier_ombre" },
                    { texte: "Passer son chemin", effet: { msg: "Vous frissonnez, mais avancez." } }
                ]
            }
            // ... (à remplir jusqu'à 70)
        ]
    },

    // ------------------------------------------
    // 4. LES GUILDES
    // ------------------------------------------
    guildes: [
        {
            id: "chiens_garde",
            nom: "Les Chiens de Garde",
            rangRequis: "E",
            salaireBase: 100, // Or par jour
            commission: 0.4, // Ils prennent 40% des butins
            bonus: { defense: 0, attaque: 5 },
            description: "Guilde précaire, idéale pour les débutants désespérés."
        },
        {
            id: "bouclier_argent",
            nom: "Le Bouclier d'Argent",
            rangRequis: "D",
            salaireBase: 300,
            commission: 0.2,
            bonus: { defense: 20, pv_max: 50 },
            description: "Une guilde solide qui privilégie la survie de ses membres."
        },
        {
            id: "faucheurs",
            nom: "La Guilde des Faucheurs",
            rangRequis: "B",
            salaireBase: 1500,
            commission: 0.1,
            bonus: { attaque: 30, critique: 0.15 },
            description: "Prestigieuse, brutale. Seuls les plus forts survivent à leurs raids."
        }
    ]
};
