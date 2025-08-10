const request = require('supertest');
const express = require('express');
jest.mock('../../config/firebase'); // Mock de Firebase
jest.mock('express-validator'); // Mock completo de express-validator
jest.mock('../../services/authService'); // Mock de authService

const { login } = require('../../controllers/authController');
const authService = require('../../services/authService');

// Configurar una app Express para pruebas
const app = express();
app.use(express.json());
// Eliminar el middleware que sobrescribe req.body para permitir enviar datos personalizados
app.post('/api/auth/login', login);

describe('Auth Controller', () => {
  let validationResultMock;

  beforeEach(() => {
    // Configurar mock de validationResult
    validationResultMock = require('express-validator').validationResult;
    validationResultMock.mockReturnValue({
      isEmpty: jest.fn(),
      array: jest.fn(),
    });

    // Configurar mock de authService.login como una función mock
    authService.login.mockImplementation(() => Promise.resolve({
      idToken: 'mocked-token',
      uid: 'mocked-uid',
      email: 'test@example.com',
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/auth/login should return 200 and a token on successful login', async () => {
    validationResultMock.mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Inicio de sesión exitoso',
      token: 'mocked-token',
      user: { uid: 'mocked-uid', email: 'test@example.com' },
    });
    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  test('POST /api/auth/login should return 400 if validation fails', async () => {
    validationResultMock.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: 'Correo inválido' }],
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'invalid-email', password: '' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ errors: [{ msg: 'Correo inválido' }] });
    expect(authService.login).not.toHaveBeenCalled();
  });

  test('POST /api/auth/login should return 401 on login failure', async () => {
    validationResultMock.mockReturnValue({
      isEmpty: () => true,
      array: () => [],
    });
    authService.login.mockRejectedValue(new Error('Error al iniciar sesión: Credenciales incorrectas'));

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Error al iniciar sesión: Credenciales incorrectas' });
    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
  });
});