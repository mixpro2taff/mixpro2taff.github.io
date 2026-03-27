// ======================
// UI DE BASE
// ======================
function log(msg, color = "#fff") {
    const screen = document.getElementById('game-screen');
    const div = document.createElement('div');
    div.className = "log-entry";
    div.style.color = color;
    div.innerHTML = msg;
    screen.appendChild(div);
    screen.scrollTop = screen.scrollHeight;
}

function updateUI() {
    document.getElementById('stat-jour').innerText  = jour;
    document.getElementById('stat-pv').innerText    = Math.floor(joueur.pv);
    document.getElementById('stat-or').innerText    = Math.floor(joueur.or);
    document.getElementById('stat-att').innerText   = Math.floor(joueur.att);
    document.getElementById('stat-def').innerText   = joueur.def.toFixed(2);
    document.getElementById('stat-regen').innerText = Math.floor(joueur.regen);
    document.getElementById('stat-int').innerText   = joueur.intelligence;
    document.getElementById('stat-gemmes').innerText = joueur.gemmes;
    document.getElementById('btn-next').innerText   = "Lancer Jour " + jour;
}

// ======================
// CARTE OBJET
// ======================
function createCard(obj, isMerchant = false) {
    const card = document.createElement('div');
    const isPossessed = obj.capa && joueur.capas.includes(obj.capa);
    card.className = `item-card rarity-${obj.r} ${isPossessed ? 'possessed-card' : ''}`;

    let s = "";
    if (obj.att)         s += `⚔️ Atk: <span>+${obj.att}</span><br>`;
    if (obj.pv)          s += `❤️ PV: <span>+${obj.pv}</span><br>`;
    if (obj.def)         s += `🛡️ Def: <span>${obj.def}</span><br>`;
    if (obj.intelligence) s += `🧠 Int: <span>+${obj.intelligence}</span><br>`;
    if (obj.regen)       s += `✨ Reg: <span>+${obj.regen}</span><br>`;

    card.innerHTML = `
        <div class="card-name">${obj.nom}</div>
        <div class="card-stats">${s || '<em style="color:#666">Capacité spéciale</em>'}</div>
        ${obj.capa ? `<div class="card-capa">★ ${obj.capa}</div>` : ''}
        ${isPossessed ? `<div class="owned-tag">✓ ACQUIS</div>` : ''}
        ${isMerchant  ? `<div style="margin-top:10px; color:#f1c40f; font-weight:bold; font-size:0.8em">💰 20 OR</div>` : ''}
    `;

    if (isMerchant) {
        card.style.cursor = 'pointer';
        card.onclick = () => {
            if (joueur.or >= 20) {
                joueur.or -= 20;
                log("→ Achat : " + obj.nom + " pour 20 or", "#3498db");
                appliquer_objet(obj);
                card.style.opacity = "0.3";
                card.style.cursor  = "not-allowed";
                card.onclick = null;
            } else {
                log("❌ Pas assez d'or ! (Il te faut 20 or)", "#e74c3c");
            }
        };
    }
    return card;
}

// ======================
// CODEX
// ======================
function toggleCodex(show) {
    const overlay = document.getElementById('codex-overlay');
    if (show) {
        document.getElementById('my-capas-list').innerText =
            joueur.capas.length > 0 ? joueur.capas.join(", ") : "Aucune";
        switchCodexTab('objets');
        overlay.style.display = 'block';
    } else {
        overlay.style.display = 'none';
    }
}

function switchCodexTab(tab) {
    const tabObjets  = document.getElementById('tab-objets');
    const tabEvents  = document.getElementById('tab-events');
    const contentObj = document.getElementById('codex-objets-content');
    const contentEv  = document.getElementById('codex-events-content');

    if (tab === 'objets') {
        tabObjets.style.cssText  = 'background: var(--accent); color: #000; border-color: var(--accent);';
        tabEvents.style.cssText  = 'background: #000; color: #fff; border-color: #fff;';
        contentObj.style.display = 'block';
        contentEv.style.display  = 'none';
        renderCodex();
    } else {
        tabEvents.style.cssText  = 'background: var(--accent); color: #000; border-color: var(--accent);';
        tabObjets.style.cssText  = 'background: #000; color: #fff; border-color: #fff;';
        contentObj.style.display = 'none';
        contentEv.style.display  = 'block';
        renderEventsCodex();
    }
}

function renderCodex() {
    const grid = document.getElementById('codex-grid');
    grid.innerHTML = "";

    const categories = [
        { title: "COMMUNS",           items: oCommuns,         color: "#95a5a6" },
        { title: "RARES",             items: oRares,           color: "#3498db" },
        { title: "LÉGENDAIRES",       items: oLeg,             color: "#f1c40f" },
        { title: "ULTRA",             items: oUltra,           color: "#9b59b6" },
        { title: "INTELLIGENCE",      items: oIntel,           color: "#2ecc71" },
        { title: "MARCHAND EXCLUSIF", items: oMarchandExclusif,color: "#e67e22" },
        { title: "CHEAT",             items: oCheat,           color: "#e74c3c" }
    ];

    categories.forEach(cat => {
        const section = document.createElement('div');
        section.style.width = '100%';
        section.style.marginBottom = '30px';
        section.innerHTML = `<h2 style="color:${cat.color}; border-bottom: 2px solid ${cat.color}; padding-bottom: 10px;">${cat.title}</h2>`;
        const cardsDiv = document.createElement('div');
        cardsDiv.className = 'cards-container';
        cardsDiv.style.marginTop = '15px';
        cat.items.forEach(item => cardsDiv.appendChild(createCard(item, false)));
        section.appendChild(cardsDiv);
        grid.appendChild(section);
    });
}

function renderEventsCodex() {
    const grid = document.getElementById('events-grid');
    grid.innerHTML = "";
    grid.style.cssText = 'display:flex; flex-wrap:wrap; gap:15px; justify-content:center;';

    EVENTS_CODEX_DATA.forEach(ev => {
        const card = document.createElement('div');
        card.style.cssText = `background:var(--card-bg); border:2px solid #333; padding:10px; width:180px; min-height:180px;
            display:flex; flex-direction:column; transition:all 0.3s ease;`;
        card.innerHTML = `
            <div style="font-size:2em; text-align:center; margin-bottom:8px;">${ev.icon}</div>
            <div style="font-weight:bold; color:${ev.color}; border-bottom:1px solid #333; padding-bottom:4px; margin-bottom:8px; font-size:0.85em;">${ev.nom}</div>
            <div style="font-size:0.7em; color:#bbb; margin-bottom:6px; line-height:1.3;">${ev.desc}</div>
            <div style="font-size:0.65em; color:#fff; background:rgba(255,255,255,0.05); padding:6px; border-radius:3px; margin-bottom:6px; flex-grow:1;">${ev.stats}</div>
            <div style="font-size:0.6em; color:#f1c40f; font-style:italic;">📊 ${ev.proba}</div>
        `;
        card.onmouseover = () => { card.style.borderColor = ev.color; card.style.boxShadow = `0 0 15px ${ev.color}`; card.style.transform = 'translateY(-5px)'; };
        card.onmouseout  = () => { card.style.borderColor = '#333';   card.style.boxShadow = 'none';                  card.style.transform = 'translateY(0)'; };
        grid.appendChild(card);
    });
}

// ======================
// COLLECTION D'OBJETS
// ======================
let selectedCollectionItems = [];

function loadSelectedItems() {
    const savedItems = JSON.parse(localStorage.getItem('pixelquest_selected_items') || '[]');
    const inventory  = JSON.parse(localStorage.getItem('pixelquest_inventory') || '[]');
    selectedCollectionItems = [];

    savedItems.forEach(savedItem => {
        let slotIndex = 0;
        inventory.forEach(() => {
            if (selectedCollectionItems.filter(s => s.item.nom === savedItem.nom).length === slotIndex) {
                selectedCollectionItems.push({ key: `${savedItem.nom}-${slotIndex}`, item: savedItem });
                slotIndex++;
            }
        });
    });

    const el = document.getElementById('selected-count');
    if (el) el.innerText = selectedCollectionItems.length;
}

function openCollection() {
    loadSelectedItems();
    document.getElementById('collection-overlay').style.display = 'block';
    renderCollection();
}

function closeCollection() {
    document.getElementById('collection-overlay').style.display = 'none';
}

function renderCollection() {
    const grid = document.getElementById('collection-grid');
    grid.innerHTML = '';

    const inventory   = JSON.parse(localStorage.getItem('pixelquest_inventory') || '[]');
    const itemCounts  = {};
    inventory.forEach(item => { itemCounts[item.nom] = (itemCounts[item.nom] || 0) + 1; });

    const categories = [
        { title: "COMMUNS",      items: oCommuns, color: "#95a5a6" },
        { title: "RARES",        items: oRares,   color: "#3498db" },
        { title: "INTELLIGENCE", items: oIntel,   color: "#2ecc71" },
        { title: "LÉGENDAIRES",  items: oLeg,     color: "#f1c40f" },
        { title: "ULTRA",        items: oUltra,   color: "#9b59b6" },
        { title: "CHEAT",        items: oCheat,   color: "#e74c3c" }
    ];

    categories.forEach(cat => {
        const section = document.createElement('div');
        section.style.width = '100%';
        section.style.marginBottom = '30px';
        section.innerHTML = `<h2 style="color:${cat.color}; border-bottom: 2px solid ${cat.color}; padding-bottom: 10px;">${cat.title}</h2>`;
        const cardsDiv = document.createElement('div');
        cardsDiv.className = 'cards-container';
        cardsDiv.style.marginTop = '15px';

        cat.items.forEach(item => {
            const count    = itemCounts[item.nom] || 0;
            const maxCount = ["commun", "rare", "intel"].includes(item.r) ? 3 : 1;
            for (let i = 0; i < maxCount; i++) {
                cardsDiv.appendChild(createCollectionCard(item, i < count, i));
            }
        });

        section.appendChild(cardsDiv);
        grid.appendChild(section);
    });

    updateCollectionCount();
}

function createCollectionCard(item, isOwned, slotIndex) {
    const card    = document.createElement('div');
    const itemKey = `${item.nom}-${slotIndex}`;
    const isSelected = selectedCollectionItems.some(sel => sel.key === itemKey);

    card.className = `collection-card rarity-${item.r}`;
    if (isOwned)   card.classList.add('owned');
    if (isSelected) card.classList.add('selected');

    let stats = '';
    if (item.att)          stats += `⚔️ Atk: <span>+${item.att}</span><br>`;
    if (item.pv)           stats += `❤️ PV: <span>+${item.pv}</span><br>`;
    if (item.def)          stats += `🛡️ Def: <span>${item.def}</span><br>`;
    if (item.intelligence) stats += `🧠 Int: <span>+${item.intelligence}</span><br>`;
    if (item.regen)        stats += `✨ Reg: <span>+${item.regen}</span><br>`;

    card.innerHTML = `
        ${isSelected ? '<div class="selected-indicator">✓</div>' : ''}
        ${isOwned && !isSelected ? `<div class="card-count">${slotIndex + 1}</div>` : ''}
        <div class="card-name">${item.nom}</div>
        <div class="card-stats">${stats || '<em style="color:#666">Capacité spéciale</em>'}</div>
        ${item.capa ? `<div class="card-capa">★ ${item.capa}</div>` : ''}
    `;

    if (isOwned) card.onclick = () => toggleCollectionSelection(item, itemKey);
    return card;
}

function toggleCollectionSelection(item, itemKey) {
    const index = selectedCollectionItems.findIndex(sel => sel.key === itemKey);
    if (index > -1) {
        selectedCollectionItems.splice(index, 1);
    } else {
        if (selectedCollectionItems.length >= 3) {
            alert('Tu peux sélectionner maximum 3 objets !');
            return;
        }
        selectedCollectionItems.push({ key: itemKey, item: item });
    }
    localStorage.setItem('pixelquest_selected_items', JSON.stringify(selectedCollectionItems.map(s => s.item)));
    renderCollection();
}

function updateCollectionCount() {
    const count = selectedCollectionItems.length;
    const el1 = document.getElementById('collection-selected-count');
    const el2 = document.getElementById('selected-count');
    if (el1) el1.innerText = count;
    if (el2) el2.innerText = count;
}

// ======================
// OVERLAY INFO DIFFICULTÉ
// ======================
function openDiffInfo()  { document.getElementById('diff-info-overlay').style.display = 'block'; }
function closeDiffInfo() { document.getElementById('diff-info-overlay').style.display = 'none';  }

// ======================
// BOUTIQUE (fenêtre externe)
// ======================
function toggleBoutique(show) {
    if (show) window.open('boutique.html', 'Boutique', 'width=900,height=700');
}

// Écouter les messages de la boutique
window.addEventListener('message', function(event) {
    if (event.data.type === 'upgrade_bought') {
        log("💎 Amélioration achetée : " + event.data.stat.toUpperCase() + " +" + event.data.bonus, "#9b59b6");
        permanentUpgrades = JSON.parse(localStorage.getItem('pixelquest_upgrades'));
        upgradesCost      = JSON.parse(localStorage.getItem('pixelquest_costs'));
        joueur.gemmes     = parseInt(localStorage.getItem('pixelquest_gemmes'));
        updateUI();
    }
});
