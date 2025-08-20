import { format, fromUnixTime } from 'date-fns';

// Utility functions to test (these would be extracted from the component)
export const detectTimestampPrecision = (input: string): 'seconds' | 'milliseconds' | null => {
  const num = input.replace(/\D/g, '');
  if (num.length === 10) return 'seconds';
  if (num.length === 13) return 'milliseconds';
  return null;
};

export const validateTimestampInput = (input: string) => {
  if (!input.trim()) {
    return { isValid: false };
  }

  if (!/^\d+$/.test(input.trim())) {
    return {
      isValid: false,
      error: "Only digits allowed.",
    };
  }

  const precision = detectTimestampPrecision(input);
  if (!precision) {
    if (input.length > 13) {
      return {
        isValid: false,
        error: "Value too long—did you paste milliseconds?",
      };
    }
    return {
      isValid: false,
      error: "Invalid timestamp length. Use 10 digits (seconds) or 13 digits (milliseconds).",
    };
  }

  const timestamp = parseInt(input);
  const minTimestamp = 0;
  const maxTimestamp = precision === 'seconds' ? 4102444800 : 4102444800000;
  
  if (timestamp < minTimestamp || timestamp > maxTimestamp) {
    return {
      isValid: false,
      error: "Out of reasonable range (1970-2100).",
    };
  }

  return { isValid: true };
};

describe('Timestamp Utilities', () => {
  describe('detectTimestampPrecision', () => {
    it('should detect seconds precision for 10-digit timestamps', () => {
      expect(detectTimestampPrecision('1640995200')).toBe('seconds');
      expect(detectTimestampPrecision('0000000000')).toBe('seconds');
      expect(detectTimestampPrecision('9999999999')).toBe('seconds');
    });

    it('should detect milliseconds precision for 13-digit timestamps', () => {
      expect(detectTimestampPrecision('1640995200000')).toBe('milliseconds');
      expect(detectTimestampPrecision('0000000000000')).toBe('milliseconds');
    });

    it('should return null for invalid lengths', () => {
      expect(detectTimestampPrecision('123')).toBe(null);
      expect(detectTimestampPrecision('12345678901234')).toBe(null);
      expect(detectTimestampPrecision('')).toBe(null);
    });

    it('should handle non-numeric characters by filtering them out', () => {
      expect(detectTimestampPrecision('1,640,995,200')).toBe('seconds');
      expect(detectTimestampPrecision('1640995200abc')).toBe('seconds');
    });
  });

  describe('validateTimestampInput', () => {
    it('should validate correct 10-digit timestamps', () => {
      const result = validateTimestampInput('1640995200');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should validate correct 13-digit timestamps', () => {
      const result = validateTimestampInput('1640995200000');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject empty input', () => {
      const result = validateTimestampInput('');
      expect(result.isValid).toBe(false);
    });

    it('should reject non-numeric input', () => {
      const result = validateTimestampInput('abc123');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Only digits allowed.');
    });

    it('should reject timestamps that are too long', () => {
      const result = validateTimestampInput('12345678901234567890');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Value too long—did you paste milliseconds?');
    });

    it('should reject timestamps with invalid length', () => {
      const result = validateTimestampInput('123456789');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid timestamp length. Use 10 digits (seconds) or 13 digits (milliseconds).');
    });

    it('should reject timestamps outside reasonable range', () => {
      // Test future timestamp beyond year 2100
      const result = validateTimestampInput('9999999999');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Out of reasonable range (1970-2100).');
    });

    it('should accept edge case timestamps', () => {
      // Unix epoch
      expect(validateTimestampInput('0').isValid).toBe(true);
      
      // Year 2038 problem timestamp
      expect(validateTimestampInput('2147483647').isValid).toBe(true);
    });
  });

  describe('Timestamp Conversion Integration', () => {
    it('should correctly convert known timestamps', () => {
      // New Year 2022 UTC
      const timestamp = 1640995200;
      const date = fromUnixTime(timestamp);
      const formatted = format(date, 'yyyy-MM-dd HH:mm:ss');
      
      expect(formatted).toBe('2022-01-01 00:00:00');
    });

    it('should handle Unix epoch correctly', () => {
      const timestamp = 0;
      const date = fromUnixTime(timestamp);
      const formatted = format(date, 'yyyy-MM-dd HH:mm:ss');
      
      expect(formatted).toBe('1970-01-01 00:00:00');
    });

    it('should handle millisecond timestamps correctly', () => {
      const timestamp = 1640995200000;
      const date = new Date(timestamp);
      const formatted = format(date, 'yyyy-MM-dd HH:mm:ss');
      
      expect(formatted).toBe('2022-01-01 00:00:00');
    });
  });
});
