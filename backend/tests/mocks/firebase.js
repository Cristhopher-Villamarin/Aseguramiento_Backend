const admin = {
  auth: jest.fn(() => ({
    createUser: jest.fn(),
  })),
  firestore: {
    FieldValue: {
      serverTimestamp: jest.fn(() => 'mock-timestamp'),
    },
  },
};

const db = {
  collection: jest.fn(() => ({
    doc: jest.fn(() => ({
      get: jest.fn(),
      set: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    })),
    where: jest.fn(() => ({
      where: jest.fn(() => ({
        get: jest.fn(),
      })),
      get: jest.fn(),
      orderBy: jest.fn(() => ({
        get: jest.fn(),
      })),
    })),
  })),
};

module.exports = { admin, db };