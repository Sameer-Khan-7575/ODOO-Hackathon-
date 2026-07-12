const { getConfig } = require('../services/scoring.service');
const { EsgConfig } = require('../models');

async function get(req, res, next) {
  try {
    const config = await getConfig();
    res.json(config);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { env_weight, social_weight, governance_weight, auto_emission_calc, evidence_required, badge_auto_award } = req.body;

    if (env_weight != null && social_weight != null && governance_weight != null) {
      const sum = Number(env_weight) + Number(social_weight) + Number(governance_weight);
      if (Math.abs(sum - 100) > 0.01) {
        return res.status(400).json({ message: 'Weights must sum to 100' });
      }
    }

    const config = await getConfig();
    await config.update({
      ...(env_weight != null && { env_weight }),
      ...(social_weight != null && { social_weight }),
      ...(governance_weight != null && { governance_weight }),
      ...(auto_emission_calc != null && { auto_emission_calc }),
      ...(evidence_required != null && { evidence_required }),
      ...(badge_auto_award != null && { badge_auto_award }),
    });

    res.json(config);
  } catch (err) {
    next(err);
  }
}

module.exports = { get, update };
