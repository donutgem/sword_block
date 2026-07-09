import QuestLeaderboard from 'https://app.joinquest.com/student-deploy/quest-leaderboard.mjs';

const leaderboardConfigs = {
  blocks: {
    leaderboardKey: 'blocks-defeated',
    leaderboardName: 'Most Blocks Defeated',
    scoreLabel: 'blocks',
    order: 'desc'
  },
  fastest: {
    leaderboardKey: 'fastest-time',
    leaderboardName: 'Fastest Completion',
    scoreLabel: 'seconds',
    order: 'asc'
  }
};

export async function loadLeaderboard(state, type = 'blocks') {
  state.leaderboard.status = 'loading';
  const config = leaderboardConfigs[type];

  try {
    const result = await QuestLeaderboard.loadTop({
      ...config,
      limit: 10
    });

    if (type === 'blocks') {
      state.leaderboard.blocksEntries = result.entries || [];
    } else {
      state.leaderboard.fastestEntries = result.entries || [];
    }
    
    state.leaderboard.selectedType = type;
    state.leaderboard.status = 'ready';
  } catch (error) {
    state.leaderboard.status = 'unavailable';
  }
}

export function switchLeaderboard(state, type) {
  state.leaderboard.selectedType = type;
}

export function getDisplayEntries(state) {
  if (state.leaderboard.selectedType === 'blocks') {
    return state.leaderboard.blocksEntries;
  } else {
    return state.leaderboard.fastestEntries;
  }
}

export async function submitWaveScore(state, elapsedTime) {
  const blocksScore = state.score.blocksDefeated;
  const playerName = getPlayerName(state);

  // Submit blocks defeated (highest is better)
  if (blocksScore > state.leaderboard.lastSubmittedScore) {
    state.leaderboard.lastSubmittedScore = blocksScore;
    state.leaderboard.status = 'submitting';

    try {
      const config = leaderboardConfigs.blocks;
      await QuestLeaderboard.submitScore({
        ...config,
        playerName,
        score: blocksScore,
        displayScore: `${blocksScore} blocks`
      });
    } catch (error) {
      state.leaderboard.status = 'unavailable';
    }
  }

  // Submit fastest time (lowest is better)
  try {
    const config = leaderboardConfigs.fastest;
    const timeInSeconds = Math.round(elapsedTime);
    
    await QuestLeaderboard.submitScore({
      ...config,
      playerName,
      score: timeInSeconds,
      displayScore: formatTime(elapsedTime)
    });
  } catch (error) {
    state.leaderboard.status = 'unavailable';
  }

  // Reload leaderboards
  await loadLeaderboard(state, 'blocks');
  await loadLeaderboard(state, 'fastest');
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getPlayerName(state) {
  return state.leaderboard.playerName.trim() || 'Player';
}
