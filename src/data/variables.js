export const DEFAULT_VARS = {
  offEffWeight: 0.85, defEffWeight: 0.90, tempoFactor: 0.30,
  seedAdvantage: 0.65, sosWeight: 0.70, momentumFactor: 0.45,
  upsetModifier: 0.20, travelFactor: 0.15, coachExpWeight: 0.40,
  clutchFactor: 0.35, ftRate: 0.25, threePtWeight: 0.50,
  reboundMargin: 0.55, turnoverPenalty: 0.60, benchDepth: 0.30,
  injuryImpact: 0.75, publicSentiment: 0.10, sharpMoney: 0.45,
};

export const VAR_META = {
  offEffWeight: { label: "Off Efficiency", group: "Core", desc: "Adjusted offensive efficiency weight" },
  defEffWeight: { label: "Def Efficiency", group: "Core", desc: "Adjusted defensive efficiency weight" },
  tempoFactor: { label: "Tempo", group: "Core", desc: "Pace differential" },
  seedAdvantage: { label: "Seed Advantage", group: "Tournament", desc: "Historical seed advantage" },
  sosWeight: { label: "SOS", group: "Core", desc: "Strength of schedule" },
  momentumFactor: { label: "Momentum", group: "Intangibles", desc: "Recent form" },
  upsetModifier: { label: "Upset Chaos", group: "Tournament", desc: "March Madness chaos" },
  travelFactor: { label: "Travel/Rest", group: "Tournament", desc: "Distance & rest" },
  coachExpWeight: { label: "Coaching Exp", group: "Intangibles", desc: "Tournament pedigree" },
  clutchFactor: { label: "Clutch", group: "Intangibles", desc: "Close-game execution" },
  ftRate: { label: "FT Rate", group: "Shooting", desc: "Free throw pressure" },
  threePtWeight: { label: "3PT", group: "Shooting", desc: "3PT efficiency" },
  reboundMargin: { label: "Rebounds", group: "Core", desc: "Rebounding edge" },
  turnoverPenalty: { label: "Turnovers", group: "Core", desc: "Turnover penalty" },
  benchDepth: { label: "Bench Depth", group: "Intangibles", desc: "Rotation depth" },
  injuryImpact: { label: "Injury Impact", group: "Tournament", desc: "Injury adjustments" },
  publicSentiment: { label: "Public Sent.", group: "Market", desc: "Public betting contrarian" },
  sharpMoney: { label: "Sharp Money", group: "Market", desc: "Pro line movement" },
};
