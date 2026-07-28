const TRAITS_DB = {
    "lache": { name: "Lâche", desc: "Fuit devant le danger. (-5 Moral constant)", effect: { moraleMax: -5 } },
    "courageux": { name: "Sang-Froid", desc: "Garde son calme. (Bonus pour ne pas paniquer)", effect: { moraleMax: +10 } },
    "ampute_bras": { name: "Amputé (Bras)", desc: "A perdu un bras en raid. (-10 Force, -10 Agilité)", effect: { strength: -10, agility: -10 } },
    "ampute_jambe": { name: "Amputé (Jambe)", desc: "A perdu une jambe. Agilité divisée.", effect: { agility: -15, vitality: -5 } },
    "tueur_gobelin": { name: "Fléau des Gobelins", desc: "Connaît leurs faiblesses. (+5 Force contre eux)", effect: {} },
    "reputation": { name: "La Réputation le précède", desc: "Les humains le respectent ou le craignent.", effect: { reputation: +10 } }
};
