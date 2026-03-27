// ======================
// ÉVÉNEMENTS ALÉATOIRES
// ======================

function event_piege() {
    log("⚠️ Tu avances dans un couloir sombre...");
    log("Un déclic sous ton pied ! Un piège !");
    if (joueur.intelligence >= jour) {
        log("→ Ton intelligence te permet de l'esquiver au dernier moment !", "#2ecc71");
        log("→ Tu récupères même quelques pièces près du mécanisme : +10 or", "#f1c40f");
        joueur.or += 10;
    } else {
        let d = jour * 2;
        joueur.pv -= d;
        log("→ Le piège se déclenche ! Tu perds " + d + " PV", "#e74c3c");
    }
    updateUI();
}

function event_piege_plus() {
    log("⚠️⚠️ Le sol s'effondre sous tes pieds !");
    log("Un piège mortel se déclenche !");
    if (joueur.intelligence >= jour * 2) {
        log("→ Grâce à ton intelligence exceptionnelle, tu anticipes le danger !", "#2ecc71");
        log("→ Tu explores la salle piégée et trouves : +20 or", "#f1c40f");
        joueur.or += 20;
    } else {
        let d = jour * 4;
        joueur.pv -= d;
        log("→ L'impact est brutal ! Tu perds " + d + " PV", "#e74c3c");
    }
    updateUI();
}

function event_gain() {
    log("💰 En explorant les environs, tu découvres une bourse abandonnée !");
    log("→ +10 or obtenus", "#f1c40f");
    joueur.or += 10;
    updateUI();
}

function event_gain_plus() {
    log("💰💰 Tu tombes sur un ancien campement de bandits...");
    log("Leur trésor est encore là !");
    log("→ +20 or obtenus", "#f1c40f");
    joueur.or += 20;
    updateUI();
}

function event_rencontre() {
    log("😊 Tu croises un groupe de voyageurs pacifiques autour d'un feu de camp.");
    log("Ils partagent leur nourriture avec toi.");
    log("→ +10 PV récupérés", "#2ecc71");
    joueur.pv += 10;
    updateUI();
}

function event_incroyable() {
    log("Tu trouve une ruine ancienne abritant des trésors cachés...");
    log("Tu décide de rentrer");
    let ruine = randint(1, 3);
    if (ruine > 1) {
        log("Le trésor est bien mais tu espérait mieux... +10 or et des objets");
        log("→ +10 or obtenus", "#f1c40f");
        loot_du_jour();
        joueur.or += 10;
    } else {
        log("Tu as trouvé un trésor incroyable");
        log("30 Or, 20 diamant, et des objets obtenus");
        log("→ +30 or obtenus", "#f1c40f");
        log("💎 Tu obtient 20 gemmes");
        event_coffre_plus();
        joueur.or += 30;
        joueur.gemmes += 20;
    }
}

function event_chemin() {
    log("🛤️ Tu arrives à une intersection. Trois chemins s'offrent à toi...");
    log("Le premier semble mener vers des ruines anciennes.");
    log("Le second traverse une forêt dense.");
    log("Le troisième longe une falaise escarpée.");
    let c = parseInt(prompt("Quel chemin prends-tu ? (1, 2 ou 3)"));
    if (isNaN(c) || c < 1 || c > 3) c = 2;
    let a = randint(1, 3);
    if (a == c) {
        log("→ Excellent choix ! Tu découvres un coffre caché !", "#f1c40f");
        loot_du_jour();
    } else if (a > c) {
        log("→ Tu trouves une cache de brigands avec de l'or : +20 or", "#f1c40f");
        joueur.or += 20;
    } else {
        log("→ Le chemin était vide... Tu continues ton voyage.", "#95a5a6");
    }
    updateUI();
}

function event_coffre() {
    log("📦 En fouillant les buissons, tu aperçois quelque chose qui brille...");
    log("Un coffre apparaît !");
    const probas = [
        [oCommuns, 1000], [oCommuns, 800], [oRares, 500],
        [oLeg, 30], [oIntel, 300]
    ];
    probas.forEach(([pool, chance]) => {
        if (randint(1, 1000) <= chance && pool.length > 0) appliquer_objet(choice(pool));
    });
}

function event_coffre_plus() {
    log("📦✨ Un éclat magique attire ton attention au loin...");
    log("En t'approchant, tu découvres un coffre orné de runes mystiques !");
    log("C'est un coffre rare !");
    const probas = [
        [oRares, 1000], [oRares, 800], [oLeg, 100],
        [oUltra, 40], [oIntel, 800], [oCheat, 10]
    ];
    probas.forEach(([pool, chance]) => {
        if (randint(1, 1000) <= chance && pool.length > 0) appliquer_objet(choice(pool));
    });
}

function event_gemmes() {
    log("En explorant les environs tu trouve une grotte");
    log("Dans la grotte, il y a des diamants, tu décide d'en extraire");
    log("Tu réussit a en prendre le maximum dans tes sac...");
    log("💎 Tu obtient 10 gemmes");
    joueur.gemmes += 10;
}

function event_gemmes_plus() {
    log("En explorant les environs tu trouve une grotte");
    log("La grotte est remplit de diamant, tu décide d'en extraire");
    log("Tu réussit a en prendre le maximum dans tes sac...");
    log("💎 Tu obtient 20 gemmes");
    joueur.gemmes += 20;
}

function event_pari() {
    log("🎲 Tu tombes sur un groupe de voyageurs jouant à des jeux d'argent.");
    log("L'ambiance est tendue. L'un d'eux te lance un défi...");
    log("Tu décides de participer à une partie !");
    if (randint(1, 2) === 1) {
        log("→ Les dés roulent en ta faveur ! Tu remportes la mise !", "#2ecc71");
        log("→ +20 or gagnés", "#f1c40f");
        joueur.or += 20;
    } else {
        log("→ Malchance... Tu perds ta mise.", "#e74c3c");
        log("→ -10 or perdus", "#e74c3c");
        joueur.or -= 10;
    }
    updateUI();
}

function event_pari_plus() {
    log("🎲✨ Un mystérieux joueur encapuchonné t'invite à une partie spéciale...");
    log("Les règles semblent être en ta faveur, mais le risque demeure.");
    log("Tu acceptes le défi !");
    if (randint(1, 4) <= 3) {
        log("→ Victoire ! Le joueur reconnaît ta chance et te récompense !", "#2ecc71");
        log("→ +20 or gagnés", "#f1c40f");
        joueur.or += 20;
    } else {
        log("→ Contre toute attente, tu perds la partie...", "#e74c3c");
        log("→ -10 or perdus", "#e74c3c");
        joueur.or -= 10;
    }
    updateUI();
}

function jackpot() {
    log("🏆 En explorant une grotte abandonnée, tu tombes sur une salle cachée...");
    log("Un TRÉSOR LÉGENDAIRE s'y trouve !");
    log("Des pièces d'or partout, des gemmes précieuses...");
    log("→ JACKPOT ! +40 or obtenus !", "#f1c40f");
    joueur.or += 40;
    updateUI();
}

function event_auberge() {
    log("🏠 Après des heures de marche, tu aperçois une auberge accueillante.");
    log("L'odeur de nourriture chaude t'attire. L'aubergiste te propose ses services.");
    let choix = confirm("Payer 10 or pour un repos complet (+30 PV) ?\n(Annuler = repos simple gratuit +10 PV)");
    if (choix && joueur.or >= 10) {
        joueur.or -= 10;
        joueur.pv += 30;
        log("→ Tu paies pour une chambre confortable et un festin.", "#2ecc71");
        log("→ -10 or dépensés", "#e74c3c");
        log("→ +30 PV récupérés", "#2ecc71");
    } else if (choix) {
        log("→ Tu n'as pas assez d'or pour le repos complet...", "#e74c3c");
    } else {
        joueur.pv += 10;
        log("→ Tu dors dans l'écurie. Ce n'est pas luxueux mais ça repose.", "#95a5a6");
        log("→ +10 PV récupérés", "#2ecc71");
    }
    updateUI();
}

function event_bibliotheque() {
    log("📚 Tu découvres une bibliothèque ancienne remplie de grimoires poussiéreux.");
    log("Les connaissances contenues ici sont immenses, mais déchiffrer ces textes");
    log("anciens demande une concentration intense qui épuise le corps...");
    let choix = confirm("Étudier les grimoires ? (Coûte 15 PV pour +3 Intelligence)");
    if (choix && joueur.pv > 15) {
        joueur.pv -= 15;
        joueur.intelligence += 3;
        log("→ Tu passes des heures à déchiffrer les textes anciens.", "#9b59b6");
        log("→ -15 PV (fatigue mentale)", "#e74c3c");
        log("→ +3 Intelligence obtenus", "#2ecc71");
        updateUI();
    } else if (choix) {
        log("→ Tu es trop affaibli pour étudier en sécurité...", "#e74c3c");
    } else {
        log("→ Tu préfères garder tes forces. Sage décision.", "#95a5a6");
    }
}

function event_enigme() {
    log("🧩 Un sage mystérieux bloque ton chemin.");
    log("'Résous mon énigme et je te récompenserai', dit-il avec un sourire.");
    let reponse  = parseInt(prompt("Énigme : Combien font 7 + (jour actuel × 2) - jour ?\n(Le jour actuel est : " + jour + ")"));
    let solution = 7 + (jour * 2) - jour;

    if (reponse === solution) {
        log("→ 'Excellent !' s'exclame le sage. 'Voici ta récompense !'", "#2ecc71");
        log("→ +20 or obtenus", "#f1c40f");
        log("→ +2 Intelligence (apprentissage)", "#9b59b6");
        joueur.or += 20;
        joueur.intelligence += 2;
        updateUI();
    } else if (joueur.intelligence >= jour * 1.5) {
        log("→ Ta réponse est fausse, mais le sage est impressionné par ton intelligence.", "#f39c12");
        log("→ Il te donne une petite récompense : +10 or", "#f1c40f");
        joueur.or += 10;
        updateUI();
    } else {
        log("→ 'Dommage...' Le sage disparaît dans un nuage de fumée.", "#e74c3c");
        log("(La réponse était : " + solution + ")");
    }
}

function event_donjon() {
    log("🏰 Tu découvres l'entrée d'un donjon mystérieux...");
    log("Des bruits inquiétants résonnent depuis les profondeurs.");
    log("Un combat difficile t'attend, mais le trésor pourrait être immense !");
    let choix = confirm("Entrer dans le donjon ?");
    if (!choix) {
        log("→ Tu préfères éviter le danger. Parfois, la sagesse vaut mieux que la bravoure.", "#95a5a6");
        return;
    }

    let mult = diffSetting.enemy;
    if (jour >= 30) mult *= 6;
    else if (jour >= 20) mult *= 4;
    else if (jour >= 10) mult *= 2;

    let ennemiDonjon = {
        nom:  jour >= 30 ? "ULTRA Gardien du donjon" : jour >= 20 ? "SUPER Gardien du donjon" : jour >= 10 ? "Élite Gardien du donjon" : "Gardien du donjon",
        pv:   300 * mult,
        att:  50  * mult,
        def:  Math.max(0.1, 0.6 / (jour >= 10 ? 2 : 1)),
        or:   20  * diffSetting.gold
    };

    log("→ Tu descends dans les profondeurs...");
    if (combat(ennemiDonjon)) {
        log("🎁 Le donjon révèle ses trésors !", "#f1c40f");
        loot_du_jour();
        loot_du_jour();
    }
}

function event_marchand_ambulant() {
    log("🎪 En traversant un village, tu aperçois un marchand ambulant excentrique !");
    log("Sa carriole déborde d'objets étranges et de reliques mystérieuses.");
    log("'Ah, un aventurier ! J'ai exactement ce qu'il te faut !' dit-il avec un sourire.");

    const allItems = [...oMarchandExclusif, ...oRares, ...oLeg, ...oIntel];
    const stock = [];

    if (allItems.length > 0) stock.push(choice(allItems));
    if (randint(1, 100) <= 40 && allItems.length > 0) stock.push(choice(allItems));
    if (randint(1, 100) <= 1  && allItems.length > 0) {
        stock.push(choice(allItems));
        log("→ Le marchand est de très bonne humeur aujourd'hui !", "#f1c40f");
    }

    log("→ Le marchand te DONNE généreusement " + stock.length + " objet" + (stock.length > 1 ? "s" : "") + " !", "#2ecc71");
    stock.forEach(obj => appliquer_objet(obj));
    updateUI();
}

// ======================
// TABLE DES ÉVÉNEMENTS
// ======================
function getEventsPossibles() {
    const en = getScaledEnemies();

    let events = [
        () => combat(en.voleur),   () => combat(en.voleur),
        () => combat(en.guerrier), () => combat(en.voleur),
        () => combat(en.guerrier), () => combat(en.guerrier),
        event_gain, event_gain, event_gain_plus,
        event_rencontre, event_rencontre,
        event_pari, event_pari, event_pari_plus,
        event_piege_plus, event_piege, event_piege,
        event_coffre, event_coffre_plus,
        event_chemin, event_chemin,
        jackpot, event_donjon, event_marchand_ambulant,
        event_enigme, event_bibliotheque,
        event_enigme, event_bibliotheque,
        event_auberge,
        event_gemmes, event_gemmes_plus,
        event_incroyable
    ];

    if (jour >= 5) {
        events.push(
            () => combat(en.champion),    () => combat(en.mage),
            () => combat(en.paladin),     () => combat(en.necromancien),
            () => combat(en.berserker),   () => combat(en.assassin),
            () => combat(en.assassin),    () => combat(en.berserker),
            () => combat(en.paladin),     () => combat(en.champion)
        );
    }
    if (jour >= 10) {
        events.push(() => combat(en.dragon), () => combat(en.titan));
    }
    if (jour >= 20) {
        events.push(() => combat(en.creature));
    }
    if (jour >= 30) {
        events.push(() => combat(en.demon));
    }

    return events;
}
