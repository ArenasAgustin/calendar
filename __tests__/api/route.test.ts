// Jest globals are available without import
// describe, it, expect, jest, beforeEach, afterEach
import { NextRequest } from 'next/server';
import { GET, POST, PUT } from '@/app/api/route';
import * as fs from 'fs';

// Mock del módulo fs
jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('API Routes', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada test
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restaurar mocks después de cada test
    jest.restoreAllMocks();
  });

  describe('GET /api', () => {
    it('should return notes successfully when file exists', async () => {
      // Arrange
      const mockNotes = JSON.stringify([
        { day: 1, month: 0, year: 2024, note: 'Test note' }
      ]);
      mockedFs.readFileSync.mockReturnValue(mockNotes);

      // Act
      const response = await GET();

      // Assert
      expect(response.status).toBe(200);
      expect(mockedFs.readFileSync).toHaveBeenCalledWith('notes.json', 'utf8');
      
      const responseText = await response.text();
      expect(responseText).toBe(mockNotes);
    });

    it('should return 500 error when file reading fails', async () => {
      // Arrange
      mockedFs.readFileSync.mockImplementation(() => {
        throw new Error('File not found');
      });

      // Act
      const response = await GET();

      // Assert
      expect(response.status).toBe(500);
      expect(mockedFs.readFileSync).toHaveBeenCalledWith('notes.json', 'utf8');
      
      const responseText = await response.text();
      expect(responseText).toBe('Error reading file');
    });
  });

  describe('POST /api', () => {
    it('should save notes array successfully', async () => {
      // Arrange
      const mockNotes = [
        { day: 1, month: 0, year: 2024, note: 'Test note 1' },
        { day: 2, month: 0, year: 2024, note: 'Test note 2' }
      ];
      
      const mockRequest = {
        json: jest.fn().mockResolvedValue(mockNotes)
      } as unknown as NextRequest;

      mockedFs.writeFileSync.mockImplementation(() => {});

      // Act
      const response = await POST(mockRequest);

      // Assert
      expect(response.status).toBe(200);
      expect(mockRequest.json).toHaveBeenCalled();
      expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
        'notes.json',
        JSON.stringify(mockNotes, null, 2)
      );
      
      const responseText = await response.text();
      expect(responseText).toBe('Success');
    });

    it('should return 400 error for invalid data format (not array)', async () => {
      // Arrange
      const invalidData = { invalid: 'data' };
      
      const mockRequest = {
        json: jest.fn().mockResolvedValue(invalidData)
      } as unknown as NextRequest;

      // Act
      const response = await POST(mockRequest);

      // Assert
      expect(response.status).toBe(400);
      expect(mockRequest.json).toHaveBeenCalled();
      expect(mockedFs.writeFileSync).not.toHaveBeenCalled();
      
      const responseText = await response.text();
      expect(responseText).toBe('Invalid data format');
    });

    it('should return 400 error for array with invalid objects', async () => {
      // Arrange
      const invalidData = ['not an object', 123];
      
      const mockRequest = {
        json: jest.fn().mockResolvedValue(invalidData)
      } as unknown as NextRequest;

      // Act
      const response = await POST(mockRequest);

      // Assert
      expect(response.status).toBe(400);
      expect(mockRequest.json).toHaveBeenCalled();
      expect(mockedFs.writeFileSync).not.toHaveBeenCalled();
      
      const responseText = await response.text();
      expect(responseText).toBe('Invalid data format');
    });

    it('should return 500 error when file writing fails', async () => {
      // Arrange
      const mockNotes = [
        { day: 1, month: 0, year: 2024, note: 'Test note' }
      ];
      
      const mockRequest = {
        json: jest.fn().mockResolvedValue(mockNotes)
      } as unknown as NextRequest;

      mockedFs.writeFileSync.mockImplementation(() => {
        throw new Error('Write permission denied');
      });

      // Act
      const response = await POST(mockRequest);

      // Assert
      expect(response.status).toBe(500);
      expect(mockRequest.json).toHaveBeenCalled();
      
      const responseText = await response.text();
      expect(responseText).toBe('Error writing file');
    });
  });

  describe('PUT /api', () => {
    it('should add new note to existing notes successfully', async () => {
      // Arrange
      const existingNotes = [
        { day: 1, month: 0, year: 2024, note: 'Existing note' }
      ];
      const newNote = { day: 2, month: 0, year: 2024, note: 'New note' };
      
      const mockRequest = {
        json: jest.fn().mockResolvedValue(newNote)
      } as unknown as NextRequest;

      mockedFs.readFileSync.mockReturnValue(JSON.stringify(existingNotes));
      mockedFs.writeFileSync.mockImplementation(() => {});

      // Act
      const response = await PUT(mockRequest);

      // Assert
      expect(response.status).toBe(200);
      expect(mockRequest.json).toHaveBeenCalled();
      expect(mockedFs.readFileSync).toHaveBeenCalledWith('notes.json', 'utf8');
      expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
        'notes.json',
        JSON.stringify([...existingNotes, newNote], null, 2)
      );
      
      const responseText = await response.text();
      expect(responseText).toBe('Success');
    });

    it('should return 400 error for invalid note format', async () => {
      // Arrange
      const invalidNote = 'not an object';
      
      const mockRequest = {
        json: jest.fn().mockResolvedValue(invalidNote)
      } as unknown as NextRequest;

      // Act
      const response = await PUT(mockRequest);

      // Assert
      expect(response.status).toBe(400);
      expect(mockRequest.json).toHaveBeenCalled();
      expect(mockedFs.readFileSync).not.toHaveBeenCalled();
      expect(mockedFs.writeFileSync).not.toHaveBeenCalled();
      
      const responseText = await response.text();
      expect(responseText).toBe('Invalid data format');
    });

    it('should return 500 error when reading existing notes fails', async () => {
      // Arrange
      const newNote = { day: 2, month: 0, year: 2024, note: 'New note' };
      
      const mockRequest = {
        json: jest.fn().mockResolvedValue(newNote)
      } as unknown as NextRequest;

      mockedFs.readFileSync.mockImplementation(() => {
        throw new Error('File not found');
      });

      // Act
      const response = await PUT(mockRequest);

      // Assert
      expect(response.status).toBe(500);
      expect(mockRequest.json).toHaveBeenCalled();
      expect(mockedFs.readFileSync).toHaveBeenCalledWith('notes.json', 'utf8');
      expect(mockedFs.writeFileSync).not.toHaveBeenCalled();
      
      const responseText = await response.text();
      expect(responseText).toBe('Error updating file');
    });

    it('should return 500 error when writing updated notes fails', async () => {
      // Arrange
      const existingNotes = [
        { day: 1, month: 0, year: 2024, note: 'Existing note' }
      ];
      const newNote = { day: 2, month: 0, year: 2024, note: 'New note' };
      
      const mockRequest = {
        json: jest.fn().mockResolvedValue(newNote)
      } as unknown as NextRequest;

      mockedFs.readFileSync.mockReturnValue(JSON.stringify(existingNotes));
      mockedFs.writeFileSync.mockImplementation(() => {
        throw new Error('Write permission denied');
      });

      // Act
      const response = await PUT(mockRequest);

      // Assert
      expect(response.status).toBe(500);
      expect(mockRequest.json).toHaveBeenCalled();
      expect(mockedFs.readFileSync).toHaveBeenCalledWith('notes.json', 'utf8');
      
      const responseText = await response.text();
      expect(responseText).toBe('Error updating file');
    });
  });
});
