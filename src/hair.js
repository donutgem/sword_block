import * as THREE from 'three';

export const hairOptions = [
  { name: 'Raised Cut', swatch: '#3a2618' },
  { name: 'Bowl Cut', swatch: '#553421' },
  { name: 'Mohawk', swatch: '#222936' },
  { name: 'Long Sweep', swatch: '#2f221c' },
  { name: 'Soft Waves', swatch: '#4c3326' }
];

export function setHairOption(state, index) {
  if (hairOptions[index]) {
    state.player.outfit.hairIndex = index;
  }
}

export function getSelectedHair(state) {
  return hairOptions[state.player.outfit.hairIndex] || hairOptions[0];
}

export function createHairStyles(state) {
  const hairRoot = new THREE.Group();
  hairRoot.name = 'hair-styles';
  hairRoot.add(
    createRaisedCut(),
    createBowlCut(),
    createMohawk(),
    createLongSweep(),
    createSoftWaves()
  );
  state.player.hairStyles = hairRoot.children;
  syncPlayerHair(state);
  return hairRoot;
}

export function syncPlayerHair(state) {
  if (!state.player.hairStyles) {
    return;
  }

  state.player.hairStyles.forEach((style, index) => {
    style.visible = index === state.player.outfit.hairIndex;
  });
}

function createRaisedCut() {
  const group = new THREE.Group();
  const material = createHairMaterial(hairOptions[0].swatch);
  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(0.45, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5),
    material
  );
  cap.position.y = 2.5;
  group.add(cap);
  return group;
}

function createBowlCut() {
  const group = new THREE.Group();
  const material = createHairMaterial(hairOptions[1].swatch);
  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(0.43, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.58),
    material
  );
  cap.position.y = 2.53;
  group.add(cap);

  const back = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.28, 0.16, 10),
    material
  );
  back.position.set(0, 2.44, 0.28);
  group.add(back);
  return group;
}

function createMohawk() {
  const group = new THREE.Group();
  const material = createHairMaterial(hairOptions[2].swatch);
  [-0.25, 0, 0.25].forEach((z, index) => {
    const spike = new THREE.Mesh(
      new THREE.ConeGeometry(0.16, index === 1 ? 0.55 : 0.46, 6),
      material
    );
    spike.position.set(0, index === 1 ? 2.82 : 2.76, z);
    group.add(spike);
  });
  return group;
}

function createLongSweep() {
  const group = new THREE.Group();
  const material = createHairMaterial(hairOptions[3].swatch);
  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(0.44, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.58),
    material
  );
  cap.position.y = 2.53;
  group.add(cap);

  const sweep = new THREE.Mesh(
    new THREE.BoxGeometry(0.52, 0.14, 0.12),
    material
  );
  sweep.position.set(0.06, 2.48, -0.34);
  sweep.rotation.z = -0.16;
  group.add(sweep);

  const back = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.3, 0.28, 12),
    material
  );
  back.position.set(0, 2.34, 0.25);
  group.add(back);
  return group;
}

function createSoftWaves() {
  const group = new THREE.Group();
  const material = createHairMaterial(hairOptions[4].swatch);
  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(0.44, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.58),
    material
  );
  cap.position.y = 2.52;
  group.add(cap);

  const back = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.4, 0.66, 14),
    material
  );
  back.position.set(0, 2.16, 0.26);
  group.add(back);

  [-0.28, 0.28].forEach((x) => {
    const side = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.52, 0.18),
      material
    );
    side.position.set(x, 2.24, 0.08);
    side.rotation.z = x > 0 ? -0.08 : 0.08;
    group.add(side);
  });

  return group;
}

function createHairMaterial(color) {
  return new THREE.MeshStandardMaterial({ color });
}
