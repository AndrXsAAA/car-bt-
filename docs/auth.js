import { getDefaultPlayerData, readJSON, writeJSON, PLAYER_PREFIX, SESSION_KEY } from "./database.js";

const ACCOUNTS_KEY = "car_nitro_accounts";

function getCredentials() {
  const email = document.getElementById("email")?.value?.trim().toLowerCase();
  const password = document.getElementById("password")?.value;

  if (!email || !password) {
    alert("Ingresa email y password.");
    return null;
  }

  return { email, password };
}

function setupLocalModeBanner() {
  const banner = document.createElement("p");
  banner.textContent = "Modo local activo: datos guardados en este navegador.";
  banner.style.color = "#ffd54f";
  banner.style.fontWeight = "bold";
  document.body.appendChild(banner);
}

setupLocalModeBanner();

const localSession = localStorage.getItem(SESSION_KEY);
if (localSession && !window.location.pathname.endsWith("game.html")) {
  window.location.href = "game.html";
}

window.register = async function register() {
  const credentials = getCredentials();
  if (!credentials) return;

  const accounts = readJSON(ACCOUNTS_KEY, {});

  if (accounts[credentials.email]) {
    alert("Ese correo ya está registrado.");
    return;
  }

  const uid = `local_${Date.now()}`;
  accounts[credentials.email] = { password: credentials.password, uid };

  writeJSON(ACCOUNTS_KEY, accounts);
  localStorage.setItem(SESSION_KEY, uid);
  writeJSON(`${PLAYER_PREFIX}${uid}`, getDefaultPlayerData());

  window.location.href = "game.html";
};

window.login = async function login() {
  const credentials = getCredentials();
  if (!credentials) return;

  const accounts = readJSON(ACCOUNTS_KEY, {});
  const account = accounts[credentials.email];

  if (!account || account.password !== credentials.password) {
    alert("Email o password incorrectos.");
    return;
  }

  localStorage.setItem(SESSION_KEY, account.uid);

  if (!localStorage.getItem(`${PLAYER_PREFIX}${account.uid}`)) {
    writeJSON(`${PLAYER_PREFIX}${account.uid}`, getDefaultPlayerData());
  }

  window.location.href = "game.html";
};
