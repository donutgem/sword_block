import * as THREE from 'three';

const desiredCameraPosition = new THREE.Vector3();
const desiredLookTarget = new THREE.Vector3();
const cameraLocalOffset = new THREE.Vector3(0.7, 2.7, 3.2);
const lookLocalOffset = new THREE.Vector3(0.35, 2.0, -8);
const outfitCameraOffset = new THREE.Vector3(0, 1.45, -6.2);
const outfitLookOffset = new THREE.Vector3(0, 1.25, 0);

export function createSceneApp(state) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#8fc7df');
  scene.fog = new THREE.Fog('#8fc7df', 30, 62);

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
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(window.innerWidth, window.innerHeight);

  addLights(scene);
  addArena(scene, state);
  addForge(scene, state);

  return { scene, camera, renderer };
}

export function updateCamera(camera, state) {
  const isChoosingOutfit = state.mode === 'customize';
  const positionOffset = isChoosingOutfit ? outfitCameraOffset : cameraLocalOffset;
  const targetOffset = isChoosingOutfit ? outfitLookOffset : lookLocalOffset;

  if (isChoosingOutfit) {
    desiredCameraPosition.copy(positionOffset);
    desiredCameraPosition.add(state.player.position);

    desiredLookTarget.copy(targetOffset);
    desiredLookTarget.add(state.player.position);
  } else {
    desiredCameraPosition.copy(positionOffset);
    state.player.object.localToWorld(desiredCameraPosition);

    desiredLookTarget.copy(targetOffset);
    state.player.object.localToWorld(desiredLookTarget);
  }

  camera.position.copy(desiredCameraPosition);
  camera.lookAt(desiredLookTarget);
}

function addLights(scene) {
  const fillLight = new THREE.HemisphereLight('#dcefff', '#5d4d3d', 0.78);
  scene.add(fillLight);

  const directionalLight = new THREE.DirectionalLight('#fff2d6', 2.45);
  directionalLight.position.set(9, 15, 6);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.set(2048, 2048);
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 42;
  directionalLight.shadow.camera.left = -22;
  directionalLight.shadow.camera.right = 22;
  directionalLight.shadow.camera.top = 22;
  directionalLight.shadow.camera.bottom = -22;
  directionalLight.shadow.bias = -0.001;
  directionalLight.shadow.normalBias = 0.025;
  scene.add(directionalLight);
}

function addArena(scene, state) {
  const groundTexture = createGroundTexture();
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(42, 42),
    new THREE.MeshStandardMaterial({
      color: '#79a95d',
      map: groundTexture,
      roughness: 0.96,
      metalness: 0
    })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.rotation.z = Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const wallMaterial = new THREE.MeshStandardMaterial({
    color: '#9d6747',
    roughness: 0.88,
    metalness: 0
  });
  const northWall = new THREE.Mesh(
    new THREE.BoxGeometry(42, 1.5, 1),
    wallMaterial
  );
  northWall.position.set(0, 0.75, -state.arena.halfSize - 0.5);
  northWall.castShadow = true;
  northWall.receiveShadow = true;
  scene.add(northWall);

  const southWall = northWall.clone();
  southWall.position.z = state.arena.halfSize + 0.5;
  scene.add(southWall);

  const eastWall = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1.5, 42),
    wallMaterial
  );
  eastWall.position.set(state.arena.halfSize + 0.5, 0.75, 0);
  eastWall.castShadow = true;
  eastWall.receiveShadow = true;
  scene.add(eastWall);

  const westWall = eastWall.clone();
  westWall.position.x = -state.arena.halfSize - 0.5;
  scene.add(westWall);
}

function createGroundTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;

  const context = canvas.getContext('2d');
  context.fillStyle = '#719d56';
  context.fillRect(0, 0, canvas.width, canvas.height);

  const grassColors = ['#557c42', '#88ad68', '#668d4c'];
  for (let index = 0; index < 520; index += 1) {
    const x = (index * 47) % canvas.width;
    const y = (index * 83 + index * index * 7) % canvas.height;
    context.fillStyle = grassColors[index % grassColors.length];
    context.globalAlpha = 0.2 + (index % 4) * 0.08;
    context.fillRect(x, y, 1, 1 + (index % 3));
  }
  context.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 12);
  return texture;
}

function addForge(scene, state) {
  const forge = new THREE.Group();
  forge.position.copy(state.forge.position);

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(1.2, 1.6, 0.8, 10),
    new THREE.MeshStandardMaterial({ color: '#355a78' })
  );
  base.position.y = 0.4;
  forge.add(base);

  const top = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.35, 1.1),
    new THREE.MeshStandardMaterial({ color: '#d2e7f5' })
  );
  top.position.y = 1;
  forge.add(top);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.6, 0.08, 10, 30),
    new THREE.MeshStandardMaterial({
      color: '#ffd22e',
      emissive: '#ff6a00',
      emissiveIntensity: 0.75
    })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.15;
  forge.add(ring);

  forge.traverse((mesh) => {
    if (mesh.isMesh) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
  });

  scene.add(forge);
  state.forge.object = forge;
}
