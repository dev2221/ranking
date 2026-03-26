/**
 * Calculate the average of an array of numbers
 * @param {number[]} values - Array of numbers
 * @returns {number} - Average value
 */
const calculateAverage = (values) => {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};

/**
 * Calculate intern's hard skills average
 * @param {Object} hardSkills - Object with logic, javascript, sql scores
 * @returns {number} - Average hard skills score
 */
const calculateHardSkillsAverage = (hardSkills) => {
  // Hard skills removed for CER-only ranking.
  // Keep for compatibility; always return 0 to avoid influencing scores.
  return 0;
};

/**
 * Calculate intern's soft skills average
 * @param {Object} softSkills - Object with communication, proactivity, teamwork scores
 * @returns {number} - Average soft skills score
 */
const calculateSoftSkillsAverage = (softSkills) => {
  const values = [
    softSkills.communication || 0,
    softSkills.proactivity || 0,
    softSkills.teamwork || 0,
  ];
  return calculateAverage(values);
};

/**
 * Calculate overall average score for an intern from all evaluations
 * @param {Object} intern - Intern object with evaluations array
 * @returns {number} - Overall average score
 */
const calculateInternScore = (intern) => {
  if (!intern.evaluations || intern.evaluations.length === 0) {
    return 0;
  }

  const allSoftSkillsScores = [];

  intern.evaluations.forEach((evaluation) => {
    const softSkillsScores = [
      evaluation.softSkills?.communication || 0,
      evaluation.softSkills?.proactivity || 0,
      evaluation.softSkills?.teamwork || 0,
    ];

    allSoftSkillsScores.push(...softSkillsScores);
  });

  return calculateAverage(allSoftSkillsScores);
};

/**
 * Get detailed breakdown of an intern's scores
 * @param {Object} intern - Intern object with evaluations array
 * @returns {Object} - Object with hardSkills, softSkills, and overall averages
 */
const getInternBreakdown = (intern) => {
  if (!intern.evaluations || intern.evaluations.length === 0) {
    return {
      hardSkills: { logic: 0, javascript: 0, sql: 0 },
      softSkills: { communication: 0, proactivity: 0, teamwork: 0 },
      hardSkillsAverage: 0,
      softSkillsAverage: 0,
      overallAverage: 0,
    };
  }

  let softSkillsTotals = { communication: 0, proactivity: 0, teamwork: 0 };
  let totalEvaluations = 0;

  intern.evaluations.forEach((evaluation) => {
    softSkillsTotals.communication += evaluation.softSkills?.communication || 0;
    softSkillsTotals.proactivity += evaluation.softSkills?.proactivity || 0;
    softSkillsTotals.teamwork += evaluation.softSkills?.teamwork || 0;

    totalEvaluations++;
  });

  const softSkillsAverages = {
    communication: softSkillsTotals.communication / totalEvaluations,
    proactivity: softSkillsTotals.proactivity / totalEvaluations,
    teamwork: softSkillsTotals.teamwork / totalEvaluations,
  };

  const softSkillsAverage = calculateAverage([
    softSkillsAverages.communication,
    softSkillsAverages.proactivity,
    softSkillsAverages.teamwork,
  ]);

  const overallAverage = softSkillsAverage;

  return {
    hardSkills: { logic: 0, javascript: 0, sql: 0 },
    softSkills: softSkillsAverages,
    hardSkillsAverage: 0,
    softSkillsAverage: Math.round(softSkillsAverage * 100) / 100,
    overallAverage: Math.round(overallAverage * 100) / 100,
  };
};

/**
 * Generate ranking list sorted by overall average (highest first)
 * @param {Object[]} interns - Array of intern objects
 * @returns {Object[]} - Sorted array with ranking info
 */
const generateRanking = (interns) => {
  const rankedInterns = interns.map((intern) => ({
    ...intern,
    breakdown: getInternBreakdown(intern),
    score: calculateInternScore(intern),
  }));

  // Sort by score descending
  rankedInterns.sort((a, b) => b.score - a.score);

  // Add ranking position
  return rankedInterns.map((intern, index) => ({
    ...intern,
    ranking: index + 1,
    score: Math.round(intern.score * 100) / 100,
  }));
};

module.exports = {
  calculateAverage,
  calculateHardSkillsAverage,
  calculateSoftSkillsAverage,
  calculateInternScore,
  getInternBreakdown,
  generateRanking,
};
