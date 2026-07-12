const { EmissionFactor } = require('../models');

/**
 * Calculates CO2e for a given emission factor + quantity.
 */
async function calculateCo2e(emissionFactorId, quantity) {
  const factor = await EmissionFactor.findByPk(emissionFactorId);
  if (!factor) {
    const err = new Error('Emission factor not found');
    err.status = 404;
    throw err;
  }
  const co2e = Number(factor.co2e_per_unit) * Number(quantity);
  return { co2e: Number(co2e.toFixed(4)), factor };
}

module.exports = { calculateCo2e };
