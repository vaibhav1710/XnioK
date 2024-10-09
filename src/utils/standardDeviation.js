/**
 * Calculates the standard deviation of an array of numbers.
 * @param {Number[]} prices - Array of prices.
 * @returns {Number} - The calculated standard deviation.
 */
function calculateStandardDeviation(prices) {
  if (prices.length === 0) return 0;

  const mean = prices.reduce((sum, value) => sum + value, 0) / prices.length;
  const variance =
    prices.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
    prices.length;

  return parseFloat(Math.sqrt(variance).toFixed(2)); // Return the standard deviation rounded to 2 decimal places
}

module.exports = {
  calculateStandardDeviation,
};
