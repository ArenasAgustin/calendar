// Jest globals are available without import
// describe, it, expect, jest, beforeEach, afterEach
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Calendar from "@/components/Calendar";
import * as functions from "@/utils/functions";
import "@testing-library/jest-dom";

// Mock the utility functions
jest.mock("@/utils/functions", () => ({
  calendarReducer: jest.fn(),
  fetchNotes: jest.fn(),
}));

// Mock child components
jest.mock("@/components/MonthCalendar", () => {
  return function MockMonthCalendar({ monthIndex, onSelectDay }: any) {
    return (
      <div data-testid={`month-calendar-${monthIndex}`}>
        <button onClick={() => onSelectDay(15)}>Month {monthIndex + 1}</button>
      </div>
    );
  };
});

jest.mock("@/components/ModalMonth", () => {
  return function MockModalMonth({ stateGlobal }: any) {
    return stateGlobal.isMonthModalOpen ? (
      <div data-testid="modal-month">Month Modal</div>
    ) : null;
  };
});

jest.mock("@/components/ModalNote", () => {
  return function MockModalNote({ stateGlobal }: any) {
    return stateGlobal.isAddNoteModalOpen ? (
      <div data-testid="modal-note">Note Modal</div>
    ) : null;
  };
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("Calendar Component", () => {
  const mockDispatch = jest.fn();
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock useReducer to return a controlled state
    const mockState = {
      currentYear: 2024,
      selectedMonth: null,
      selectedDay: null,
      isMonthModalOpen: false,
      isAddNoteModalOpen: false,
      isExpandedDay: false,
      notes: [],
    };

    // Mock React hooks
    jest
      .spyOn(require("react"), "useReducer")
      .mockReturnValue([mockState, mockDispatch]);
    jest.spyOn(require("react"), "useEffect").mockImplementation(((
      fn: React.EffectCallback
    ) => {
      const cleanup = fn();
      return cleanup;
    }) as any);

    // Mock calendarReducer to return the same state
    (functions.calendarReducer as jest.Mock).mockReturnValue(mockState);

    // Mock fetchNotes
    (functions.fetchNotes as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Rendering", () => {
    it("should render the calendar with correct initial year", () => {
      render(<Calendar initialYear={2024} />);

      expect(screen.getByText("2024")).toBeInTheDocument();
    });

    it("should render year navigation buttons", () => {
      render(<Calendar initialYear={2024} />);

      const buttons = screen.getAllByRole("button");
      // Should have at least 3 buttons: prev year, next year, add note
      expect(buttons.length).toBeGreaterThanOrEqual(3);
    });

    it("should render add note button", () => {
      render(<Calendar initialYear={2024} />);

      const addNoteButton = screen.getByRole("button", { name: /add note/i });
      expect(addNoteButton).toBeInTheDocument();
    });

    it("should render 12 month calendars", () => {
      render(<Calendar initialYear={2024} />);

      for (let i = 0; i < 12; i++) {
        expect(screen.getByTestId(`month-calendar-${i}`)).toBeInTheDocument();
      }
    });
  });

  describe("Year Navigation", () => {
    it("should dispatch SET_YEAR action when clicking previous year button", async () => {
      const user = userEvent.setup();
      render(<Calendar initialYear={2024} />);

      // Get all buttons and find the first one (should be prev year)
      const buttons = screen.getAllByRole("button");
      const prevButton = buttons[0]; // First button should be previous year
      await user.click(prevButton);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "SET_YEAR",
        payload: 2023,
      });
    });

    it("should dispatch SET_YEAR action when clicking next year button", async () => {
      const user = userEvent.setup();
      render(<Calendar initialYear={2024} />);

      // Get all buttons and find the second one (should be next year)
      const buttons = screen.getAllByRole("button");
      const nextButton = buttons[1]; // Second button should be next year
      await user.click(nextButton);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "SET_YEAR",
        payload: 2025,
      });
    });
  });

  describe("Add Note Functionality", () => {
    it("should dispatch OPEN_MODAL_NOTE action when clicking add note button", async () => {
      const user = userEvent.setup();
      render(<Calendar initialYear={2024} />);

      const addNoteButton = screen.getByRole("button", { name: /add note/i });
      await user.click(addNoteButton);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "OPEN_MODAL_NOTE",
      });
    });
  });

  describe("Month Selection", () => {
    it("should dispatch SELECT_MONTH action when clicking on a month", async () => {
      const user = userEvent.setup();
      render(<Calendar initialYear={2024} />);

      const monthCalendar = screen.getByTestId("month-calendar-0");
      await user.click(monthCalendar);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "SELECT_MONTH",
        payload: 0,
      });
    });
  });

  describe("Effects and Lifecycle", () => {
    it("should call fetchNotes on component mount", () => {
      render(<Calendar initialYear={2024} />);

      expect(functions.fetchNotes).toHaveBeenCalledWith(mockDispatch);
    });

    it("should update localStorage when notes change", () => {
      const mockStateWithNotes = {
        currentYear: 2024,
        selectedMonth: null,
        selectedDay: null,
        isMonthModalOpen: false,
        isAddNoteModalOpen: false,
        isExpandedDay: false,
        notes: [{ day: 1, month: 0, year: 2024, note: "Test note" }],
      };

      jest
        .spyOn(require("react"), "useReducer")
        .mockReturnValue([mockStateWithNotes, mockDispatch]);

      render(<Calendar initialYear={2024} />);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "calendarNotes",
        btoa(JSON.stringify(mockStateWithNotes.notes))
      );
    });
  });

  describe("Modal Rendering", () => {
    it("should render ModalMonth when isMonthModalOpen is true", () => {
      const mockStateWithModal = {
        currentYear: 2024,
        selectedMonth: 0,
        selectedDay: null,
        isMonthModalOpen: true,
        isAddNoteModalOpen: false,
        isExpandedDay: false,
        notes: [],
      };

      jest
        .spyOn(require("react"), "useReducer")
        .mockReturnValue([mockStateWithModal, mockDispatch]);

      render(<Calendar initialYear={2024} />);

      expect(screen.getByTestId("modal-month")).toBeInTheDocument();
    });

    it("should render ModalNote when isAddNoteModalOpen is true", () => {
      const mockStateWithModal = {
        currentYear: 2024,
        selectedMonth: null,
        selectedDay: null,
        isMonthModalOpen: false,
        isAddNoteModalOpen: true,
        isExpandedDay: false,
        notes: [],
      };

      jest
        .spyOn(require("react"), "useReducer")
        .mockReturnValue([mockStateWithModal, mockDispatch]);

      render(<Calendar initialYear={2024} />);

      expect(screen.getByTestId("modal-note")).toBeInTheDocument();
    });

    it("should not render modals when both are closed", () => {
      render(<Calendar initialYear={2024} />);

      expect(screen.queryByTestId("modal-month")).not.toBeInTheDocument();
      expect(screen.queryByTestId("modal-note")).not.toBeInTheDocument();
    });
  });

  describe("Props Handling", () => {
    it("should initialize with correct year from props", () => {
      render(<Calendar initialYear={2025} />);

      expect(screen.getByText("2025")).toBeInTheDocument();
    });

    it("should handle different initial years", () => {
      const { rerender } = render(<Calendar initialYear={2020} />);
      expect(screen.getByTestId("current-year")).toHaveTextContent("2020");

      rerender(<Calendar initialYear={2030} />);
      expect(screen.getByTestId("current-year")).toHaveTextContent("2030");
    });
  });
});
