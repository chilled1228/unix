import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EnhancedTimestampConverter } from '@/components/EnhancedTimestampConverter';

// Mock date-fns-tz to avoid timezone issues in tests
jest.mock('date-fns-tz', () => ({
  formatInTimeZone: jest.fn((date, timezone, format) => {
    const mockDate = new Date(date);
    return mockDate.toISOString().slice(0, 19).replace('T', ' ') + ' UTC';
  }),
  zonedTimeToUtc: jest.fn((date) => date),
}));

describe('EnhancedTimestampConverter', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Mock current time to a fixed value for consistent tests
    jest.spyOn(Date, 'now').mockReturnValue(1640995200000); // 2022-01-01 00:00:00 UTC
    jest.spyOn(Math, 'floor').mockReturnValue(1640995200);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render the converter with default mode', () => {
      render(<EnhancedTimestampConverter />);
      
      expect(screen.getByText('Unix Converter')).toBeInTheDocument();
      expect(screen.getByText('Epoch → Date')).toBeInTheDocument();
      expect(screen.getByText('Date → Epoch')).toBeInTheDocument();
      expect(screen.getByLabelText('Unix Timestamp')).toBeInTheDocument();
    });

    it('should display current timestamp', () => {
      render(<EnhancedTimestampConverter />);
      
      expect(screen.getByText('Current Unix Timestamp')).toBeInTheDocument();
      expect(screen.getByText('1640995200')).toBeInTheDocument();
    });

    it('should have proper accessibility attributes', () => {
      render(<EnhancedTimestampConverter />);
      
      const input = screen.getByLabelText('Unix Timestamp');
      expect(input).toHaveAttribute('type', 'tel');
      expect(input).toHaveAttribute('inputMode', 'numeric');
      expect(input).toHaveAttribute('maxLength', '13');
    });
  });

  describe('Mode Switching', () => {
    it('should switch between epoch-to-date and date-to-epoch modes', async () => {
      const user = userEvent.setup();
      render(<EnhancedTimestampConverter />);
      
      const epochToDateButton = screen.getByRole('button', { name: /epoch → date/i });
      const dateToEpochButton = screen.getByRole('button', { name: /date → epoch/i });
      
      expect(epochToDateButton).toHaveAttribute('aria-pressed', 'true');
      expect(dateToEpochButton).toHaveAttribute('aria-pressed', 'false');
      
      await user.click(dateToEpochButton);
      
      expect(epochToDateButton).toHaveAttribute('aria-pressed', 'false');
      expect(dateToEpochButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Input Validation', () => {
    it('should show error for non-numeric input', async () => {
      const user = userEvent.setup();
      render(<EnhancedTimestampConverter />);
      
      const input = screen.getByLabelText('Unix Timestamp');
      await user.type(input, 'abc123');
      
      await waitFor(() => {
        expect(screen.getByText('Only digits allowed.')).toBeInTheDocument();
      });
    });

    it('should show error for invalid timestamp length', async () => {
      const user = userEvent.setup();
      render(<EnhancedTimestampConverter />);
      
      const input = screen.getByLabelText('Unix Timestamp');
      await user.type(input, '123456789'); // 9 digits
      
      await waitFor(() => {
        expect(screen.getByText(/Invalid timestamp length/)).toBeInTheDocument();
      });
    });

    it('should show precision suggestion for milliseconds', async () => {
      const user = userEvent.setup();
      render(<EnhancedTimestampConverter />);
      
      const input = screen.getByLabelText('Unix Timestamp');
      await user.type(input, '1640995200000'); // 13 digits
      
      await waitFor(() => {
        expect(screen.getByText(/Looks like milliseconds/)).toBeInTheDocument();
      });
    });
  });

  describe('Conversion Results', () => {
    it('should display conversion results for valid timestamp', async () => {
      const user = userEvent.setup();
      render(<EnhancedTimestampConverter />);
      
      const input = screen.getByLabelText('Unix Timestamp');
      await user.type(input, '1640995200');
      
      await waitFor(() => {
        expect(screen.getByText('Results')).toBeInTheDocument();
        expect(screen.getByText('ISO 8601')).toBeInTheDocument();
        expect(screen.getByText('UTC')).toBeInTheDocument();
        expect(screen.getByText('Local Time')).toBeInTheDocument();
      });
    });

    it('should show empty state when no input', () => {
      render(<EnhancedTimestampConverter />);
      
      expect(screen.getByText('Enter a Unix timestamp to see the conversion')).toBeInTheDocument();
    });
  });

  describe('Copy Functionality', () => {
    it('should copy result to clipboard when copy button is clicked', async () => {
      const user = userEvent.setup();
      const mockWriteText = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: { writeText: mockWriteText },
      });
      
      render(<EnhancedTimestampConverter />);
      
      const input = screen.getByLabelText('Unix Timestamp');
      await user.type(input, '1640995200');
      
      await waitFor(() => {
        const copyButtons = screen.getAllByTitle(/Copy.*to clipboard/);
        expect(copyButtons.length).toBeGreaterThan(0);
      });
      
      const firstCopyButton = screen.getAllByTitle(/Copy.*to clipboard/)[0];
      await user.click(firstCopyButton);
      
      expect(mockWriteText).toHaveBeenCalled();
    });

    it('should show success toast after successful copy', async () => {
      const user = userEvent.setup();
      const mockWriteText = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: { writeText: mockWriteText },
      });
      
      render(<EnhancedTimestampConverter />);
      
      const input = screen.getByLabelText('Unix Timestamp');
      await user.type(input, '1640995200');
      
      await waitFor(() => {
        const copyButtons = screen.getAllByTitle(/Copy.*to clipboard/);
        expect(copyButtons.length).toBeGreaterThan(0);
      });
      
      const firstCopyButton = screen.getAllByTitle(/Copy.*to clipboard/)[0];
      await user.click(firstCopyButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Copied.*to clipboard/)).toBeInTheDocument();
      });
    });
  });

  describe('Precision Toggle', () => {
    it('should allow switching between precision modes', async () => {
      const user = userEvent.setup();
      render(<EnhancedTimestampConverter />);
      
      const secondsRadio = screen.getByLabelText('Seconds');
      const millisecondsRadio = screen.getByLabelText('Milliseconds');
      const autoRadio = screen.getByLabelText('Auto-detect');
      
      expect(autoRadio).toBeChecked();
      
      await user.click(secondsRadio);
      expect(secondsRadio).toBeChecked();
      
      await user.click(millisecondsRadio);
      expect(millisecondsRadio).toBeChecked();
    });
  });

  describe('Current Timestamp', () => {
    it('should use current timestamp when "Use Now" button is clicked', async () => {
      const user = userEvent.setup();
      render(<EnhancedTimestampConverter />);
      
      const useNowButton = screen.getByText('Use Now');
      await user.click(useNowButton);
      
      const input = screen.getByLabelText('Unix Timestamp');
      expect(input).toHaveValue('1640995200');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      render(<EnhancedTimestampConverter />);
      
      const input = screen.getByLabelText('Unix Timestamp');
      expect(input).toBeInTheDocument();
      
      const precisionFieldset = screen.getByRole('group', { name: /precision/i });
      expect(precisionFieldset).toBeInTheDocument();
      
      const modeButtons = screen.getAllByRole('button');
      modeButtons.forEach(button => {
        if (button.getAttribute('aria-pressed')) {
          expect(button).toHaveAttribute('aria-pressed');
        }
      });
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<EnhancedTimestampConverter />);
      
      const input = screen.getByLabelText('Unix Timestamp');
      
      // Tab to input
      await user.tab();
      expect(input).toHaveFocus();
      
      // Type in input
      await user.type(input, '1640995200');
      expect(input).toHaveValue('1640995200');
    });
  });
});
