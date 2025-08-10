const request = require('supertest');
const express = require('express');
jest.mock('../../config/firebase'); // Mock de Firebase
jest.mock('express-validator'); // Mock completo de express-validator
jest.mock('../../services/reportService'); // Mock de reportService

const { createReport, getReports, updateReport, deleteReport } = require('../../controllers/reportController');
const reportService = require('../../services/reportService');

// Configurar una app Express para pruebas
const app = express();
app.use(express.json());

// Middleware simulado para establecer req.user
app.use((req, res, next) => {
  req.user = 'user-123'; // Simula el userId obtenido de authMiddleware
  next();
});

// Rutas para cada método
app.post('/api/topics/:topicId/reports', [
  (req, res, next) => {
    req.params.topicId = 'topic-123';
    req.body = { title: 'Test Report', url: 'https://example.com', comments: ['comment1'] };
    next();
  },
], createReport);

app.get('/api/topics/:topicId/reports', [
  (req, res, next) => {
    req.params.topicId = 'topic-123';
    next();
  },
], getReports);

app.put('/api/topics/:topicId/reports/:reportId', [
  (req, res, next) => {
    req.params.topicId = 'topic-123';
    req.params.reportId = 'report-123';
    req.body = { title: 'Updated Report' };
    next();
  },
], updateReport);

app.delete('/api/topics/:topicId/reports/:reportId', [
  (req, res, next) => {
    req.params.topicId = 'topic-123';
    req.params.reportId = 'report-123';
    next();
  },
], deleteReport);

describe('Report Controller', () => {
  let validationResultMock;

  beforeEach(() => {
    // Configurar mock de validationResult
    validationResultMock = require('express-validator').validationResult;
    validationResultMock.mockReturnValue({ isEmpty: () => true, array: () => [] });

    // Configurar mocks de reportService
    reportService.createReport.mockResolvedValue({
      id: 'report-123',
      title: 'Test Report',
      topicId: 'topic-123',
      userId: 'user-123',
      url: 'https://example.com',
      comments: ['comment1'],
    });
    reportService.getReports.mockResolvedValue([
      {
        id: 'report-123',
        title: 'Test Report',
        topicId: 'topic-123',
        userId: 'user-123',
        url: 'https://example.com',
        comments: ['comment1'],
      },
    ]);
    reportService.updateReport.mockResolvedValue({
      id: 'report-123',
      title: 'Updated Report',
      topicId: 'topic-123',
      userId: 'user-123',
      url: 'https://example.com',
      comments: ['comment1'],
    });
    reportService.deleteReport.mockResolvedValue();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/topics/:topicId/reports should return 201 on successful report creation', async () => {
    const response = await request(app)
      .post('/api/topics/topic-123/reports')
      .send({ title: 'Test Report', url: 'https://example.com', comments: ['comment1'] });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'Reporte creado exitosamente',
      report: {
        id: 'report-123',
        title: 'Test Report',
        topicId: 'topic-123',
        userId: 'user-123',
        url: 'https://example.com',
        comments: ['comment1'],
      },
    });
    expect(reportService.createReport).toHaveBeenCalledWith(
      'Test Report',
      'topic-123',
      'user-123',
      'https://example.com',
      ['comment1'],
    );
  });

  test('GET /api/topics/:topicId/reports should return 200 with report list', async () => {
    const response = await request(app)
      .get('/api/topics/topic-123/reports');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      reports: [
        {
          id: 'report-123',
          title: 'Test Report',
          topicId: 'topic-123',
          userId: 'user-123',
          url: 'https://example.com',
          comments: ['comment1'],
        },
      ],
    });
    expect(reportService.getReports).toHaveBeenCalledWith('topic-123', 'user-123');
  });

  test('PUT /api/topics/:topicId/reports/:reportId should return 200 on successful report update', async () => {
    const response = await request(app)
      .put('/api/topics/topic-123/reports/report-123')
      .send({ title: 'Updated Report' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Reporte actualizado exitosamente',
      report: {
        id: 'report-123',
        title: 'Updated Report',
        topicId: 'topic-123',
        userId: 'user-123',
        url: 'https://example.com',
        comments: ['comment1'],
      },
    });
    expect(reportService.updateReport).toHaveBeenCalledWith(
      'report-123',
      'topic-123',
      'Updated Report',
      'user-123',
    );
  });

  test('DELETE /api/topics/:topicId/reports/:reportId should return 200 on successful report deletion', async () => {
    const response = await request(app)
      .delete('/api/topics/topic-123/reports/report-123');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Reporte eliminado exitosamente',
    });
    expect(reportService.deleteReport).toHaveBeenCalledWith('report-123', 'topic-123', 'user-123');
  });
});