const request = require('supertest');
const express = require('express');
jest.mock('../../config/firebase'); // Mock de Firebase
jest.mock('express-validator'); // Mock completo de express-validator
jest.mock('../../services/topicService'); // Mock de topicService

const { createTopic, getTopics, updateTopic, deleteTopic } = require('../../controllers/topicController');
const topicService = require('../../services/topicService');

// Configurar una app Express para pruebas
const app = express();
app.use(express.json());

// Middleware simulado para establecer req.user
app.use((req, res, next) => {
  req.user = 'user-123'; // Simula el userId obtenido de authMiddleware
  next();
});

// Rutas para cada método
app.post('/api/topics', [
  (req, res, next) => {
    req.body = { name: 'Test Topic' };
    next();
  },
], createTopic);

app.get('/api/topics', getTopics);

app.put('/api/topics/:topicId', [
  (req, res, next) => {
    req.params.topicId = 'topic-123';
    req.body = { name: 'Updated Topic' };
    next();
  },
], updateTopic);

app.delete('/api/topics/:topicId', [
  (req, res, next) => {
    req.params.topicId = 'topic-123';
    next();
  },
], deleteTopic);

describe('Topic Controller', () => {
  let validationResultMock;

  beforeEach(() => {
    // Configurar mock de validationResult
    validationResultMock = require('express-validator').validationResult;
    validationResultMock.mockReturnValue({ isEmpty: () => true, array: () => [] });

    // Configurar mocks de topicService
    topicService.createTopic.mockResolvedValue({
      id: 'topic-123',
      name: 'Test Topic',
      userId: 'user-123',
    });
    topicService.getTopics.mockResolvedValue([
      { id: 'topic-123', name: 'Test Topic', userId: 'user-123' },
    ]);
    topicService.updateTopic.mockResolvedValue({
      id: 'topic-123',
      name: 'Updated Topic',
      userId: 'user-123',
    });
    topicService.deleteTopic.mockResolvedValue();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/topics should return 201 on successful topic creation', async () => {
    const response = await request(app)
      .post('/api/topics')
      .send({ name: 'Test Topic' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'Tema creado exitosamente',
      topic: { id: 'topic-123', name: 'Test Topic', userId: 'user-123' },
    });
    expect(topicService.createTopic).toHaveBeenCalledWith('Test Topic', 'user-123');
  });

  test('GET /api/topics should return 200 with topic list', async () => {
    const response = await request(app)
      .get('/api/topics');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      topics: [{ id: 'topic-123', name: 'Test Topic', userId: 'user-123' }],
    });
    expect(topicService.getTopics).toHaveBeenCalledWith('user-123');
  });

  test('PUT /api/topics/:topicId should return 200 on successful topic update', async () => {
    const response = await request(app)
      .put('/api/topics/topic-123')
      .send({ name: 'Updated Topic' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Tema actualizado exitosamente',
      topic: { id: 'topic-123', name: 'Updated Topic', userId: 'user-123' },
    });
    expect(topicService.updateTopic).toHaveBeenCalledWith('topic-123', 'Updated Topic', 'user-123');
  });

  test('DELETE /api/topics/:topicId should return 200 on successful topic deletion', async () => {
    const response = await request(app)
      .delete('/api/topics/topic-123');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Tema eliminado exitosamente',
    });
    expect(topicService.deleteTopic).toHaveBeenCalledWith('topic-123', 'user-123');
  });
});