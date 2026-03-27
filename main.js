// ======================
// DÉMARRAGE DU JEU
// ======================
function startGame(mode) {
    document.getElementById('collection-overlay').style.display = 'none';
    diffSetting = DIFF_SETTINGS[mode] || DIFF_SETTINGS.normal;

    // Charger gemmes et vérifier bonus quotidien
    joueur.gemmes = parseInt(localStorage.getItem('pixelquest_gemmes') || '0');
    checkDailyGems();

    // Appliquer les upgrades permanents
    joueur.pv    += permanentUpgrades.pv;
    joueur.att   += permanentUpgrades.att;
    joueur.def   -= permanentUpgrades.def;
    joueur.or    += permanentUpgrades.or;
    joueur.regen += permanentUpgrades.regen;

    // Appliquer le multiplicateur de défense de difficulté
    joueur.def = Math.max(DEF_MIN, joueur.def * diffSetting.def);

    // Appliquer les nerfs de difficulté
    if (diffSetting.nerfPv   > 0) { joueur.pv    = Math.floor(joueur.pv    * (1 - diffSetting.nerfPv));   log("💀 Nerf difficulté : PV réduits de "             + (diffSetting.nerfPv   * 100) + "%", "#e74c3c"); }
    if (diffSetting.nerfAtt  > 0) { joueur.att   = Math.floor(joueur.att   * (1 - diffSetting.nerfAtt));  log("💀 Nerf difficulté : Attaque réduite de "         + (diffSetting.nerfAtt  * 100) + "%", "#e74c3c"); }
    if (diffSetting.nerfRegen> 0) { joueur.regen = Math.floor(joueur.regen * (1 - diffSetting.nerfRegen));log("💀 Nerf difficulté : Régénération réduite de "     + (diffSetting.nerfRegen* 100) + "%", "#e74c3c"); }
    if (diffSetting.nerfOr   > 0) { joueur.or    = Math.floor(joueur.or    * (1 - diffSetting.nerfOr));   log("💀 Nerf difficulté : Or de départ réduit de "      + (diffSetting.nerfOr   * 100) + "%", "#e74c3c"); }

    // Charger et appliquer les objets sélectionnés en collection
    const selectedItems = JSON.parse(localStorage.getItem('pixelquest_selected_items') || '[]');
    if (selectedItems.length > 0) {
        log("🎁 Objets de départ :", "#9b59b6");
        selectedItems.forEach(item => {
            // Retirer des pools avant application
            if (["legendaire", "ultra", "cheat"].includes(item.r)) {
                [oLeg, oUltra, oCheat, oMarchandExclusif].forEach(pool => {
                    const idx = pool.findIndex(o => o.nom === item.nom);
                    if (idx > -1) pool.splice(idx, 1);
                });
            }
            appliquer_objet(item);
        });
    }

    document.getElementById('start-menu').style.display = 'none';
    log("⚙️ Difficulté : " + diffSetting.name, "#f1c40f");

    if (permanentUpgrades.pv > 0 || permanentUpgrades.att > 0 || permanentUpgrades.def > 0 ||
        permanentUpgrades.or > 0 || permanentUpgrades.regen > 0) {
        log("💎 Améliorations permanentes actives !", "#9b59b6");
    }
    updateUI();
}

// ======================
// TOUR DE JEU
// ======================
function playTurn() {
    document.getElementById('btn-next').disabled = true;
    log("━━━━━ JOUR " + jour + " ━━━━━", "#f1c40f");

    // Effets de capacités passifs en début de tour
    if (joueur.capas.includes("ia")) {
        joueur.intelligence += 2;
        log("🧠 Capacité IA active : +2 Intelligence", "#9b59b6");
    }
    if (joueur.capas.includes("investissement") && randint(1, 2) === 1) {
        joueur.or += 20;
        log("💼 Capacité Investissement : +20 or", "#f1c40f");
    }
    if (joueur.capas.includes("alchimie") && randint(1, 4) === 1) {
        joueur.or += 25;
        log("💎 Capacité Alchimie : +25 or", "#f1c40f");
    }

    // Loot quotidien
    loot_du_jour();
    if (joueur.capas.includes("loot+") && randint(1, 4) <= 3) {
        log("🎁 Capacité Loot+ activée !", "#e67e22");
        loot_du_jour();
    }

    if (joueur.pv <= 0) return;

    // Boss fixes aux jours clés
    if (jour === 10) {
        log("🚨 BOSS APPARAÎT : Seigneur de fer !", "#8e44ad");
        if (!combat(ennemisBase.boss10, true)) return;
    } else if (jour === 20) {
        log("🚨 BOSS APPARAÎT : Roi du Nord !", "#3498db");
        if (!combat(ennemisBase.boss20, true)) return;
    } else if (jour === 30) {
        log("🚨 BOSS APPARAÎT : Roi du monde !", "#27ae60");
        if (!combat(ennemisBase.boss30, true)) return;
    } else if (jour === 40) {
        log("🚨 BOSS APPARAÎT : Prince solaire !", "#f39c12");
        if (!combat(ennemisBase.boss40, true)) return;
    } else if (jour === 50) {
        log("🚨 BOSS APPARAÎT : Roi de la galaxie !", "#9b59b6");
        if (!combat(ennemisBase.boss50, true)) return;
    } else if (jour === 60) {
        log("🚨 BOSS FINAL : Dictateur inter-galaxie !", "#e74c3c");
        if (!combat(ennemisBase.boss60, true)) {
            return;
        } else {
            log("━━━━━━━━━━━━━━━━━━━━━━", "#f1c40f");
            log("🏆 VICTOIRE TOTALE ! 🏆", "#f1c40f");
            log("Tu as survécu aux 60 jours les plus dangereux de l'humanité !", "#2ecc71");
            log("Félicitations, tu es une légende !", "#f1c40f");
            log("━━━━━━━━━━━━━━━━━━━━━━", "#f1c40f");
            const btn = document.getElementById('btn-next');
            btn.innerText = "🎉 REJOUER";
            btn.onclick   = () => location.reload();
            btn.disabled  = false;
            return;
        }
    } else {
        // Événement aléatoire
        const events = getEventsPossibles();
        choice(events)();
    }

    if (joueur.pv <= 0) return;

    // Afficher le marchand
    document.getElementById('merchant-area').style.display = 'block';
    const mCards = document.getElementById('merchant-cards');
    mCards.innerHTML = "";
    genererMarchand().forEach(it => mCards.appendChild(createCard(it, true)));

    updateUI();
}

// ======================
// FIN DE JOURNÉE
// ======================
function finishDay() {
    document.getElementById('merchant-area').style.display = 'none';
    jour++;
    updateUI();
    document.getElementById('btn-next').disabled = false;
}

// ======================
// INIT
// ======================
window.addEventListener('DOMContentLoaded', function() {
    loadSelectedItems();
});
