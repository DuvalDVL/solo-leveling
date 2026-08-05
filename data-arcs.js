// ==========================================
// DATA-ARCS.JS
// Arcs narratifs qui s'etalent sur plusieurs jours, declenches aleatoirement ou a des jalons cles
// Chaque etape peut appliquer un effet (meme structure que les evenements civils/donjon) et programme la suivante avec un delai en jours
// ==========================================

const arcsNarratifsData = [

    {
        id: "filature",
        declencheur: "aleatoire",
        chanceParJour: 0.03,
        niveauMin: 3,
        etapes: [
            {
                texte: "En rentrant ce soir, vous avez l'etrange sensation d'etre suivi. Vous vous retournez : personne.",
                delaiProchaineEtape: 3
            },
            {
                texte: "La meme silhouette encapuchonnee reapparait a la lisiere de votre champ de vision, pour la deuxieme fois cette semaine.",
                delaiProchaineEtape: 4
            },
            {
                texte: "Cette fois, la silhouette ne fuit pas. Elle vous attend, immobile, au coin d'une ruelle.",
                choix: [
                    { texte: "Affronter directement", typeAction: "combat", monstre_id: "chasseur_pillard" },
                    { texte: "Tenter de negocier (Karma min: -50)", effet: { karma: 3, msg: "Il s'agissait d'un eclaireur de guilde rivale venu evaluer votre potentiel. Vous vous quittez sans effusion de sang." } }
                ]
            }
        ]
    },
    {
        id: "rivalite_guilde",
        declencheur: "jalon",
        jalon: "guilde_fondee",
        etapes: [
            {
                texte: "Un message anonyme glisse sous la porte de votre QG : 'Cette ville n'a pas besoin d'une guilde de plus. Partez, ou nous vous y forcerons.'",
                delaiProchaineEtape: 5
            },
            {
                texte: "Une escouade rivale a force l'entree de votre QG, esperant piller vos reserves.",
                choix: [
                    { texte: "Defendre le QG", typeAction: "combat", monstre_id: "chasseur_pillard" },
                    { texte: "Payer un tribut pour eviter le conflit (-200 Or)", effet: { or: -200, karma: -1, msg: "Vous evitez l'affrontement, mais votre reputation en prend un coup." } }
                ]
            }
        ]
    },
    {
        id: "chasseur_blesse",
        declencheur: "aleatoire",
        chanceParJour: 0.025,
        niveauMin: 5,
        etapes: [
            {
                texte: "Un message de detresse circule sur le reseau des Chasseurs : une escouade est portee disparue dans un donjon proche.",
                delaiProchaineEtape: 2
            },
            {
                texte: "Vous retrouvez la trace de l'escouade disparue. Un seul survivant, grievement blesse, vous supplie de l'aide.",
                choix: [
                    { texte: "Le soigner sur place (-1 Potion de Soin si disponible, +Karma)", effet: { karma: 8, msg: "Le survivant est stabilise et vous confie des informations sur un donjon inexplore." } },
                    { texte: "L'achever pour abreger ses souffrances", effet: { karma: -8, or: 100, msg: "Un acte que vous justifiez par la pitie. Vous recuperez ce qu'il portait sur lui." } },
                    { texte: "L'ignorer et poursuivre votre route", effet: { karma: -2, msg: "Vous tournez les talons sans un regard en arriere." } }
                ]
            }
        ]
    }

];
