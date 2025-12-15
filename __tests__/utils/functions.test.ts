/**
 * @jest-environment jsdom
 */

// Jest globals are available without import
// describe, it, expect, jest, beforeEach, afterEach
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  generateDayOptions,
  isToday,
  calendarReducer,
  noteReducer,
  getDateToString,
  fetchNotes,
  saveNote
} from '@/utils/functions';
import { CalendarState, DayNote, Action } from '@/utils/types';
import * as constants from '@/utils/constants';

// Mock constants
jest.mock('@/utils/constants', () => ({
  isLocal: false
}));

// Mock global fetch
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Utils Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset Date to avoid timezone issues
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15T12:00:00Z')); // Fixed date for testing
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('getDaysInMonth', () => {
    it('should return correct number of days for January (31 days)', () => {
      const result = getDaysInMonth(0, 2024); // January 2024
      expect(result).toBe(31);
    });

    it('should return correct number of days for February in leap year', () => {
      const result = getDaysInMonth(1, 2024); // February 2024 (leap year)
      expect(result).toBe(29);
    });

    it('should return correct number of days for February in non-leap year', () => {
      const result = getDaysInMonth(1, 2023); // February 2023 (non-leap year)
      expect(result).toBe(28);
    });

    it('should return correct number of days for April (30 days)', () => {
      const result = getDaysInMonth(3, 2024); // April 2024
      expect(result).toBe(30);
    });
  });

  describe('getFirstDayOfMonth', () => {
    it('should return correct first day of the week for January 2024', () => {
      const result = getFirstDayOfMonth(0, 2024); // January 1, 2024 was a Monday
      expect(result).toBe(1); // Monday = 1
    });

    it('should return correct first day of the week for February 2024', () => {
      const result = getFirstDayOfMonth(1, 2024); // February 1, 2024 was a Thursday
      expect(result).toBe(4); // Thursday = 4
    });

    it('should return 0 for Sunday as first day', () => {
      const result = getFirstDayOfMonth(8, 2024); // September 1, 2024 was a Sunday
      expect(result).toBe(0); // Sunday = 0
    });
  });

  describe('generateDayOptions', () => {
    it('should generate correct day options for January 2024', () => {
      const result = generateDayOptions(0, 2024);
      expect(result).toHaveLength(31);
      expect(result[0]).toBe(1);
      expect(result[30]).toBe(31);
    });

    it('should generate correct day options for February 2024 (leap year)', () => {
      const result = generateDayOptions(1, 2024);
      expect(result).toHaveLength(29);
      expect(result[0]).toBe(1);
      expect(result[28]).toBe(29);
    });

    it('should handle string inputs correctly', () => {
      const result = generateDayOptions('0', '2024');
      expect(result).toHaveLength(31);
      expect(result[0]).toBe(1);
    });

    it('should return empty array for null month', () => {
      const result = generateDayOptions(null, 2024);
      expect(result).toEqual([]);
    });

    it('should return empty array for null year', () => {
      const result = generateDayOptions(0, null);
      expect(result).toEqual([]);
    });

    it('should return empty array for undefined inputs', () => {
      const result = generateDayOptions(undefined, undefined);
      expect(result).toEqual([]);
    });
  });

  describe('isToday', () => {
    it('should return true for today\'s date', () => {
      // Using mocked date: 2024-01-15
      const result = isToday(15, 0, 2024); // January 15, 2024
      expect(result).toBe(true);
    });

    it('should return false for different day', () => {
      const result = isToday(16, 0, 2024); // January 16, 2024
      expect(result).toBe(false);
    });

    it('should return false for different month', () => {
      const result = isToday(15, 1, 2024); // February 15, 2024
      expect(result).toBe(false);
    });

    it('should return false for different year', () => {
      const result = isToday(15, 0, 2023); // January 15, 2023
      expect(result).toBe(false);
    });
  });

  describe('calendarReducer', () => {
    const initialState: CalendarState = {
      currentYear: 2024,
      selectedMonth: null,
      selectedDay: null,
      isMonthModalOpen: false,
      isAddNoteModalOpen: false,
      isExpandedDay: false,
      notes: []
    };

    it('should handle SET_YEAR action', () => {
      const action: Action = { type: 'SET_YEAR', payload: 2025 };
      const result = calendarReducer(initialState, action);
      
      expect(result.currentYear).toBe(2025);
      expect(result).not.toBe(initialState); // Should return new object
    });

    it('should handle SELECT_MONTH action', () => {
      const action: Action = { type: 'SELECT_MONTH', payload: 5 };
      const result = calendarReducer(initialState, action);
      
      expect(result.selectedMonth).toBe(5);
      expect(result.isMonthModalOpen).toBe(true);
      expect(result.isExpandedDay).toBe(false);
    });

    it('should handle CLOSE_MODAL_MONTH action', () => {
      const stateWithOpenModal = {
        ...initialState,
        selectedMonth: 5,
        selectedDay: 15,
        isMonthModalOpen: true
      };
      
      const action: Action = { type: 'CLOSE_MODAL_MONTH' };
      const result = calendarReducer(stateWithOpenModal, action);
      
      expect(result.selectedDay).toBe(null);
      expect(result.selectedMonth).toBe(null);
      expect(result.isMonthModalOpen).toBe(false);
    });

    it('should handle CLOSE_MODAL_NOTE action', () => {
      const stateWithOpenModal = {
        ...initialState,
        selectedMonth: 5,
        selectedDay: 15,
        isAddNoteModalOpen: true
      };
      
      const action: Action = { type: 'CLOSE_MODAL_NOTE' };
      const result = calendarReducer(stateWithOpenModal, action);
      
      expect(result.selectedDay).toBe(null);
      expect(result.selectedMonth).toBe(null);
      expect(result.isAddNoteModalOpen).toBe(false);
    });

    it('should handle OPEN_MODAL_NOTE action', () => {
      const action: Action = { type: 'OPEN_MODAL_NOTE' };
      const result = calendarReducer(initialState, action);
      
      expect(result.isAddNoteModalOpen).toBe(true);
    });

    it('should handle SELECT_DAY action', () => {
      const action: Action = { type: 'SELECT_DAY', payload: 15 };
      const result = calendarReducer(initialState, action);
      
      expect(result.selectedDay).toBe(15);
      expect(result.isExpandedDay).toBe(true);
    });

    it('should handle BACK_TO_MONTH action', () => {
      const stateWithSelectedDay = {
        ...initialState,
        selectedDay: 15,
        isExpandedDay: true
      };
      
      const action: Action = { type: 'BACK_TO_MONTH' };
      const result = calendarReducer(stateWithSelectedDay, action);
      
      expect(result.isExpandedDay).toBe(false);
      expect(result.selectedDay).toBe(null);
    });

    it('should handle ADD_NOTE action with new note', () => {
      const stateWithSelection = {
        ...initialState,
        selectedMonth: 0,
        currentYear: 2024
      };
      
      const newNote: DayNote = {
        day: 15,
        month: 0,
        year: 2024,
        note: 'Test note'
      };
      
      const action: Action = { type: 'ADD_NOTE', payload: newNote };
      const result = calendarReducer(stateWithSelection, action);
      
      expect(result.notes).toHaveLength(1);
      expect(result.notes[0]).toEqual(newNote);
    });

    it('should handle ADD_NOTE action with existing note (update)', () => {
      const existingNote: DayNote = {
        day: 15,
        month: 0,
        year: 2024,
        note: 'Old note'
      };
      
      const stateWithNotes = {
        ...initialState,
        selectedMonth: 0,
        currentYear: 2024,
        notes: [existingNote]
      };
      
      const updatedNote: DayNote = {
        day: 15,
        month: 0,
        year: 2024,
        note: 'Updated note'
      };
      
      const action: Action = { type: 'ADD_NOTE', payload: updatedNote };
      const result = calendarReducer(stateWithNotes, action);
      
      expect(result.notes).toHaveLength(1);
      expect(result.notes[0].note).toBe('Updated note');
    });

    it('should handle DELETE_NOTE action', () => {
      const noteToDelete: DayNote = {
        day: 15,
        month: 0,
        year: 2024,
        note: 'Note to delete'
      };
      
      const stateWithNotes = {
        ...initialState,
        notes: [noteToDelete]
      };
      
      const action: Action = { 
        type: 'DELETE_NOTE', 
        payload: { day: 15, month: 0, year: 2024, note: '' }
      };
      const result = calendarReducer(stateWithNotes, action);
      
      expect(result.notes).toHaveLength(0);
    });

    it('should handle DELETE_ALL_NOTES action', () => {
      const stateWithNotes = {
        ...initialState,
        notes: [
          { day: 1, month: 0, year: 2024, note: 'Note 1' },
          { day: 2, month: 0, year: 2024, note: 'Note 2' }
        ]
      };
      
      const action: Action = { type: 'DELETE_ALL_NOTES' };
      const result = calendarReducer(stateWithNotes, action);
      
      expect(result.notes).toHaveLength(0);
    });

    it('should handle SET_NOTES action', () => {
      const newNotes: DayNote[] = [
        { day: 1, month: 0, year: 2024, note: 'Note 1' },
        { day: 2, month: 0, year: 2024, note: 'Note 2' }
      ];
      
      const action: Action = { type: 'SET_NOTES', payload: newNotes };
      const result = calendarReducer(initialState, action);
      
      expect(result.notes).toEqual(newNotes);
    });

    it('should return same state for unknown action', () => {
      const action = { type: 'UNKNOWN_ACTION' } as any;
      const result = calendarReducer(initialState, action);
      
      expect(result).toBe(initialState);
    });
  });

  describe('noteReducer', () => {
    const initialNote: DayNote = {
      day: 1,
      month: 0,
      year: 2024,
      note: ''
    };

    it('should handle SET_MONTH action', () => {
      const action: Action = { type: 'SET_MONTH', payload: 5 };
      const result = noteReducer(initialNote, action);
      
      expect(result.month).toBe(5);
      expect(result).not.toBe(initialNote);
    });

    it('should handle SET_DAY action', () => {
      const action: Action = { type: 'SET_DAY', payload: 15 };
      const result = noteReducer(initialNote, action);
      
      expect(result.day).toBe(15);
    });

    it('should handle SET_YEAR action', () => {
      const action: Action = { type: 'SET_YEAR', payload: 2025 };
      const result = noteReducer(initialNote, action);
      
      expect(result.year).toBe(2025);
    });

    it('should handle SET_NOTE action', () => {
      const action: Action = { type: 'SET_NOTE', payload: 'Test note content' };
      const result = noteReducer(initialNote, action);
      
      expect(result.note).toBe('Test note content');
    });

    it('should return same state for unknown action', () => {
      const action = { type: 'UNKNOWN_ACTION' } as any;
      const result = noteReducer(initialNote, action);
      
      expect(result).toBe(initialNote);
    });
  });

  describe('getDateToString', () => {
    it('should format date with "long" type', () => {
      const result = getDateToString('long', 2024, 0, 15);
      expect(result).toContain('January');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });

    it('should format date with "month-year" type', () => {
      const result = getDateToString('month-year', 2024, 0);
      expect(result).toContain('January');
      expect(result).toContain('2024');
      expect(result).not.toContain('1'); // Should not contain day
    });

    it('should format date with default type (month only)', () => {
      const result = getDateToString('default', 2024, 0);
      expect(result).toContain('January');
      expect(result).not.toContain('2024'); // Should not contain year
      expect(result).not.toContain('1'); // Should not contain day
    });

    it('should use default day value of 1 when not provided', () => {
      const result = getDateToString('long', 2024, 0);
      expect(result).toContain('1'); // Should use day 1 as default
    });
  });

  describe('fetchNotes', () => {
    const mockDispatch = jest.fn();

    beforeEach(() => {
      mockDispatch.mockClear();
    });

    // Note: API tests are covered in the API route tests
    // This test focuses on localStorage functionality

    it('should fetch notes from localStorage (default behavior)', async () => {
      // Since isLocal is mocked as false, this tests localStorage functionality
      const mockNotes = [
        { day: 1, month: 0, year: 2024, note: 'Test note' }
      ];
      
      const encodedNotes = btoa(JSON.stringify(mockNotes));
      localStorageMock.getItem.mockReturnValueOnce(encodedNotes);

      await fetchNotes(mockDispatch);

      expect(localStorageMock.getItem).toHaveBeenCalledWith('calendarNotes');
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_NOTES',
        payload: mockNotes
      });
    });

    it('should handle empty localStorage', async () => {
      // Since isLocal is mocked as false, this tests localStorage functionality
      localStorageMock.getItem.mockReturnValueOnce(null);

      await fetchNotes(mockDispatch);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_NOTES',
        payload: []
      });
    });
  });

  describe('saveNote', () => {
    const mockNote: DayNote = {
      day: 15,
      month: 0,
      year: 2024,
      note: 'Test note'
    };

    // Note: API save functionality is tested in the API route tests
    // This section tests localStorage functionality (default behavior)

    it('should save note to localStorage (default behavior)', async () => {
      // Since isLocal is mocked as false, this tests localStorage functionality
      const existingNotes = [
        { day: 1, month: 0, year: 2024, note: 'Existing note' }
      ];
      
      const encodedExistingNotes = btoa(JSON.stringify(existingNotes));
      localStorageMock.getItem.mockReturnValueOnce(encodedExistingNotes);

      await saveNote(mockNote);

      const expectedNotes = [...existingNotes, mockNote];
      const expectedEncodedNotes = btoa(JSON.stringify(expectedNotes));

      expect(localStorageMock.getItem).toHaveBeenCalledWith('calendarNotes');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'calendarNotes',
        expectedEncodedNotes
      );
    });

    it('should handle empty localStorage when saving', async () => {
      // Since isLocal is mocked as false, this tests localStorage functionality
      localStorageMock.getItem.mockReturnValueOnce(null);

      await saveNote(mockNote);

      const expectedEncodedNotes = btoa(JSON.stringify([mockNote]));

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'calendarNotes',
        expectedEncodedNotes
      );
    });
  });
});
