import { getPlayerData, updatePlayerData, logout } from "./database.js";

let player;
let logoutButtonAdded = false;

function renderPlayerData() {
  const playerDataElement = document.getElementById("playerData");
  if (!playerDataElement) return;

  playerDataElement.innerHTML = `Dinero: $${player.money} | Reputación: ${player.reputation}`;
}

function ensurePlayerShape(data) {
  return {
    money: Number.isFinite(data.money) ? data.money : 50000,
    reputation: Number.isFinite(data.reputation) ? data.reputation : 0,
    ownedCars: Array.isArray(data.ownedCars) ? data.ownedCars : ["torashi"],
    currentCar: data.currentCar || "torashi",
    garage: data.garage || {}
  };
}

function addLogoutButton() {
  if (logoutButtonAdded) return;

  const button = document.createElement("button");
  button.textContent = "Cerrar sesión";
  button.style.marginLeft = "10px";
  button.onclick = () => {
    logout();
    window.location.href = "index.html";
  };

  document.body.appendChild(button);
  logoutButtonAdded = true;
}

async function loadPlayer() {
  try {
    player = ensurePlayerShape(await getPlayerData());
    renderPlayerData();
    addLogoutButton();
  } catch (error) {
    alert(error.message);
    window.location.href = "index.html";
  }
}

window.buyBlackMarketCar = async function buyBlackMarketCar() {
  const price = 120000;
  const targetCar = "obsidian_xr12";

  if (!player) {
    alert("Jugador no cargado todavía.");
    return;
  }

  if (player.ownedCars.includes(targetCar)) {
    alert("Ya tienes este carro en tu garage.");
    return;
  }

  if (player.money < price) {
    alert("No tienes suficiente dinero");
    return;
  }

  const previousState = {
    money: player.money,
    ownedCars: [...player.ownedCars]
  };

  player.money -= price;
  player.ownedCars.push(targetCar);

  try {
    await updatePlayerData({
      money: player.money,
      ownedCars: player.ownedCars
    });

    alert("Compraste Obsidian XR-12");
    renderPlayerData();
  } catch (error) {
    player.money = previousState.money;
    player.ownedCars = previousState.ownedCars;
    alert(`No se pudo guardar la compra: ${error.message}`);
  }
};

loadPlayer();
