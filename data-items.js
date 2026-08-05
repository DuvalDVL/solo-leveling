// ==========================================
// DATA-ITEMS.JS
// Base de donnees des objets et equipements
// Systeme visuel : image generique partagee par type/rarete + liseret CSS pilote par le champ "rang"
// Seuls les objets uniques/legendaires ont un visuel dedie
// ==========================================

const itemsData = [

    // ------------------------------------------
    // 1. CONSOMMABLES
    // ------------------------------------------
    { id: "potion_soin_e", nom: "Potion de Soin Basique", type: "consommable", rang: "E", image: "assets/items/consommables/potion_soin.png", stackable: true, description: "Restaure 50 PV.", effet: { type: "soin_pv", valeur: 50 } },
    { id: "potion_soin_d", nom: "Potion de Soin Avancee", type: "consommable", rang: "D", image: "assets/items/consommables/potion_soin.png", stackable: true, description: "Restaure 150 PV.", effet: { type: "soin_pv", valeur: 150 } },
    { id: "potion_soin_c", nom: "Potion de Soin Supérieure", type: "consommable", rang: "C", image: "assets/items/consommables/potion_soin.png", stackable: true, description: "Restaure 350 PV.", effet: { type: "soin_pv", valeur: 350 } },
    { id: "potion_soin_b", nom: "Potion de Soin Concentree", type: "consommable", rang: "B", image: "assets/items/consommables/potion_soin.png", stackable: true, description: "Restaure 700 PV.", effet: { type: "soin_pv", valeur: 700 } },
    { id: "potion_soin_a", nom: "Potion de Soin Sacree", type: "consommable", rang: "A", image: "assets/items/consommables/potion_soin.png", stackable: true, description: "Restaure 1300 PV.", effet: { type: "soin_pv", valeur: 1300 } },
    { id: "potion_soin_s", nom: "Elixir de Regeneration", type: "consommable", rang: "S", image: "assets/items/consommables/potion_soin.png", stackable: true, description: "Restaure 2000 PV.", effet: { type: "soin_pv", valeur: 2000 } },

    { id: "potion_mana_e", nom: "Fiole de Mana Basique", type: "consommable", rang: "E", image: "assets/items/consommables/potion_mana.png", stackable: true, description: "Restaure 30 PM.", effet: { type: "soin_pm", valeur: 30 } },
    { id: "potion_mana_d", nom: "Fiole de Mana Avancee", type: "consommable", rang: "D", image: "assets/items/consommables/potion_mana.png", stackable: true, description: "Restaure 80 PM.", effet: { type: "soin_pm", valeur: 80 } },
    { id: "potion_mana_c", nom: "Fiole de Mana Supérieure", type: "consommable", rang: "C", image: "assets/items/consommables/potion_mana.png", stackable: true, description: "Restaure 180 PM.", effet: { type: "soin_pm", valeur: 180 } },
    { id: "potion_mana_b", nom: "Fiole de Mana Concentree", type: "consommable", rang: "B", image: "assets/items/consommables/potion_mana.png", stackable: true, description: "Restaure 350 PM.", effet: { type: "soin_pm", valeur: 350 } },
    { id: "potion_mana_a", nom: "Fiole de Mana Sacree", type: "consommable", rang: "A", image: "assets/items/consommables/potion_mana.png", stackable: true, description: "Restaure 650 PM.", effet: { type: "soin_pm", valeur: 650 } },
    { id: "potion_mana_s", nom: "Essence de Mana Pure", type: "consommable", rang: "S", image: "assets/items/consommables/potion_mana.png", stackable: true, description: "Restaure 1000 PM.", effet: { type: "soin_pm", valeur: 1000 } },

    { id: "bandages_medicaux", nom: "Bandages Medicaux", type: "consommable", rang: "E", image: "assets/items/consommables/bandages.png", stackable: true, description: "Supprime l'altération Saignement.", effet: { type: "soin_statut", cible: "saignement" } },
    { id: "antidote_universel", nom: "Antidote Universel", type: "consommable", rang: "D", image: "assets/items/consommables/antidote.png", stackable: true, description: "Supprime l'altération Poison.", effet: { type: "soin_statut", cible: "poison" } },
    { id: "cristal_teleportation", nom: "Cristal de Teleportation", type: "consommable", rang: "B", image: "assets/items/consommables/cristal_teleportation.png", stackable: true, description: "Permet de fuir un donjon instantanement. Objet très rare.", effet: { type: "fuite_instantanee" } },
    { id: "elixir_vie", nom: "Elixir de Vie", type: "consommable", rang: "S", image: "assets/items/legendaire/elixir_vie.png", stackable: true, description: "Objet légendaire de la Vitrine du Système. Guerit les blessures permanentes d'un allie ou accorde un bonus definitif de Vitalite.", effet: { type: "guerison_permanente_ou_bonus_vitalite" } },

    // ------------------------------------------
    // 2. MATERIAUX ET MONNAIES D'ECHANGE
    // ------------------------------------------
    { id: "cristal_mana_e", nom: "Cristal de Mana Brute", type: "materiau", rang: "E", image: "assets/items/materiaux/cristal_mana.png", stackable: true, description: "Residu magique extrait d'un monstre de bas etage. Se vend a la guilde." },
    { id: "cristal_mana_d", nom: "Cristal de Mana Lumineux", type: "materiau", rang: "D", image: "assets/items/materiaux/cristal_mana.png", stackable: true, description: "Cristal degageant une lueur stable." },
    { id: "cristal_mana_c", nom: "Cristal de Mana Vibrant", type: "materiau", rang: "C", image: "assets/items/materiaux/cristal_mana.png", stackable: true, description: "Cristal charge d'une énergie palpable." },
    { id: "cristal_mana_b", nom: "Cristal de Mana Condense", type: "materiau", rang: "B", image: "assets/items/materiaux/cristal_mana.png", stackable: true, description: "Rare et très recherche des alchimistes." },
    { id: "cristal_mana_a", nom: "Cristal de Mana Radiant", type: "materiau", rang: "A", image: "assets/items/materiaux/cristal_mana.png", stackable: true, description: "Emet une chaleur magique constante." },
    { id: "cristal_mana_s", nom: "Cristal de Mana Absolu", type: "materiau", rang: "S", image: "assets/items/materiaux/cristal_mana.png", stackable: true, description: "Extrêmement rare, loot de boss de haut rang uniquement." },

    { id: "cadavre_monstre", nom: "Cadavre de Monstre", type: "materiau", rang: "E", image: "assets/items/materiaux/cadavre_monstre.png", stackable: true, description: "A revendre a la guilde des Charognards." },
    { id: "pierre_essence", nom: "Pierre d'Essence Pure", type: "special", rang: "S", image: "assets/items/special/pierre_essence.png", stackable: true, description: "Cristal d'ame extrêmement rare. Monnaie de la Boutique du Système, loot de boss uniquement." },

    { id: "cle_donjon_e", nom: "Cle de Donjon Instancie (E)", type: "special", rang: "E", image: "assets/items/special/cle_donjon.png", stackable: true, description: "Ouvre un donjon instancie de rang E. Obtenue via le Coffre Maudit.", effet: { type: "ouvre_donjon_instancie", rang: "E" } },
    { id: "cle_donjon_d", nom: "Cle de Donjon Instancie (D)", type: "special", rang: "D", image: "assets/items/special/cle_donjon.png", stackable: true, description: "Ouvre un donjon instancie de rang D.", effet: { type: "ouvre_donjon_instancie", rang: "D" } },
    { id: "cle_donjon_c", nom: "Cle de Donjon Instancie (C)", type: "special", rang: "C", image: "assets/items/special/cle_donjon.png", stackable: true, description: "Ouvre un donjon instancie de rang C.", effet: { type: "ouvre_donjon_instancie", rang: "C" } },
    { id: "cle_donjon_b", nom: "Cle de Donjon Instancie (B)", type: "special", rang: "B", image: "assets/items/special/cle_donjon.png", stackable: true, description: "Ouvre un donjon instancie de rang B.", effet: { type: "ouvre_donjon_instancie", rang: "B" } },
    { id: "cle_donjon_a", nom: "Cle de Donjon Instancie (A)", type: "special", rang: "A", image: "assets/items/special/cle_donjon.png", stackable: true, description: "Ouvre un donjon instancie de rang A.", effet: { type: "ouvre_donjon_instancie", rang: "A" } },
    { id: "cle_donjon_s", nom: "La Cle S (Héritage)", type: "special", rang: "S", image: "assets/items/legendaire/cle_s.png", stackable: false, description: "Objet unique scenarise. Ouvre le donjon final et declenche l'Ascension de Monarque.", effet: { type: "ouvre_donjon", rang: "S", cible: "temple_monarque" } },

    { id: "faux_papiers_identite", nom: "Faux Papiers d'Identité", type: "special", rang: "C", image: "assets/items/special/faux_papiers.png", stackable: false, description: "Achetes au Marche Noir. Permettent de contourner un test de Rang.", effet: { type: "contourne_test_rang" } },
    { id: "dissimulateur_mana", nom: "Dissimulateur de Mana", type: "accessoire", rang: "B", image: "assets/items/accessoires/dissimulateur_mana.png", stackable: false, description: "Permet de cacher sa véritable puissance aux Inspecteurs de l'Association.", special: "masque_mana" },

    // ------------------------------------------
    // 3. ARMES PRINCIPALES PAR CLASSE
    // Image générique partagee par classe d'arme, liseret CSS gère par le rang
    // ------------------------------------------

    // --- Guerrier (Force) : épées / lames lourdes ---
    { id: "epee_rouillee", nom: "Epee Rouillee", type: "arme_principale", classe: "guerrier", rang: "E", image: "assets/items/armes/epee_generique.png", stackable: false, description: "Une arme de fortune trouvee sur un champ de bataille oublie.", stats: { force: 5 }, competence_texte: "Frapper lourdement" },
    { id: "glaive_acier", nom: "Glaive en Acier", type: "arme_principale", classe: "guerrier", rang: "D", image: "assets/items/armes/epee_generique.png", stackable: false, description: "Lame solide forgee par un armurier de guilde mineure.", stats: { force: 12 }, competence_texte: "Frapper lourdement" },
    { id: "hache_or", nom: "Hache d'Or", type: "arme_principale", classe: "guerrier", rang: "C", image: "assets/items/armes/epee_generique.png", stackable: false, description: "Son tranchant dore intimide autant qu'il blesse.", stats: { force: 25, vitalite: 5 }, competence_texte: "Fendre en deux" },
    { id: "espadon_chevalier", nom: "Espadon de Chevalier", type: "arme_principale", classe: "guerrier", rang: "B", image: "assets/items/armes/epee_generique.png", stackable: false, description: "Arme ceremoniale d'un ordre dechu.", stats: { force: 45, vitalite: 10 }, competence_texte: "Fendre en deux" },
    { id: "lame_sacree_dragon", nom: "Lame Sacree du Dragon", type: "arme_principale", classe: "guerrier", rang: "A", image: "assets/items/armes/epee_generique.png", stackable: false, description: "Forgee dans l'ecaille d'un dragon ancien.", stats: { force: 75, vitalite: 15 }, competence_texte: "Frappe Draconique", statut_applique: { type: "brûlure", chance: 0.2, duree: 2 } },
    { id: "lame_roi_demon", nom: "Lame du Roi Demon", type: "arme_principale", classe: "guerrier", rang: "S", image: "assets/items/legendaire/lame_roi_demon.png", stackable: false, description: "L'arme ultime forgee dans le noir absolu.", stats: { force: 130, vitalite: 25 }, competence_texte: "Fendre en Deux le Destin", statut_applique: { type: "saignement", chance: 0.35, duree: 3 } },

    // --- Assassin (Agilite + Reflexe) : dagues ---
    { id: "dague_emoussee", nom: "Dague Emoussee", type: "arme_principale", classe: "assassin", rang: "E", image: "assets/items/armes/dague_generique.png", stackable: false, description: "Une arme de fortune.", stats: { agilite: 5, force: 1 }, competence_texte: "Poignarder maladroitement" },
    { id: "croc_lycan", nom: "Croc de Lycan", type: "arme_principale", classe: "assassin", rang: "D", image: "assets/items/armes/dague_generique.png", stackable: false, description: "Taillee dans la machoire d'une bete feroce.", stats: { agilite: 12, force: 2 }, competence_texte: "Poignarder dans l'angle mort" },
    { id: "dague_empoisonnee", nom: "Dague Empoisonnee", type: "arme_principale", classe: "assassin", rang: "C", image: "assets/items/armes/dague_generique.png", stackable: false, description: "La lame suinte encore d'un poison actif.", stats: { agilite: 25 }, competence_texte: "Trancher la gorge", statut_applique: { type: "poison", chance: 0.3, duree: 3 } },
    { id: "dague_ombre", nom: "Dague de l'Ombre", type: "arme_principale", classe: "assassin", rang: "B", image: "assets/items/armes/dague_generique.png", stackable: false, description: "Semble absorber la lumiere environnante.", stats: { agilite: 45 }, competence_texte: "Trancher la gorge", statut_applique: { type: "saignement", chance: 0.4, duree: 3 } },
    { id: "crocs_jumeaux_argent", nom: "Crocs Jumeaux d'Argent", type: "arme_principale", classe: "assassin", rang: "A", image: "assets/items/armes/dague_generique.png", stackable: false, description: "Une paire de lames jumelles d'une precision chirurgicale.", stats: { agilite: 80 }, competence_texte: "Execution Furtive", statut_applique: { type: "saignement", chance: 0.45, duree: 4 } },
    { id: "dagues_monarque", nom: "Dagues du Monarque des Ombres", type: "arme_principale", classe: "assassin", rang: "S", image: "assets/items/legendaire/dagues_monarque.png", stackable: false, description: "L'arme ultime forgee dans le noir absolu.", stats: { agilite: 150, force: 100 }, competence_texte: "Execution Sombre", statut_applique: { type: "saignement_mortel", chance: 0.5, duree: 5 } },

    // --- Mage (Intelligence) : batons / orbes / sceptres ---
    { id: "baton_bois", nom: "Baton en Bois", type: "arme_principale", classe: "mage", rang: "E", image: "assets/items/armes/baton_generique.png", stackable: false, description: "Un simple baton canalisant un mana instable.", stats: { intelligence: 5 }, competence_texte: "Incanter un sort" },
    { id: "baton_runique", nom: "Baton Runique", type: "arme_principale", classe: "mage", rang: "D", image: "assets/items/armes/baton_generique.png", stackable: false, description: "Grave de symboles anciens.", stats: { intelligence: 12 }, competence_texte: "Incanter un sort" },
    { id: "orbe_foudre", nom: "Orbe de Foudre", type: "arme_principale", classe: "mage", rang: "C", image: "assets/items/armes/baton_generique.png", stackable: false, description: "Une sphere crepitant d'electricite statique.", stats: { intelligence: 25 }, competence_texte: "Projeter de l'énergie" },
    { id: "sceptre_flammes", nom: "Sceptre des Flammes", type: "arme_principale", classe: "mage", rang: "B", image: "assets/items/armes/baton_generique.png", stackable: false, description: "Chaud au toucher, jamais consume.", stats: { intelligence: 45 }, competence_texte: "Projeter de l'energie", statut_applique: { type: "brulure", chance: 0.3, duree: 3 } },
    { id: "grimoire_vivant", nom: "Grimoire Vivant", type: "arme_principale", classe: "mage", rang: "A", image: "assets/items/armes/baton_generique.png", stackable: false, description: "Ses pages tournent seules, murmurant des sorts oublies.", stats: { intelligence: 80 }, competence_texte: "Incantation Interdite" },
    { id: "sceptre_roi_demon", nom: "Sceptre du Roi Demon", type: "arme_principale", classe: "mage", rang: "S", image: "assets/items/legendaire/sceptre_roi_demon.png", stackable: false, description: "L'arme ultime forgee dans le noir absolu.", stats: { intelligence: 150 }, competence_texte: "Enfer Blanc", statut_applique: { type: "brûlure", chance: 0.5, duree: 4 } },

    // --- Ranger (Perception + Agilite) : arcs ---
    { id: "arc_chasse", nom: "Arc de Chasse", type: "arme_principale", classe: "ranger", rang: "E", image: "assets/items/armes/arc_generique.png", stackable: false, description: "Un arc simple mais fiable.", stats: { perception: 5 }, competence_texte: "Decocher une fleche" },
    { id: "arc_renforce", nom: "Arc Renforce", type: "arme_principale", classe: "ranger", rang: "D", image: "assets/items/armes/arc_generique.png", stackable: false, description: "Renforce de fibres magiques.", stats: { perception: 12 }, competence_texte: "Decocher une fleche" },
    { id: "arbalete_elfe", nom: "Arbalete Elfe", type: "arme_principale", classe: "ranger", rang: "C", image: "assets/items/armes/arc_generique.png", stackable: false, description: "Précision redoutable a moyenne portee.", stats: { perception: 25, agilite: 5 }, competence_texte: "Tir de précision" },
    { id: "fusil_mana", nom: "Fusil a Mana", type: "arme_principale", classe: "ranger", rang: "B", image: "assets/items/armes/arc_generique.png", stackable: false, description: "Convertit le mana en projectiles concentres.", stats: { perception: 45, agilite: 10 }, competence_texte: "Tir de précision" },
    { id: "arc_vent_hurlant", nom: "Arc du Vent Hurlant", type: "arme_principale", classe: "ranger", rang: "A", image: "assets/items/armes/arc_generique.png", stackable: false, description: "Chaque fleche tiree siffle comme une tempete.", stats: { perception: 80, agilite: 15 }, competence_texte: "Tir Fulgurant" },
    { id: "arc_arbre_monde", nom: "Arc de l'Arbre Monde", type: "arme_principale", classe: "ranger", rang: "S", image: "assets/items/legendaire/arc_arbre_monde.png", stackable: false, description: "Taille dans une branche de l'Arbre Monde lui-même.", stats: { perception: 150, agilite: 30 }, competence_texte: "Tir Transperce-Armure" },

    // --- Tank / Protecteur (Vitalite) : boucliers ---
    { id: "bouclier_bois", nom: "Bouclier en Bois", type: "arme_principale", classe: "tank", rang: "E", image: "assets/items/armes/bouclier_generique.png", stackable: false, description: "Rudimentaire mais efficace.", stats: { vitalite: 5 }, competence_texte: "Se mettre en garde" },
    { id: "bouclier_fer", nom: "Bouclier de Fer", type: "arme_principale", classe: "tank", rang: "D", image: "assets/items/armes/bouclier_generique.png", stackable: false, description: "Standard de l'Association pour les recrues.", stats: { vitalite: 12 }, competence_texte: "Se mettre en garde" },
    { id: "bouclier_lourd_orc", nom: "Bouclier Lourd Orc", type: "arme_principale", classe: "tank", rang: "C", image: "assets/items/armes/bouclier_generique.png", stackable: false, description: "Butin de guerre pris a un chef orc.", stats: { vitalite: 25, force: 5 }, competence_texte: "Posture Inebranlable" },
    { id: "bouclier_bastion", nom: "Bouclier Bastion", type: "arme_principale", classe: "tank", rang: "B", image: "assets/items/armes/bouclier_generique.png", stackable: false, description: "Aussi large qu'une porte de forteresse.", stats: { vitalite: 45, force: 10 }, competence_texte: "Posture Inebranlable" },
    { id: "bouclier_bastion_sacre", nom: "Bouclier Bastion Sacre", type: "arme_principale", classe: "tank", rang: "A", image: "assets/items/armes/bouclier_generique.png", stackable: false, description: "Beni par un ancien ordre de gardiens.", stats: { vitalite: 80, force: 15 }, competence_texte: "Rempart Absolu" },
    { id: "egide_lumiere", nom: "Egide de Lumiere", type: "arme_principale", classe: "tank", rang: "S", image: "assets/items/legendaire/egide_lumiere.png", stackable: false, description: "L'arme ultime forgee dans une lumiere primordiale.", stats: { vitalite: 150, force: 25 }, competence_texte: "Rempart du Monarque" },

    // ------------------------------------------
    // 4. ARMURES (torse)
    // Trois archetypes partages entre classes pour limiter les visuels : Légère (Assassin/Ranger), Robe (Mage), Lourde (Guerrier/Tank)
    // ------------------------------------------
    { id: "armure_legere_e", nom: "Tenue de Cuir Rapiecee", type: "armure", archetype: "legere", rang: "E", image: "assets/items/armures/legere.png", stackable: false, description: "Legere, laisse une grande liberte de mouvement.", stats: { agilite: 3, vitalite: 2 } },
    { id: "armure_legere_d", nom: "Tenue de Cuir Renforcee", type: "armure", archetype: "legere", rang: "D", image: "assets/items/armures/legere.png", stackable: false, description: "Cuir traite pour resister aux griffures.", stats: { agilite: 7, vitalite: 5 } },
    { id: "armure_legere_c", nom: "Tenue d'Eclaireur", type: "armure", archetype: "légère", rang: "C", image: "assets/items/armures/légère.png", stackable: false, description: "Portee par les chasseurs specialises en infiltration.", stats: { agilite: 14, vitalite: 8 } },
    { id: "armure_legere_b", nom: "Tenue d'Ombre", type: "armure", archetype: "legere", rang: "B", image: "assets/items/armures/legere.png", stackable: false, description: "Absorbe les sons de vos pas.", stats: { agilite: 25, vitalite: 12 } },
    { id: "armure_legere_a", nom: "Tenue de Predateur Nocturne", type: "armure", archetype: "legere", rang: "A", image: "assets/items/armures/legere.png", stackable: false, description: "Presque invisible dans la penombre.", stats: { agilite: 40, vitalite: 18 } },
    { id: "armure_legere_s", nom: "Tenue du Chasseur Fantome", type: "armure", archetype: "legere", rang: "S", image: "assets/items/legendaire/armure_legere_s.png", stackable: false, description: "Semble a peine appartenir a ce monde.", stats: { agilite: 70, vitalite: 30 } },

    { id: "armure_robe_e", nom: "Robe d'Apprenti", type: "armure", archetype: "robe", rang: "E", image: "assets/items/armures/robe.png", stackable: false, description: "Tissu imbibe de residus de mana.", stats: { intelligence: 3, vitalite: 1 } },
    { id: "armure_robe_d", nom: "Robe Tissee de Mana", type: "armure", archetype: "robe", rang: "D", image: "assets/items/armures/robe.png", stackable: false, description: "Améliore légèrement la circulation du mana.", stats: { intelligence: 7, vitalite: 3 } },
    { id: "armure_robe_c", nom: "Robe de l'Association", type: "armure", archetype: "robe", rang: "C", image: "assets/items/armures/robe.png", stackable: false, description: "Standard chez les mages affilies.", stats: { intelligence: 14, vitalite: 6 } },
    { id: "armure_robe_b", nom: "Robe des Arcanes", type: "armure", archetype: "robe", rang: "B", image: "assets/items/armures/robe.png", stackable: false, description: "Brodee de fils conducteurs de mana.", stats: { intelligence: 25, vitalite: 10 } },
    { id: "armure_robe_a", nom: "Robe du Sage Oublie", type: "armure", archetype: "robe", rang: "A", image: "assets/items/armures/robe.png", stackable: false, description: "Portee autrefois par un mage legendaire.", stats: { intelligence: 40, vitalite: 15 } },
    { id: "armure_robe_s", nom: "Robe du Monarque Blanc", type: "armure", archetype: "robe", rang: "S", image: "assets/items/legendaire/armure_robe_s.png", stackable: false, description: "Chaque fil semble tisse de flamme contenue.", stats: { intelligence: 70, vitalite: 25 } },

    { id: "armure_lourde_e", nom: "Plastron Cabosse", type: "armure", archetype: "lourde", rang: "E", image: "assets/items/armures/lourde.png", stackable: false, description: "Recupere sur un champ de bataille.", stats: { vitalite: 5, force: 2 } },
    { id: "armure_lourde_d", nom: "Plastron de Fer", type: "armure", archetype: "lourde", rang: "D", image: "assets/items/armures/lourde.png", stackable: false, description: "Standard de l'Association pour les combattants de première ligne.", stats: { vitalite: 12, force: 4 } },
    { id: "armure_lourde_c", nom: "Armure de Garde", type: "armure", archetype: "lourde", rang: "C", image: "assets/items/armures/lourde.png", stackable: false, description: "Renforcee au niveau des articulations.", stats: { vitalite: 22, force: 8 } },
    { id: "armure_lourde_b", nom: "Armure de Bastion", type: "armure", archetype: "lourde", rang: "B", image: "assets/items/armures/lourde.png", stackable: false, description: "Portee par les gardiens de guilde.", stats: { vitalite: 40, force: 14 } },
    { id: "armure_lourde_a", nom: "Armure du Rempart Sacre", type: "armure", archetype: "lourde", rang: "A", image: "assets/items/armures/lourde.png", stackable: false, description: "Benie contre les altérations d'etat.", stats: { vitalite: 65, force: 20 } },
    { id: "armure_lourde_s", nom: "Armure du Titan Dechu", type: "armure", archetype: "lourde", rang: "S", image: "assets/items/legendaire/armure_lourde_s.png", stackable: false, description: "Forgee dans les restes d'un colosse de rang S.", stats: { vitalite: 120, force: 35 } },

    // ------------------------------------------
    // 5. ACCESSOIRES
    // ------------------------------------------
    { id: "anneau_dissimulation", nom: "Anneau de Dissimulation", type: "accessoire", rang: "C", image: "assets/items/accessoires/anneau_generique.png", stackable: false, description: "Masque le véritable niveau de mana de son porteur. Illegal.", stats: { intelligence: 5 }, special: "masque_mana" },
    { id: "amulette_vitalite", nom: "Amulette de Vitalite", type: "accessoire", rang: "D", image: "assets/items/accessoires/amulette_generique.png", stackable: false, description: "Renforce la constitution du porteur.", stats: { vitalite: 8 } },
    { id: "boucle_agilite", nom: "Boucle d'Oreille d'Agilite", type: "accessoire", rang: "C", image: "assets/items/accessoires/boucle_generique.png", stackable: false, description: "Un bijou léger qui affine les reflexes.", stats: { agilite: 10 } },
    { id: "gantelets_force", nom: "Gantelets de Force", type: "accessoire", rang: "B", image: "assets/items/accessoires/gantelets_generique.png", stackable: false, description: "Renforcent chaque coup porte.", stats: { force: 15 } },
    { id: "diademe_intelligence", nom: "Diademe d'Intelligence", type: "accessoire", rang: "B", image: "assets/items/accessoires/diademe_generique.png", stackable: false, description: "Amplifie la concentration mentale.", stats: { intelligence: 15 } },
    { id: "amulette_perception", nom: "Amulette de l'Oeil Vif", type: "accessoire", rang: "C", image: "assets/items/accessoires/amulette_generique.png", stackable: false, description: "Aiguise les sens du porteur.", stats: { perception: 10 } },
    { id: "coeur_monarque", nom: "Coeur de Monarque", type: "accessoire", rang: "S", image: "assets/items/legendaire/coeur_monarque.png", stackable: false, description: "Bat encore d'une puissance interdite. Objet de la Vitrine du Systeme.", stats: { force: 20, agilite: 20, intelligence: 20, perception: 20, vitalite: 20 } },

    // ------------------------------------------
    // 6. PIERRES RUNIQUES (competences)
    // Visuel commun : éclat de pierre avec rune lumineuse coloree selon le rang
    // La version légendaire a un visuel unique (pierre noire a pointes, rune rouge)
    // ------------------------------------------
    { id: "pierre_runique_sprint", nom: "Pierre Runique : Sprint", type: "pierre_runique", rang: "D", image: "assets/items/runes/pierre_runique.png", stackable: false, description: "Debloque la competence Sprint. Augmente massivement l'esquive pour un tour. Coute de la Fatigue.", competence: { id: "sprint", cout: { fatigue: 15 } } },
    { id: "pierre_runique_camouflage", nom: "Pierre Runique : Camouflage", type: "pierre_runique", rang: "C", image: "assets/items/runes/pierre_runique.png", stackable: false, description: "Debloque la competence Camouflage. Permet d'ignorer une salle sans combattre, ou garantit un coup critique au tour suivant.", competence: { id: "camouflage", cout: { pm: 20 } } },
    { id: "pierre_runique_coup_lourd", nom: "Pierre Runique : Coup Lourd", type: "pierre_runique", rang: "B", image: "assets/items/runes/pierre_runique.png", stackable: false, description: "Debloque la competence Coup Lourd. Consomme 30 pourcent des PM et detruit l'armure de l'ennemi.", competence: { id: "coup_lourd", cout: { pmPourcent: 0.3 } } },
    { id: "pierre_runique_soin_groupe", nom: "Pierre Runique : Soin de Groupe", type: "pierre_runique", rang: "B", image: "assets/items/runes/pierre_runique.png", stackable: false, description: "Debloque la competence Soin de Groupe. Indispensable si le joueur ne dispose pas d'un Soigneur.", competence: { id: "soin_groupe", cout: { pm: 40 } } },
    { id: "pierre_runique_ombre", nom: "Pierre Runique Légendaire : Extraction d'Ombre", type: "pierre_runique", rang: "S", image: "assets/items/legendaire/pierre_runique_ombre.png", stackable: false, description: "Pierre corrompue, noire et hostile au toucher. Remplace toutes les attaques basiques pour les joueurs ayant choisi la voie du Monarque des Ombres. Reservee a l'Endgame et a la Boutique du Systeme.", competence: { id: "extraction_ombre", cout: { pm: 0 } } }

];
