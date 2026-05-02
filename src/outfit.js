import { setMessage } from './state.js';

export const topOptions = [
  { name: 'Crimson Tunic', primary: '#8f4a58', trim: '#efc36b' },
  { name: 'Forest Jacket', primary: '#4b7655', trim: '#d9eb9d' },
  { name: 'Royal Guard', primary: '#445f9d', trim: '#f2d37a' },
  { name: 'Sun Scout', primary: '#b86d3f', trim: '#f3e5a1' },
  { name: 'Shadow Vest', primary: '#5c476e', trim: '#cfb8f0' }
];

export const pantsOptions = [
  { name: 'Navy Pants', color: '#344f6d' },
  { name: 'Moss Pants', color: '#536c4e' },
  { name: 'Stone Pants', color: '#6a6670' },
  { name: 'Sand Pants', color: '#90734f' },
  { name: 'Berry Pants', color: '#70455a' }
];

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
}

export function startGameWithOutfit(state) {
  state.mode = 'playing';
  setMessage(state, 'Outfit ready. Move with K, turn with J/L, and attack with Space.', 4);
}
