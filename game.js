import { getPlayerData, updatePlayerData } from "./database.js";

let player;

async function loadPlayer() {
  player = await getPlayerData();
  document.getElementById("playerData").innerHTML =
    `Dinero: $${player.money} | Reputación: ${player.reputation}`;
}

window.buyBlackMarketCar = async function() {
  const price = 120000;

  if (player.money >= price) {
    player.money -= price;
    player.ownedCars.push("obsidian_xr12");

    await updatePlayerData({
      money: player.money,
      ownedCars: player.ownedCars
    });

    alert("Compraste Obsidian XR-12");
    loadPlayer();
  } else {
    alert("No tienes suficiente dinero");
  }
};

loadPlayer();
