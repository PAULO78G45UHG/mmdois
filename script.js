// BANCO DE DADOS DE ITENS E GAMEPASSES (ESTILO MM2)
const MM2_DATABASE = {
    knives: [
        { id: "niks_scythe", name: "Nik's Scythe", rarity: "ancient", type: "knife" },
        { id: "chroma_fang", name: "Chroma Fang", rarity: "godly", type: "knife" },
        { id: "seer", name: "Seer", rarity: "godly", type: "knife" },
        { id: "icebreaker", name: "Icebreaker", rarity: "ancient", type: "knife" }
    ],
    guns: [
        { id: "chroma_luger", name: "Chroma Luger", rarity: "godly", type: "gun" },
        { id: "darkbringer", name: "Darkbringer", rarity: "godly", type: "gun" },
        { id: "laser", name: "Laser", rarity: "godly", type: "gun" }
    ],
    gamepasses: [
        { id: "radio", name: "Radio / Boombox", price: 475 },
        { id: "elite", name: "Elite Status", price: 499 },
        { id: "vip", name: "VIP Gamepass", price: 399 }
    ]
};

// ESTADO DO JOGADOR
let playerData = {
    level: 1,
    xp: 0,
    coins: 250,
    inventory: ["seer", "laser"],
    equippedKnife: "seer",
    equippedGun: "laser",
    device: "desktop"
};

// ESTADO DA PARTIDA
let gameState = {
    phase: "LOBBY", // LOBBY, VOTING, IN_GAME, END
    timer: 120,
    currentMap: null,
    interval: null
};

// SELEÇÃO DE DISPOSITIVO (INTRO)
function selectDevice(device) {
    playerData.device = device;
    document.getElementById("device-screen").classList.add("hidden");
    document.getElementById("game-ui").classList.remove("hidden");

    if (device === "mobile") {
        document.getElementById("mobile-controls").classList.remove("hidden");
    }

    initGame();
}

// INICIALIZAÇÃO
function initGame() {
    updateHUD();
    renderInventory("knives");
    renderShop();
    renderGamepasses();
    startRoundLoop();
}

// ATUALIZAR INTERFACE HUD
function updateHUD() {
    document.getElementById("player-level").textContent = playerData.level;
    document.getElementById("player-coins").textContent = playerData.coins;
}

// LOOP DAS RODADAS (CRONÔMETRO)
function startRoundLoop() {
    gameState.interval = setInterval(() => {
        if (gameState.timer > 0) {
            gameState.timer--;
            let mins = String(Math.floor(gameState.timer / 60)).padStart(2, '0');
            let secs = String(gameState.timer % 60).padStart(2, '0');
            document.getElementById("game-timer").textContent = `${mins}:${secs}`;
        } else {
            advanceGamePhase();
        }
    }, 1000);
}

function advanceGamePhase() {
    if (gameState.phase === "LOBBY") {
        gameState.phase = "VOTING";
        document.getElementById("game-state").textContent = "Votação de Mapa";
        document.getElementById("map-voting").classList.remove("hidden");
        gameState.timer = 15;
    } else if (gameState.phase === "VOTING") {
        document.getElementById("map-voting").classList.add("hidden");
        gameState.phase = "IN_GAME";
        document.getElementById("game-state").textContent = "Em Partida";
        gameState.timer = 120;
    } else if (gameState.phase === "IN_GAME") {
        gameState.phase = "LOBBY";
        document.getElementById("game-state").textContent = "Intermissão";
        gameState.timer = 30;
    }
}

// Mapeamento e Votação de Mapas
function voteMap(mapName) {
    gameState.currentMap = mapName;
    alert(`Você votou no mapa: ${mapName}`);
}

// RENDERIZAÇÃO DE JANELAS E ITENS
function openTab(tabName) {
    document.getElementById("modal-screen").classList.remove("hidden");
    document.querySelectorAll(".tab-content").forEach(el => el.classList.add("hidden"));
    document.getElementById(`tab-${tabName}`).classList.remove("hidden");
}

function closeModal() {
    document.getElementById("modal-screen").classList.add("hidden");
}

// RENDERIZAR INVENTÁRIO
function renderInventory(category) {
    const grid = document.getElementById("inventory-grid");
    grid.innerHTML = "";

    const items = [...MM2_DATABASE.knives, ...MM2_DATABASE.guns].filter(item => 
        playerData.inventory.includes(item.id)
    );

    items.forEach(item => {
        const card = document.createElement("div");
        card.className = `item-card ${item.rarity}`;
        card.innerHTML = `
            <strong>${item.name}</strong>
            <p>${item.rarity.toUpperCase()}</p>
        `;
        grid.appendChild(card);
    });
}

// RENDERIZAR LOJA
function renderShop() {
    const grid = document.getElementById("shop-grid");
    grid.innerHTML = "";

    MM2_DATABASE.knives.concat(MM2_DATABASE.guns).forEach(item => {
        const card = document.createElement("div");
        card.className = `item-card ${item.rarity}`;
        card.innerHTML = `
            <strong>${item.name}</strong>
            <p>1000 Moedas</p>
            <button onclick="buyItem('${item.id}')">Comprar</button>
        `;
        grid.appendChild(card);
    });
}

// RENDERIZAR GAMEPASSES
function renderGamepasses() {
    const grid = document.getElementById("gamepass-grid");
    grid.innerHTML = "";

    MM2_DATABASE.gamepasses.forEach(gp => {
        const card = document.createElement("div");
        card.className = "item-card legendary";
        card.innerHTML = `
            <strong>${gp.name}</strong>
            <p>${gp.price} Robux</p>
            <button>Obter</button>
        `;
        grid.appendChild(card);
    });
}

function buyItem(itemId) {
    if (playerData.coins >= 1000) {
        playerData.coins -= 1000;
        playerData.inventory.push(itemId);
        updateHUD();
        renderInventory("knives");
        alert("Item comprado!");
    } else {
        alert("Moedas insuficientes!");
    }
}

// RENDERIZAÇÃO NO CANVAS (MUNDO DO JOGO)
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Simulação do Mapa/Lobby
    ctx.fillStyle = "#333";
    ctx.fillRect(100, 100, canvas.width - 200, canvas.height - 200);

    ctx.fillStyle = "#fff";
    ctx.font = "16px Arial";
    ctx.fillText(`Mapa Atual: ${gameState.currentMap || 'Lobby'}`, 120, 130);

    requestAnimationFrame(draw);
}
draw();