// ==========================================
// DATA-EVENEMENTS-DONJON.JS
// Les 70 evenements de donjon, filtres par rangMin et theme dans engine-donjon.js
// theme : "grotte", "temple", "donjon" (generique, accepte partout), "tous"
// Les monstre_id ont ete realignes sur data-monstres.js (chevalier_ombre -> assassin_ombre, chef_hobgobelin -> chef_gobelin)
// ==========================================

const donjonEvenementsData = [

    {
        id: "d_01_piege_lames",
        texte: "Le couloir en pierre est tapisse de dalles suspectes pretes a s'enfoncer.",
        rangMin: "E", theme: "tous", type: "interaction",
        choix: [{
            texte: "Analyser (Jet de Perception)", typeAction: "jet_perception",
            succes_critique: { texte: "Vous desamorcez le piege et récupérez des pieces mecaniques de valeur.", item_gagne: "cristal_mana_e", xp: 20 },
            succes: { texte: "Vous évitez habilement les dalles.", xp: 10, fatigue: 5 },
            echec: { texte: "Vous declenchez des lames cachees.", pv: -20, statut: "saignement" },
            echec_critique: { texte: "Vous trebuchez en plein milieu du piege.", pv: -40, statut: "etourdissement" }
        }]
    },
    {
        id: "d_02_autel_sanglant",
        texte: "Un autel ancien degage une odeur de fer et de magie noire.",
        rangMin: "C", theme: "temple", type: "interaction",
        choix: [
            { texte: "Offrir de son sang (-30 PV)", effet: { pv: -30, item_gagne: "pierre_essence", msg: "L'autel brille d'une lueur rouge, vous recompensant." } },
            { texte: "Profaner l'autel", typeAction: "combat", monstre_id: "assassin_ombre" },
            { texte: "Ignorer l'autel", effet: { msg: "Vous préférez ne pas tenter le diable." } }
        ]
    },
    {
        id: "d_03_coffre_piege",
        texte: "Un magnifique coffre en bois renforce repose au milieu d'une piece vide.",
        rangMin: "E", theme: "tous", type: "interaction",
        choix: [
            { texte: "Forcer la serrure", effet: { or: 150, item_gagne: "potion_soin_e", msg: "Le coffre contenait un beau pactole." } },
            { texte: "Fermer les yeux et frapper le coffre (Piege)", effet: { pv: -25, msg: "C'etait un monstre Mimique. Il vous mord avant de s'enfuir." } }
        ]
    },
    {
        id: "d_04_source_magique",
        texte: "Une source d'eau pure bouillonne doucement au creux de la roche souterraine.",
        rangMin: "E", theme: "grotte", type: "interaction",
        choix: [
            { texte: "Boire l'eau magique", effet: { pv: 50, pm: 30, msg: "Une vague de fraicheur revigorante parcourt votre corps." } },
            { texte: "Remplir une fiole vide", effet: { item_gagne: "potion_soin_e", msg: "Vous stockez de l'eau aux propriétés curatives." } }
        ]
    },
    {
        id: "d_05_statue_pleureuse",
        texte: "Une statue de pierre geante verse des larmes de liquide fluorescent.",
        rangMin: "D", theme: "temple", type: "interaction",
        choix: [
            { texte: "Recueillir les larmes", effet: { item_gagne: "cristal_mana_d", msg: "Le liquide se solidifie instantanement en cristal." } },
            { texte: "Prier devant la statue", effet: { intelligence: 1, pm: 20, msg: "Une paix etrange envahit votre esprit." } }
        ]
    },
    {
        id: "d_06_eboulement_soudain",
        texte: "Des blocs de pierre se detachent du plafond en cascade.",
        rangMin: "E", theme: "grotte", type: "interaction",
        choix: [
            { texte: "Esquiver en urgence (Agilite min: 6)", condition: { stat: "agilite", min: 6 }, effet: { msg: "Vous glissez hors de la zone d'impact indemne." } },
            { texte: "Encaisser le choc", effet: { pv: -30, fatigue: 15, msg: "Vous etes touche par des debris rocheux." } }
        ]
    },
    {
        id: "d_07_cadavre_chasseur",
        texte: "Le corps sans vie d'un autre aventurier git contre un mur, serrant encore son sac.",
        rangMin: "E", theme: "tous", type: "interaction",
        choix: [
            { texte: "Fouiller le sac", effet: { or: 80, item_gagne: "potion_soin_e", karma: -1, msg: "Vous empochez ses biens. La mort n'a plus besoin d'or." } },
            { texte: "Lui offrir une sepulture rapide", effet: { karma: 5, msg: "Un geste de respect dans ce monde de brutes." } }
        ]
    },
    {
        id: "d_08_brume_hallucinogene",
        texte: "Une nappe de brume violette et epaisse envahit le couloir.",
        rangMin: "C", theme: "donjon", type: "interaction",
        choix: [
            { texte: "Retenir sa respiration et foncer", effet: { pv: -15, fatigue: 10, msg: "Vous traversez au prix d'un essoufflement sévère." } },
            { texte: "Utiliser un morceau de tissu imbibe", effet: { msg: "Vous filtrez la fumee toxique sans encombre." } }
        ]
    },
    {
        id: "d_09_runes_piegees",
        texte: "Le sol est grave de symboles magiques lumineux qui pulsent d'énergie instable.",
        rangMin: "B", theme: "temple", type: "interaction",
        choix: [
            { texte: "Desactiver les runes (Intelligence min: 12)", condition: { stat: "intelligence", min: 12 }, effet: { xp: 50, item_gagne: "cristal_mana_d", msg: "Vous comprenez la logique arcanique et desamorcez le glyphe." } },
            { texte: "Courir a travers", effet: { pv: -50, statut: "brulure", msg: "Les runes explosent a votre passage." } }
        ]
    },
    {
        id: "d_10_fissure_abyssale",
        texte: "Une large crevasse coupe le chemin en deux. Le fond est invisible.",
        rangMin: "E", theme: "grotte", type: "interaction",
        choix: [
            { texte: "Sauter par-dessus (Agilite min: 10)", condition: { stat: "agilite", min: 10 }, effet: { msg: "Grand saut réussi avec succès." } },
            { texte: "Chercher un contournement plus long", effet: { fatigue: 20, msg: "Vous perdez du temps et de l'énergie, mais passez en sécurité." } }
        ]
    },
    {
        id: "d_11_porte_scellee_magie",
        texte: "Une lourde porte de pierre bloquee par une barriere magique bloque l'acces a la suite.",
        rangMin: "D", theme: "temple", type: "interaction",
        choix: [
            { texte: "Forcer la porte en frappant (Force min: 15)", condition: { stat: "force", min: 15 }, effet: { fatigue: 25, msg: "La porte cede sous vos coups repetes." } },
            { texte: "Utiliser du Mana pour surcharger le sceau (-20 PM)", effet: { pm: -20, msg: "La barriere se dissout dans un gresillement." } }
        ]
    },
    {
        id: "d_12_champignons_lumineux",
        texte: "Une colonie de champignons geants diffuse une lumiere bleue apaisante.",
        rangMin: "E", theme: "grotte", type: "interaction",
        choix: [
            { texte: "Manger un specimen", effet: { pm: 40, pv: 10, msg: "Une énergie etrange mais bénéfique envahit votre esprit." } },
            { texte: "Recolter pour la revente", effet: { or: 45, msg: "Les alchimistes les achetent a bon prix." } }
        ]
    },
    {
        id: "d_13_chenil_gobelin",
        texte: "Vous tombez sur une cage abandonnée ou des betes feroces etaient enfermees.",
        rangMin: "E", theme: "grotte", type: "interaction",
        choix: [
            { texte: "Fouiller les cages", effet: { item_gagne: "cristal_mana_e", msg: "Des restes de butin oublies par les gardiens." } },
            { texte: "Passer vite", effet: { msg: "L'odeur nauseabonde vous incite a fuir." } }
        ]
    },
    {
        id: "d_14_piege_pendule",
        texte: "Des lames tranchantes en forme de balancier geant traversent le couloir en rythme.",
        rangMin: "D", theme: "donjon", type: "interaction",
        choix: [
            { texte: "Calculer le timing parfait (Perception min: 8)", condition: { stat: "perception", min: 8 }, effet: { xp: 30, msg: "Vous passez au millimetre près." } },
            { texte: "Courir au hasard", effet: { pv: -35, msg: "Vous prenez une lame de plein fouet." } }
        ]
    },
    {
        id: "d_15_puits_souhaits",
        texte: "Un vieux puits au milieu d'une salle ronde semble reagir au son de votre voix.",
        rangMin: "C", theme: "temple", type: "interaction",
        choix: [
            { texte: "Jeter 50 Or dans le puits", effet: { or: -50, stats_all: 1, msg: "Le puits brille. Vous sentez une amélioration globale de vos capacités." } },
            { texte: "Ignorer cette superstition", effet: { msg: "De l'argent jete par les fenetres." } }
        ]
    },
    {
        id: "d_16_cristal_instable",
        texte: "Un enorme cristal brut emet des vibrations et menace d'exploser.",
        rangMin: "D", theme: "grotte", type: "interaction",
        choix: [
            { texte: "Le stabiliser avec soin", effet: { item_gagne: "cristal_mana_d", xp: 25, msg: "Vous récupérez un cristal de qualité supérieure." } },
            { texte: "Le frapper pour le briser", effet: { pv: -20, or: 60, msg: "Il explose en morceaux, vous ecorchant au passage." } }
        ]
    },
    {
        id: "d_17_fresque_murale",
        texte: "Une fresque murale ancienne depeint une guerre oubliee entre les hommes et les monstres.",
        rangMin: "E", theme: "temple", type: "interaction",
        choix: [
            { texte: "Etudier les techniques de combat gravees", effet: { force: 1, xp: 15, msg: "Votre style d'attaque gagne en précision." } },
            { texte: "Ignorer la fresque", effet: { msg: "Perte de temps." } }
        ]
    },
    {
        id: "d_18_marmite_alchimique",
        texte: "Une vieille marmite abandonnée bout encore mysterieusement dans un coin.",
        rangMin: "C", theme: "donjon", type: "interaction",
        choix: [
            { texte: "Gouter le breuvage", effet: { pv: -40, pm: 50, msg: "C'etait un poison violent mais dynamisant pour le mana." } },
            { texte: "Renverser la marmite", effet: { msg: "Prudence excessive." } }
        ]
    },
    {
        id: "d_19_fosse_piquants",
        texte: "Des planches vermoulues cedent sous vos pieds au-dessus d'une fosse remplie de piques.",
        rangMin: "E", theme: "grotte", type: "interaction",
        choix: [
            { texte: "Se raccrocher in extremis au bord (Agilite min: 7)", condition: { stat: "agilite", min: 7 }, effet: { msg: "Vous vous rétablissez de justesse." } },
            { texte: "Tomber dans la fosse", effet: { pv: -45, statut: "saignement", msg: "Les piques vous lacerent la jambe." } }
        ]
    },
    {
        id: "d_20_coffre_mimique_bis",
        texte: "Un coffre richement orne scintille dans une alcove sombre.",
        rangMin: "D", theme: "donjon", type: "interaction",
        choix: [
            { texte: "Ouvrir prudemment", effet: { or: 200, msg: "Cette fois, c'etait un vrai trésor." } },
            { texte: "Attaquer preventivement", typeAction: "combat", monstre_id: "limon_acide" }
        ]
    },
    {
        id: "d_21_vent_glacial",
        texte: "Un courant d'air arctique s'engouffre soudainement dans le donjon, engourdissant vos membres.",
        rangMin: "C", theme: "grotte", type: "interaction",
        choix: [
            { texte: "Courir pour se rechauffer", effet: { fatigue: 15, msg: "Vous luttez contre le froid intense." } },
            { texte: "Subir le givre", effet: { agilite: -1, msg: "Vos mouvements deviennent rigides et lents." } }
        ]
    },
    {
        id: "d_22_bibliotheque_ancienne",
        texte: "Des etageres remplies de parchemins en decomposition s'etendent a perte de vue.",
        rangMin: "B", theme: "temple", type: "interaction",
        choix: [
            { texte: "Lire les grimoires interdits (Intelligence min: 15)", condition: { stat: "intelligence", min: 15 }, effet: { intelligence: 2, pmMax: 30, msg: "Votre esprit s'elargit aux secrets des arcanes." } },
            { texte: "Prendre ce qui brille", effet: { or: 120, msg: "Quelques pieces anciennes glissees entre les pages." } }
        ]
    },
    {
        id: "d_23_piege_gaz_soporifique",
        texte: "Un sifflement suspect retentit alors qu'un gaz verdatre commence a s'echapper des murs.",
        rangMin: "D", theme: "donjon", type: "interaction",
        choix: [
            { texte: "Retenir sa respiration (Vitalite min: 10)", condition: { stat: "vitalite", min: 10 }, effet: { msg: "Vous traversez la zone avant de respirer le gaz." } },
            { texte: "Respirer et s'endormir brievement", effet: { pv: -10, fatigue: 30, msg: "Vous vous réveillez fatigue, le sac un peu plus léger." } }
        ]
    },
    {
        id: "d_24_marcheur_egare",
        texte: "Un chasseur blesse erre sans but, victime d'une terrible malediction de folie.",
        rangMin: "C", theme: "tous", type: "interaction",
        choix: [
            { texte: "L'achever pour abreger ses souffrances", effet: { karma: -5, or: 70, msg: "Un acte froid mais lucratif." } },
            { texte: "L'ignorer et le laisser a son sort", effet: { karma: -1, msg: "Vous l'évitez soigneusement." } }
        ]
    },
    {
        id: "d_25_cellule_prison",
        texte: "Une vieille cellule de geole en fer rouille enferme un squelette encapuchonne.",
        rangMin: "E", theme: "donjon", type: "interaction",
        choix: [
            { texte: "Fouiller les ossements", effet: { item_gagne: "cristal_mana_e", or: 30, msg: "Un anneau rouille et quelques babioles de valeur." } },
            { texte: "Saluer la memoire du mort", effet: { karma: 2, msg: "Une minute de silence par respect." } }
        ]
    },
    {
        id: "d_26_salle_tresor_gardee",
        texte: "Une petite salle contient un coffre ouvert rempli d'or, mais une creature veille a l'entrée.",
        rangMin: "C", theme: "donjon", type: "interaction",
        choix: [
            { texte: "Affronter le gardien", typeAction: "combat", monstre_id: "assassin_ombre" },
            { texte: "Tenter le vol a la tire (Agilite min: 14)", condition: { stat: "agilite", min: 14 }, effet: { or: 300, msg: "Vol a la tire réussi. Vous repartez avec le magot." } }
        ]
    },
    {
        id: "d_27_echo_lointain",
        texte: "Des bruits de pas resonnent dans votre dos, comme si quelqu'un ou quelque chose vous traquait.",
        rangMin: "E", theme: "grotte", type: "interaction",
        choix: [
            { texte: "Accelerer le rythme", effet: { fatigue: 15, msg: "Vous distancez l'éventuel poursuivant au prix d'un effort intense." } },
            { texte: "Tendre une embuscade", effet: { perception: 1, xp: 15, msg: "Vous attendez, mais c'etait le simple echo de vos propres pas." } }
        ]
    },
    {
        id: "d_28_murailles_sueurs",
        texte: "La température monte brusquement de plusieurs dizaines de degrés dans ce secteur.",
        rangMin: "D", theme: "donjon", type: "interaction",
        choix: [
            { texte: "Boire de l'eau et avancer", effet: { pv: -10, msg: "La chaleur deshydrate rapidement votre corps." } },
            { texte: "Battre en retraite temporaire", effet: { fatigue: 10, msg: "Vous reprenez votre souffle dans une zone plus fraiche." } }
        ]
    },
    {
        id: "d_29_pierre_gravee_runes",
        texte: "Une stèle couverte d'inscriptions anciennes emet une faible lueur protectrice.",
        rangMin: "C", theme: "temple", type: "interaction",
        choix: [
            { texte: "Mediter devant la stèle", effet: { pm: 50, intelligence: 1, msg: "Votre esprit absorbe la résonance magique de la pierre." } },
            { texte: "Briser la stèle pour récupérer les materiaux", effet: { or: 100, karma: -3, msg: "Vous detruisez un artefact historique pour de l'argent." } }
        ]
    },
    {
        id: "d_30_marais_acide_souterrain",
        texte: "Le sol cede la place a une étendue de boue bouillonnante et corrosive.",
        rangMin: "D", theme: "grotte", type: "interaction",
        choix: [
            { texte: "Traverser en courant (Agilite min: 9)", condition: { stat: "agilite", min: 9 }, effet: { msg: "Vous traversez avant que la boue ne ronge vos bottes." } },
            { texte: "Subir la corrosion", effet: { pv: -25, or: -30, msg: "Votre équipement et vos jambes subissent l'acide." } }
        ]
    },
    {
        id: "d_31_offrande_oubliee",
        texte: "Une table en pierre porte des offrandes de nourriture encore fraiches malgre les siecles.",
        rangMin: "E", theme: "temple", type: "interaction",
        choix: [
            { texte: "Manger les offrandes", effet: { pv: 40, karma: -1, msg: "C'est delicieux, mais profaner des offrandes laisse une trace." } },
            { texte: "Laisser les offrandes en paix", effet: { karma: 2, msg: "Vous montrez du respect aux anciens occupants." } }
        ]
    },
    {
        id: "d_32_souffle_ombre",
        texte: "Une bourrasque de vent ténébreux eteint toutes vos sources de lumiere instantanement.",
        rangMin: "C", theme: "donjon", type: "interaction",
        choix: [
            { texte: "Avancer a tatons dans le noir (Perception min: 10)", condition: { stat: "perception", min: 10 }, effet: { xp: 20, msg: "Vos sens aiguises vous guident sans encombre." } },
            { texte: "Paniquer et trebucher", effet: { pv: -20, fatigue: 10, msg: "Vous vous cognez violemment contre un pilier." } }
        ]
    },
    {
        id: "d_33_reliquaire_brise",
        texte: "Un reliquaire en verre etincelant git brise sur le sol, son contenu eparpille.",
        rangMin: "D", theme: "temple", type: "interaction",
        choix: [
            { texte: "Ramasser les éclats magiques", effet: { item_gagne: "cristal_mana_d", msg: "Les fragments gardent une forte concentration de mana." } },
            { texte: "Ne rien toucher", effet: { msg: "La prudence est de mise." } }
        ]
    },
    {
        id: "d_34_fosse_aux_goulues",
        texte: "Des bruits de mastication et de grognements etouffes proviennent des ténèbres en contrebas.",
        rangMin: "C", theme: "grotte", type: "interaction",
        choix: [
            { texte: "Lancer une pierre pour faire diversion", effet: { fatigue: 5, msg: "Vous passez discretement pendant que la creature est distraite." } },
            { texte: "Affronter la chose", typeAction: "combat", monstre_id: "limon_acide" }
        ]
    },
    {
        id: "d_35_chambre_resonante",
        texte: "La moindre syllabe prononcee dans cette salle s'amplifie en un echo assourdissant.",
        rangMin: "E", theme: "grotte", type: "interaction",
        choix: [
            { texte: "Garder un silence de mort", effet: { msg: "Vous traversez la zone sans alerter l'environnement." } },
            { texte: "Crier de rage", effet: { pm: -15, force: 1, msg: "L'onde de choc résonne en vous et stimule votre adrenaline." } }
        ]
    },
    {
        id: "d_36_statue_guerrier_chute",
        texte: "Une immense statue de pierre s'est effondree, bloquant partiellement le passage principal.",
        rangMin: "D", theme: "temple", type: "interaction",
        choix: [
            { texte: "Soulever le bloc (Force min: 12)", condition: { stat: "force", min: 12 }, effet: { xp: 25, or: 50, msg: "Vous degagez un passage secret cache sous la statue." } },
            { texte: "Passer par un chemin etroit secondaire", effet: { fatigue: 15, msg: "Un passage exigu et inconfortable." } }
        ]
    },
    {
        id: "d_37_bassin_illusions",
        texte: "L'eau de ce bassin reflete des decors qui ne correspondent pas du tout au donjon actuel.",
        rangMin: "B", theme: "temple", type: "interaction",
        choix: [
            { texte: "Plonger le regard au fond (Intelligence min: 14)", condition: { stat: "intelligence", min: 14 }, effet: { intelligence: 2, pmMax: 20, msg: "Vous percevez la véritable matrice du donjon." } },
            { texte: "Detourner les yeux", effet: { msg: "Ces illusions malefiques risquent de vous rendre fou." } }
        ]
    },
    {
        id: "d_38_carcasse_golem",
        texte: "Les restes d'un ancien golem mecanique parsement le sol de metal rouille.",
        rangMin: "D", theme: "donjon", type: "interaction",
        choix: [
            { texte: "Récupérer les composants", effet: { item_gagne: "cristal_mana_d", msg: "Vous extrayez un noyau encore actif." } },
            { texte: "Ignorer les ferrailles", effet: { msg: "Aucun intérêt pratique." } }
        ]
    },
    {
        id: "d_39_piege_pression_lateral",
        texte: "Les murs de la piece commencent a se resserrer lentement l'un vers l'autre.",
        rangMin: "C", theme: "donjon", type: "interaction",
        choix: [
            { texte: "Trouver le mecanisme d'arret (Perception min: 11)", condition: { stat: "perception", min: 11 }, effet: { xp: 35, msg: "Vous enclenchez le levier d'arret in extremis." } },
            { texte: "Forcer le passage en force brute", effet: { pv: -30, fatigue: 20, msg: "Vous resistez a la pression des murs de justesse." } }
        ]
    },
    {
        id: "d_40_champ_de_force_faible",
        texte: "Une barriere lumineuse transparente bloque l'acces a un couloir annexe.",
        rangMin: "E", theme: "temple", type: "interaction",
        choix: [
            { texte: "Canaliser son énergie pour la percer", effet: { pm: -10, item_gagne: "cristal_mana_e", msg: "La barriere cede et libère un depot d'énergie." } },
            { texte: "Faire demi-tour", effet: { msg: "Vous abandonnez l'acces." } }
        ]
    },
    {
        id: "d_41_vision_fugace",
        texte: "Une silhouette spectrale traverse brievement le mur devant vous avant de s'evanouir.",
        rangMin: "C", theme: "temple", type: "interaction",
        choix: [
            { texte: "Tenter de communiquer", effet: { karma: 3, intelligence: 1, msg: "Le spectre laisse un sentiment de paix avant de disparaitre." } },
            { texte: "Sortir son arme par reflexe", effet: { fatigue: 5, msg: "Il n'y avait rien a frapper." } }
        ]
    },
    {
        id: "d_42_chambre_aux_epices",
        texte: "Un entrepot souterrain rempli de jarres d'aromates et de poudres alchimiques anciennes.",
        rangMin: "D", theme: "donjon", type: "interaction",
        choix: [
            { texte: "Récupérer ce qui est vendable", effet: { or: 90, msg: "Les marchands du marche noir en raffolent." } },
            { texte: "Gouter une poudre inconnue", effet: { pv: -15, pm: 30, msg: "Un stimulant puissant mais agressif pour l'estomac." } }
        ]
    },
    {
        id: "d_43_pendule_du_temps",
        texte: "Un gigantesque balancier mystique oscille au milieu d'une salle aux murs invisibles.",
        rangMin: "B", theme: "temple", type: "interaction",
        choix: [
            { texte: "Traverser au rythme de l'oscillation (Agilite min: 15)", condition: { stat: "agilite", min: 15 }, effet: { agilite: 2, xp: 50, msg: "Vos reflexes se synchronisent avec l'anomalie temporelle." } },
            { texte: "Se faire froler par le pendule", effet: { pv: -40, statut: "etourdissement", msg: "Le choc temporel vous desoriente totalement." } }
        ]
    },
    {
        id: "d_44_tas_d_os_suspect",
        texte: "Un immense tas d'ossements humains et animaux s'élevé au centre de la piece.",
        rangMin: "E", theme: "grotte", type: "interaction",
        choix: [
            { texte: "Fouiller le tas", typeAction: "combat", monstre_id: "limon_acide" },
            { texte: "Contourner prudemment", effet: { msg: "Vous évitez un piege ou un réveil macabre." } }
        ]
    },
    {
        id: "d_45_source_corruption",
        texte: "Un liquide noir et visqueux suinte des murs, pulsant comme un coeur vivant.",
        rangMin: "B", theme: "donjon", type: "interaction",
        choix: [
            { texte: "Purifier la source avec du Mana (-40 PM)", condition: { stat: "intelligence", min: 12 }, effet: { pm: -40, karma: 10, xp: 60, msg: "Vous neutralisez la source corrompue du donjon." } },
            { texte: "Ignorer et fuir l'odeur", effet: { msg: "Une abomination pareille ne présage rien de bon." } }
        ]
    },
    {
        id: "d_46_coffre_chaine_lourde",
        texte: "Un coffre de fer scelle par de lourdes chaines magiques repose sur un piedestal.",
        rangMin: "A", theme: "temple", type: "interaction",
        choix: [
            { texte: "Briser les chaines (Force min: 18)", condition: { stat: "force", min: 18 }, effet: { item_gagne: "pierre_essence", or: 500, msg: "Vous obtenez un trésor d'une valeur inestimable." } },
            { texte: "Renoncer face a la robustesse du sceau", effet: { msg: "Impossible a ouvrir sans une force surhumaine." } }
        ]
    },
    {
        id: "d_47_marche_des_ombres",
        texte: "Les torches du couloir s'eteignent une a une a mesure que vous avancez.",
        rangMin: "C", theme: "donjon", type: "interaction",
        choix: [
            { texte: "Avancer sereinement", effet: { perception: 1, msg: "Votre vision nocturne s'adapte a l'obscurite." } },
            { texte: "Allumer une torche de secours", effet: { fatigue: 5, msg: "Vous conservez une visibilité claire." } }
        ]
    },
    {
        id: "d_48_autel_offrande_vide",
        texte: "Un autel sacrificiel entierement creux et poussiereux.",
        rangMin: "E", theme: "temple", type: "interaction",
        choix: [
            { texte: "Deposer une piece d'or en offrande", effet: { or: -10, karma: 2, msg: "Une lueur benigne vous enveloppe brievement." } },
            { texte: "Ne rien faire", effet: { msg: "Rien ne se passe." } }
        ]
    },
    {
        id: "d_49_fissure_gaz_toxique",
        texte: "Une petite fissure crache un gaz jaunatre qui pique les yeux.",
        rangMin: "D", theme: "grotte", type: "interaction",
        choix: [
            { texte: "Colmater avec de la pierre", effet: { force: 1, msg: "Vous scellez la fuite proprement." } },
            { texte: "Passer en courant", effet: { pv: -15, msg: "Vous toussez bruyamment en traversant." } }
        ]
    },
    {
        id: "d_50_salle_des_miroirs",
        texte: "Une piece entierement tapissee de miroirs anciens qui refletent des versions etranges de vous-même.",
        rangMin: "C", theme: "temple", type: "interaction",
        choix: [
            { texte: "Briser le miroir central", typeAction: "combat", monstre_id: "assassin_ombre" },
            { texte: "Mediter face a son reflet", effet: { intelligence: 1, pm: 30, msg: "Vous acceptez vos parts d'ombre et de lumiere." } }
        ]
    },
    {
        id: "d_51_chute_de_pierres_minimes",
        texte: "Quelques cailloux degringolent du plafond, annoncant l'instabilite de la zone.",
        rangMin: "E", theme: "grotte", type: "interaction",
        choix: [
            { texte: "S'abriter sous une arche solide", effet: { msg: "Vous évitez les petits debris." } },
            { texte: "Courir sans regarder", effet: { pv: -10, msg: "Un caillou vous erafle l'epaule." } }
        ]
    },
    {
        id: "d_52_coffre_ouvert_piege",
        texte: "Un coffre grand ouvert, apparemment pille, cache un mecanisme de flechettes empoisonnees.",
        rangMin: "D", theme: "donjon", type: "interaction",
        choix: [
            { texte: "Inspecter le fond du coffre (Perception min: 9)", condition: { stat: "perception", min: 9 }, effet: { item_gagne: "cristal_mana_d", xp: 15, msg: "Vous repérez le double fond cache." } },
            { texte: "Mettre la main directement dedans", effet: { pv: -25, statut: "poison", msg: "Une flechette vous lacere la paume." } }
        ]
    },
    {
        id: "d_53_bruit_de_chaines",
        texte: "Des bruits de lourdes chaines trainees sur le sol se rapprochent dans le noir.",
        rangMin: "C", theme: "donjon", type: "interaction",
        choix: [
            { texte: "Se cacher derrière un pilier", effet: { perception: 1, msg: "Vous observez passer une patrouille sans être vu." } },
            { texte: "Préparer son arme", typeAction: "combat", monstre_id: "assassin_ombre" }
        ]
    },
    {
        id: "d_54_source_thermique_souterraine",
        texte: "Une eau chaude et fumante remplit un bassin naturel au milieu des rochers.",
        rangMin: "E", theme: "grotte", type: "interaction",
        choix: [
            { texte: "Tremper ses pieds et se reposer", effet: { fatigue: -25, pv: 20, msg: "Une detente musculaire bien meritee." } },
            { texte: "Boire goulument", effet: { pv: -10, msg: "L'eau est trop minerale et vous barbouille l'estomac." } }
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
        texte: "Une ancienne fresque murale a ete vandalisee et grattee methodiquement.",
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
            { texte: "Suivre le courant d'air", effet: { fatigue: -10, msg: "Le chemin s'avere plus direct et oxygenant." } },
            { texte: "Rester sur sa trajectoire initiale", effet: { msg: "Vous conservez votre plan de route." } }
        ]
    },
    {
        id: "d_58_fragment_cristal_geant",
        texte: "Un éclat de cristal monumental est plante profondement dans le sol rocheux.",
        rangMin: "B", theme: "grotte", type: "interaction",
        choix: [
            { texte: "Extraire le fragment (Force min: 15)", condition: { stat: "force", min: 15 }, effet: { item_gagne: "pierre_essence", xp: 40, msg: "Vous réussissez a detacher un morceau de haute purete." } },
            { texte: "Le frapper en vain", effet: { pv: -15, msg: "Le cristal est trop dur, vous vous blessez les mains." } }
        ]
    },
    {
        id: "d_59_chambre_des_soupirs",
        texte: "Des murmures inintelligibles semblent provenir des murs eux-mêmes.",
        rangMin: "C", theme: "temple", type: "interaction",
        choix: [
            { texte: "Ecouter les voix (Intelligence min: 11)", condition: { stat: "intelligence", min: 11 }, effet: { intelligence: 1, pm: 30, msg: "Les murmures vous révèlent l'emplacement d'un piege plus loin." } },
            { texte: "Se boucher les oreilles", effet: { fatigue: 10, msg: "Une irritation mentale desagreable." } }
        ]
    },
    {
        id: "d_60_piege_cable_discret",
        texte: "Un fin fil tendu traverse le ras du sol entre deux encadrements de porte.",
        rangMin: "D", theme: "donjon", type: "interaction",
        choix: [
            { texte: "Enjamber avec agilite", effet: { msg: "Vous esquivez le declencheur sans encombre." } },
            { texte: "Le couper pour récupérer le fil d'acier", effet: { item_gagne: "cristal_mana_e", msg: "Un cable magique reutilisable récupère." } }
        ]
    },
    {
        id: "d_61_bassin_de_sang_fige",
        texte: "Une cuve en pierre remplie d'un liquide rouge sombre completement solidifie.",
        rangMin: "C", theme: "temple", type: "interaction",
        choix: [
            { texte: "Briser la surface solidifiee", effet: { or: 75, item_gagne: "cristal_mana_d", msg: "Des objets precieux avaient ete jetes dedans en offrande." } },
            { texte: "Ne pas y toucher", effet: { msg: "L'atmosphere est trop pesante." } }
        ]
    },
    {
        id: "d_62_ronces_magiques",
        texte: "Des lianes epineuses lumineuses barrent l'acces au couloir.",
        rangMin: "D", theme: "grotte", type: "interaction",
        choix: [
            { texte: "Bruler les ronces", effet: { pm: -20, msg: "Les lianes se recroquevillent sous la chaleur de votre mana." } },
            { texte: "Forcer le passage a travers les epines", effet: { pv: -20, statut: "saignement", msg: "Les epines vous lacerent les bras." } }
        ]
    },
    {
        id: "d_63_autel_de_l_eclair",
        texte: "Un autel grave d'eclairs stylises crepite d'electricite statique.",
        rangMin: "B", theme: "temple", type: "interaction",
        choix: [
            { texte: "Canaliser l'énergie statique", effet: { agilite: 2, pm: 50, msg: "Vos influx nerveux sont survoltes. Votre agilite augmente." } },
            { texte: "Toucher imprudemment", effet: { pv: -45, statut: "etourdissement", msg: "Une decharge fulgurante vous traverse de part en part." } }
        ]
    },
    {
        id: "d_64_corps_frais",
        texte: "Le corps d'un aventurier tout juste abattu git au milieu du chemin.",
        rangMin: "C", theme: "donjon", type: "interaction",
        choix: [
            { texte: "Fouiller rapidement le corps", effet: { or: 150, item_gagne: "potion_soin_d", karma: -2, msg: "Vous empochez son butin avant l'arrivée du monstre l'ayant tue." } },
            { texte: "Prendre la fuite de peur", effet: { msg: "Le danger est manifestement tout proche." } }
        ]
    },
    {
        id: "d_65_fissure_lumiere_solaire",
        texte: "Une minuscule faille dans la roche laisse filtrer un authentique rayon de soleil extérieur.",
        rangMin: "E", theme: "grotte", type: "interaction",
        choix: [
            { texte: "Regarder un instant la lumiere", effet: { fatigue: -15, pv: 15, msg: "Un rappel bienvenu du monde de la surface qui vous redonne du courage." } },
            { texte: "Ignorer et avancer", effet: { msg: "Pas le temps de contempler le paysage." } }
        ]
    },
    {
        id: "d_66_mecanisme_mysterieux",
        texte: "Un panneau mural comportant des glyphes rotatifs s'offre a votre curiosite.",
        rangMin: "D", theme: "temple", type: "interaction",
        choix: [
            { texte: "Résoudre l'enigme (Intelligence min: 10)", condition: { stat: "intelligence", min: 10 }, effet: { or: 120, xp: 30, msg: "Un compartiment secret s'ouvre, revelant des pieces." } },
            { texte: "Tourner les symboles au hasard", effet: { pv: -15, msg: "Le mecanisme declenche un petit piege a aiguilles." } }
        ]
    },
    {
        id: "d_67_chambre_froide",
        texte: "La température chute brutalement sous zero. Le givre tapisse le sol et les murs.",
        rangMin: "C", theme: "grotte", type: "interaction",
        choix: [
            { texte: "Activer sa circulation de Mana pour se rechauffer (-15 PM)", effet: { pm: -15, msg: "Votre chaleur interne repousse le givre." } },
            { texte: "Subir le froid mordant", effet: { agilite: -1, pv: -10, msg: "Vos articulations engourdies ralentissent vos pas." } }
        ]
    },
    {
        id: "d_68_monolithe_brise",
        texte: "Les fragments d'un monolithe magique jonchent le sol, degageant une faible résonance.",
        rangMin: "B", theme: "temple", type: "interaction",
        choix: [
            { texte: "Absorber les fragments brises", effet: { pmMax: 25, item_gagne: "cristal_mana_d", msg: "Votre capacité maximale de Mana s'accroit." } },
            { texte: "Laisser les pierres inertes", effet: { msg: "Vous préférez ne pas perturber les energies residuelles." } }
        ]
    },
    {
        id: "d_69_hallebardes_murales",
        texte: "Des mecanismes fixes aux murs projettent des lames de hallebarde en balancier croise.",
        rangMin: "D", theme: "donjon", type: "interaction",
        choix: [
            { texte: "Passer en s'accroupissant (Agilite min: 11)", condition: { stat: "agilite", min: 11 }, effet: { xp: 20, msg: "Vous glissez sous les lames sans une egratignure." } },
            { texte: "Courir en esperant passer", effet: { pv: -30, statut: "saignement", msg: "Une lame vous entaille profondement le flanc." } }
        ]
    },
    {
        id: "d_70_seuil_du_boss",
        texte: "Une immense porte massive gravee de cranes et de symboles runiques barre le fond du couloir. C'est l'ultime épreuve.",
        rangMin: "E", theme: "tous", type: "interaction",
        choix: [
            { texte: "Franchir les portes et affronter le Boss", typeAction: "combat", monstre_id: "chef_gobelin" }
        ]
    }

];
