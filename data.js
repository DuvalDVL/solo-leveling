// ==========================================
// BASE DE DONNÉES DU JEU INTÉGRALE (data.js)
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
            id: "potion_soin_d",
            nom: "Potion de Soin Avancée",
            type: "consommable",
            rang: "D",
            image: "assets/items/consommables/potion_soin_d.png",
            stackable: true,
            description: "Restaure 150 PV.",
            effet: { type: "soin_pv", valeur: 150 }
        },
        {
            id: "cristal_mana_e",
            nom: "Cristal de Mana Brute",
            type: "materiau",
            rang: "E",
            image: "assets/items/materiaux/cristal_mana_e.png",
            stackable: true,
            description: "Un résidu magique extrait d'un monstre de bas étage."
        },
        {
            id: "cristal_mana_d",
            nom: "Cristal de Mana Lumineux",
            type: "materiau",
            rang: "D",
            image: "assets/items/materiaux/cristal_mana_d.png",
            stackable: true,
            description: "Un cristal dégageant une lueur stable."
        },
        {
            id: "pierre_essence",
            nom: "Pierre d'Essence Pure",
            type: "special",
            rang: "S",
            image: "assets/items/special/pierre_essence.png",
            stackable: true,
            description: "Cristal d'âme extrêmement rare. Monnaie de la Boutique du Système."
        },
        {
            id: "dague_emoussee",
            nom: "Dague Émoussée",
            type: "arme_principale",
            rang: "E",
            image: "assets/items/armes/dague_emoussee.png",
            stackable: false,
            description: "Une arme de fortune. Bonus : +2 Agilité, +1 Force.",
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
            id: "dagues_monarque",
            nom: "Dagues du Monarque des Ombres",
            type: "arme_principale",
            rang: "S",
            image: "assets/items/armes/dagues_monarque.png",
            stackable: false,
            description: "L'arme ultime forgée dans le noir absolu.",
            stats: { agilite: 150, force: 100 },
            competence_texte: "Exécution Sombre",
            statut_applique: { type: "saignement_mortel", chance: 0.5, duree: 5 }
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
            stats: { pv: 30, attaque: 5, defense: 2, agilite: 2 },
            comportement: "agressif",
            loot: [
                { item: "cristal_mana_e", chance: 0.8, quantite: 1 }
            ]
        },
        {
            id: "gobelin_lanceur",
            nom: "Gobelin des Cavernes",
            rang: "E",
            type: "mob",
            stats: { pv: 45, attaque: 8, defense: 4, agilite: 6 },
            comportement: "lâche",
            loot: [
                { item: "cristal_mana_e", chance: 0.6, quantite: 1 }
            ]
        },
        {
            id: "chef_hobgobelin",
            nom: "Chef Hobgobelin",
            rang: "D",
            type: "boss",
            stats: { pv: 150, attaque: 15, defense: 10, agilite: 12 },
            comportement: "tactique",
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
            stats: { pv: 500, attaque: 45, defense: 40, agilite: 25 },
            comportement: "lourd",
            loot: [
                { item: "pierre_essence", chance: 0.1, quantite: 1 },
                { item: "epee_flamboyante_b", chance: 0.05, quantite: 1 }
            ]
        },
        {
            id: "mille_pattes_geant",
            nom: "Mille-pattes du Désert (Zone de Pénalité)",
            rang: "A",
            type: "survie",
            stats: { pv: 9999, attaque: 150, defense: 100, agilite: 50 },
            comportement: "implacable",
            description: "Monstre invincible de la Zone de Pénalité. Il faut survivre 4 heures."
        }
    ],

    // ------------------------------------------
    // 3. LES ÉVÉNEMENTS (Phase 1 : 30 Événements)
    // ------------------------------------------
    evenements: {
        phase1: [
            {
                id: "p1_01_voyous",
                texte: "En rentrant chez vous par une ruelle sombre, des voyous de quartier exigent votre argent.",
                choix: [
                    { texte: "Donner 50 Or", effet: { or: -50, karma: 0, msg: "Vous payez pour éviter les ennuis." } },
                    { texte: "Vous défendre (Force min: 5)", condition: { stat: "force", min: 5 }, effet: { or: 25, pv: -10, karma: 1, msg: "Vous donnez une leçon aux voyous et récupérez leur butin." } }
                ]
            },
            {
                id: "p1_02_chat",
                texte: "Vous trouvez un chat errant coincé au sommet d'un grillage rouillé.",
                choix: [
                    { texte: "Aider le chat", effet: { karma: 5, agilite: 1, fatigue: 10, msg: "Le chat miaule joyeusement. Votre agilité s'améliore légèrement par cet effort." } },
                    { texte: "Ignorer", effet: { karma: -2, msg: "Vous passez votre chemin sans vous soucier de l'animal." } }
                ]
            },
            {
                id: "p1_03_pub_guildes",
                texte: "Un tract publicitaire pour une guilde de bas étage glisse sous votre porte.",
                choix: [
                    { texte: "Lire attentivement (+ Perception)", effet: { perception: 1, msg: "Vous analysez les clauses abusives du contrat." } },
                    { texte: "Jeter à la poubelle", effet: { msg: "Vous ignorez les sirènes des guildes." } }
                ]
            },
            {
                id: "p1_04_fatigue_chronique",
                texte: "Votre corps subit le contrecoup des petits boulots extérieurs. Une fatigue intense vous prend.",
                choix: [
                    { texte: "Prendre un excitant chimique (-10 PV, - Fatigue)", effet: { pv: -10, fatigue: -20, msg: "Votre cœur s'emballe, mais la fatigue disparaît." } },
                    { texte: "S'allonger un moment", effet: { fatigue: -10, msg: "Vous récupérez un peu d'énergie au prix de votre temps." } }
                ]
            },
            {
                id: "p1_05_colis_anonyme",
                texte: "Un colis non étiqueté est déposé devant votre palier. Il émet un léger bourdonnement.",
                choix: [
                    { texte: "Ouvrir le colis", effet: { or: 100, pv: -15, msg: "C'était un piège magique de bas niveau, mais il y avait de l'or à l'intérieur !" } },
                    { texte: "Le jeter dans la benne", effet: { msg: "La prudence est mère de sûreté. Vous vous en débarrassez." } }
                ]
            },
            {
                id: "p1_06_veilleur_nuit",
                texte: "Un vieil homme s'effondre sur le trottoir en pleine rue sous le regard indifférent des passants.",
                choix: [
                    { texte: "L'aider et le raccompagner", effet: { karma: 10, or: -20, msg: "L'homme vous remercie chaleureusement et vous bénit." } },
                    { texte: "L'ignorer superbement", effet: { karma: -5, msg: "Le monde des chasseurs est impitoyable." } }
                ]
            },
            {
                id: "p1_07_entrainement_saccage",
                texte: "Vous décidez de faire des pompes et des abdos intensifs dans votre salon.",
                choix: [
                    { texte: "Pousser ses limites (100 pompes, squats...)", effet: { force: 1, fatigue: 30, msg: "Votre corps brûle, vos muscles se fortifient !" } },
                    { texte: "Séance légère", effet: { force: 0, fatigue: 10, msg: "Une routine classique pour maintenir la forme." } }
                ]
            },
            {
                id: "p1_08_veille_fissure",
                texte: "Une micro-fissure dimensionnelle s'ouvre brièvement dans votre cuisine, laissant échapper une odeur d'ozone.",
                choix: [
                    { texte: "Toucher la brèche", effet: { intelligence: 1, pm: 10, msg: "Votre esprit effleure l'énergie du Mana." } },
                    { texte: "Fuir dans le salon", effet: { msg: "Vous attendez terrifié que la brée se referme d'elle-même." } }
                ]
            },
            {
                id: "p1_09_proche_inquiet",
                texte: "Un membre de votre famille appelle pour savoir si vous vous en sortez financièrement.",
                choix: [
                    { texte: "Rassurer et envoyer un peu d'argent (-50 Or)", effet: { or: -50, karma: 5, msg: "Ils sont soulagés d'avoir de vos nouvelles." } },
                    { texte: "Mentir et raccrocher", effet: { karma: -2, msg: "Vous préférez garder vos deniers pour survivre." } }
                ]
            },
            {
                id: "p1_10_marche_noir_info",
                texte: "Dans un forum obscur en ligne, un utilisateur anonyme vend des coordonnées de portails non répertoriés.",
                choix: [
                    { texte: "Acheter l'information (100 Or)", effet: { or: -100, perception: 1, msg: "Vous apprenez à repérer les anomalies d'aura." } },
                    { texte: "Fermer la page", effet: { msg: "Trop louche pour être honnête." } }
                ]
            },
            {
                id: "p1_11_agression_metro",
                texte: "Dans le métro bondé, un individu louche bouscule volontairement les passagers pour les détrousser.",
                choix: [
                    { texte: "Le coincer discrètement", effet: { karma: 3, or: 40, msg: "Vous récupérez les portefeuilles volés et gardez une part." } },
                    { texte: "Tourner la tête", effet: { msg: "Ce n'est pas vos oignons." } }
                ]
            },
            {
                id: "p1_12_panne_courant",
                texte: "Une coupure de courant générale plonge votre immeuble dans le noir complet pendant des heures.",
                choix: [
                    { texte: "Méditer dans l'obscurité", effet: { intelligence: 1, fatigue: -5, msg: "Le calme forcé vous permet de clarifier votre esprit." } },
                    { texte: "Allumer des bougies et s'impatienter", effet: { fatigue: 5, msg: "Une soirée longue et ennuyeuse." } }
                ]
            },
            {
                id: "p1_13_recrutement_force",
                texte: "Un rabatteur de guilde vous aborde agressivement à la sortie de votre immeuble.",
                choix: [
                    { texte: "Le menacer du regard (Agilité min: 8)", condition: { stat: "agilite", min: 8 }, effet: { karma: 2, msg: "Il comprend tout de suite qu'il perd son temps avec vous." } },
                    { texte: "Esquiver poliment et fuir", effet: { msg: "Vous décampez avant qu'il n'insiste." } }
                ]
            },
            {
                id: "p1_14_medication_douteuse",
                texte: "Un médecin de rue propose des pilules miracles censées augmenter la résistance au stress des Chasseurs.",
                choix: [
                    { texte: "Acheter et consommer (75 Or)", effet: { or: -75, pvMax: 5, msg: "Vos veines brûlent, mais votre corps encaisse mieux." } },
                    { texte: "Refuser net", effet: { msg: "L'arnaque est grossière." } }
                ]
            },
            {
                id: "p1_15_etincelle_reveil",
                texte: "Au milieu de la nuit, une violente migraine vous réveille. Vos yeux brillent brièvement d'une lueur bleue.",
                choix: [
                    { texte: "Accepter la douleur", effet: { perception: 2, pm: 20, msg: "Votre corps s'adapte lentement à l'appel du Système." } },
                    { texte: "Prendre des analgésiques", effet: { fatigue: 10, msg: "Vous étouffez les symptômes." } }
                ]
            },
            {
                id: "p1_16_journal_brise",
                texte: "Vous trouvez un vieux journal intime abandonné sur un banc public, écrit par un ancien Chasseur déchu.",
                choix: [
                    { texte: "Le lire en entier", effet: { intelligence: 1, karma: 2, msg: "Ses erreurs passées deviennent vos leçons de survie." } },
                    { texte: "L'utiliser pour allumer un feu", effet: { msg: "Du papier bon à jeter." } }
                ]
            },
            {
                id: "p1_17_incident_bureau",
                texte: "Votre supérieur hiérarchique direct vous humilie injustement devant vos collègues de travail.",
                choix: [
                    { texte: "Garder son calme et encaisser", effet: { karma: 1, fatigue: 10, msg: "Vous serrez les poings en silence. Votre patience s'aiguise." } },
                    { texte: "L'envoyer balader et claquer la porte", effet: { or: -100, karma: -2, msg: "Libre, mais financièrement dans le pétrin." } }
                ]
            },
            {
                id: "p1_18_poubelle_magique",
                texte: "En jetant vos ordures, vous remarquez un composant de portail jeté par erreur par un autre Chasseur.",
                choix: [
                    { texte: "Fouiller la benne", effet: { item_gagne: "cristal_mana_e", msg: "Vous récupérez un cristal à moitié utilisable !" } },
                    { texte: "Ne pas se salir les mains", effet: { msg: "Vous rebroussez chemin." } }
                ]
            },
            {
                id: "p1_19_propos_nocturnes",
                texte: "Des bruits de pas lourds et anormaux résonnent sur le toit de votre immeuble au milieu de la nuit.",
                choix: [
                    { texte: "Aller voir par la fenêtre", effet: { perception: 1, msg: "Vous apercevez l'ombre fugace d'une bête familière." } },
                    { texte: "Se cacher sous les draps", effet: { msg: "La peur vous paralyse." } }
                ]
            },
            {
                id: "p1_20_don_sanguin_cache",
                texte: "Une clinique louche propose de l'argent rapide en échange de prélèvements sanguins inexpliqués.",
                choix: [
                    { texte: "Donner du sang contre de l'or (50 Or, -15 PV)", effet: { or: 50, pv: -15, msg: "Vous repartez plus pauvre en sang, un peu plus riche en pièces." } },
                    { texte: "Refuser et fuir l'endroit", effet: { msg: "L'ambiance est irrespirable." } }
                ]
            },
            {
                id: "p1_21_cours_art_martiaux",
                texte: "Une vieille vidéo d'un maître d'arts martiaux legendaire circule sur un réseau crypté.",
                choix: [
                    { texte: "Étudier les postures (Intelligence min: 6)", condition: { stat: "intelligence", min: 6 }, effet: { agilite: 1, msg: "Vous comprenez comment optimiser vos déplacements." } },
                    { texte: "Trouver ça inefficace", effet: { msg: "Vous perdez votre temps." } }
                ]
            },
            {
                id: "p1_22_voisin_bruyant",
                texte: "Votre voisin fait un tapage nocturne insupportable alors que vous devez récupérer pour un raid.",
                choix: [
                    { texte: "Aller lui expliquer poliment la situation", effet: { karma: 1, fatigue: 5, msg: "Il s'excuse et baisse le son." } },
                    { texte: "Frapper violemment à sa porte", effet: { karma: -2, force: 1, msg: "Il cède de peur. Vous avez évacué votre frustration." } }
                ]
            },
            {
                id: "p1_23_loterie_douteuse",
                texte: "Un ticket de loterie acheté par ennui dans une supérette de quartier.",
                choix: [
                    { texte: "Gratter le ticket (Coût: 10 Or)", effet: { or: 40, msg: "C'est petit, mais vous avez gagné un petit pactole !" } },
                    { texte: "Jeter le ticket", effet: { or: -10, msg: "De l'argent jeté par la fenêtre." } }
                ]
            },
            {
                id: "p1_24_faim_de_loup",
                texte: "Faute d'argent, votre frigo est désespérément vide pour les trois prochains jours.",
                choix: [
                    { texte: "Manger des rations de survie bon marché (-10 PV)", effet: { pv: -10, msg: "Ça cale l'estomac, mais c'est infect." } },
                    { texte: "Jeûner en dormant", effet: { fatigue: 15, msg: "Le ventre vide, le sommeil est agité." } }
                ]
            },
            {
                id: "p1_25_regard_tranchant",
                texte: "Dans le métro, un inconnu vous fixe intensément avec une hostilité non dissimulée.",
                choix: [
                    { texte: "Soutenir son regard (Perception min: 5)", condition: { stat: "perception", min: 5 }, effet: { perception: 1, msg: "L'inconnu détourne les yeux le premier, intimidé." } },
                    { texte: "Baisser les yeux", effet: { msg: "Inutile de chercher les ennuis." } }
                ]
            },
            {
                id: "p1_26_ reparation_materiel",
                texte: "Votre équipement de base commence à s'effilocher sérieusement.",
                choix: [
                    { texte: "Le réparer vous-même avec du fil et de la colle", effet: { agilite: 1, msg: "Bricolage de fortune mais efficace." } },
                    { texte: "Laisser tel quel", effet: { msg: "Il tiendra bien encore un peu." } }
                ]
            },
            {
                id: "p1_27_appel_secours_anonyme",
                texte: "Votre téléphone vibre avec un message d'alerte automatisé signalant une brèche mineure proche.",
                choix: [
                    { texte: "Ignorer l'alerte", effet: { msg: "Ce n'est pas votre rôle pour l'instant." } },
                    { texte: "Noter l'emplacement pour plus tard", effet: { perception: 1, msg: "Vous commencez à cartographier mentalement la ville." } }
                ]
            },
            {
                id: "p1_28_hallucination_auditive",
                texte: "Une voix mécanique semble résonner au fond de votre esprit, murmurant des mots incompréhensibles.",
                choix: [
                    { texte: "Écouter attentivement", effet: { intelligence: 1, pm: 15, msg: "Votre esprit frôle une structure invisible." } },
                    { texte: "Secouer la tête pour chasser le bruit", effet: { msg: "Vous reprenez vos esprits." } }
                ]
            },
            {
                id: "p1_29_fausse_piste",
                texte: "Un prétendu expert en ésotérisme propose des cours pour éveiller ses pouvoirs de Chasseur.",
                choix: [
                    { texte: "Payer la formation (50 Or)", effet: { or: -50, msg: "C'était un charlatan pur et simple. Vous avez perdu votre argent." } },
                    { texte: "Passer votre chemin", effet: { msg: "Vous repérez l'escroquerie à plein nez." } }
                ]
            },
            {
                id: "p1_30_veille_eveil",
                texte: "La pression barométrique chute brutalement. L'air devient lourd, saturé d'énergie magique invisible.",
                choix: [
                    { texte: "Se préparer mentalement à l'inévitable", effet: { pvMax: 10, pmMax: 10, msg: "Votre corps se détend et s'apprête à franchir le seuil." } },
                    { texte: "Dormir profondément", effet: { fatigue: -10, msg: "Vous dormez malgré l'atmosphère lourde." } }
                ]
            }
        ],

        // ------------------------------------------
        // 4. LES ÉVÉNEMENTS DE DONJON (70 Événements)
        // ------------------------------------------
        donjon: [
            // --- PIÈGES ET INTERACTIONS (1 à 25) ---
            {
                id: "d_01_piege_lames",
                texte: "Le couloir en pierre est tapissé de dalles suspectes prêtes à s'enfoncer.",
                rangMin: "E", theme: "tous", type: "interaction",
                choix: [
                    { 
                        texte: "Analyser (Jet de Perception)", typeAction: "jet_perception",
                        succes_critique: { texte: "Vous désamorcez le piège et récupérez des pièces mécaniques de valeur !", item_gagne: "cristal_mana_e", xp: 20 },
                        succes: { texte: "Vous évitez habilement les dalles.", xp: 10, fatigue: 5 },
                        echec: { texte: "Vous déclenchez des lames cachées !", pv: -20, statut: "saignement" },
                        echec_critique: { texte: "Vous trébuchez en plein milieu du piège !", pv: -40, statut: "etourdi" }
                    }
                ]
            },
            {
                id: "d_02_autel_sanglant",
                texte: "Un autel ancien dégage une odeur de fer et de magie noire.",
                rangMin: "C", theme: "temple", type: "interaction",
                choix: [
                    { texte: "Offrir de son sang (-30 PV)", effet: { pv: -30, item_gagne: "pierre_essence", msg: "L'autel brille d'une lueur rouge, vous récompensant." } },
                    { texte: "Profaner l'autel", typeAction: "combat", monstre_id: "chevalier_ombre" },
                    { texte: "Ignorer l'autel", effet: { msg: "Vous préférez ne pas tenter le diable." } }
                ]
            },
            {
                id: "d_03_coffre_piege",
                texte: "Un magnifique coffre en bois renforcé repose au milieu d'une pièce vide.",
                rangMin: "E", theme: "tous", type: "interaction",
                choix: [
                    { texte: "Forcer la serrure", effet: { or: 150, item_gagne: "potion_soin_e", msg: "Le coffre contenait un beau pactole !" } },
                    { texte: "Fermer les yeux et frapper le coffre (Piège !)", effet: { pv: -25, msg: "C'était un monstre Mimique ! Il vous mord avant de s'enfuir." } }
                ]
            },
            {
                id: "d_04_source_magique",
                texte: "Une source d'eau pure bouillonne doucement au creux de la roche souterraine.",
                rangMin: "E", theme: "grotte", type: "interaction",
                choix: [
                    { texte: "Boire l'eau magique", effet: { pv: 50, pm: 30, msg: "Une vague de fraîcheur revigorante parcoure votre corps." } },
                    { texte: "Remplir une fiole vide", effet: { item_gagne: "potion_soin_e", msg: "Vous stockez de l'eau aux propriétés curatives." } }
                ]
            },
            {
                id: "d_05_statue_pleureuse",
                texte: "Une statue de pierre géante verse des larmes de liquide fluorescent.",
                rangMin: "D", theme: "temple", type: "interaction",
                choix: [
                    { texte: "Recueillir les larmes", effet: { item_gagne: "cristal_mana_d", msg: "Le liquide se solidifie instantanément en cristal." } },
                    { texte: "Prier devant la statue", effet: { intelligence: 1, pm: 20, msg: "Une paix étrange envahit votre esprit." } }
                ]
            },
            {
                id: "d_06_eboulement_soudain",
                texte: "Des blocs de pierre se détachent du plafond en cascade !",
                rangMin: "E", theme: "grotte", type: "interaction",
                choix: [
                    { texte: "Esquiver en urgence (Agilité min: 6)", condition: { stat: "agilite", min: 6 }, effet: { msg: "Vous glissez hors de la zone d'impact indemne !" } },
                    { texte: "encaisser le choc", effet: { pv: -30, fatigue: 15, msg: "Vous êtes touché par des débris rocheux." } }
                ]
            },
            {
                id: "d_07_cadavre_chasseur",
                texte: "Le corps sans vie d'un autre aventurier gît contre un mur, serrant encore son sac.",
                rangMin: "E", theme: "tous", type: "interaction",
                choix: [
                    { texte: "Fouiller le sac", effet: { or: 80, item_gagne: "potion_soin_e", karma: -1, msg: "Vous empochez ses biens. La mort n'a plus besoin d'or." } },
                    { texte: "Lui offrir une sépulture rapide", effet: { karma: 5, msg: "Un geste de respect dans ce monde de brutes." } }
                ]
            },
            {
                id: "d_08_brume_hallucinogene",
                texte: "Une nappe de brume violette et épaisse envahit le couloir.",
                rangMin: "C", theme: "donjon", type: "interaction",
                choix: [
                    { texte: "Retenir sa respiration et foncer", effet: { pv: -15, fatigue: 10, msg: "Vous traversez au prix d'un essoufflement sévère." } },
                    { texte: "Utiliser un morceau de tissu imbibé", effet: { msg: "Vous filtrez la fumée toxique sans encombre." } }
                ]
            },
            {
                id: "d_09_runes_piegees",
                texte: "Le sol est gravé de symboles magiques lumineux qui pulsent d'énergie instable.",
                rangMin: "B", theme: "temple", type: "interaction",
                choix: [
                    { texte: "Désactiver les runes (Intelligence min: 12)", condition: { stat: "intelligence", min: 12 }, effet: { xp: 50, item_gagne: "cristal_mana_d", msg: "Vous comprenez la logique arcanique et désamorcez le glyphe." } },
                    { texte: "Courir à travers", effet: { pv: -50, statut: "brulure", msg: "Les runes explosent à votre passage !" } }
                ]
            },
            {
                id: "d_10_fissure_abyssale",
                texte: "Une large crevasse coupe le chemin en deux. Le fond est invisible.",
                rangMin: "E", theme: "grotte", type: "interaction",
                choix: [
                    { texte: "Sauter par-dessus (Agilité min: 10)", condition: { stat: "agilite", min: 10 }, effet: { msg: "Grand saut réussi avec succès !" } },
                    { texte: "Chercher un contournement plus long", effet: { fatigue: 20, msg: "Vous perdez du temps et de l'énergie, mais passez en sécurité." } }
                ]
            },
            {
                id: "d_11_porte_scellee_magie",
                texte: "Une lourde porte de pierre bloquée par une barrière magique bloque l'accès à la suite.",
                rangMin: "D", theme: "temple", type: "interaction",
                choix: [
                    { texte: "Forcer la porte en frappant (Force min: 15)", condition: { stat: "force", min: 15 }, effet: { fatigue: 25, msg: "La porte cède sous vos coups répétés." } },
                    { texte: "Utiliser du Mana pour surcharger le sceau (-20 PM)", effet: { pm: -20, msg: "La barrière se dissout dans un grésillement." } }
                ]
            },
            {
                id: "d_12_champignon lumineux",
                texte: "Une colonie de champignons géants diffuse une lumière bleue apaisante.",
                rangMin: "E", theme: "grotte", type: "interaction",
                choix: [
                    { texte: "Manger un spécimen", effet: { pm: 40, pv: 10, msg: "Une énergie étrange mais bénéfique envahit votre esprit." } },
                    { texte: "Récolter pour la revente", effet: { or: 45, msg: "Les alchimistes les achètent à bon prix." } }
                ]
            },
            {
                id: "d_13_chenil_gobelin",
                texte: "Vous tombez sur une cage abandonnée où des bêtes féroces étaient enfermées.",
                rangMin: "E", theme: "grotte", type: "interaction",
                choix: [
                    { texte: "Fouiller les cages", effet: { item_gagne: "cristal_mana_e", msg: "Des restes de butin oubliés par les gardiens." } },
                    { texte: "Passer vite", effet: { msg: "L'odeur nauséabonde vous incite à fuir." } }
                ]
            },
            {
                id: "d_14_piege_pendule",
                texte: "Des lames tranchantes en forme de balancier géant traversent le couloir en rythme.",
                rangMin: "D", theme: "donjon", type: "interaction",
                choix: [
                    { texte: "Calculer le timing parfait (Perception min: 8)", condition: { stat: "perception", min: 8 }, effet: { xp: 30, msg: "Vous passez au millimètre près." } },
                    { texte: "Courir au hasard", effet: { pv: -35, msg: "Vous prenez une lame de plein fouet !" } }
                ]
            },
            {
                id: "d_15_puits_souhaits",
                texte: "Un vieux puits au milieu d'une salle ronde semble réagir au son de votre voix.",
                rangMin: "C", theme: "temple", type: "interaction",
                choix: [
                    { texte: "Jeter 50 Or dans le puits", effet: { or: -50, stats_all: 1, msg: "Le puits brille. Vous sentez une amélioration globale de vos capacités !" } },
                    { texte: "Ignorer cette superstition", effet: { msg: "De l'argent jeté par les fenêtres." } }
                ]
            },
            {
                id: "d_16_cristal_instable",
                texte: "Un énorme cristal brut émet des vibrations et menace d'exploser.",
                rangMin: "D", theme: "grotte", type: "interaction",
                choix: [
                    { texte: "Le stabiliser avec soin", effet: { item_gagne: "cristal_mana_d", xp: 25, msg: "Vous récupérez un cristal de qualité supérieure." } },
                    { texte: "Le frapper pour le briser", effet: { pv: -20, or: 60, msg: "Il explose en morceaux, vous écorchant au passage." } }
                ]
            },
            {
                id: "d_17_fresque_murale",
                texte: "Une fresque murale ancienne dépeint une guerre oubliée entre les hommes et les monstres.",
                rangMin: "E", theme: "temple", type: "interaction",
                choix: [
                    { texte: "Étudier les techniques de combat gravées", effet: { force: 1, xp: 15, msg: "Votre style d'attaque gagne en précision." } },
                    { texte: "Ignorer la fresque", effet: { msg: "Perte de temps." } }
                ]
            },
            {
                id: "d_18_marmite_alchimique",
                texte: "Une vieille marmite abandonnée bout encore mystérieusement dans un coin.",
                rangMin: "C", theme: "donjon", type: "interaction",
                choix: [
                    { texte: "Goûter le breuvage", effet: { pv: -40, pm: 50, msg: "C'était un poison violent mais dynamisant pour le mana !" } },
                    { texte: "Renverser la marmite", effet: { msg: "Prudence excessive." } }
                ]
            },
            {
                id: "d_19_fosse_piquants",
                texte: "Des planches vermoulues cèdent sous vos pieds au dessus d'une fosse remplie de piques.",
                rangMin: "E", theme: "grotte", type: "interaction",
                choix: [
                    { texte: "Se raccrocher in extremis au bord (Agilité min: 7)", condition: { stat: "agilite", min: 7 }, effet: { msg: "Vous vous rétablissez de justesse !" } },
                    { texte: "Tomber dans la fosse", effet: { pv: -45, statut: "saignement", msg: "Les piques vous lacèrent la jambe." } }
                ]
            },
            {
                id: "d_20_coffre_mimique_bis",
                texte: "Un coffre richement orné scintille dans une alcôve sombre.",
                rangMin: "D", theme: "donjon", type: "interaction",
                choix: [
                    { texte: "Ouvrir prudemment", effet: { or: 200, msg: "Cette fois, c'était un vrai trésor !" } },
                    { texte: "Attaquer préventivement", typeAction: "combat", monstre_id: "limon_acide" }
                ]
            },
            {
                id: "d_21_vent_glacial",
                texte: "Un courant d'air arctique s'engouffre soudainement dans le donjon, engourdissant vos membres.",
                rangMin: "C", theme: "grotte", type: "interaction",
                choix: [
                    { texte: "Courir pour se réchauffer", effet: { fatigue: 15, msg: "Vous luttez contre le froid intense." } },
                    { texte: "Subir le givre", effet: { agilite: -1, msg: "Vos mouvements deviennent rigides et lents." } }
                ]
            },
            {
                id: "d_22_bibliotheque_ancienne",
                texte: "Des étagères remplies de parchemins en décomposition s'étendent à perte de vue.",
                rangMin: "B", theme: "temple", type: "interaction",
                choix: [
                    { texte: "Lire les grimoires interdits (Intelligence min: 15)", condition: { stat: "intelligence", min: 15 }, effet: { intelligence: 2, pmMax: 30, msg: "Votre esprit s'élargit aux secrets des arcanes." } },
                    { texte: "Prendre ce qui brille", effet: { or: 120, msg: "Quelques pièces anciennes glissées entre les pages." } }
                ]
            },
            {
                id: "d_23_piege_gaz_soporifique",
                texte: "Un sifflement suspect retentit alors qu'un gaz verdâtre commence à s'échapper des murs.",
                rangMin: "D", theme: "donjon", type: "interaction",
                choix: [
                    { texte: "Retenir sa respiration (Vitalité min: 10)", condition: { stat: "vitalite", min: 10 }, effet: { msg: "Vous traversez la zone avant de respirer le gaz." } },
                    { texte: "Respirer et s'endormir brièvement", effet: { pv: -10, fatigue: 30, msg: "Vous vous réveillez fatigué, le sac un peu plus léger." } }
                ]
            },
            {
                id: "d_24_marcheur_egare",
                texte: "Un chasseur blessé erre sans but, victime d'une terrible malédiction de folie.",
                rangMin: "C", theme: "tous", type: "interaction",
                choix: [
                    { texte: "L'achever pour abréger ses souffrances", effet: { karma: -5, or: 70, msg: "Un acte froid mais lucratif." } },
                    { texte: "L'ignorer et le laisser à son sort", effet: { karma: -1, msg: "Vous l'évitez soigneusement." } }
                ]
            },
            {
                id: "d_25_cellule_prison",
                texte: "Une vieille cellule de geôle en fer rouillé enferme un squelette encapuchonné.",
                rangMin: "E", theme: "donjon", type: "interaction",
                choix: [
                    { texte: "Fouiller les ossements", effet: { item_gagne: "cristal_mana_e", or: 30, msg: "Un anneau rouillé et quelques babioles de valeur." } },
                    { texte: "Saluer la mémoire du mort", effet: { karma: 2, msg: "Une minute de silence par respect." } }
                ]
            }

            // Note : Pour atteindre les 70 événements de donjon et les combats/boss associés de manière fluide, dites-moi simplement "continuer" et je vous enverrai la suite immédiate de ce fichier data.js !
        ]
    },

    // ------------------------------------------
    // 5. LES GUILDES
    // ------------------------------------------
    guildes: [
        {
            id: "chiens_garde",
            nom: "Les Chiens de Garde",
            rangRequis: "E",
            salaireBase: 100,
            commission: 0.4,
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
            id: "tigre_blanc",
            nom: "Guilde du Tigre Blanc",
            rangRequis: "A",
            salaireBase: 2500,
            commission: 0.1,
            bonus: { force: 50, critique: 0.2 },
            description: "Prestigieuse, brutale. Seuls les plus forts survivent à leurs raids."
        }
    ]

        // --- SUITE DES ÉVÉNEMENTS DE DONJON (26 à 70) ---
            {
                id: "d_26_salle_tresor_gardee",
                texte: "Une petite salle contient un coffre ouvert rempli d'or, mais une créature veille à l'entrée.",
                rangMin: "C", theme: "donjon", type: "interaction",
                choix: [
                    { texte: "Affronter le gardien", typeAction: "combat", monstre_id: "chevalier_ombre" },
                    { texte: "Tenter de faire les the 100 pas en douce (Agilité min: 14)", condition: { stat: "agilite", min: 14 }, effet: { or: 300, msg: "Vol à la tire réussi ! Vous repartez avec le magot." } }
                ]
            },
            {
                id: "d_27_echo_lointain",
                texte: "Des bruits de pas résonnent dans votre dos, comme si quelqu'un — ou quelque chose — vous traquait.",
                rangMin: "E", theme: "grotte", type: "interaction",
                choix: [
                    { texte: "Accélérer le rythme", effet: { fatigue: 15, msg: "Vous distancer l'éventuel poursuivant au prix d'un effort intense." } },
                    { texte: "Tendre une embuscade", effet: { perception: 1, xp: 15, msg: "Vous attendez, mais c'était le simple écho de vos propres pas." } }
                ]
            },
            {
                id: "d_28_murailles_sueurs",
                texte: "La température monte brusquement de plusieurs dizaines de degrés dans ce secteur.",
                rangMin: "D", theme: "donjon", type: "interaction",
                choix: [
                    { texte: "Boire de l'eau et avancer", effet: { pv: -10, msg: "La chaleur déshydrate rapidement votre corps." } },
                    { texte: "Battre en retraite temporaire", effet: { fatigue: 10, msg: "Vous reprenez votre souffle dans une zone plus fraîche." } }
                ]
            },
            {
                id: "d_29_pierre_grav_runes",
                texte: "Une stèle couverte d'inscriptions anciennes émet une faible lueur protectrice.",
                rangMin: "C", theme: "temple", type: "interaction",
                choix: [
                    { texte: "Méditer devant la stèle", effet: { pm: 50, intelligence: 1, msg: "Votre esprit absorbe la résonance magique de la pierre." } },
                    { texte: "Briser la stèle pour récupérer les matériaux", effet: { or: 100, karma: -3, msg: "Vous détruisez un artefact historique pour de l'argent." } }
                ]
            },
            {
                id: "d_30_marais_acide_souterrain",
                texte: "Le sol cède la place à une étendue de boue bouillonnante et corrosive.",
                rangMin: "D", theme: "grotte", type: "interaction",
                choix: [
                    { texte: "Traverser en courant (Agilité min: 9)", condition: { stat: "agilite", min: 9 }, effet: { msg: "Vous traversez avant que la boue ne ronge vos bottes." } },
                    { texte: "Subir la corrosion", effet: { pv: -25, or: -30, msg: "Votre équipement et vos jambes subissent l'acide." } }
                ]
            },
            {
                id: "d_31_offrande_oubliee",
                texte: "Une table en pierre porte des offrandes de nourriture encore fraîches malgré les siècles.",
                rangMin: "E", theme: "temple", type: "interaction",
                choix: [
                    { texte: "Manger les offrandes", effet: { pv: 40, karma: -1, msg: "C'est délicieux, mais profaner des offrandes laisse une trace." } },
                    { texte: "Laisser les offrandes en paix", effet: { karma: 2, msg: "Vous montrez du respect aux anciens occupants." } }
                ]
            },
            {
                id: "d_32_souffle_ombre",
                texte: "Une bourrasque de vent ténébreux éteint toutes vos sources de lumière instantanément.",
                rangMin: "C", theme: "donjon", type: "interaction",
                choix: [
                    { texte: "Avancer à tâtons dans le noir (Perception min: 10)", condition: { stat: "perception", min: 10 }, effet: { xp: 20, msg: "Vos sens aiguisés vous guident sans encombre." } },
                    { texte: "Paniquer et trébucher", effet: { pv: -20, fatigue: 10, msg: "Vous vous cognez violemment contre un pilier." } }
                ]
            },
            {
                id: "d_33_reliquaire_brise",
                texte: "Un reliquaire en verre étincelant gît brisé sur le sol, son contenu éparpillé.",
                rangMin: "D", theme: "temple", type: "interaction",
                choix: [
                    { texte: "Ramasser les éclats magiques", effet: { item_gagne: "cristal_mana_d", msg: "Les fragments gardent une forte concentration de mana." } },
                    { texte: "Ne rien toucher", effet: { msg: "La prudence est de mise." } }
                ]
            },
            {
                id: "d_34_fosse_aux_goulues",
                texte: "Des bruits de mastication et de grognements étouffés proviennent des ténèbres en contrebas.",
                rangMin: "C", theme: "grotte", type: "interaction",
                choix: [
                    { texte: "Lancer une pierre pour faire diversion", effet: { fatigue: 5, msg: "Vous passez discrètement pendant que la créature est distraite." } },
                    { texte: "Affronter la chose", typeAction: "combat", monstre_id: "limon_acide" }
                ]
            },
            {
                id: "d_35_chambre_resonante",
                texte: "La moindre syllabe prononcée dans cette salle se amplifie en un écho assourdissant.",
                rangMin: "E", theme: "grotte", type: "interaction",
                choix: [
                    { texte: "Garder un silence de mort", effet: { msg: "Vous traversez la zone sans alerter l'environnement." } },
                    { texte: "Crier de rage", effet: { pm: -15, force: 1, msg: "L'onde de choc résonne en vous et stimule votre adrénaline." } }
                ]
            },
            {
                id: "d_36_statue_guerrier_chute",
                texte: "Une immense statue de pierre s'est effondrée, bloquant partiellement le passage principal.",
                rangMin: "D", theme: "temple", type: "interaction",
                choix: [
                    { texte: "Soulever le bloc (Force min: 12)", condition: { stat: "force", min: 12 }, effet: { xp: 25, or: 50, msg: "Vous dégagez un passage secret caché sous la statue !" } },
                    { texte: "Passer par un chemin étroit secondaire", effet: { fatigue: 15, msg: "Un passage exigu et inconfortable." } }
                ]
            },
            {
                id: "d_37_bassin_illusions",
                texte: "L'eau de ce bassin reflète des décors qui ne correspondent pas du tout au donjon actuel.",
                rangMin: "B", theme: "temple", type: "interaction",
                choix: [
                    { texte: "Plonger le regard au fond (Intelligence min: 14)", condition: { stat: "intelligence", min: 14 }, effet: { intelligence: 2, pmMax: 20, msg: "Vous percevez la véritable matrice du donjon." } },
                    { texte: "Détourner les yeux", effet: { msg: "Ces illusions maléfiques risquent de vous rendre fou." } }
                ]
            },
            {
                id: "d_38_carcasse_golem",
                texte: "Les restes d'un ancien golem mécanique parsèment le sol de métal rouillé.",
                rangMin: "D", theme: "donjon", type: "interaction",
                choix: [
                    { texte: "Récupérer les composants", effet: { item_gagne: "cristal_mana_d", msg: "Vous extrayez un noyau encore actif." } },
                    { texte: "Ignorer les ferrailles", effet: { msg: "Aucun intérêt pratique." } }
                ]
            },
            {
                id: "d_39_piege_pression_lateral",
                texte: "Les murs de la pièce commencent à se resserrer lentement l'un vers l'autre !",
                rangMin: "C", theme: "donjon", type: "interaction",
                choix: [
                    { texte: "Trouver le mécanisme d'arrêt (Perception min: 11)", condition: { stat: "perception", min: 11 }, effet: { xp: 35, msg: "Vous enclenchez le levier d'arrêt in extremis !" } },
                    { texte: "Forcer le passage en force brute", effet: { pv: -30, fatigue: 20, msg: "Vous résistez à la pression des murs de justesse." } }
                ]
            },
            {
                id: "d_40_champ_de_force_faible",
                texte: "Une barrière lumineuse transparente bloque l'accès à un couloir annexe.",
                rangMin: "E", theme: "temple", type: "interaction",
                choix: [
                    { texte: "Canaliser son énergie pour la percer", effet: { pm: -10, item_gagne: "cristal_mana_e", msg: "La barrière cède et libère un dépôt d'énergie." } },
                    { texte: "Faire demi-tour", effet: { msg: "Vous abandonnez l'accès." } }
                ]
            },
            {
                id: "d_41_vision_fugace",
                texte: "Une silhouette spectrale traverse brièvement le mur devant vous avant de s'évanouir.",
                rangMin: "C", theme: "temple", type: "interaction",
                choix: [
                    { texte: "Tenter de communiquer", effet: { karma: 3, intelligence: 1, msg: "Le spectre laisse un sentiment de paix avant de disparaître." } },
                    { texte: "Sortir son arme par réflexe", effet: { fatigue: 5, msg: "Il n'y avait rien à frapper." } }
                ]
            },
            {
                id: "d_42_chambre_aux_epices",
                texte: "Un entrepôt souterrain rempli de jarres d'aromates et de poudres alchimiques anciennes.",
                rangMin: "D", theme: "donjon", type: "interaction",
                choix: [
                    { texte: "Récupérer ce qui est vendable", effet: { or: 90, msg: "Les marchands du marché noir en raffolent." } },
                    { texte: "Goûter une poudre inconnue", effet: { pv: -15, pm: 30, msg: "Un stimulant puissant mais agressif pour l'estomac." } }
                ]
            },
            {
                id: "d_43_pendule_du_temps",
                texte: "Un gigantesque balancier mystique oscille au milieu d'une salle aux murs invisibles.",
                rangMin: "B", theme: "temple", type: "interaction",
                choix: [
                    { texte: "Traverser au rythme de l'oscillation (Agilité min: 15)", condition: { stat: "agilite", min: 15 }, effet: { agilite: 2, xp: 50, msg: "Vos réflexes se synchro-nicent avec l'anomalie temporelle !" } },
                    { texte: "Se faire frôler par le pendule", effet: { pv: -40, statut: "etourdi", msg: "Le choc temporel vous désoriente totalement." } }
                ]
            },
            {
                id: "d_44_tas_d_os_suspect",
                texte: "Un immense tas d'ossements humains et animaux s'élève au centre de la pièce.",
                rangMin: "E", theme: "grotte", type: "interaction",
                choix: [
                    { texte: "Fouiller le tas", typeAction: "combat", monstre_id: "limon_acide" },
                    { texte: "Contourner prudemment", effet: { msg: "Vous évitez un piège ou un réveil macabre." } }
                ]
            },
            {
                id: "d_45_source_corruption",
                texte: "Un liquide noir et visqueux suinte des murs, pulsant comme un cœur vivant.",
                rangMin: "B", theme: "donjon", type: "interaction",
                choix: [
                    { texte: "Purifier la source avec du Mana (-40 PM)", condition: { stat: "intelligence", min: 12 }, effet: { karma: 10, xp: 60, msg: "Vous neutralisez la source corrompue du donjon." } },
                    { texte: "Ignorer et fuir l'odeur", effet: { msg: "Une abomination pareille ne présage rien de bon." } }
                ]
            },
            {
                id: "d_46_coffre_chaine_lourde",
                texte: "Un coffre de fer scellé par de lourdes chaînes magiques repose sur un piédestal.",
                rangMin: "A", theme: "temple", type: "interaction",
                choix: [
                    { texte: "Briser les chaînes (Force min: 18)", condition: { stat: "force", min: 18 }, effet: { item_gagne: "pierre_essence", or: 500, msg: "Vous obtenez un trésor d'une valeur inestimable !" } },
                    { texte: "Renoncer face à la robustesse du sceau", effet: { msg: "Impossible à ouvrir sans une force surhumaine." } }
                ]
            },
            {
                id: "d_47_marche_des_ombres",
                texte: "Les torches du couloir s'éteignent une à une à mesure que vous avancez.",
                rangMin: "C", theme: "donjon", type: "interaction",
                choix: [
                    { texte: "Avancer sereinement", effet: { perception: 1, msg: "Votre vision nocturne s'adapte à l'obscurité." } },
                    { texte: "Allumer une torche de secours", effet: { fatigue: 5, msg: "Vous conservez une visibilité claire." } }
                ]
            },
            {
                id: "d_48_autel_offrande_vide",
                texte: "Un autel sacrificiel entièrement creux et poussiéreux.",
                rangMin: "E", theme: "temple", type: "interaction",
                choix: [
                    { texte: "Déposer une pièce d'or en offrande", effet: { or: -10, karma: 2, msg: "Une lueur bénigne vous enveloppe brièvement." } },
                    { texte: "Ne rien faire", effet: { msg: "Rien ne se passe." } }
                ]
            },
            {
                id: "d_49_fissure_gaz_toxique",
                texte: "Une petite fissure crache un gaz jaunâtre qui pique les yeux.",
                rangMin: "D", theme: "grotte", type: "interaction",
                choix: [
                    { texte: "Colmater avec de la pierre", effet: { force: 1, msg: "Vous scellez la fuite proprement." } },
                    { texte: "Passer en courant", effet: { pv: -15, msg: "Vous toussez bruyamment en traversant." } }
                ]
            },
            {
                id: "d_50_salle_des_miroirs",
                texte: "Une pièce entièrement tapissée de miroirs anciens qui reflètent des versions étranges de vous-même.",
                rangMin: "C", theme: "temple", type: "interaction",
                choix: [
                    { texte: "Briser le miroir central", typeAction: "combat", monstre_id: "chevalier_ombre" },
                    { texte: "Méditer face à son reflet", effet: { intelligence: 1, pm: 30, msg: "Vous acceptez vos parts d'ombre et de lumière." } }
                ]
            },
            {
                id: "d_51_chute_de_pierres_minimes",
                texte: "Quelques cailloux dégringolent du plafond, annonçant l'instabilité de la zone.",
                rangMin: "E", theme: "grotte", type: "interaction",
                choix: [
                    { texte: "S'abriter sous une arche solide", effet: { msg: "Vous évitez les petits débris." } },
                    { texte: "Courir sans regarder", effet: { pv: -10, msg: "Un caillou vous érafle l'épaule." } }
                ]
            },
            {
                id: "d_52_coffre_ouvert_piege",
                texte: "Un coffre grand ouvert, apparemment pillé, cache un mécanisme de fléchettes empoisonnées.",
                rangMin: "D", theme: "donjon", type: "interaction",
                choix: [
                    { texte: "Inspecter le fond du coffre (Perception min: 9)", condition: { stat: "perception", min: 9 }, effet: { item_gagne: "cristal_mana_d", xp: 15, msg: "Vous repérez le double fond caché !" } },
                    { texte: "Mettre la main directement dedans", effet: { pv: -25, statut: "empoisonne", msg: "Une fléchette vous lacère la paume !" } }
                ]
            },
            {
                id: "d_53_bruit_de_chaines",
                texte: "Des bruits de lourdes chaînes traînées sur le sol se rapprochent dans le noir.",
                rangMin: "C", theme: "donjon", type: "interaction",
                choix: [
                    { texte: "Se cacher derrière un pilier", effet: { perception: 1, msg: "Vous observez passer une patrouille sans être vu." } },
                    { texte: "Préparer son arme", typeAction: "combat", monstre_id: "chevalier_ombre" }
                ]
            },
            {
                id: "d_54_source_thermique_souterraine",
                texte: "Une eau chaude et fumante remplit un bassin naturel au milieu des rochers.",
                rangMin: "E", theme: "grotte", type: "interaction",
                choix: [
                    { texte: "Tremper ses pieds et se reposer", effet: { fatigue: -25, pv: 20, msg: "Une détente musculaire bien méritée." } },
                    { texte: "Boire goulûment", effet: { pv: -10, msg: "L'eau est trop minérale et vous barbouille l'estomac." } }
                ]
            },
            {
                id: "d_55_runes_de_silence",
                texte: "Des symboles magiques absorbent tous les bruits de pas dans cette zone.",
                rangMin: "C", theme: "temple", type: "interaction",
                choix: [
                    { texte: "Profiter du silence pour souffler", effet: { pm: 40, fatigue: -10, msg: "Le calme absolu ressource votre système nerveux." } },
                    { texte: "Tenter de perturber les runes", effet: { intelligence: 1, msg: "Vous apprenez comment fonctionne l'absorption magique." } }
                ]
            },
            {
                id: "d_56_fresque_effacee",
                texte: "Une ancienne fresque murale a été vandalisée et grattée méthodiquement.",
                rangMin: "D", theme: "temple", type: "interaction",
                choix: [
                    { texte: "Analyser les traces de grattage (Perception min: 10)", condition: { stat: "perception", min: 10 }, effet: { perception: 1, msg: "Quelqu'un a voulu cacher l'histoire d'un monstre précis." } },
                    { texte: "Passer son chemin", effet: { msg: "Rien d'utile ici." } }
                ]
            },
            {
                id: "d_57_ventilation_magique",
                texte: "Un flux d'air frais traverse soudainement les boyaux du donjon.",
                rangMin: "E", theme: "grotte", type: "interaction",
                choix: [
                    { texte: "Suivre le courant d'air", effet: { fatigue: -10, msg: "Le chemin s'avère plus direct et oxygénant." } },
                    { texte: "Rester sur sa trajectoire initiale", effet: { msg: "Vous conservez votre plan de route." } }
                ]
            },
            {
                id: "d_58_fragment_cristal_geant",
                texte: "Un éclat de cristal monumental est planté profondément dans le sol rocheux.",
                rangMin: "B", theme: "grotte", type: "interaction",
                    choix: [
                    { texte: "Extraire le fragment (Force min: 15)", condition: { stat: "force", min: 15 }, effet: { item_gagne: "pierre_essence", xp: 40, msg: "Vous réussissez à détacher un morceau de haute pureté." } },
                    { texte: "Le frapper en vain", effet: { pv: -15, msg: "Le cristal est trop dur, vous vous blessez les mains." } }
                ]
            },
            {
                id: "d_59_chambre_des_soupirs",
                texte: "Des murmures inintelligibles semblent provenir des murs eux-mêmes.",
                rangMin: "C", theme: "temple", type: "interaction",
                choix: [
                    { texte: "Écouter les voix (Intelligence min: 11)", condition: { stat: "intelligence", min: 11 }, effet: { intelligence: 1, pm: 30, msg: "Les murmures vous révèlent l'emplacement d'un piège plus loin." } },
                    { texte: "Se boucher les oreilles", effet: { fatigue: 10, msg: "Une irritation mentale désagréable." } }
                ]
            },
            {
                id: "d_60_piege_cable_discret",
                texte: "Un fin fil tendu traverse le ras du sol entre deux encadrements de porte.",
                rangMin: "D", theme: "donjon", type: "interaction",
                choix: [
                    { texte: "Enjamber avec agilité", effet: { msg: "Vous esquivez le déclencheur sans encombre." } },
                    { texte: "Le couper pour récupérer le fil d'acier", effet: { item_gagne: "cristal_mana_e", msg: "Un câble magique réutilisable récupéré !" } }
                ]
            },
            {
                id: "d_61_bassin_de_sang_fige",
                texte: "Une cuve en pierre remplie d'un liquide rouge sombre complètement solidifié.",
                rangMin: "C", theme: "temple", type: "interaction",
                choix: [
                    { texte: "Briser la surface solidifiée", effet: { or: 75, item_gagne: "cristal_mana_d", msg: "Des objets précieux avaient été jetés dedans en offrande." } },
                    { texte: "Ne pas y toucher", effet: { msg: "L'atmosphère est trop pesante." } }
                ]
            },
            {
                id: "d_62_ronces_magiques",
                texte: "Des lianes épineuses lumineuses barrent l'accès au couloir.",
                rangMin: "D", theme: "grotte", type: "interaction",
                choix: [
                    { texte: "Brûler les ronces", effet: { pm: -20, msg: "Les lianes se recroquevillent sous la chaleur de votre mana." } },
                    { texte: "Forcer le passage à travers les épines", effet: { pv: -20, statut: "saignement", msg: "Les épines vous lacèrent les bras." } }
                ]
            },
            {
                id: "d_63_autel_de_l_eclair",
                texte: "Un autel gravé d'éclairs stylisés crépite d'électricité statique.",
                rangMin: "B", theme: "temple", type: "interaction",
                choix: [
                    { texte: "Canaliser l'énergie statique", effet: { agilite: 2, pm: 50, msg: "Vos influx nerveux sont survoltés ! Votre agilité augmente." } },
                    { texte: "Toucher imprudemment", effet: { pv: -45, statut: "etourdi", msg: "Une décharge fulgurante vous traverse de part en part !" } }
                ]
            },
            {
                id: "d_64_corps_frais",
                texte: "Le corps d'un aventurier tout juste abattu gît au milieu du chemin.",
                rangMin: "C", theme: "donjon", type: "interaction",
                choix: [
                    { texte: "Fouiller rapidement le corps", effet: { or: 150, item_gagne: "potion_soin_d", karma: -2, msg: "Vous empochez son butin avant l'arrivée du monstre l'ayant tué." } },
                    { texte: "Prendre la fuite de peur", effet: { msg: "Le danger est manifestement tout proche." } }
                ]
            },
            {
                id: "d_65_fissure_lumiere_solaire",
                texte: "Une minuscule faille dans la roche laisse filtrer un authentique rayon de soleil extérieur.",
                rangMin: "E", theme: "grotte", type: "interaction",
                choix: [
                    { texte: "Regarder un instant la lumière", effet: { fatigue: -15, pv: 15, msg: "Un rappel bienvenu du monde de la surface qui vous redonne du courage." } },
                    { texte: "Ignorer et avancer", effet: { msg: "Pas le temps de contempler le paysage." } }
                ]
            },
            {
                id: "d_66_mecanisme_mysterieux",
                texte: "Un panneau mural comportant des glyphes rotatifs s'offre à votre curiosité.",
                rangMin: "D", theme: "temple", type: "interaction",
                choix: [
                    { texte: "Résoudre l'énigme (Intelligence min: 10)", condition: { stat: "intelligence", min: 10 }, effet: { or: 120, xp: 30, msg: "Un compartiment secret s'ouvre, révélant des pièces !" } },
                    { texte: "Tourner les symboles au hasard", effet: { pv: -15, msg: "Le mécanisme déclenche un petit piège à aiguilles." } }
                ]
            },
            {
                id: "d_67_chambre_froide",
                texte: "La température chute brutalement sous zéro. Le givre tapisse le sol et les murs.",
                rangMin: "C", theme: "grotte", type: "interaction",
                choix: [
                    { texte: "Activer sa circulation de Mana pour se réchauffer (-15 PM)", effet: { pm: -15, msg: "Votre chaleur interne repousse le givre." } },
                    { texte: "Subir le froid mordant", effet: { agilite: -1, pv: -10, msg: "Vos articulations engourdies ralentissent vos pas." } }
                ]
            },
            {
                id: "d_68_monolithe_brise",
                texte: "Les fragments d'un monolithe magique jonchent le sol, dégageant une faible résonance.",
                rangMin: "B", theme: "temple", type: "interaction",
                choix: [
                    { texte: "Absorber les fragments brisés", effet: { pmMax: 25, item_gagne: "cristal_mana_d", msg: "Votre capacité maximale de Mana s'accroît." } },
                    { texte: "Laisser les pierres inertes", effet: { msg: "Vous préférez ne pas perturber les énergies résiduelles." } }
                ]
            },
            {
                id: "d_69_hallebardes_murales",
                texte: "Des mécanismes fixés aux murs projettent des lames de hallebarde en balancier croisé.",
                rangMin: "D", theme: "donjon", type: "interaction",
                choix: [
                    { texte: "Passer en se accroupissant (Agilité min: 11)", condition: { stat: "agilite", min: 11 }, effet: { xp: 20, msg: "Vous glissez sous les lames sans une égratignure." } },
                    { texte: "Courir en espérant passer", effet: { pv: -30, statut: "saignement", msg: "Une lame vous entaille profondément le flanc." } }
                ]
            },
            {
                id: "d_70_seuil_du_boss",
                texte: "Une immense porte massive gravée de crânes et de symboles runiques barre le fond du couloir. C'est l'ultime épreuve.",
                rangMin: "E", theme: "tous", type: "interaction",
                choix: [
                    { texte: "Franchir les portes et affronter le Boss", typeAction: "combat", monstre_id: "chef_hobgobelin" }
                ]
            }
        ]
    },

    // ------------------------------------------
    // 5. LES GUILDES
    // ------------------------------------------
    guildes: [
        {
            id: "chiens_garde",
            nom: "Les Chiens de Garde",
            rangRequis: "E",
            salaireBase: 100,
            commission: 0.4,
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
            id: "tigre_blanc",
            nom: "Guilde du Tigre Blanc",
            rangRequis: "A",
            salaireBase: 2500,
            commission: 0.1,
            bonus: { force: 50, critique: 0.2 },
            description: "Prestigieuse, brutale. Seuls les plus forts survivent à leurs raids."
        }
    ]
};

