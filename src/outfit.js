import { setMessage } from './state.js';

export const topOptions = [
  { name: 'Crimson Tunic', primary: '#8f4a58', trim: '#efc36b', shape: 'balanced' },
  { name: 'Forest Jacket', primary: '#4b7655', trim: '#d9eb9d', shape: 'wide' },
  { name: 'Royal Guard', primary: '#445f9d', trim: '#f2d37a', shape: 'armored' },
  { name: 'Sun Scout', primary: '#b86d3f', trim: '#f3e5a1', shape: 'slim' },
  { name: 'Shadow Vest', primary: '#5c476e', trim: '#cfb8f0', shape: 'narrow' }
];

export const pantsOptions = [
  { name: 'Navy Pants', color: '#344f6d', fit: 1 },
  { name: 'Moss Pants', color: '#536c4e', fit: 1.12 },
  { name: 'Stone Pants', color: '#6a6670', fit: 1.22 },
  { name: 'Sand Pants', color: '#90734f', fit: 0.92 },
  { name: 'Berry Pants', color: '#70455a', fit: 1.05 }
];

const topShapes = {
  balanced: { body: 1, depth: 1, shoulders: 1, armWidth: 1 },
  wide: { body: 1.1, depth: 1.08, shoulders: 1.12, armWidth: 1.05 },
  armored: { body: 1.18, depth: 1.14, shoulders: 1.22, armWidth: 1.18 },
  slim: { body: 0.88, depth: 0.92, shoulders: 0.9, armWidth: 0.9 },
  narrow: { body: 0.96, depth: 0.86, shoulders: 0.96, armWidth: 0.82 }
};

export function setTopOption(state, index) {
  if (topOptions[index]) {
    state.player.outfit.topIndex = index;
  }
}

export function setPantsOption(state, index) {
  if (pantsOptions[index]) {
    state.player.outfit.pantsIndex = index;
  }
}

export function getSelectedTop(state) {
  return topOptions[state.player.outfit.topIndex] || topOptions[0];
}

export function getSelectedPants(state) {
  return pantsOptions[state.player.outfit.pantsIndex] || pantsOptions[0];
}

export function syncPlayerOutfit(state) {
  if (!state.player.outfitMaterials) {
    return;
  }

  const top = getSelectedTop(state);
  const pants = getSelectedPants(state);

  state.player.outfitMaterials.top.color.set(top.primary);
  state.player.outfitMaterials.trim.color.set(top.trim);
  state.player.outfitMaterials.pants.color.set(pants.color);
  syncOutfitShape(state, top, pants);
}

function syncOutfitShape(state, top, pants) {
  const parts = state.player.outfitParts;

  if (!parts) {
    return;
  }

  const shape = topShapes[top.shape] || topShapes.balanced;
  const pantsFit = pants.fit || 1;
  const shoulderX = 0.5 * shape.shoulders;
  const armX = 0.54 * shape.shoulders;
  const legX = 0.29 * pantsFit;

  parts.torso.scale.set(shape.body, 1, shape.depth);
  parts.chestWrap.scale.set(shape.body, 1, shape.depth);
  parts.belt.scale.set(shape.body, 1, shape.depth);
  parts.shoulderBar.scale.set(shape.shoulders, 1, shape.depth);

  parts.leftShoulderPad.position.x = -shoulderX;
  parts.rightShoulderPad.position.x = shoulderX;
  parts.leftShoulderPad.scale.set(shape.armWidth, 1, shape.depth);
  parts.rightShoulderPad.scale.set(shape.armWidth, 1, shape.depth);

  parts.leftArm.position.x = -armX;
  parts.rightArm.position.x = armX;
  parts.leftSleeve.position.x = -armX;
  parts.rightSleeve.position.x = armX;
  parts.leftBracer.position.x = -armX;
  parts.rightBracer.position.x = armX;

  parts.leftArm.scale.set(shape.armWidth, 1, shape.armWidth);
  parts.rightArm.scale.set(shape.armWidth, 1, shape.armWidth);
  parts.leftSleeve.scale.set(shape.armWidth, 1, shape.armWidth);
  parts.rightSleeve.scale.set(shape.armWidth, 1, shape.armWidth);
  parts.leftBracer.scale.set(shape.armWidth, 1, shape.armWidth);
  parts.rightBracer.scale.set(shape.armWidth, 1, shape.armWidth);

  parts.pantsWaist.scale.set(pantsFit, 1, pantsFit);
  parts.leftLeg.position.x = -legX;
  parts.rightLeg.position.x = legX;
  parts.leftBoot.position.x = -legX;
  parts.rightBoot.position.x = legX;
  parts.leftLeg.scale.set(pantsFit, 1, pantsFit);
  parts.rightLeg.scale.set(pantsFit, 1, pantsFit);
  parts.leftBoot.scale.set(pantsFit, 1, pantsFit);
  parts.rightBoot.scale.set(pantsFit, 1, pantsFit);
}

export function startGameWithOutfit(state) {
  state.player.rotationX = 0;
  state.player.rotationY = 0;
  state.mode = 'playing';
  setMessage(state, 'Outfit ready. Move with K, turn with J/L, and attack with Space.', 4);
}
