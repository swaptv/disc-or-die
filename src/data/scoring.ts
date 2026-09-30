export const scoring = {
  love: { onceMore: 75, manyTimes: 95, curious: 75, someday: 35, favoriteBonus: 10 },
  fomo: { independentDesire: 15, urgency: 85 },
  rarity: { available: 20, scarce: 90 },
  value: { fair: 85, expensive: 25 },
  weights: { love: 0.5, desire: 0.25, value: 0.2, rarity: 0.05 },
  thresholds: { buy: 72, waitLove: 50 },
} as const;
