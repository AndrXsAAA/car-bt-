import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161/build/three.module.js";

let scene;
let camera;
let renderer;
let car;
let speed = 0;
let nitro = 100;
let drifting = false;
let engineHealth = 100;
let engineDestroyed = false;

const maxSpeed = 1.8;
const acceleration = 0.03;
const friction = 0.015;
const turnSpeed = 0.035;
const keys = {};

const hudSpeed = document.getElementById("speed");
const hudNitro = document.getElementById("nitro");
const hudEngine = document.getElementById("engineStatus");

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x202830);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 20, 10);
  scene.add(light);

  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(500, 500),
    new THREE.MeshStandardMaterial({ color: 0x444444 })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(10, 5, 2),
    new THREE.MeshStandardMaterial({ color: 0x990000 })
  );
  wall.position.set(0, 2.5, -40);
  scene.add(wall);

  car = new THREE.Mesh(
    new THREE.BoxGeometry(2, 1, 4),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
  );
  car.position.y = 0.5;
  scene.add(car);

  window.addEventListener("keydown", (event) => {
    keys[event.key.toLowerCase()] = true;
  });

  window.addEventListener("keyup", (event) => {
    keys[event.key.toLowerCase()] = false;
  });

  window.addEventListener("resize", onResize);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function updateCar() {
  if (engineDestroyed) return;

  if (keys.w) speed += acceleration;
  if (keys.s) speed -= acceleration;

  if (keys.shift && nitro > 0) {
    speed += 0.05;
    nitro -= 0.5;
  }

  drifting = keys[" "];

  if (keys.a) {
    car.rotation.y += drifting ? turnSpeed * 1.5 : turnSpeed;
  }

  if (keys.d) {
    car.rotation.y -= drifting ? turnSpeed * 1.5 : turnSpeed;
  }

  speed = Math.max(-maxSpeed, Math.min(maxSpeed, speed));

  if (!keys.w && !keys.s) {
    speed *= 1 - friction;
  }

  car.position.x -= Math.sin(car.rotation.y) * speed;
  car.position.z -= Math.cos(car.rotation.y) * speed;

  if (!keys.shift && nitro < 100) {
    nitro += 0.2;
  }

  nitro = Math.max(0, Math.min(100, nitro));

  checkCollision();
  updateHUD();
}

function checkCollision() {
  if (car.position.z < -38 && car.position.z > -42) {
    engineHealth -= 0.5;
    speed *= -0.3;
  }

  if (engineHealth <= 0 && !engineDestroyed) {
    engineHealth = 0;
    speed = 0;
    engineDestroyed = true;
    alert("Motor destruido 💥");
  }
}

function updateHUD() {
  if (hudSpeed) hudSpeed.innerText = Math.abs(speed * 100).toFixed(0);
  if (hudNitro) hudNitro.innerText = nitro.toFixed(0);
  if (hudEngine) hudEngine.innerText = engineHealth.toFixed(0);
}

function updateCamera() {
  const offset = new THREE.Vector3(
    Math.sin(car.rotation.y) * 12,
    6,
    Math.cos(car.rotation.y) * 12
  );

  camera.position.copy(car.position).add(offset);
  camera.lookAt(car.position);
}

function animate() {
  requestAnimationFrame(animate);
  updateCar();
  updateCamera();
  renderer.render(scene, camera);
}
