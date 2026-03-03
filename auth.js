import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, setDoc } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

window.register = async function() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await setDoc(doc(db, "players", user.uid), {
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
  });

  window.location.href = "game.html";
};

window.login = async function() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await signInWithEmailAndPassword(auth, email, password);
  window.location.href = "game.html";
};
