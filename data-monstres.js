// ==========================================
// DATA-MONSTRES.JS
// Bestiaire complet, organise par rang et par theme d'environnement
// theme : "grotte", "foret", "ruines", "temple", "tous"
// ==========================================

const monstresData = [

    // ==========================================
    // RANG E - LA SURVIE
    // ==========================================
    { id: "limon_acide", nom: "Limon Acide", rang: "E", theme: "tous", type: "mob", stats: { pv: 30, attaque: 5, defense: 2, agilite: 2 }, comportement: "agressif", description: "Resistance physique elevee, tres faible en degats.", loot: [{ item: "cristal_mana_e", chance: 0.8, quantite: 1 }] },
    { id: "gobelin_eclaireur", nom: "Gobelin Eclaireur", rang: "E", theme: "foret", type: "mob", stats: { pv: 40, attaque: 7, defense: 3, agilite: 10 }, comportement: "lache", description: "Faible, mais esquive elevee. Jet d'Agilite requis pour le toucher facilement.", loot: [{ item: "cristal_mana_e", chance: 0.6, quantite: 1 }] },
    { id: "loup_crocs_acier", nom: "Loup a Crocs d'Acier", rang: "E", theme: "foret", type: "mob", stats: { pv: 45, attaque: 9, defense: 3, agilite: 8 }, comportement: "meute", description: "Chasse en meute.", statutInflige: { type: "saignement", chance: 0.25, duree: 2 }, loot: [{ item: "cristal_mana_e", chance: 0.7, quantite: 1 }] },
    { id: "rat_geant_egouts", nom: "Rat Geant des Souterrains", rang: "E", theme: "ruines", type: "mob", stats: { pv: 35, attaque: 6, defense: 2, agilite: 9 }, comportement: "agressif", description: "Grouille en petits groupes dans les ruines urbaines.", loot: [{ item: "cristal_mana_e", chance: 0.6, quantite: 1 }] },
    { id: "esprit_poussiere", nom: "Esprit de Poussiere", rang: "E", theme: "temple", type: "mob", stats: { pv: 38, attaque: 6, defense: 5, agilite: 4 }, comportement: "erratique", description: "Reste des gardiens antiques d'un temple oublie.", loot: [{ item: "cristal_mana_e", chance: 0.65, quantite: 1 }] },
    { id: "chef_gobelin", nom: "Chef Gobelin", rang: "E", theme: "foret", type: "boss", stats: { pv: 140, attaque: 14, defense: 8, agilite: 10 }, comportement: "tactique", description: "Appelle des renforts a 50 pourcent de PV.", competenceSpeciale: { nom: "Appel des Renforts", seuilPv: 0.5, effet: "invoque_mob", cible: "gobelin_eclaireur" }, loot: [{ item: "cristal_mana_e", chance: 1, quantite: 3 }, { item: "dague_emoussee", chance: 0.4, quantite: 1 }, { item: "cle_donjon_e", chance: 0.15, quantite: 1 }] },

    // ==========================================
    // RANG D - LA MONTEE EN PUISSANCE
    // ==========================================
    { id: "macaque_enrage", nom: "Macaque Enrage", rang: "D", theme: "foret", type: "mob", stats: { pv: 90, attaque: 14, defense: 6, agilite: 22 }, comportement: "agressif", description: "Agilite tres elevee, difficile a toucher.", loot: [{ item: "cristal_mana_d", chance: 0.6, quantite: 1 }] },
    { id: "araignee_cavernes", nom: "Araignee des Cavernes", rang: "D", theme: "grotte", type: "mob", stats: { pv: 85, attaque: 12, defense: 7, agilite: 14 }, comportement: "embuscade", description: "Tisse des toiles pieges.", competenceSpeciale: { nom: "Jet de Toile", chance: 0.3, effet: "etourdissement" }, loot: [{ item: "cristal_mana_d", chance: 0.6, quantite: 1 }] },
    { id: "golem_pierre", nom: "Golem de Pierre", rang: "D", theme: "ruines", type: "mob", stats: { pv: 160, attaque: 16, defense: 22, agilite: 3 }, comportement: "lourd", description: "Tres haute defense, tres lent, vulnerable a la magie.", vulnerabilite: "intelligence", loot: [{ item: "cristal_mana_d", chance: 0.7, quantite: 2 }] },
    { id: "goule_affamee", nom: "Goule Affamee", rang: "D", theme: "temple", type: "mob", stats: { pv: 95, attaque: 15, defense: 8, agilite: 10 }, comportement: "agressif", description: "Rode dans les cryptes a la recherche de chair fraiche.", statutInflige: { type: "poison", chance: 0.2, duree: 2 }, loot: [{ item: "cristal_mana_d", chance: 0.55, quantite: 1 }] },
    { id: "reine_araignee", nom: "Reine Araignee", rang: "D", theme: "grotte", type: "boss", stats: { pv: 300, attaque: 22, defense: 12, agilite: 16 }, comportement: "tactique", description: "Morsure venimeuse redoutable.", competenceSpeciale: { nom: "Morsure Venimeuse", chance: 0.4, effet: "poison", duree: 4 }, loot: [{ item: "cristal_mana_d", chance: 1, quantite: 3 }, { item: "armure_legere_d", chance: 0.35, quantite: 1 }, { item: "cle_donjon_d", chance: 0.2, quantite: 1 }] },

    // ==========================================
    // RANG C - L'ELAN
    // ==========================================
    { id: "homme_lezard", nom: "Homme-Lezard", rang: "C", theme: "grotte", type: "mob", stats: { pv: 220, attaque: 28, defense: 18, agilite: 15 }, comportement: "equilibre", description: "Combattant polyvalent sans faiblesse marquee.", competenceSpeciale: { nom: "Coup de Queue", chance: 0.25, effet: "etourdissement" }, loot: [{ item: "cristal_mana_c", chance: 0.6, quantite: 1 }] },
    { id: "vampire_mineur", nom: "Vampire Mineur", rang: "C", theme: "ruines", type: "mob", stats: { pv: 200, attaque: 30, defense: 14, agilite: 20 }, comportement: "agressif", description: "Se soigne d'un pourcentage des degats infliges.", passif: { type: "vol_de_vie", pourcentage: 0.25 }, loot: [{ item: "cristal_mana_c", chance: 0.6, quantite: 1 }] },
    { id: "orc_desert", nom: "Orc du Desert", rang: "C", theme: "ruines", type: "mob", stats: { pv: 260, attaque: 35, defense: 16, agilite: 10 }, comportement: "brutal", description: "Grosse force de frappe, ignore 20 pourcent de l'armure.", passif: { type: "ignore_armure", pourcentage: 0.2 }, loot: [{ item: "cristal_mana_c", chance: 0.6, quantite: 1 }] },
    { id: "spectre_gardien", nom: "Spectre Gardien", rang: "C", theme: "temple", type: "mob", stats: { pv: 210, attaque: 26, defense: 20, agilite: 12 }, comportement: "defensif", description: "Protege les reliques du temple jusqu'a la mort.", loot: [{ item: "cristal_mana_c", chance: 0.6, quantite: 1 }] },
    { id: "chasseur_pillard", nom: "Chasseur Pillard", rang: "C", theme: "tous", type: "humain", comportement: "embuscade", stats: { pv: 240, attaque: 32, defense: 18, agilite: 22 }, description: "Ancien chasseur tombe dans la criminalite, tend des embuscades en donjon.", loot: [{ item: "or", chance: 1, quantite: 150 }] },
    { id: "chef_tribu_orc", nom: "Chef de Tribu Orc", rang: "C", theme: "ruines", type: "boss", stats: { pv: 480, attaque: 40, defense: 22, agilite: 12 }, comportement: "tactique", description: "Cri de Guerre qui baisse la defense de toute l'escouade adverse.", competenceSpeciale: { nom: "Cri de Guerre", effet: "baisse_defense_groupe", valeur: 0.15 }, loot: [{ item: "cristal_mana_c", chance: 1, quantite: 3 }, { item: "hache_or", chance: 0.3, quantite: 1 }, { item: "cle_donjon_c", chance: 0.25, quantite: 1 }] },

    // ==========================================
    // RANG B - LA POWER FANTASY COMMENCE
    // ==========================================
    { id: "haut_orc", nom: "Haut Orc", rang: "B", theme: "ruines", type: "mob", stats: { pv: 550, attaque: 55, defense: 40, agilite: 14 }, comportement: "equilibre", description: "Excellente parade, demande une haute Perception pour trouver la faille.", vulnerabilite: "perception", loot: [{ item: "cristal_mana_b", chance: 0.5, quantite: 1 }] },
    { id: "yeti_glaces", nom: "Yeti des Glaces", rang: "B", theme: "grotte", type: "mob", stats: { pv: 620, attaque: 50, defense: 35, agilite: 10 }, comportement: "brutal", description: "Souffle glacial capable de geler sa cible.", competenceSpeciale: { nom: "Souffle Glacial", chance: 0.3, effet: "gel" }, loot: [{ item: "cristal_mana_b", chance: 0.5, quantite: 1 }] },
    { id: "assassin_ombre", nom: "Assassin de l'Ombre", rang: "B", theme: "temple", type: "mob", stats: { pv: 400, attaque: 60, defense: 20, agilite: 45 }, comportement: "cible_arriere_garde", description: "Frappe directement les Mages et Soigneurs en arriere-garde.", loot: [{ item: "cristal_mana_b", chance: 0.5, quantite: 1 }] },
    { id: "spectre_flamboyant", nom: "Spectre Flamboyant", rang: "B", theme: "temple", type: "mob", stats: { pv: 480, attaque: 52, defense: 25, agilite: 18 }, comportement: "agressif", description: "Enflamme tout ce qu'il touche.", statutInflige: { type: "brulure", chance: 0.35, duree: 3 }, loot: [{ item: "cristal_mana_b", chance: 0.5, quantite: 1 }] },
    { id: "equipe_association", nom: "Equipe de l'Association", rang: "A", theme: "tous", type: "humain", stats: { pv: 700, attaque: 65, defense: 45, agilite: 30 }, comportement: "tactique_groupe", description: "Tank, Soigneur et Mage coordonnes, utilisent de vraies tactiques de groupe.", loot: [{ item: "or", chance: 1, quantite: 400 }] },
    { id: "chamane_haut_orc", nom: "Chamane Haut Orc", rang: "B", theme: "ruines", type: "boss", stats: { pv: 900, attaque: 60, defense: 38, agilite: 16 }, comportement: "soigneur_ennemi", description: "Malediction de feu et soin de ses allies.", competenceSpeciale: { nom: "Malediction de Feu", chance: 0.35, effet: "brulure", duree: 3 }, competenceSecondaire: { nom: "Soin Tribal", effet: "soigne_allies", valeur: 0.15 }, loot: [{ item: "cristal_mana_b", chance: 1, quantite: 4 }, { item: "sceptre_flammes", chance: 0.25, quantite: 1 }, { item: "cle_donjon_b", chance: 0.3, quantite: 1 }] },

    // ==========================================
    // RANG A - L'INVINCIBILITE
    // ==========================================
    { id: "chevalier_mort", nom: "Chevalier de la Mort", rang: "A", theme: "ruines", type: "mob", stats: { pv: 1400, attaque: 95, defense: 70, agilite: 20 }, comportement: "brutal", description: "Immunise a toutes les alterations d'etat, haute armure.", immuniteStatuts: true, loot: [{ item: "cristal_mana_a", chance: 0.4, quantite: 1 }] },
    { id: "wyverne", nom: "Wyverne", rang: "A", theme: "foret", type: "mob", stats: { pv: 1300, attaque: 100, defense: 55, agilite: 40 }, comportement: "volant", description: "Seules la magie et les attaques de Ranger font 100 pourcent des degats.", resistancePhysique: 0.5, loot: [{ item: "cristal_mana_a", chance: 0.4, quantite: 1 }] },
    { id: "inspecteur_elite", nom: "Inspecteur d'Elite", rang: "A", theme: "tous", type: "humain", stats: { pv: 1200, attaque: 110, defense: 60, agilite: 35 }, comportement: "boss_humain", description: "Degats critiques garantis s'il attaque par surprise.", loot: [{ item: "or", chance: 1, quantite: 800 }] },
    { id: "liche_ancestrale", nom: "Liche Ancestrale", rang: "A", theme: "temple", type: "boss", stats: { pv: 2200, attaque: 120, defense: 65, agilite: 25 }, comportement: "tactique", description: "Confusion : les allies du joueur ont 50 pourcent de chance de s'attaquer entre eux.", competenceSpeciale: { nom: "Confusion", chance: 0.4, effet: "confusion_groupe", valeur: 0.5 }, loot: [{ item: "cristal_mana_a", chance: 1, quantite: 4 }, { item: "grimoire_vivant", chance: 0.25, quantite: 1 }, { item: "cle_donjon_a", chance: 0.3, quantite: 1 }] },

    // ==========================================
    // RANG S - L'ENDGAME
    // ==========================================
    { id: "dragon_feu", nom: "Dragon de Feu", rang: "S", theme: "tous", type: "mob", stats: { pv: 5000, attaque: 220, defense: 120, agilite: 30 }, comportement: "devastateur", description: "Souffle de destruction infligeant des degats massifs de zone a toute l'escouade.", competenceSpeciale: { nom: "Souffle de Destruction", effet: "degats_zone_groupe", statutApplique: "brulure" }, loot: [{ item: "pierre_essence", chance: 0.5, quantite: 1 }] },
    { id: "geant_cuirasse", nom: "Geant Cuirasse", rang: "S", theme: "ruines", type: "mob", stats: { pv: 6500, attaque: 180, defense: 200, agilite: 8 }, comportement: "colosse", description: "PV colossaux. Les attaques physiques rebondissent sans jet de Perception critique.", vulnerabilite: "perception_critique", loot: [{ item: "pierre_essence", chance: 0.5, quantite: 1 }] },
    { id: "architecte", nom: "L'Architecte", rang: "S", theme: "temple", type: "boss", stats: { pv: 9000, attaque: 200, defense: 150, agilite: 20 }, comportement: "boss_divin", description: "Mecaniques multiples, invoque des statues de pierre incassables.", competenceSpeciale: { nom: "Invocation de Statues", effet: "invoque_gardiens", cible: "golem_pierre" }, loot: [{ item: "pierre_essence", chance: 1, quantite: 3 }, { item: "coeur_monarque", chance: 0.1, quantite: 1 }] },
    { id: "monarque_final", nom: "Le Monarque", rang: "S", theme: "temple", type: "boss_final", stats: { pv: 15000, attaque: 260, defense: 180, agilite: 40 }, comportement: "scenarise", description: "Combat final scenarise declenchant l'Ascension de Monarque du joueur.", loot: [{ item: "cle_donjon_s", chance: 1, quantite: 1 }] },

    // ==========================================
    // ZONE DE PENALITE (survie, invincible)
    // ==========================================
    { id: "mille_pattes_desert", nom: "Mille-pattes du Desert", rang: "special", theme: "zone_penalite", type: "survie", stats: { pv: 99999, attaque: 150, defense: 100, agilite: 50 }, comportement: "implacable", description: "Monstre invincible de la Zone de Penalite. Impossible a vaincre, il faut survivre un nombre de tours defini." }

];
