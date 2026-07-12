const { CarbonTransaction, EmissionFactor } = require('../models');
const { calculateCo2e } = require('../services/carbonCalc.service');

async function listTransactions(req, res, next) {
  try {
    const { department_id, source_type, from, to } = req.query;
    const where = {};
    if (department_id) where.department_id = department_id;
    if (source_type) where.source_type = source_type;
    if (from || to) {
      const { Op } = require('sequelize');
      where.transaction_date = {};
      if (from) where.transaction_date[Op.gte] = from;
      if (to) where.transaction_date[Op.lte] = to;
    }

    const transactions = await CarbonTransaction.findAll({
      where,
      include: [{ model: EmissionFactor }],
      order: [['transaction_date', 'DESC']],
    });
    res.json(transactions);
  } catch (err) {
    next(err);
  }
}

async function createTransaction(req, res, next) {
  try {
    const { source_type, source_reference_id, emission_factor_id, quantity, department_id, transaction_date } = req.body;

    if (!source_type || !emission_factor_id || quantity == null) {
      return res.status(400).json({ message: 'source_type, emission_factor_id and quantity are required' });
    }

    const { co2e } = await calculateCo2e(emission_factor_id, quantity);

    const transaction = await CarbonTransaction.create({
      source_type,
      source_reference_id,
      emission_factor_id,
      quantity,
      calculated_co2e: co2e,
      department_id,
      transaction_date,
    });

    res.status(201).json(transaction);
  } catch (err) {
    next(err);
  }
}

async function listEmissionFactors(req, res, next) {
  try {
    const factors = await EmissionFactor.findAll();
    res.json(factors);
  } catch (err) {
    next(err);
  }
}

module.exports = { listTransactions, createTransaction, listEmissionFactors };
