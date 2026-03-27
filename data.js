// ======================
// CONSTANTES & DONNÉES
// ======================
const DEF_MIN = 0.2;

const oCommuns = [
    {nom: "Épée rouillée", att: 3, r:"commun"},
    {nom: "Casque simple", pv: 8, r:"commun"},
    {nom: "Anneau magique usé", def: -0.1, r:"commun"},
    {nom: "Lance", att: 4, r:"commun"},
    {nom: "Bâton magique", att: 2, regen: 1, r:"commun"},
    {nom: "Buff commun", att: 2, pv: 5, def: -0.05, r:"commun"},
    {nom: "Bouclier", def: -0.1, pv: 5, r:"commun"},
    {nom: "Buff evo commun", att: 4, pv: 10, regen: 1, def: -0.1, r:"commun"}
];

const oRares = [
    {nom: "Épée fine", att: 8, r:"rare"},
    {nom: "Armure renforcée", def: -0.2, pv: 10, r:"rare"},
    {nom: "Amulette vitale", pv: 20, r:"rare"},
    {nom: "Anneau de pouvoir", pv: 10, att: 5, r:"rare"},
    {nom: "Colt 1911", att: 10, r:"rare"},
    {nom: "Buff rare", att: 4, pv: 10, def: -0.1, r:"rare"},
    {nom: "M4", att: 18, r:"rare"},
    {nom: "Buff evo rare", att: 8, pv: 20, def: -0.2, regen: 2, r:"rare"},
    {nom: "Livre tactique", att: 8, intelligence: 5, r:"rare"}
];

const oLeg = [
    {nom: "Lame mythique", att: 95, r:"legendaire"},
    {nom: "Armure enchantée", pv: 70, def: -0.25, regen: 10, r:"legendaire"},
    {nom: "Coeur du héros", pv: 50, capa: "vol_de_vie", r:"legendaire"},
    {nom: "Carapace absolue", pv: 70, capa: "reduc_degats", r:"legendaire"},
    {nom: "Lames frénétiques", att: 45, capa: "multi_attaque", r:"legendaire"},
    {nom: "Buff legendaire", att: 30, pv: 50, def: -0.3, regen: 8, r:"legendaire"},
    {nom: "Savoir continu", intelligence: 10, capa: "ia", r:"legendaire"}
];

const oUltra = [
    {nom: "Bouclier invincible", pv: 120, def: -0.5, capa: "invincible_3tour", r:"ultra"},
    {nom: "Gantelet de puissance", att: 90, capa: "crit_25", r:"ultra"},
    {nom: "Tenu de camouflage ultime", pv: 80, def: -0.4, capa: "esquive_total", r:"ultra"},
    {nom: "Buff ultime", pv: 125, def: -0.6, att: 50, regen: 15, r:"ultra"},
    {nom: "Source du savoir", intelligence: 15, capa: "raisonnement", r:"ultra"},
    {nom: "Negociant", capa: "investissement", r:"ultra"}
];

const oIntel = [
    {nom: "Cerveau moisi", intelligence: 1, r:"intel"},
    {nom: "Livre pas ouf", intelligence: 2, r:"intel"},
    {nom: "Livre carré", intelligence: 5, r:"intel"},
    {nom: "Grimoire qui date", intelligence: 3, r:"intel"},
    {nom: "Livre du savoir", intelligence: 7, r:"intel"}
];

const oCheat = [
    {nom: "(Mahe) Rat divin", capa: "loot+", r:"cheat"},
    {nom: "Buff divin", pv: 300, att: 150, def: -1, regen: 30, r:"cheat"},
    {nom: "Lumiere divine", att: 100, capa: "extermination", r:"cheat"},
    {nom: "Miroir de l'âme", capa: "reflect_50", r:"cheat"}
];

const oMarchandExclusif = [
    {nom: "Élixir ancestral", pv: 30, regen: 6, r:"rare"},
    {nom: "Couronne du sage", intelligence: 45, def: -0.2, att: 25, r:"legendaire"},
    {nom: "Cape d'invisibilité", def: -0.4, pv: 80, capa: "phase", r:"ultra"},
    {nom: "Grimoire interdit", intelligence: 10, att: 35, r:"legendaire"},
    {nom: "Anneau du phénix", pv: 25, regen: 10, r:"rare"},
    {nom: "Lame du voyageur", att: 35, r:"rare"},
    {nom: "Pierre philosophale", def: -0.2, pv: 50, regen: 8, capa: "alchimie", r:"ultra"},
    {nom: "Médaillon du destin", pv: 40, att: 15, def: -0.20, intelligence: 5, r:"legendaire"}
];

const ALL_ITEMS = [...oCommuns, ...oRares, ...oLeg, ...oUltra, ...oIntel, ...oCheat, ...oMarchandExclusif];

const ennemisBase = {
    voleur:      {nom: "Voleur",                pv: 60,    att: 6,   def: 2,    or: 10,  gemmes: 0},
    guerrier:    {nom: "Guerrier",              pv: 100,   att: 8,   def: 1.8,  or: 20,  gemmes: 0},
    champion:    {nom: "Champion",              pv: 200,   att: 20,  def: 1.5,  or: 30,  gemmes: 0},
    assassin:    {nom: "Assassin",              pv: 80,    att: 15,  def: 2,    or: 20,  gemmes: 0},
    mage:        {nom: "Mage noir",             pv: 100,   att: 30,  def: 1,    or: 30,  gemmes: 0},
    berserker:   {nom: "Berserker",             pv: 120,   att: 15,  def: 1.5,  or: 20,  gemmes: 0},
    paladin:     {nom: "Paladin corrompu",      pv: 250,   att: 10,  def: 0.6,  or: 20,  gemmes: 1},
    necromancien:{nom: "Nécromancien",          pv: 200,   att: 20,  def: 1,    or: 30,  gemmes: 1},
    dragon:      {nom: "Dragon sauvage",        pv: 400,   att: 40,  def: 1.2,  or: 40,  gemmes: 2},
    titan:       {nom: "Titan de pierre",       pv: 500,   att: 35,  def: 0.8,  or: 40,  gemmes: 2},
    creature:    {nom: "Créature démoniaque",   pv: 1000,  att: 100, def: 0.5,  or: 50,  gemmes: 4},
    demon:       {nom: "Démon",                 pv: 1500,  att: 150, def: 0.5,  or: 60,  gemmes: 6},
    boss10:      {nom: "Seigneur de fer",       pv: 450,   att: 25,  def: 1,    or: 30,  gemmes: 1},
    boss20:      {nom: "Roi du Nord",           pv: 2500,  att: 80,  def: 0.5,  or: 40,  gemmes: 3},
    boss30:      {nom: "Roi du monde",          pv: 5500,  att: 250, def: 0.3,  or: 60,  gemmes: 6},
    boss40:      {nom: "Prince solaire",        pv: 12000, att: 450, def: 0.20, or: 80,  gemmes: 9},
    boss50:      {nom: "Roi de la galaxie",     pv: 20000, att: 600, def: 0.10, or: 90,  gemmes: 12},
    boss60:      {nom: "Dictateur inter-galaxie", pv: 35000, att: 900, def: 0.1, or: 100, gemmes: 18}
};

const DIFF_SETTINGS = {
    tres_facile:  { name: 'TRES FACILE',   gold: 1,   enemy: 1,  boss: 1,   def: 1,  nerfPv: 0,    nerfAtt: 0,    nerfRegen: 0,    nerfOr: 0    },
    facile:       { name: 'FACILE',        gold: 1,   enemy: 1,  boss: 1,   def: 1,  nerfPv: 0,    nerfAtt: 0,    nerfRegen: 0,    nerfOr: 0    },
    normal:       { name: 'NORMAL',        gold: 1,   enemy: 1.5,boss: 1,   def: 1,  nerfPv: 0,    nerfAtt: 0,    nerfRegen: 0,    nerfOr: 0    },
    difficile:    { name: 'DIFFICILE',     gold: 1,   enemy: 2,  boss: 1,   def: 2,  nerfPv: 0,    nerfAtt: 0,    nerfRegen: 0,    nerfOr: 0    },
    tres_difficile:{ name: 'TRES DIFFICILE',gold: 1,  enemy: 3,  boss: 1.5, def: 3,  nerfPv: 0,    nerfAtt: 0,    nerfRegen: 0,    nerfOr: 0    },
    pro:          { name: 'PRO',           gold: 1,   enemy: 4,  boss: 2,   def: 5,  nerfPv: 0.10, nerfAtt: 0.10, nerfRegen: 0,    nerfOr: 0    },
    impossible:   { name: 'IMPOSSIBLE',    gold: 1,   enemy: 5,  boss: 2.5, def: 8,  nerfPv: 0.20, nerfAtt: 0.20, nerfRegen: 0,    nerfOr: 0    },
    enfer:        { name: 'ENFER',         gold: 1,   enemy: 6,  boss: 3,   def: 10, nerfPv: 0.30, nerfAtt: 0.30, nerfRegen: 0,    nerfOr: 0    },
    apocalypse:   { name: 'APOCALYPSE',    gold: 1,   enemy: 8,  boss: 4,   def: 15, nerfPv: 0.50, nerfAtt: 0.50, nerfRegen: 0.25, nerfOr: 0.25 },
    apocalypse2:  { name: 'APOCALYPSE II', gold: 1,   enemy: 10, boss: 5,   def: 25, nerfPv: 0.50, nerfAtt: 0.50, nerfRegen: 0.5,  nerfOr: 0.5  },
    apocalypse3:  { name: 'APOCALYPSE III',gold: 1,   enemy: 12, boss: 6,   def: 30, nerfPv: 0.75, nerfAtt: 0.75, nerfRegen: 0.5,  nerfOr: 0.5  },
    apocalypse4:  { name: 'APOCALYPSE IV', gold: 1,   enemy: 14, boss: 8,   def: 40, nerfPv: 0.75, nerfAtt: 0.75, nerfRegen: 0.75, nerfOr: 0.75 }
};

const EVENTS_CODEX_DATA = [
    { nom: "Voleur",       desc: "Ennemi rapide",          icon: "🗡️",  stats: "PV: 60 | Att: 6 | Def: 2 | Or: 10",      proba: "Très Fréquent", color: "#e74c3c" },
    { nom: "Guerrier",     desc: "Équilibré",              icon: "⚔️",  stats: "PV: 100 | Att: 8 | Def: 1.8 | Or: 20",   proba: "Très Fréquent", color: "#e74c3c" },
    { nom: "Assassin",     desc: "Frappe fort",            icon: "🔪",  stats: "PV: 80 | Att: 15 | Def: 2 | Or: 20",     proba: "Fréquent",      color: "#e74c3c" },
    { nom: "Mage noir",    desc: "Attaque magique",        icon: "🔮",  stats: "PV: 100 | Att: 30 | Def: 1 | Or: 30",    proba: "J5+ Fréquent",  color: "#9b59b6" },
    { nom: "Berserker",    desc: "Tank agressif",          icon: "🪓",  stats: "PV: 120 | Att: 15 | Def: 1.5 | Or: 20",  proba: "J5+ Fréquent",  color: "#c0392b" },
    { nom: "Nécromancien", desc: "Magie noire",            icon: "💀",  stats: "PV: 200 | Att: 20 | Def: 1 | Or: 30",    proba: "J5+ Fréquent",  color: "#8e44ad" },
    { nom: "Paladin corrompu", desc: "Défense élevée",     icon: "🛡️",  stats: "PV: 250 | Att: 10 | Def: 0.6 | Or: 20", proba: "J5+ Fréquent",  color: "#34495e" },
    { nom: "Champion",     desc: "Fort (J5+)",             icon: "👑",  stats: "PV: 200 | Att: 20 | Def: 1.5 | Or: 30", proba: "J5+ Fréquent",  color: "#c0392b" },
    { nom: "Dragon sauvage", desc: "Créature mythique",    icon: "🐉",  stats: "PV: 400 | Att: 40 | Def: 1.2 | Or: 40", proba: "J10+ Rare",      color: "#e74c3c" },
    { nom: "Titan de pierre", desc: "Colosse antique",     icon: "🗿",  stats: "PV: 500 | Att: 35 | Def: 0.8 | Or: 40", proba: "J10+ Rare",      color: "#95a5a6" },
    { nom: "Créature démoniaque", desc: "Animal des démons", icon: "🦇", stats: "PV: 1000 | Att: 100 | Def: 0.5 | Or: 50", proba: "J20+ Rare",   color: "#d63031" },
    { nom: "Démon",        desc: "Ce que tu n'as pas envie de rencontrer", icon: "👹", stats: "PV: 1500 | Att: 150 | Def: 0.5 | Or: 60", proba: "J30+ Rare", color: "#c0392b" },
    { nom: "Boss J10",     desc: "Seigneur de fer",        icon: "👑",  stats: "PV: 450 | Att: 25 | Or: 30",             proba: "J10",           color: "#8e44ad" },
    { nom: "Boss J20",     desc: "Roi du Nord",            icon: "❄️",  stats: "PV: 2500 | Att: 80 | Or: 40",            proba: "J20",           color: "#3498db" },
    { nom: "Boss J30",     desc: "Roi du monde",           icon: "🌍",  stats: "PV: 5500 | Att: 250 | Or: 60",           proba: "J30",           color: "#27ae60" },
    { nom: "Boss J40",     desc: "Prince solaire",         icon: "☀️",  stats: "PV: 12000 | Att: 450 | Or: 80",          proba: "J40",           color: "#f39c12" },
    { nom: "Boss J50",     desc: "Roi galactique",         icon: "🌌",  stats: "PV: 20000 | Att: 600 | Or: 90",          proba: "J50",           color: "#9b59b6" },
    { nom: "Boss J60",     desc: "Dictateur inter-galaxie",icon: "🌑",  stats: "PV: 35000 | Att: 900 | Or: 100",         proba: "J60",           color: "#9b59b6" },
    { nom: "Auberge",      desc: "Repos payant ou gratuit",icon: "🏠",  stats: "10 or = +30 PV | Gratuit = +10 PV",      proba: "Fréquent",      color: "#2ecc71" },
    { nom: "Bibliothèque", desc: "Savoir contre santé",    icon: "📚",  stats: "-15 PV pour +3 Intelligence",            proba: "Courant",       color: "#9b59b6" },
    { nom: "Énigme",       desc: "Test d'intelligence",    icon: "🧩",  stats: "Bonne réponse: +20 or +2 Int",           proba: "Courant",       color: "#3498db" },
    { nom: "Donjon",       desc: "Combat dur, gros loot",  icon: "🏰",  stats: "Gardien (PV:300 Att:50) loot",           proba: "Rare",          color: "#8e44ad" },
    { nom: "Marchand ambulant", desc: "Objets exclusifs !", icon: "🎪", stats: "1 objet exclusif + objets rares",         proba: "Rare",          color: "#e67e22" },
    { nom: "Piège",        desc: "Dégâts évitables",       icon: "⚠️",  stats: "Jour×2 dégâts | Int≥Jour: +10 or",       proba: "Courant",       color: "#e67e22" },
    { nom: "Piège +",      desc: "Dangereux",              icon: "⚠️⚠️",stats: "Jour×4 dégâts | Int≥Jour×2: +20 or",    proba: "Rare",          color: "#d35400" },
    { nom: "Or",           desc: "Trouvaille",             icon: "💰",  stats: "+10 or",                                  proba: "Courant",       color: "#f1c40f" },
    { nom: "Or bonus",     desc: "Belle trouvaille",       icon: "💰💰",stats: "+20 or",                                  proba: "Courant",       color: "#f39c12" },
    { nom: "Repos",        desc: "Rencontre paisible",     icon: "😊",  stats: "+10 PV",                                  proba: "Courant",       color: "#2ecc71" },
    { nom: "3 chemins",    desc: "Choix stratégique",      icon: "🛤️",  stats: "Loot / +20 or / Rien",                   proba: "Courant",       color: "#3498db" },
    { nom: "Coffre",       desc: "Loot standard",          icon: "📦",  stats: "Commun/Rare/Légendaire",                  proba: "Courant",       color: "#95a5a6" },
    { nom: "Coffre rare",  desc: "Loot premium",           icon: "📦✨",stats: "Rare/Légendaire/Ultra",                   proba: "Rare",          color: "#9b59b6" },
    { nom: "Pari",         desc: "50/50",                  icon: "🎲",  stats: "+20 or / -10 or",                         proba: "Courant",       color: "#e74c3c" },
    { nom: "Pari +",       desc: "75% succès",             icon: "🎲✨",stats: "75% +20 or / 25% -10 or",                proba: "Rare",          color: "#c0392b" },
    { nom: "JACKPOT",      desc: "Trésor légendaire",      icon: "🏆",  stats: "+40 or",                                  proba: "Rare",          color: "#f1c40f" },
    { nom: "RUINE ANCESTRALE", desc: "Trésor le plus précieux", icon: "✨", stats: "30 or, 20 gemmes, coffre rare si tu as de la chance", proba: "Rare", color: "#f1c40f" }
];
