// ==========================================
// DATA-EVENEMENTS-PHASE1.JS
// Les 30 evenements de la Phase 1 (passe civil). Le moteur en tire 5 aleatoirement par partie.
// Champs effet geres par engine-hub.js : or, pv, pm, pvMax, pmMax, fatigue, karma, force, agilite, intelligence, perception, vitalite, item_gagne, msg
// ==========================================

const evenementsPhase1Data = [

    {
        id: "p1_01_voyous",
        texte: "En rentrant chez vous par une ruelle sombre, des voyous de quartier exigent votre argent.",
        choix: [
            { texte: "Donner 50 Or", effet: { or: -50, karma: 0, msg: "Vous payez pour éviter les ennuis." } },
            { texte: "Vous defendre (Force min: 5)", condition: { stat: "force", min: 5 }, effet: { or: 25, pv: -10, karma: 1, msg: "Vous donnez une lecon aux voyous et récupérez leur butin." } },
        
            { texte: "Analyser calmement la situation (Intelligence)", effet: { intelligence: 1, msg: "Vous prenez du recul et raisonnez avec sang-froid." } },
            { texte: "Observer attentivement les environs (Perception)", effet: { perception: 1, msg: "Rien ne vous echappe." } },
        ]
    },
    {
        id: "p1_02_chat",
        texte: "Vous trouvez un chat errant coince au sommet d'un grillage rouille.",
        choix: [
            { texte: "Aider le chat", effet: { karma: 5, agilite: 1, fatigue: 10, msg: "Le chat miaule joyeusement. Votre agilite s'améliore légèrement par cet effort." } },
            { texte: "Ignorer", effet: { karma: -2, msg: "Vous passez votre chemin sans vous soucier de l'animal." } },
        
            { texte: "Rester sur ses gardes (Perception)", effet: { perception: 1, msg: "Votre vigilance s'aiguise." } },
            { texte: "Serrer les dents et tenir bon (Vitalite)", effet: { vitalite: 1, msg: "Votre resistance physique augmente legerement." } },
        ]
    },
    {
        id: "p1_03_pub_guildes",
        texte: "Un tract publicitaire pour une guilde de bas etage glisse sous votre porte.",
        choix: [
            { texte: "Lire attentivement (+ Perception)", effet: { perception: 1, msg: "Vous analysez les clauses abusives du contrat." } },
            { texte: "Jeter a la poubelle", effet: { msg: "Vous ignorez les sirenes des guildes." } },
        
            { texte: "Puiser dans ses reserves (Vitalite)", effet: { vitalite: 1, msg: "Votre endurance se renforce." } },
            { texte: "Reflechir avant d'agir (Intelligence)", effet: { intelligence: 1, msg: "La reflexion prime sur la precipitation." } },
        ]
    },
    {
        id: "p1_04_fatigue_chronique",
        texte: "Votre corps subit le contrecoup des petits boulots exterieurs. Une fatigue intense vous prend.",
        choix: [
            { texte: "Prendre un excitant chimique (-10 PV, - Fatigue)", effet: { pv: -10, fatigue: -20, msg: "Votre coeur s'emballe, mais la fatigue disparait." } },
            { texte: "S'allonger un moment", effet: { fatigue: -10, msg: "Vous récupérez un peu d'énergie au prix de votre temps." } },
        
            { texte: "Etudier les details de la scene (Intelligence)", effet: { intelligence: 1, msg: "Vous emmagasinez chaque detail utile." } },
            { texte: "Ecouter plus que parler (Perception)", effet: { perception: 1, msg: "Vous captez ce que les autres manquent." } },
        ]
    },
    {
        id: "p1_05_colis_anonyme",
        texte: "Un colis non etiquete est depose devant votre palier. Il emet un léger bourdonnement.",
        choix: [
            { texte: "Ouvrir le colis", effet: { or: 100, pv: -15, msg: "C'etait un piege magique de bas niveau, mais il y avait de l'or a l'intérieur." } },
            { texte: "Le jeter dans la benne", effet: { msg: "La prudence est mere de sûreté. Vous vous en debarrassez." } },
        
            { texte: "Observer attentivement les environs (Perception)", effet: { perception: 1, msg: "Rien ne vous echappe." } },
            { texte: "Encaisser sans broncher (Vitalite)", effet: { vitalite: 1, msg: "Votre corps apprend a endurer." } },
        ]
    },
    {
        id: "p1_06_veilleur_nuit",
        texte: "Un vieil homme s'effondre sur le trottoir en pleine rue sous le regard indifferent des passants.",
        choix: [
            { texte: "L'aider et le raccompagner", effet: { karma: 10, or: -20, msg: "L'homme vous remercie chaleureusement et vous benit." } },
            { texte: "L'ignorer superbement", effet: { karma: -5, msg: "Le monde des chasseurs est impitoyable." } },
        
            { texte: "Serrer les dents et tenir bon (Vitalite)", effet: { vitalite: 1, msg: "Votre resistance physique augmente legerement." } },
            { texte: "Chercher une explication logique (Intelligence)", effet: { intelligence: 1, msg: "Votre esprit s'aiguise a force de tout questionner." } },
        ]
    },
    {
        id: "p1_07_entrainement_saccage",
        texte: "Vous decidez de faire des pompes et des abdos intensifs dans votre salon.",
        choix: [
            { texte: "Pousser ses limites (100 pompes, squats...)", effet: { force: 1, fatigue: 30, msg: "Votre corps brule, vos muscles se fortifient." } },
            { texte: "Seance légère", effet: { fatigue: 10, msg: "Une routine classique pour maintenir la forme." } },
        
            { texte: "Reflechir avant d'agir (Intelligence)", effet: { intelligence: 1, msg: "La reflexion prime sur la precipitation." } },
            { texte: "Scruter les moindres details (Perception)", effet: { perception: 1, msg: "Votre sens de l'observation progresse." } },
        ]
    },
    {
        id: "p1_08_veille_fissure",
        texte: "Une micro-fissure dimensionnelle s'ouvre brievement dans votre cuisine, laissant echapper une odeur d'ozone.",
        choix: [
            { texte: "Toucher la breche", effet: { intelligence: 1, pm: 10, msg: "Votre esprit effleure l'énergie du Mana." } },
            { texte: "Fuir dans le salon", effet: { msg: "Vous attendez terrifie que la breche se referme d'elle-même." } },
        
            { texte: "Ecouter plus que parler (Perception)", effet: { perception: 1, msg: "Vous captez ce que les autres manquent." } },
            { texte: "Rester impassible malgre la fatigue (Vitalite)", effet: { vitalite: 1, msg: "Votre corps s'endurcit." } },
        ]
    },
    {
        id: "p1_09_proche_inquiet",
        texte: "Un membre de votre famille appelle pour savoir si vous vous en sortez financierement.",
        choix: [
            { texte: "Rassurer et envoyer un peu d'argent (-50 Or)", effet: { or: -50, karma: 5, msg: "Ils sont soulages d'avoir de vos nouvelles." } },
            { texte: "Mentir et raccrocher", effet: { karma: -2, msg: "Vous préférez garder vos deniers pour survivre." } },
        
            { texte: "Encaisser sans broncher (Vitalite)", effet: { vitalite: 1, msg: "Votre corps apprend a endurer." } },
            { texte: "Analyser calmement la situation (Intelligence)", effet: { intelligence: 1, msg: "Vous prenez du recul et raisonnez avec sang-froid." } },
        ]
    },
    {
        id: "p1_10_marche_noir_info",
        texte: "Dans un forum obscur en ligne, un utilisateur anonyme vend des coordonnees de portails non repertories.",
        choix: [
            { texte: "Acheter l'information (100 Or)", effet: { or: -100, perception: 1, msg: "Vous apprenez a repérer les anomalies d'aura." } },
            { texte: "Fermer la page", effet: { msg: "Trop louche pour être honnete." } },
        
            { texte: "Chercher une explication logique (Intelligence)", effet: { intelligence: 1, msg: "Votre esprit s'aiguise a force de tout questionner." } },
            { texte: "Rester sur ses gardes (Perception)", effet: { perception: 1, msg: "Votre vigilance s'aiguise." } },
        ]
    },
    {
        id: "p1_11_agression_metro",
        texte: "Dans le metro bonde, un individu louche bouscule volontairement les passagers pour les detrousser.",
        choix: [
            { texte: "Le coincer discretement", effet: { karma: 3, or: 40, msg: "Vous récupérez les portefeuilles voles et gardez une part." } },
            { texte: "Tourner la tete", effet: { msg: "Ce n'est pas vos oignons." } },
        
            { texte: "Scruter les moindres details (Perception)", effet: { perception: 1, msg: "Votre sens de l'observation progresse." } },
            { texte: "Puiser dans ses reserves (Vitalite)", effet: { vitalite: 1, msg: "Votre endurance se renforce." } },
        ]
    },
    {
        id: "p1_12_panne_courant",
        texte: "Une coupure de courant générale plonge votre immeuble dans le noir complet pendant des heures.",
        choix: [
            { texte: "Mediter dans l'obscurite", effet: { intelligence: 1, fatigue: -5, msg: "Le calme force vous permet de clarifier votre esprit." } },
            { texte: "Allumer des bougies et s'impatienter", effet: { fatigue: 5, msg: "Une soiree longue et ennuyeuse." } },
        
            { texte: "Rester impassible malgre la fatigue (Vitalite)", effet: { vitalite: 1, msg: "Votre corps s'endurcit." } },
            { texte: "Etudier les details de la scene (Intelligence)", effet: { intelligence: 1, msg: "Vous emmagasinez chaque detail utile." } },
        ]
    },
    {
        id: "p1_13_recrutement_force",
        texte: "Un rabatteur de guilde vous aborde agressivement a la sortie de votre immeuble.",
        choix: [
            { texte: "Le menacer du regard (Agilite min: 8)", condition: { stat: "agilite", min: 8 }, effet: { karma: 2, msg: "Il comprend tout de suite qu'il perd son temps avec vous." } },
            { texte: "Esquiver poliment et fuir", effet: { msg: "Vous decampez avant qu'il n'insiste." } },
        
            { texte: "Analyser calmement la situation (Intelligence)", effet: { intelligence: 1, msg: "Vous prenez du recul et raisonnez avec sang-froid." } },
            { texte: "Observer attentivement les environs (Perception)", effet: { perception: 1, msg: "Rien ne vous echappe." } },
        ]
    },
    {
        id: "p1_14_medication_douteuse",
        texte: "Un medecin de rue propose des pilules miracles censees augmenter la résistance au stress des Chasseurs.",
        choix: [
            { texte: "Acheter et consommer (75 Or)", effet: { or: -75, pvMax: 5, msg: "Vos veines brulent, mais votre corps encaisse mieux." } },
            { texte: "Refuser net", effet: { msg: "L'arnaque est grossiere." } },
        
            { texte: "Rester sur ses gardes (Perception)", effet: { perception: 1, msg: "Votre vigilance s'aiguise." } },
            { texte: "Serrer les dents et tenir bon (Vitalite)", effet: { vitalite: 1, msg: "Votre resistance physique augmente legerement." } },
        ]
    },
    {
        id: "p1_15_etincelle_reveil",
        texte: "Au milieu de la nuit, une violente migraine vous réveillé. Vos yeux brillent brievement d'une lueur bleue.",
        choix: [
            { texte: "Accepter la douleur", effet: { perception: 2, pm: 20, msg: "Votre corps s'adapte lentement a l'appel du Système." } },
            { texte: "Prendre des analgesiques", effet: { fatigue: 10, msg: "Vous etouffez les symptomes." } },
        
            { texte: "Puiser dans ses reserves (Vitalite)", effet: { vitalite: 1, msg: "Votre endurance se renforce." } },
            { texte: "Reflechir avant d'agir (Intelligence)", effet: { intelligence: 1, msg: "La reflexion prime sur la precipitation." } },
        ]
    },
    {
        id: "p1_16_journal_brise",
        texte: "Vous trouvez un vieux journal intime abandonne sur un banc public, ecrit par un ancien Chasseur dechu.",
        choix: [
            { texte: "Le lire en entier", effet: { intelligence: 1, karma: 2, msg: "Ses erreurs passees deviennent vos lecons de survie." } },
            { texte: "L'utiliser pour allumer un feu", effet: { msg: "Du papier bon a jeter." } },
        
            { texte: "Etudier les details de la scene (Intelligence)", effet: { intelligence: 1, msg: "Vous emmagasinez chaque detail utile." } },
            { texte: "Ecouter plus que parler (Perception)", effet: { perception: 1, msg: "Vous captez ce que les autres manquent." } },
        ]
    },
    {
        id: "p1_17_incident_bureau",
        texte: "Votre supérieur hiérarchique direct vous humilie injustement devant vos collegues de travail.",
        choix: [
            { texte: "Garder son calme et encaisser", effet: { karma: 1, fatigue: 10, msg: "Vous serrez les poings en silence. Votre patience s'aiguise." } },
            { texte: "L'envoyer balader et claquer la porte", effet: { or: -100, karma: -2, msg: "Libre, mais financierement dans le petrin." } },
        
            { texte: "Observer attentivement les environs (Perception)", effet: { perception: 1, msg: "Rien ne vous echappe." } },
            { texte: "Encaisser sans broncher (Vitalite)", effet: { vitalite: 1, msg: "Votre corps apprend a endurer." } },
        ]
    },
    {
        id: "p1_18_poubelle_magique",
        texte: "En jetant vos ordures, vous remarquez un composant de portail jete par erreur par un autre Chasseur.",
        choix: [
            { texte: "Fouiller la benne", effet: { item_gagne: "cristal_mana_e", msg: "Vous récupérez un cristal a moitie utilisable." } },
            { texte: "Ne pas se salir les mains", effet: { msg: "Vous rebroussez chemin." } },
        
            { texte: "Serrer les dents et tenir bon (Vitalite)", effet: { vitalite: 1, msg: "Votre resistance physique augmente legerement." } },
            { texte: "Chercher une explication logique (Intelligence)", effet: { intelligence: 1, msg: "Votre esprit s'aiguise a force de tout questionner." } },
        ]
    },
    {
        id: "p1_19_propos_nocturnes",
        texte: "Des bruits de pas lourds et anormaux resonnent sur le toit de votre immeuble au milieu de la nuit.",
        choix: [
            { texte: "Aller voir par la fenetre", effet: { perception: 1, msg: "Vous apercevez l'ombre fugace d'une bete familiere." } },
            { texte: "Se cacher sous les draps", effet: { msg: "La peur vous paralyse." } },
        
            { texte: "Reflechir avant d'agir (Intelligence)", effet: { intelligence: 1, msg: "La reflexion prime sur la precipitation." } },
            { texte: "Scruter les moindres details (Perception)", effet: { perception: 1, msg: "Votre sens de l'observation progresse." } },
        ]
    },
    {
        id: "p1_20_don_sanguin_cache",
        texte: "Une clinique louche propose de l'argent rapide en echange de prelevements sanguins inexpliques.",
        choix: [
            { texte: "Donner du sang contre de l'or (50 Or, -15 PV)", effet: { or: 50, pv: -15, msg: "Vous repartez plus pauvre en sang, un peu plus riche en pieces." } },
            { texte: "Refuser et fuir l'endroit", effet: { msg: "L'ambiance est irrespirable." } },
        
            { texte: "Ecouter plus que parler (Perception)", effet: { perception: 1, msg: "Vous captez ce que les autres manquent." } },
            { texte: "Rester impassible malgre la fatigue (Vitalite)", effet: { vitalite: 1, msg: "Votre corps s'endurcit." } },
        ]
    },
    {
        id: "p1_21_cours_art_martiaux",
        texte: "Une vieille video d'un maitre d'arts martiaux légendaire circule sur un réseau crypte.",
        choix: [
            { texte: "Etudier les postures (Intelligence min: 6)", condition: { stat: "intelligence", min: 6 }, effet: { agilite: 1, msg: "Vous comprenez comment optimiser vos deplacements." } },
            { texte: "Trouver ca inefficace", effet: { msg: "Vous perdez votre temps." } },
        
            { texte: "Encaisser sans broncher (Vitalite)", effet: { vitalite: 1, msg: "Votre corps apprend a endurer." } },
            { texte: "Analyser calmement la situation (Intelligence)", effet: { intelligence: 1, msg: "Vous prenez du recul et raisonnez avec sang-froid." } },
        ]
    },
    {
        id: "p1_22_voisin_bruyant",
        texte: "Votre voisin fait un tapage nocturne insupportable alors que vous devez récupérer pour un raid.",
        choix: [
            { texte: "Aller lui expliquer poliment la situation", effet: { karma: 1, fatigue: 5, msg: "Il s'excuse et baisse le son." } },
            { texte: "Frapper violemment a sa porte", effet: { karma: -2, force: 1, msg: "Il cede de peur. Vous avez évacue votre frustration." } },
        
            { texte: "Chercher une explication logique (Intelligence)", effet: { intelligence: 1, msg: "Votre esprit s'aiguise a force de tout questionner." } },
            { texte: "Rester sur ses gardes (Perception)", effet: { perception: 1, msg: "Votre vigilance s'aiguise." } },
        ]
    },
    {
        id: "p1_23_loterie_douteuse",
        texte: "Un ticket de loterie achete par ennui dans une superette de quartier.",
        choix: [
            { texte: "Gratter le ticket (Cout: 10 Or)", effet: { or: 40, msg: "C'est petit, mais vous avez gagne un petit pactole." } },
            { texte: "Jeter le ticket", effet: { or: -10, msg: "De l'argent jete par la fenetre." } },
        
            { texte: "Scruter les moindres details (Perception)", effet: { perception: 1, msg: "Votre sens de l'observation progresse." } },
            { texte: "Puiser dans ses reserves (Vitalite)", effet: { vitalite: 1, msg: "Votre endurance se renforce." } },
        ]
    },
    {
        id: "p1_24_faim_de_loup",
        texte: "Faute d'argent, votre frigo est desesperement vide pour les trois prochains jours.",
        choix: [
            { texte: "Manger des rations de survie bon marche (-10 PV)", effet: { pv: -10, msg: "Ca cale l'estomac, mais c'est infect." } },
            { texte: "Jeuner en dormant", effet: { fatigue: 15, msg: "Le ventre vide, le sommeil est agite." } },
        
            { texte: "Rester impassible malgre la fatigue (Vitalite)", effet: { vitalite: 1, msg: "Votre corps s'endurcit." } },
            { texte: "Etudier les details de la scene (Intelligence)", effet: { intelligence: 1, msg: "Vous emmagasinez chaque detail utile." } },
        ]
    },
    {
        id: "p1_25_regard_tranchant",
        texte: "Dans le metro, un inconnu vous fixe intensement avec une hostilité non dissimulee.",
        choix: [
            { texte: "Soutenir son regard (Perception min: 5)", condition: { stat: "perception", min: 5 }, effet: { perception: 1, msg: "L'inconnu detourne les yeux le premier, intimide." } },
            { texte: "Baisser les yeux", effet: { msg: "Inutile de chercher les ennuis." } },
        
            { texte: "Analyser calmement la situation (Intelligence)", effet: { intelligence: 1, msg: "Vous prenez du recul et raisonnez avec sang-froid." } },
            { texte: "Observer attentivement les environs (Perception)", effet: { perception: 1, msg: "Rien ne vous echappe." } },
        ]
    },
    {
        id: "p1_26_reparation_materiel",
        texte: "Votre équipement de base commence a s'effilocher serieusement.",
        choix: [
            { texte: "Le réparer vous-même avec du fil et de la colle", effet: { agilite: 1, msg: "Bricolage de fortune mais efficace." } },
            { texte: "Laisser tel quel", effet: { msg: "Il tiendra bien encore un peu." } },
        
            { texte: "Rester sur ses gardes (Perception)", effet: { perception: 1, msg: "Votre vigilance s'aiguise." } },
            { texte: "Serrer les dents et tenir bon (Vitalite)", effet: { vitalite: 1, msg: "Votre resistance physique augmente legerement." } },
        ]
    },
    {
        id: "p1_27_appel_secours_anonyme",
        texte: "Votre telephone vibre avec un message d'alerte automatise signalant une breche mineure proche.",
        choix: [
            { texte: "Ignorer l'alerte", effet: { msg: "Ce n'est pas votre rôle pour l'instant." } },
            { texte: "Noter l'emplacement pour plus tard", effet: { perception: 1, msg: "Vous commencez a cartographier mentalement la ville." } },
        
            { texte: "Puiser dans ses reserves (Vitalite)", effet: { vitalite: 1, msg: "Votre endurance se renforce." } },
            { texte: "Reflechir avant d'agir (Intelligence)", effet: { intelligence: 1, msg: "La reflexion prime sur la precipitation." } },
        ]
    },
    {
        id: "p1_28_hallucination_auditive",
        texte: "Une voix mecanique semble resonner au fond de votre esprit, murmurant des mots incomprehensibles.",
        choix: [
            { texte: "Ecouter attentivement", effet: { intelligence: 1, pm: 15, msg: "Votre esprit frole une structure invisible." } },
            { texte: "Secouer la tete pour chasser le bruit", effet: { msg: "Vous reprenez vos esprits." } },
        
            { texte: "Etudier les details de la scene (Intelligence)", effet: { intelligence: 1, msg: "Vous emmagasinez chaque detail utile." } },
            { texte: "Ecouter plus que parler (Perception)", effet: { perception: 1, msg: "Vous captez ce que les autres manquent." } },
        ]
    },
    {
        id: "p1_29_fausse_piste",
        texte: "Un prétendu expert en esoterisme propose des cours pour eveiller ses pouvoirs de Chasseur.",
        choix: [
            { texte: "Payer la formation (50 Or)", effet: { or: -50, msg: "C'etait un charlatan pur et simple. Vous avez perdu votre argent." } },
            { texte: "Passer votre chemin", effet: { msg: "Vous repérez l'escroquerie a plein nez." } },
        
            { texte: "Observer attentivement les environs (Perception)", effet: { perception: 1, msg: "Rien ne vous echappe." } },
            { texte: "Encaisser sans broncher (Vitalite)", effet: { vitalite: 1, msg: "Votre corps apprend a endurer." } },
        ]
    },
    {
        id: "p1_30_veille_eveil",
        texte: "La pression barometrique chute brutalement. L'air devient lourd, sature d'énergie magique invisible.",
        choix: [
            { texte: "Se préparer mentalement a l'inévitable", effet: { pvMax: 10, pmMax: 10, msg: "Votre corps se detend et s'apprete a franchir le seuil." } },
            { texte: "Dormir profondement", effet: { fatigue: -10, msg: "Vous dormez malgre l'atmosphere lourde." } },
        
            { texte: "Serrer les dents et tenir bon (Vitalite)", effet: { vitalite: 1, msg: "Votre resistance physique augmente legerement." } },
            { texte: "Chercher une explication logique (Intelligence)", effet: { intelligence: 1, msg: "Votre esprit s'aiguise a force de tout questionner." } },
        ]
    }

];
