import { db, auth } from "./firebase.js";
import { doc, getDoc, updateDoc } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export async function getPlayerData() {
  const user = auth.currentUser;
  const docRef = doc(db, "players", user.uid);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
}

export async function updatePlayerData(data) {
  const user = auth.currentUser;
  const docRef = doc(db, "players", user.uid);
  await updateDoc(docRef, data);
}
