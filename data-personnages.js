// ==========================================
// DATA-PERSONNAGES.JS
// Personnages canoniques apparaissant via evenements aleatoires du Hub ou en donjon
// ==========================================

const personnagesData = [

    {
        id: "go_geon_hee",
        nom: "Go Geon-Hee",
        titre: "President de l'Association",
        conditionApparition: { type: "reputation_haute", seuil: 800 },
        contexte: "hub",
        description: "Apparait si la Reputation du joueur creve le plafond. Peut confier des missions classees S.",
        effetPositif: { type: "debloque_mission_rang_s" },
        effetSiRenegat: { type: "boss_humain_final" }
    },
    {
        id: "woo_jin_chul",
        nom: "Woo Jin-Chul",
        titre: "Chef de la Division de Surveillance",
        conditionApparition: { type: "gain_niveau_massif", declencheur: "rng_apres_montee_niveau" },
        contexte: "hub",
        description: "L'Inspecteur par excellence. Exige un scan de puissance : présenter le Dissimulateur de Mana ou subir le test.",
        choix: [
            { texte: "Présenter le Dissimulateur de Mana", condition: { objetRequis: "dissimulateur_mana" }, effet: { msg: "Le contrôle se passe sans encombre." } },
            { texte: "Subir le test", effet: { risque: "expose_puissance_reelle", consequence: "convocation_reevaluation_forcee" } }
        ]
    },
    {
        id: "choi_jong_in",
        nom: "Choi Jong-In",
        titre: "Maitre des Chasseurs, l'Arme Ultime",
        conditionApparition: { type: "classe_et_stat", classe: ["mage", "ranger"], statMin: { intelligence: 40 } },
        contexte: "evenement_civil",
        description: "Événement de recrutement civil si le joueur est Mage ou Ranger avec une très haute Intelligence.",
        effet: { type: "propose_recrutement_guilde_hunters" }
    },
    {
        id: "baek_yoon_ho",
        nom: "Baek Yoon-Ho",
        titre: "Maitre du Tigre Blanc",
        conditionApparition: { type: "classe_et_stat_ou_portail_rouge", classe: ["guerrier"], statMin: { force: 40 } },
        contexte: "evenement_civil_ou_portail_rouge",
        description: "Événement de recrutement civil (focus Force) ou rencontre de sauvetage dans un Portail Rouge.",
        effet: { type: "propose_recrutement_guilde_tigre_blanc" }
    },
    {
        id: "cha_hae_in",
        nom: "Cha Hae-In",
        titre: "Vice-Maitre des Chasseurs",
        conditionApparition: { type: "reputation_moyenne", seuil: 300 },
        contexte: "hub",
        description: "Propose un entraînement exceptionnel. Accepter son defi (combat non-mortel) coute enormement de Fatigue mais octroie un buff d'Agilite permanent en cas de survie.",
        choix: [
            { texte: "Accepter le defi", effet: { fatigue: 60, risqueEchec: 0.2, recompense: { agilitePermanente: 5 } } },
            { texte: "Decliner poliment", effet: { msg: "Vous préférez ne pas prendre de risque aujourd'hui." } }
        ]
    },
    {
        id: "yoo_jinho",
        nom: "Yoo Jinho",
        titre: "L'héritier riche",
        conditionApparition: { type: "guilde_joueur_creee", palierMin: 1 },
        contexte: "evenement_civil",
        description: "Propose d'injecter 50 000 Or dans la guilde du joueur en echange du poste de Vice-Maitre et d'escouades gratuites.",
        choix: [
            { texte: "Accepter l'investissement", effet: { or: 50000, allieGratuit: true, posteViceMaitre: "yoo_jinho" } },
            { texte: "Refuser, garder le contrôle total", effet: { msg: "Vous préférez bâtir votre guilde seul." } }
        ]
    },
    {
        id: "kang_tae_shik",
        nom: "Kang Tae-Shik",
        titre: "L'Inspecteur Psychopathe",
        conditionApparition: { type: "donjon_rang", rangs: ["D", "C"] },
        contexte: "donjon",
        description: "Rencontre en donjon. Il trahit son escouade sous les yeux du joueur.",
        choix: [
            { texte: "Le tuer", effet: { karma: 10, or: 300, butinAssociation: true } },
            { texte: "S'associer a lui pour diviser le butin des morts", effet: { karma: -15, or: 500, debloqueContactMarcheNoir: true } }
        ]
    },
    {
        id: "hwang_dong_su",
        nom: "Hwang Dong-Su",
        titre: "Le Renegat",
        conditionApparition: { type: "attaque_portail_guilde_ou_meurtre_allie_hwang", voie: "renegat" },
        contexte: "evenement_scenarise",
        description: "Boss humain ultra-violent. Declenche une vendetta personnelle si le joueur attaque les portails de sa guilde ou tue ses allies.",
        effet: { type: "declenche_vendetta_boss_humain" }
    }

];
