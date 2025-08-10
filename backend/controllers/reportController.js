// reportController.js
const { validationResult } = require('express-validator');
const reportService = require('../services/reportService');

const createReport = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, url, comments } = req.body;
    const { topicId } = req.params;
    const userId = req.user; // Obtenido de authMiddleware
    const report = await reportService.createReport(title, topicId, userId, url, comments);
    res.status(201).json({ message: 'Reporte creado exitosamente', report });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getReports = async (req, res) => {
  try {
    const { topicId } = req.params;
    const userId = req.user; // Obtenido de authMiddleware
    const reports = await reportService.getReports(topicId, userId);
    res.status(200).json({ reports });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateReport = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { reportId, topicId } = req.params;
    const { title } = req.body;
    const userId = req.user; // Obtenido de authMiddleware
    const report = await reportService.updateReport(reportId, topicId, title, userId);
    res.status(200).json({ message: 'Reporte actualizado exitosamente', report });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteReport = async (req, res) => {
  try {
    const { reportId, topicId } = req.params;
    const userId = req.user; // Obtenido de authMiddleware
    await reportService.deleteReport(reportId, topicId, userId);
    res.status(200).json({ message: 'Reporte eliminado exitosamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createReport, getReports, updateReport, deleteReport };