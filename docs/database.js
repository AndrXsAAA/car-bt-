export const SESSION_KEY = "car_nitro_session";
export const PLAYER_PREFIX = "car_nitro_player_";

export function getDefaultPlayerData() {
  return {
    money: 50000,
    reputation: 0,
    ownedCars: ["torashi"],
    currentCar: "torashi",
    garage: {
      torashi: {
        engine: 100,
        tires: 100,
        turbo: 100,
        suspension: 100,
        brakes: 100
      }
    }
  };
}

export function readJSON(key, fallbackValue) {
  const rawValue = localStorage.getItem(key);

  if (!rawValue) {
    return fallbackValue;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return fallbackValue;
  }
}

export function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getLocalUserId() {
  const localUid = localStorage.getItem(SESSION_KEY);

  if (!localUid) {
    throw new Error("No hay sesión iniciada. Regresa al login.");
  }

  return localUid;
}

export async function getPlayerData() {
  const uid = getLocalUserId();
  const storageKey = `${PLAYER_PREFIX}${uid}`;
  const localPlayer = readJSON(storageKey, null);

  if (!localPlayer) {
    const defaultPlayer = getDefaultPlayerData();
    writeJSON(storageKey, defaultPlayer);
    return defaultPlayer;
  }

  return localPlayer;
}

export async function updatePlayerData(data) {
  const uid = getLocalUserId();
  const storageKey = `${PLAYER_PREFIX}${uid}`;
  const currentData = readJSON(storageKey, getDefaultPlayerData());
  const updatedData = { ...currentData, ...data };
  writeJSON(storageKey, updatedData);
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}
