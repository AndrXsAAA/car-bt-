import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161/build/three.module.js";

let scene, camera, renderer;
let car;
let speed = 0;
let maxSpeed = 1.5;
let acceleration = 0.02;
let friction = 0.01;
let turnSpeed = 0.03;

const keys = {};

init();
animate();

function init() {

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Luz
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 7);
  scene.add(light);

  // Suelo
  const groundGeometry = new THREE.PlaneGeometry(200, 200);
  const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // Carro (placeholder)
  const carGeometry = new THREE.BoxGeometry(2, 1, 4);
  const carMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  car = new THREE.Mesh(carGeometry, carMaterial);
  car.position.y = 0.5;
  scene.add(car);

  camera.position.set(0, 5, -10);

  window.addEventListener("keydown", (e) => keys[e.key] = true);
  window.addEventListener("keyup", (e) => keys[e.key] = false);
}

function updateCar() {

  if (keys["w"]) {
    speed += acceleration;
  }

  if (keys["s"]) {
    speed -= acceleration;
  }

  if (keys["a"]) {
    car.rotation.y += turnSpeed;
  }

  if (keys["d"]) {
    car.rotation.y -= turnSpeed;
  }

  // Limitar velocidad
  speed = Math.max(-maxSpeed, Math.min(maxSpeed, speed));

  // Fricción
  if (!keys["w"] && !keys["s"]) {
    if (speed > 0) speed -= friction;
    if (speed < 0) speed += friction;
  }

  // Movimiento real basado en rotación
  car.position.x -= Math.sin(car.rotation.y) * speed;
  car.position.z -= Math.cos(car.rotation.y) * speed;
}

function updateCamera() {

  const offset = new THREE.Vector3(
    Math.sin(car.rotation.y) * 10,
    5,
    Math.cos(car.rotation.y) * 10
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
