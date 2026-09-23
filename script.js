// BANCO DE DADOS
const MM2_DATABASE = {
    knives: [
        { id: "niks_scythe", name: "Nik's Scythe", rarity: "ancient" },
        { id: "chroma_fang", name: "Chroma Fang", rarity: "godly" },
        { id: "seer", name: "Seer", rarity: "godly" }
    ],
    guns: [
        { id: "chroma_luger", name: "Chroma Luger", rarity: "godly" },
        { id: "darkbringer", name: "Darkbringer", rarity: "godly" }
    ],
    gamepasses: [
        { id: "radio", name: "Radio / Boombox", price: 475 },
        { id: "elite", name: "Elite Status", price: 499 }
    ]
};

let playerData = {
    level: 1,
    coins: 250,
    inventory: ["seer", "chroma_luger"],
    device: "desktop"
};

let gameState = {
    phase: "LOBBY",
    timer: 120,
    currentMap: "Lobby",
    interval: null
};

// SELEÇÃO DE DISPOSITIVO
function selectDevice(device) {
    playerData.device = device;
    
    // Oculta a intro
    document.getElementById("device-screen").classList.add("hidden");
    
    // Mostra os controles mobile se selecionado
    if (device === "mobile") {
        document.getElementById("mobile-controls").classList.remove("hidden");
    }

    initGame();
}

function initGame() {
    updateHUD();
    renderInventory();
    renderShop();
    renderGamepasses();
    startRoundLoop();
    resizeCanvas();
}

function updateHUD() {
    document.getElementById("player-level").textContent = playerData.level;
    document.getElementById("player-coins").textContent = playerData.coins;
}

function startRoundLoop() {
    if (gameState.interval) clearInterval(gameState.interval);
    
    gameState.interval = setInterval(() => {
        if (gameState.timer > 0) {
            gameState.timer--;
            let mins = String(Math.floor(gameState.timer / 60)).padStart(2, '0');
            let secs = String(gameState.timer % 60).padStart(2, '0');
            document.getElementById("game-timer").textContent = `${mins}:${secs}`;
        }
    }, 1000);
}

// JANELAS MODAIS
function openTab(tabName) {
    document.getElementById("modal-screen").classList.remove("hidden");
    document.querySelectorAll(".tab-content").forEach(el => el.classList.add("hidden"));
    document.getElementById(`tab-${tabName}`).classList.remove("hidden");
}

function closeModal() {
    document.getElementById("modal-screen").classList.add("hidden");
}

function renderInventory() {
    const grid = document.getElementById("inventory-grid");
    grid.innerHTML = "";
    const items = [...MM2_DATABASE.knives, ...MM2_DATABASE.guns].filter(item => 
        playerData.inventory.includes(item.id)
    );
    items.forEach(item => {
        const card = document.createElement("div");
        card.className = `item-card ${item.rarity}`;
        card.innerHTML = `<strong>${item.name}</strong><p>${item.rarity.toUpperCase()}</p>`;
        grid.appendChild(card);
    });
}

function renderShop() {
    const grid = document.getElementById("shop-grid");
    grid.innerHTML = "";
    MM2_DATABASE.knives.concat(MM2_DATABASE.guns).forEach(item => {
        const card = document.createElement("div");
        card.className = `item-card ${item.rarity}`;
        card.innerHTML = `<strong>${item.name}</strong><p>1000 Moedas</p>`;
        grid.appendChild(card);
    });
}

function renderGamepasses() {
    const grid = document.getElementById("gamepass-grid");
    grid.innerHTML = "";
    MM2_DATABASE.gamepasses.forEach(gp => {
        const card = document.createElement("div");
        card.className = "item-card legendary";
        card.innerHTML = `<strong>${gp.name}</strong><p>${gp.price} Robux</p>`;
        grid.appendChild(card);
    });
}

// CONFIGURAÇÃO DO CANVAS
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
    
    // Desenha o chão do mapa
    ctx.fillStyle = "#252525";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Texto central indicando o mapa
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "24px 'Arial Black'";
    ctx.textAlign = "center";
    ctx.fillText(`MAPA ATUAL: ${gameState.currentMap.toUpperCase()}`, canvas.width / 2, canvas.height / 2);

    requestAnimationFrame(draw);
}
draw();