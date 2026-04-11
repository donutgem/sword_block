import * as THREE from 'three';

const desiredCameraPosition = new THREE.Vector3();
const desiredLookTarget = new THREE.Vector3();
const cameraLocalOffset = new THREE.Vector3(0.7, 2.7, 3.2);
const lookLocalOffset = new THREE.Vector3(0.35, 2.0, -8);

export function createSceneApp(state) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#9edcff');
  scene.fog = new THREE.Fog('#9edcff', 26, 58);

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 7, 15);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setSize(window.innerWidth, window.innerHeight);

  addLights(scene);
  addArena(scene, state);
  addForge(scene, state);

  return { scene, camera, renderer };
}

export function updateCamera(camera, state) {
  desiredCameraPosition.copy(cameraLocalOffset);
  state.player.object.localToWorld(desiredCameraPosition);

  desiredLookTarget.copy(lookLocalOffset);
  state.player.object.localToWorld(desiredLookTarget);

  camera.position.copy(desiredCameraPosition);
  camera.lookAt(desiredLookTarget);
}

function addLights(scene) {
  const ambientLight = new THREE.AmbientLight('#ffffff', 0.42);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight('#fff5d8', 1.15);
  directionalLight.position.set(6, 12, 8);
  scene.add(directionalLight);
}

function addArena(scene, state) {
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(42, 42),
    new THREE.MeshStandardMaterial({ color: '#739f73' })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  const grid = new THREE.GridHelper(40, 20, '#466554', '#63856f');
  grid.position.y = 0.02;
  scene.add(grid);

  const axes = new THREE.AxesHelper(2.4);
  axes.position.set(0, 0.04, 0);
  scene.add(axes);

  const calibrationCube = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 1.4, 1.4),
    new THREE.MeshStandardMaterial({ color: '#f6f7fb' })
  );
  calibrationCube.position.set(-state.arena.halfSize + 3, 0.7, state.arena.halfSize - 3);
  scene.add(calibrationCube);

  const wallMaterial = new THREE.MeshStandardMaterial({ color: '#7f6758' });
  const northWall = new THREE.Mesh(
    new THREE.BoxGeometry(42, 1.5, 1),
    wallMaterial
  );
  northWall.position.set(0, 0.75, -state.arena.halfSize - 0.5);
  scene.add(northWall);

  const southWall = northWall.clone();
  southWall.position.z = state.arena.halfSize + 0.5;
  scene.add(southWall);

  const eastWall = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1.5, 42),
    wallMaterial
  );
  eastWall.position.set(state.arena.halfSize + 0.5, 0.75, 0);
  scene.add(eastWall);

  const westWall = eastWall.clone();
  westWall.position.x = -state.arena.halfSize - 0.5;
  scene.add(westWall);
}

function addForge(scene, state) {
  const forge = new THREE.Group();
  forge.position.copy(state.forge.position);

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(1.2, 1.6, 0.8, 10),
    new THREE.MeshStandardMaterial({ color: '#53616f' })
  );
  base.position.y = 0.4;
  forge.add(base);

  const top = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.35, 1.1),
    new THREE.MeshStandardMaterial({ color: '#9ea7b0' })
  );
  top.position.y = 1;
  forge.add(top);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.6, 0.08, 10, 30),
    new THREE.MeshStandardMaterial({ color: '#f0b253', emissive: '#e68e1a' })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.15;
  forge.add(ring);

  scene.add(forge);
  state.forge.object = forge;
}
