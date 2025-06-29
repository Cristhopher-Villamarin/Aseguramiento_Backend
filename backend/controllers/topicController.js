const { validationResult } = require('express-validator');
const topicService = require('../services/topicService');

const createTopic = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;
    const userId = req.user; // Obtenido de authMiddleware
    const topic = await topicService.createTopic(name, userId);
    res.status(201).json({ message: 'Tema creado exitosamente', topic });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getTopics = async (req, res) => {
  try {
    const userId = req.user; // Obtenido de authMiddleware
    const topics = await topicService.getTopics(userId);
    res.status(200).json({ topics });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTopic = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { topicId } = req.params;
    const { name } = req.body;
    const userId = req.user; // Obtenido de authMiddleware
    const topic = await topicService.updateTopic(topicId, name, userId);
    res.status(200).json({ message: 'Tema actualizado exitosamente', topic });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    const userId = req.user; // Obtenido de authMiddleware
    await topicService.deleteTopic(topicId, userId);
    res.status(200).json({ message: 'Tema eliminado exitosamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createTopic, getTopics, updateTopic, deleteTopic };