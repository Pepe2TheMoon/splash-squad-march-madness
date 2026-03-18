export function runMonteCarloSim(t1, t2, vars, numSims) {
  const results = { t1Wins: 0, t2Wins: 0, margins: [], t1Points: [], t2Points: [] };
  const computePower = (t) => (
    t.off * vars.offEffWeight + (130 - t.def) * vars.defEffWeight +
    t.tempo * vars.tempoFactor * 0.1 + t.ft * vars.ftRate * 50 +
    t.three * vars.threePtWeight * 80 + t.reb * vars.reboundMargin * 2 -
    t.tov * vars.turnoverPenalty * 1.5
  );
  for (let i = 0; i < numSims; i++) {
    const powerDiff = computePower(t1) - computePower(t2);
    const seedBonus = (t2.seed - t1.seed) * vars.seedAdvantage * 1.5;
    const chaos = (Math.random() - 0.5) * vars.upsetModifier * 60;
    const momentum = (Math.random() - 0.5) * vars.momentumFactor * 20;
    const clutch = (Math.random() - 0.5) * vars.clutchFactor * 15;
    const totalDiff = (powerDiff + seedBonus + chaos + momentum + clutch) * 0.15;
    const basePoints = 68 + ((t1.tempo + t2.tempo) / 2 - 67) * 0.4;
    const s1 = Math.round(basePoints + totalDiff / 2 + (Math.random() - 0.5) * 18);
    const s2 = Math.round(basePoints - totalDiff / 2 + (Math.random() - 0.5) * 18);
    if (s1 > s2) results.t1Wins++; else if (s2 > s1) results.t2Wins++;
    else { results.t1Wins += 0.5; results.t2Wins += 0.5; }
    results.margins.push(s1 - s2); results.t1Points.push(s1); results.t2Points.push(s2);
  }
  return results;
}

export function computeSimStats(results, numSims) {
  const avgMargin = results.margins.reduce((a, b) => a + b, 0) / numSims;
  const avgT1 = results.t1Points.reduce((a, b) => a + b, 0) / numSims;
  const avgT2 = results.t2Points.reduce((a, b) => a + b, 0) / numSims;
  const t1WinPct = (results.t1Wins / numSims) * 100;
  const t2WinPct = (results.t2Wins / numSims) * 100;
  const marginStd = Math.sqrt(results.margins.reduce((sum, m) => sum + Math.pow(m - avgMargin, 2), 0) / numSims);
  return { avgMargin, avgT1, avgT2, t1WinPct, t2WinPct, marginStd };
}
