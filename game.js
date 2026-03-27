// ======================
// ÉTAT DU JEU
// ======================
let jour = 1;
let diffSetting = { name: 'NORMAL', gold: 1, enemy: 1.5, boss: 1, def: 1, nerfPv: 0, nerfAtt: 0, nerfRegen: 0, nerfOr: 0 };
let joueur = { intelligence: 0, pv: 100, att: 8, def: 3, or: 40, regen: 20, capas: [], gemmes: 0 };
let permanentUpgrades = JSON.parse(localStorage.getItem('pixelquest_upgrades') || '{"pv":0,"att":0,"def":0,"or":0,"regen":0}');
let upgradesCost    = JSON.parse(localStorage.getItem('pixelquest_costs')    || '{"pv":10,"att":10,"def":10,"or":10,"regen":10}');

// ======================
// HELPERS
// ======================
const randint = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const choice  = (arr)      => arr[Math.floor(Math.random() * arr.length)];

function ennemi_elite(e) {
    return { nom: "Élite " + e.nom, pv: Math.floor(e.pv * 2), att: Math.floor(e.att * 2), def: Math.max(0.1, e.def / 2), or: e.or, gemmes: e.gemmes || 0 };
}
function ennemi_elite2(e) {
    return { nom: "SUPER " + e.nom, pv: Math.floor(e.pv * 4), att: Math.floor(e.att * 4), def: Math.max(0.1, e.def / 2), or: e.or, gemmes: e.gemmes || 0 };
}
function ennemi_elite3(e) {
    return { nom: "ULTRA " + e.nom, pv: Math.floor(e.pv * 6), att: Math.floor(e.att * 6), def: Math.max(0.1, e.def / 2), or: e.or, gemmes: e.gemmes || 0 };
}
function ennemi_boss(e) {
    return { nom: "Boss " + e.nom, pv: Math.floor(e.pv * 8), att: Math.floor(e.att * 8), def: Math.max(0.1, e.def / 2.5), or: Math.floor(e.or * 1.5), gemmes: e.gemmes || 0 };
}

// ======================
// APPLIQUER OBJET
// ======================
function appliquer_objet(obj) {
    log("✨ Objet acquis : " + obj.nom, "#3498db");
    for (let s in obj) {
        if (["nom", "r"].includes(s)) continue;
        if (s === "capa") {
            if (!joueur.capas.includes(obj[s])) {
                joueur.capas.push(obj[s]);
                log("  → Capacité obtenue : " + obj[s], "#e67e22");
            }
        } else {
            joueur[s] += obj[s];
            if (s === "att")         log("  → Attaque +" + obj[s], "#2ecc71");
            if (s === "pv")          log("  → PV +" + obj[s], "#2ecc71");
            if (s === "def")         log("  → Défense " + (obj[s] > 0 ? "+" : "") + obj[s], "#2ecc71");
            if (s === "regen")       log("  → Régénération +" + obj[s], "#2ecc71");
            if (s === "intelligence") log("  → Intelligence +" + obj[s], "#2ecc71");
        }
    }
    joueur.def = Math.max(DEF_MIN, joueur.def);

    // Retirer des pools (unique)
    if (obj.r === "legendaire") {
        let idx = oLeg.indexOf(obj);
        if (idx > -1) oLeg.splice(idx, 1);
        idx = oMarchandExclusif.findIndex(o => o.nom === obj.nom);
        if (idx > -1) oMarchandExclusif.splice(idx, 1);
    }
    if (obj.r === "ultra") {
        let idx = oUltra.indexOf(obj);
        if (idx > -1) oUltra.splice(idx, 1);
        idx = oMarchandExclusif.findIndex(o => o.nom === obj.nom);
        if (idx > -1) oMarchandExclusif.splice(idx, 1);
    }
    if (obj.r === "cheat") {
        const idx = oCheat.indexOf(obj);
        if (idx > -1) oCheat.splice(idx, 1);
    }

    updateUI();
}

// ======================
// LOOT DU JOUR
// ======================
function loot_du_jour() {
    const probas = [
        [oCommuns, 1000], [oCommuns, 500], [oRares, 500],
        [oLeg, 30], [oUltra, 10], [oIntel, 250], [oCheat, 2]
    ];
    probas.forEach(([pool, chance]) => {
        if (randint(1, 1000) <= chance && pool.length > 0) {
            appliquer_objet(choice(pool));
        }
    });
}

// ======================
// COMBAT
// ======================
function combat(eBase, isBoss = false) {
    const m = isBoss ? diffSetting.boss : diffSetting.enemy;
    let en = {
        nom:    eBase.nom,
        pv:     eBase.pv  * m,
        att:    eBase.att * m,
        def:    eBase.def,
        or:     eBase.or  * diffSetting.gold,
        gemmes: eBase.gemmes || 0
    };

    log("⚔️ COMBAT : " + en.nom, "#e74c3c");
    let pvE = en.pv;
    let inv = joueur.capas.includes("invincible_3tour") ? 3 : 0;

    if (joueur.capas.includes("phase") && randint(1, 5) === 1) {
        pvE -= 999999;
        log("coup critique : capa phase active");
    }

    while (joueur.pv > 0 && pvE > 0) {
        // Dégâts reçus
        if (pvE > 0) {
            let sub = en.att * joueur.def;
            if (joueur.capas.includes("reduc_degats")) sub /= 2;
            if (inv > 0) { sub = 0; inv--; }
            if (joueur.capas.includes("reflect_50")) pvE -= (sub * 0.5);
            joueur.pv -= sub;
        }

        if (joueur.pv <= 0) break;

        // Attaques joueur
        let atks = 1;
        if (joueur.capas.includes("multi_attaque")) {
            while (randint(1, 3) === 1) atks++;
        }

        for (let i = 0; i < atks; i++) {
            let d = joueur.att * en.def;
            if (joueur.intelligence > jour * 2.5) d *= (joueur.intelligence / jour * 2);
            if (joueur.capas.includes("raisonnement") && joueur.intelligence >= jour * 1.5) d *= 2;
            if (joueur.capas.includes("extermination") && randint(1, 2) === 1) pvE -= 250;
            if (joueur.capas.includes("crit_25") && randint(1, 4) === 1) d *= 5;
            pvE -= d;
            if (joueur.capas.includes("vol_de_vie")) joueur.pv += (d * 0.05);
            if (pvE <= 0) break;
        }
    }

    if (joueur.pv > 0) {
        log("🏆 Victoire !", "#2ecc71");
        if (en.gemmes) {
            joueur.gemmes += en.gemmes;
            localStorage.setItem('pixelquest_gemmes', joueur.gemmes.toString());
            log("→ +" + en.gemmes + " 💎 gemmes récupérées", "#9b59b6");
        }
        log("→ +" + Math.floor(en.or) + " or récupérés", "#f1c40f");
        log("→ +" + Math.floor(joueur.regen) + " PV régénérés", "#2ecc71");
        joueur.or += en.or;
        joueur.pv += joueur.regen;
        updateUI();
        return true;
    }

    log("💀 DÉFAITE - Tu es tombé au combat...", "#ff0000");
    const btn = document.getElementById('btn-next');
    btn.innerText = "💀 RECOMMENCER";
    btn.onclick = () => location.reload();
    btn.disabled = false;
    return false;
}

// ======================
// GÉNÉRATION ENNEMIS PAR JOUR
// ======================
function getScaledEnemies() {
    let { voleur, guerrier, champion, assassin, mage, berserker, paladin, necromancien, dragon, titan, creature, demon } = { ...ennemisBase };

    const applyScale = (scaleFn, list) => list.map(e => scaleFn(e));

    if (jour >= 40) {
        [voleur, guerrier, champion, paladin, necromancien, assassin, berserker, mage, dragon, titan] =
            [voleur, guerrier, champion, paladin, necromancien, assassin, berserker, mage, dragon, titan].map(ennemi_boss);
        creature = ennemi_elite2(creature);
        demon    = ennemi_elite(demon);
    } else if (jour >= 30) {
        [voleur, guerrier, champion, paladin, necromancien, assassin, berserker, mage, dragon, titan] =
            [voleur, guerrier, champion, paladin, necromancien, assassin, berserker, mage, dragon, titan].map(ennemi_elite3);
        creature = ennemi_elite(creature);
    } else if (jour >= 20) {
        [voleur, guerrier, champion, paladin, necromancien, assassin, berserker, mage, dragon, titan] =
            [voleur, guerrier, champion, paladin, necromancien, assassin, berserker, mage, dragon, titan].map(ennemi_elite2);
    } else if (jour >= 10) {
        [voleur, guerrier, champion, paladin, necromancien, assassin, berserker, mage] =
            [voleur, guerrier, champion, paladin, necromancien, assassin, berserker, mage].map(ennemi_elite);
    }

    return { voleur, guerrier, champion, assassin, mage, berserker, paladin, necromancien, dragon, titan, creature, demon };
}

// ======================
// MARCHAND GÉNÉRATION
// ======================
function genererMarchand() {
    const probas = [
        [oCommuns, 1000],
        [oCommuns, 700],
        [oRares, 400],
        [oLeg, 40],
        [oUltra, 15],
        [oIntel, 50],
        [oCheat, 3]
    ];
    let stock = [];
    probas.forEach(([pool, chance]) => {
        if (randint(1, 1000) <= chance && pool.length > 0) stock.push(choice(pool));
    });
    return stock;
}

// ======================
// GEMMES QUOTIDIENNES
// ======================
function checkDailyGems() {
    const today         = new Date().toDateString();
    const lastClaim     = localStorage.getItem('pixelquest_last_daily_claim');
    const lastTimestamp = parseInt(localStorage.getItem('pixelquest_last_timestamp') || '0');
    const now           = Date.now();

    if (now < lastTimestamp) {
        log("⚠️ Détection de modification de l'heure système !", "#e74c3c");
        localStorage.setItem('pixelquest_last_timestamp', now.toString());
        return;
    }

    if (lastClaim !== today) {
        joueur.gemmes += 100;
        localStorage.setItem('pixelquest_gemmes', joueur.gemmes.toString());
        localStorage.setItem('pixelquest_last_daily_claim', today);
        log("🎁 BONUS QUOTIDIEN : +100 💎 gemmes !", "#9b59b6");
        updateUI();
    }
    localStorage.setItem('pixelquest_last_timestamp', now.toString());
}
