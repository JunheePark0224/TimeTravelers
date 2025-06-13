// backend/tests/auth.test.js - 논리적인 버전
const request = require('supertest');

// Mock setup
jest.mock('mysql2/promise', () => ({
  createConnection: jest.fn()
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn()
}));

const app = require('../app');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

describe('Authentication API Tests', () => {
  let mockConnection;

  beforeEach(() => {
    // Mock connection setup
    mockConnection = {
      execute: jest.fn(),
      end: jest.fn()
    };
    mysql.createConnection.mockResolvedValue(mockConnection);
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('POST /api/auth/login - Error Cases', () => {
    test('should fail login with non-existent user', async () => {
      // Mock no user found
      mockConnection.execute.mockResolvedValue([[]]);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email or password');
    });

    test('should fail login with wrong password', async () => {
      // Mock user exists but password wrong
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword123'
      };
      
      mockConnection.execute.mockResolvedValue([[mockUser]]);
      bcrypt.compare.mockResolvedValue(false);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email or password');
    });

    test('should fail login with missing email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'password123'
          // email missing
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('should fail login with missing password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com'
          // password missing
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/register - Error Cases', () => {
    test('should fail registration with missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          name: 'Test User'
          // missing password and birth_date
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should fail registration with missing email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          password: 'password123',
          birth_date: '1995-05-15'
          // missing email
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should fail registration with invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email-format',
          name: 'Test User',
          password: 'password123',
          birth_date: '1995-05-15'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/logout', () => {
    test('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logout successful');
    });
  });

  describe('Authentication Edge Cases', () => {
    test('should handle empty request body for login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('should handle empty request body for register', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  // TODO: Add success cases when Mock issues are resolved
  describe('Future Tests', () => {
    test.todo('should login successfully with valid credentials');
    test.todo('should register successfully with valid data');
    test.todo('should handle user session properly');
  });
});