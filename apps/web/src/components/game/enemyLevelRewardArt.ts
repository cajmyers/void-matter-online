import level1RewardArt from "../../assets/icons/level1.webp";
import level2RewardArt from "../../assets/icons/level2.webp";
import level3RewardArt from "../../assets/icons/level3.webp";

/** Owner icons: stacked face-down reward cards + level label, on `EnemyCard` art cost rail (`DCK-3`). */
const enemyLevelRewardArtByTier: Readonly<Record<1 | 2 | 3, string>> = {
  1: level1RewardArt,
  2: level2RewardArt,
  3: level3RewardArt,
};

/** Pixel height ÷ width for `assets/icons/level{1,2,3}.webp` (all three match). */
export const enemyLevelRewardArtAspectHeightOverWidth = 718 / 952;

export function enemyLevelRewardArt(tier: 1 | 2 | 3): string {
  return enemyLevelRewardArtByTier[tier];
}