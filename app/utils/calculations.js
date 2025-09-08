export const calculateSummaryStats = (goatData) => {
  const avgSitting = (goatData.reduce((sum, goat) => sum + goat.sitting, 0) / goatData.length).toFixed(1);
  const avgStanding = (goatData.reduce((sum, goat) => sum + goat.standing, 0) / goatData.length).toFixed(1);
  const avgTemperature = (goatData.reduce((sum, goat) => sum + parseFloat(goat.temperature), 0) / goatData.length).toFixed(1);

  return {
    avgSitting,
    avgStanding,
    avgTemperature
  };
};